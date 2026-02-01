import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { contentfulManagementClient, SPACE_ID, ENVIRONMENT_ID } from '@/lib/contentful-admin'
import { createAdminClient } from '@/lib/supabase-server'

// Disable caching so data is always fresh
export const dynamic = 'force-dynamic'

async function getStats() {
    try {
        // Fetch Events Link Count from Contentful
        const space = await contentfulManagementClient.getSpace(SPACE_ID)
        const environment = await space.getEnvironment(ENVIRONMENT_ID)
        const eventEntries = await environment.getEntries({
            content_type: 'event',
            limit: 0
        })
        const eventsCount = eventEntries.total;

        const memberEntries = await environment.getEntries({
            content_type: 'memberProfile',
            limit: 0
        })
        const membersCount = memberEntries.total;

        // Fetch Recruitments Count from Supabase
        const supabaseAdmin = await createAdminClient()
        const { count: recruitmentCount } = await supabaseAdmin
            .from('recruitments')
            .select('*', { count: 'exact', head: true })

        // Fetch Users Count from Supabase
        const { count: usersCount } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        return {
            events: eventsCount || 0,
            recruitments: recruitmentCount || 0,
            users: usersCount || 0,
            members: membersCount || 0
        }

    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return { events: 0, recruitments: 0, users: 0, members: 0 }
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

    const stats = await getStats()

    return (
        <AdminDashboard
            userEmail={user.email || ''}
            totalEvents={stats.events}
            totalRecruitments={stats.recruitments}
            totalUsers={stats.users}
            totalMembers={stats.members}
        />
    )
}
