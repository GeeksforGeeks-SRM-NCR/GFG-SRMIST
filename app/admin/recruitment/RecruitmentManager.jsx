'use client'

import { useState, useEffect, useTransition } from 'react'
import { toggleRecruitmentStatus, fetchRecruitments } from './actions'
// Remove client-side supabase import as we use server actions now
// import { supabase } from '@/lib/supabase'

export default function RecruitmentManager({ initialRecruitmentStatus, initialData = [] }) {
    const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(initialRecruitmentStatus)
    const [isPending, startTransition] = useTransition()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [recruitments, setRecruitments] = useState(initialData)
    const [loading, setLoading] = useState(false)

    const handleToggle = async () => {
        const newState = !isRecruitmentOpen
        setIsRecruitmentOpen(newState) // Optimistic update

        startTransition(async () => {
            try {
                await toggleRecruitmentStatus(newState)
            } catch (error) {
                console.error('Failed to toggle status:', error)
                setIsRecruitmentOpen(!newState) // Revert on error
                alert('Failed to update recruitment status')
            }
        })
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchRecruitments(startDate, endDate)
            setRecruitments(data)
        } catch (error) {
            console.error('Error fetching recruitments:', error)
            alert('Failed to fetch recruitment data')
        } finally {
            setLoading(false)
        }
    }

    // We don't need useEffect for initial fetch anymore as we pass initialData
    // But if we want to support refetching without filter, we can keep it or just rely on initialData
    // Let's keep it simple: initialData is used, filter triggers new fetch.


    const handleExport = () => {
        if (recruitments.length === 0) {
            alert('No data to export')
            return
        }

        const headers = ['Name', 'Reg No', 'Branch', 'Year', 'Team Preference', 'Created At']
        const csvContent = [
            headers.join(','),
            ...recruitments.map(row => [
                `"${row.name || ''}"`,
                `"${row.reg_no || ''}"`,
                `"${row.branch || ''}"`,
                `"${row.year || ''}"`,
                `"${row.team_preference || ''}"`,
                `"${row.created_at || ''}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `recruitment-data-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-8">
            {/* Global Toggle */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white">Recruitment Status</h3>
                    <p className="text-white/60">
                        Current status: <span className={isRecruitmentOpen ? 'text-green-400' : 'text-red-400'}>
                            {isRecruitmentOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                    </p>
                </div>
                <button
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isRecruitmentOpen ? 'bg-green-500' : 'bg-white/20'
                        }`}
                >
                    <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isRecruitmentOpen ? 'translate-x-7' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {/* Data Dashboard */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
                    <div className="flex gap-4 w-full md:w-auto">
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <button
                            onClick={fetchData}
                            className="self-end px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            Filter
                        </button>
                    </div>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        📥 Export CSV
                    </button>
                </div>

                {/* Data Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-white/60 text-sm">
                                <th className="p-3">Name</th>
                                <th className="p-3">Reg No</th>
                                <th className="p-3">Branch</th>
                                <th className="p-3">Year</th>
                                <th className="p-3">Team</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-white/40">Loading...</td>
                                </tr>
                            ) : recruitments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-white/40">No records found</td>
                                </tr>
                            ) : (
                                recruitments.map((row) => (
                                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-3">{row.name}</td>
                                        <td className="p-3 font-mono text-sm">{row.reg_no}</td>
                                        <td className="p-3">{row.branch}</td>
                                        <td className="p-3">{row.year}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                {row.team_preference}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-white/60">
                                            {new Date(row.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
