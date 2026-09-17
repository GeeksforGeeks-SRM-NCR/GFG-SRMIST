import { notFound } from "next/navigation";
import {
	contentfulManagementClient,
	ENVIRONMENT_ID,
	SPACE_ID,
} from "@/lib/contentful-admin";
import EditEventClient from "./EditEventClient";

// Disable caching so data is always fresh
export const dynamic = "force-dynamic";

// Helper function to extract plain text from RichText document
interface RichTextNode {
	nodeType?: string;
	value?: string;
	content?: RichTextNode[];
}

function extractTextFromRichText(
	richText: string | RichTextNode | null | undefined,
): string {
	if (!richText || typeof richText === "string") {
		return richText || "";
	}

	if (richText.content && Array.isArray(richText.content)) {
		return richText.content
			.map((node: RichTextNode) => {
				if (node.content && Array.isArray(node.content)) {
					return node.content
						.map((textNode: RichTextNode) => textNode.value || "")
						.join("");
				}
				return "";
			})
			.join("\n");
	}

	return "";
}

interface ContentfulAssetData {
	sys: { id: string };
	fields: {
		title?: string;
		file?: { url?: string };
	};
}

interface EventWithAssets {
	entry: Record<string, unknown> & {
		fields: Record<string, Record<string, unknown>>;
	};
	coverImageAsset: ContentfulAssetData | null;
	galleryImageAssets: ContentfulAssetData[];
}

async function getEventWithAssets(id: string): Promise<EventWithAssets | null> {
	try {
		const space = await contentfulManagementClient.getSpace(SPACE_ID);
		const environment = await space.getEnvironment(ENVIRONMENT_ID);
		const entry = await environment.getEntry(id);

		let coverImageAsset: ContentfulAssetData | null = null;
		if (entry.fields.coverImage?.["en-US"]?.sys?.id) {
			try {
				const asset = await environment.getAsset(
					entry.fields.coverImage["en-US"].sys.id,
				);
				coverImageAsset = {
					sys: { id: asset.sys.id },
					fields: {
						title: asset.fields.title?.["en-US"],
						file: asset.fields.file?.["en-US"],
					},
				};
			} catch (e: unknown) {
				console.error("Cover image fetch error", e);
			}
		}

		let galleryImageAssets: ContentfulAssetData[] = [];
		const galleryLinks = entry.fields.galleryImages?.["en-US"] || [];

		galleryImageAssets = (
			await Promise.all(
				galleryLinks.map(async (link: { sys?: { id?: string } }) => {
					if (link.sys?.id) {
						try {
							const asset = await environment.getAsset(link.sys.id);
							return {
								sys: { id: asset.sys.id },
								fields: {
									title: asset.fields.title?.["en-US"],
									file: asset.fields.file?.["en-US"],
								},
							};
						} catch (e: unknown) {
							return null;
						}
					}
					return null;
				}),
			)
		).filter(Boolean);

		return {
			entry: entry as unknown as Record<string, unknown> & {
				fields: Record<string, Record<string, unknown>>;
			},
			coverImageAsset,
			galleryImageAssets,
		};
	} catch (error: unknown) {
		console.error("Error fetching event for edit:", error);
		return null;
	}
}

export default async function EditEventPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const eventData = await getEventWithAssets(id);

	if (!eventData) {
		notFound();
	}

	const { entry, coverImageAsset, galleryImageAssets } = eventData;
	const {
		title,
		date,
		venue,
		registrationLink,
		description,
		isRegOpen,
		noMembers,
	} = entry.fields;

	// Extract plain text from RichText fields
	const registrationLinkText = extractTextFromRichText(
		registrationLink?.["en-US"] as string | RichTextNode | null | undefined,
	);
	const descriptionText = extractTextFromRichText(
		description?.["en-US"] as string | RichTextNode | null | undefined,
	);

	// Format date for input (YYYY-MM-DD)
	const rawDate = date?.["en-US"] as string | undefined;
	const formattedDate = rawDate
		? (new Date(rawDate).toISOString().split("T")[0] ?? "")
		: "";

	const initialData = {
		title: (title?.["en-US"] as string) || "",
		date: formattedDate,
		venue: (venue?.["en-US"] as string) || "",
		registrationLink: registrationLinkText,
		description: descriptionText,
		isRegOpen: (isRegOpen?.["en-US"] as boolean) || false,
		noMembers: (noMembers?.["en-US"] as string | number) ?? "",
	};

	return (
		<div className="min-h-screen bg-black text-white p-8">
			<EditEventClient
				eventId={id}
				initialData={initialData}
				coverImage={coverImageAsset}
				galleryImages={galleryImageAssets}
			/>
		</div>
	);
}
