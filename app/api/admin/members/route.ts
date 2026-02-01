import { NextResponse } from 'next/server';
import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin';

// Helper to create Rich Text structure from plain string
const createRichText = (text: string) => {
    return {
        nodeType: 'document',
        data: {},
        content: text.split('\n\n').map(para => ({
            nodeType: 'paragraph',
            data: {},
            content: [{
                nodeType: 'text',
                value: para,
                marks: [],
                data: {}
            }]
        }))
    };
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const action = formData.get('action') as string;
        const memberData = formData.get('member') as string;
        const file = formData.get('file') as File | null;

        if (!memberData) throw new Error("Missing member data");
        const member = JSON.parse(memberData);

        const space = await contentfulManagementClient.getSpace(SPACE_ID);
        const environment = await space.getEnvironment(ENVIRONMENT_ID);

        // --- ASSET PROCESSING HELPER ---
        const processAndPublishAsset = async (file: File) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 1. Create Upload
            const upload = await environment.createUpload({ file: buffer as any });

            // 2. Create Asset
            let asset = await environment.createAsset({
                fields: {
                    title: { 'en-US': `${member.name} Profile` },
                    file: {
                        'en-US': {
                            fileName: file.name,
                            contentType: file.type,
                            uploadFrom: {
                                sys: {
                                    type: 'Link',
                                    linkType: 'Upload',
                                    id: upload.sys.id
                                }
                            }
                        }
                    }
                }
            });

            // 3. Process Asset
            asset = await asset.processForAllLocales();

            // 4. Publish Asset (Poll for readiness)
            // Contentful processing is async, we often need to wait a beat or check status.
            // For simplicity in this script, we'll try to publish immediately, but usually one might need a small delay or polling.
            // A simple polling mechanism:
            let retries = 5;
            while (retries > 0) {
                try {
                    asset = await environment.getAsset(asset.sys.id); // Refresh
                    if (asset.fields.file['en-US'].url) { // URL exists means processed
                        asset = await asset.publish();
                        break;
                    }
                } catch (e) {
                    // Ignore publish error, wait and retry
                }
                await new Promise(r => setTimeout(r, 1000));
                retries--;
            }

            return asset;
        };

        // --- MAP FIELDS HELPER ---
        const mapFields = (m: any, photoAssetId?: string) => {
            const fields: any = {
                name: { 'en-US': m.name },
                role: { 'en-US': m.role },
                team: { 'en-US': m.team },
                year: { 'en-US': m.year },
                order: { 'en-US': m.order || 99 },
                bio: { 'en-US': createRichText(m.bio || '') }
            };

            if (m.email) fields.email = { 'en-US': m.email };
            if (m.github) fields.github = { 'en-US': m.github };
            if (m.linkedin) fields.linkedin = { 'en-US': m.linkedin };
            if (m.instagram) fields.instagram = { 'en-US': m.instagram };

            // Handle Derived Arrays (CSV strings)
            if (m.coLead) fields.coLead = { 'en-US': m.coLead };

            // Handle General Members
            // ID verified from user-provided JSON: "id": "generalMembers"
            if (m.generalMembers) {
                fields.generalMembers = { 'en-US': m.generalMembers };
            }

            if (photoAssetId) {
                fields.photo = { 'en-US': { sys: { type: 'Link', linkType: 'Asset', id: photoAssetId } } };
            }

            return fields;
        };

        let photoId = member.photoId; // Preserve existing by default
        if (file) {
            const asset = await processAndPublishAsset(file);
            photoId = asset.sys.id;
        }

        if (action === 'create') {
            const fields = mapFields(member, photoId);
            const entry = await environment.createEntry('memberProfile', { fields });
            const published = await entry.publish();

            return NextResponse.json({ success: true, data: published });

        } else if (action === 'update') {
            if (!member.id) throw new Error("Member ID required for update");

            const entry = await environment.getEntry(member.id);
            const fields = mapFields(member, photoId);

            // Update fields manually
            Object.keys(fields).forEach(key => {
                entry.fields[key] = fields[key];
            });

            // Handle clean up of deleted optional fields
            const optionalFields = ['email', 'github', 'linkedin', 'instagram'];
            optionalFields.forEach(field => {
                if (member.hasOwnProperty(field) && !member[field]) {
                    delete entry.fields[field];
                }
            });

            const updated = await entry.update();
            const published = await updated.publish();

            return NextResponse.json({ success: true, data: published });

        } else if (action === 'delete') {
            const { id } = member;
            if (!id) throw new Error("ID required for delete");

            const entry = await environment.getEntry(id);
            if (entry.isPublished()) {
                await entry.unpublish();
            }
            await entry.delete();

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        // Error handled in response
        return NextResponse.json({ success: false, error: error.message || 'Unknown Error' }, { status: 500 });
    }
}
