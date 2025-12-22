import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import RecruitmentToggle from './RecruitmentToggle'
import { contentfulClient } from '@/lib/contentful'

// Disable caching so data is always fresh
export const dynamic = 'force-dynamic'

async function getRecruitmentStatus() {
    try {
        const entries = await contentfulClient.getEntries({
            content_type: 'globalSettings',
            limit: 1
        })

        if (entries.items.length > 0) {
            return (entries.items[0].fields.isRecruitmentOpen as boolean) || false
        }
        return false
    } catch (error) {
        console.error('Error fetching global settings:', error)
        return false
    }
}

export default async function AdminPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const isRecruitmentOpen = await getRecruitmentStatus()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-8 p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full mx-4">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Admin Dashboard
                    </h1>
                    <p className="text-white/40">Welcome back</p>
                </div>

                <div className="w-full p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-sm text-white/40 mb-1">Logged in as</p>
                    <p className="text-lg font-medium text-white">{user.email}</p>
                </div>

                <RecruitmentToggle initialStatus={isRecruitmentOpen} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <a href="/admin/events" className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            📅
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Events</h3>
                            <p className="text-sm text-white/40">Manage club events</p>
                        </div>
                    </a>

                    <a href="/admin/recruitment" className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            👥
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Recruitment</h3>
                            <p className="text-sm text-white/40">View submissions</p>
                        </div>
                    </a>

                    <a href="/admin/users" className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 flex flex-col items-center gap-3 text-center md:col-span-2">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            🔐
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Challenge Access</h3>
                            <p className="text-sm text-white/40">Manage student whitelist</p>
                        </div>
                    </a>
                </div>

                <LogoutButton />
            </div>
        </div>
    )
}
