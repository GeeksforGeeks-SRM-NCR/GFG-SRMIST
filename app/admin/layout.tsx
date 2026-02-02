import { createClient } from '@/lib/supabase-server'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import AdminSmoothScroll from './components/AdminSmoothScroll'
import { redirect } from 'next/navigation'


export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen w-full bg-[#050505] text-white overflow-hidden selection:bg-indigo-500/30 font-sans">
            <Sidebar />

            <main className="flex-1 h-screen overflow-y-auto relative no-scrollbar">
                <AdminSmoothScroll />

                <div className="mx-auto max-w-7xl px-8 py-8 md:px-12 md:py-10 lg:px-16 ml-0 md:ml-64">

                    <Header userEmail={user.email || ''} />

                    {children}

                    <Footer />


                    <div className="fixed top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none mix-blend-screen" />
                    <div className="fixed bottom-0 left-64 h-[400px] w-[400px] rounded-full bg-emerald-900/5 blur-[100px] pointer-events-none mix-blend-screen" />
                </div>
            </main>
        </div>
    )
}
