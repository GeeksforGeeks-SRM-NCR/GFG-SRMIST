'use client';

import { useState } from 'react';
import { addToWhitelist, removeFromWhitelist } from './actions';
import { Trash2, Plus, UserCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WhitelistManager({ initialData }) {
    const [whitelist, setWhitelist] = useState(initialData || []);
    const [newEmail, setNewEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newEmail) return;

        setIsLoading(true);
        setError('');

        try {
            const res = await addToWhitelist(newEmail);
            if (res.error) {
                setError(res.error);
            } else {
                setNewEmail('');
                // Optimistic update or wait for revalidate
                // Let's just refresh for simplicity or update local state if we trust it
                router.refresh();
                // We'll also update local state to feel instant
                setWhitelist(prev => [{ email: newEmail, created_at: new Date().toISOString() }, ...prev]);
            }
        } catch (err) {
            setError('Failed to add email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (email) => {
        if (!confirm(`Remove ${email} from whitelist?`)) return;

        try {
            const res = await removeFromWhitelist(email);
            if (res.error) {
                alert(res.error);
            } else {
                setWhitelist(prev => prev.filter(item => item.email !== email));
                router.refresh();
            }
        } catch (err) {
            alert('Failed to remove email');
        }
    };

    return (
        <div className="space-y-8">
            {/* Add User Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-400" />
                    Add Student
                </h2>

                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="student@srmist.edu.in"
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500/50 transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Adding...' : 'Add'}
                    </button>
                </form>
                {error && (
                    <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Whitelist Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-purple-400" />
                        Whitelisted Users
                    </h2>
                    <span className="text-white/40 text-sm font-mono">
                        {whitelist.length} users
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Added Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {whitelist.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-8 text-center text-white/20">
                                        No users in whitelist. Add one above.
                                    </td>
                                </tr>
                            ) : (
                                whitelist.map((user) => (
                                    <tr key={user.email} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white font-mono">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-white/40 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(user.email)}
                                                className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                                                title="Remove from whitelist"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
