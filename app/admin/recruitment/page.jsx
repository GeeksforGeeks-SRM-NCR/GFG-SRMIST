import { contentfulClient } from '@/lib/contentful'
import RecruitmentManager from './RecruitmentManager'
import { fetchRecruitments } from './actions'

async function getRecruitmentStatus() {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: 'globalSettings',
            limit: 1
        })

        if (entries.items.length > 0) {
            return entries.items[0].fields.isRecruitmentOpen || false
        }
        return false
    } catch (error) {
        console.error('Error fetching global settings:', error)
        return false
    }
}

export default async function RecruitmentPage() {
    const isRecruitmentOpen = await getRecruitmentStatus()
    const initialData = await fetchRecruitments()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Recruitment Portal
                    </h1>
                    <a href="/admin" className="text-white/60 hover:text-white transition-colors">
                        ← Back to Dashboard
                    </a>
                </div>

                <RecruitmentManager
                    initialRecruitmentStatus={isRecruitmentOpen}
                    initialData={initialData}
                />
            </div>
        </div>
    )
}
