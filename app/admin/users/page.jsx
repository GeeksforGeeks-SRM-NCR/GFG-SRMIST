import { getWhitelist } from './actions'
import WhitelistManager from './WhitelistManager'

// Disable caching so data is always fresh
export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const whitelist = await getWhitelist()

    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20 z-0 pointer-events-none fixed" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                            Challenge Access
                        </h1>
                        <p className="text-white/40 mt-1">Manage student access to the coding platform</p>
                    </div>
                    <a
                        href="/admin"
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                    >
                        ← Dashboard
                    </a>
                </div>

                <WhitelistManager initialData={whitelist} />
            </div>
        </div>
    )
}
