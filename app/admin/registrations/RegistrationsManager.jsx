'use client'

import { useState, useEffect } from 'react'
import { fetchRegistrations, deleteRegistration } from './actions'
import { Download, Search, Filter, Trash2, Users, FileText, Eye, Calendar, Building2, FileDown, ClipboardList } from 'lucide-react'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { createPortal } from 'react-dom'

export default function RegistrationsManager({ initialData = [] }) {
    const [registrations, setRegistrations] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRegistration, setSelectedRegistration] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const main = document.querySelector('main')
        if (selectedRegistration) {
            if (main) main.style.overflow = 'hidden'
            document.body.style.overflow = 'hidden' // Safety fallback
        } else {
            if (main) main.style.overflow = ''
            document.body.style.overflow = ''
        }
        return () => {
            if (main) main.style.overflow = ''
            document.body.style.overflow = ''
        }
    }, [selectedRegistration])

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchRegistrations(startDate, endDate)
            setRegistrations(data)
        } catch (error) {
            console.error('Error fetching registrations:', error)
            alert('Failed to fetch registration data')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this registration?')) return

        try {
            const res = await deleteRegistration(id)
            if (res.error) {
                alert(res.error)
            } else {
                setRegistrations(prev => prev.filter(item => item.id !== id))
                router.refresh()
            }
        } catch (error) {
            alert('Failed to delete registration')
        }
    }

    const handleExport = () => {
        if (filteredRegistrations.length === 0) {
            alert('No data to export')
            return
        }

        const headers = ['ID', 'Event Name', 'Team Name', 'College', 'Member Count', 'Leader Name', 'Leader Phone', 'All Phones', 'Project Idea', 'Created At']
        const csvContent = [
            headers.join(','),
            ...filteredRegistrations.map(row => {
                const leader = row.members?.find(m => m.role === 'leader') || {}
                const allPhones = row.members?.map(m => m.phone_number).filter(Boolean).join('; ') || ''
                return [
                    `"${row.id || ''}"`,
                    `"${row.event_name || ''}"`,
                    `"${row.team_name || ''}"`,
                    `"${row.college_name || ''}"`,
                    `"${row.member_count || ''}"`,
                    `"${leader.name || ''}"`,
                    `"${leader.phone_number || ''}"`,
                    `"${allPhones}"`,
                    `"${(row.project_idea || '').replace(/"/g, '""')}"`,
                    `"${row.created_at || ''}"`
                ].join(',')
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `team-registrations-${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportPDF = () => {
        if (filteredRegistrations.length === 0) {
            alert('No data to export')
            return
        }

        const doc = new jsPDF('landscape')

        // Add title
        doc.setFontSize(20)
        doc.setTextColor(40, 40, 40)
        doc.text('Team Registrations Report', 14, 20)

        // Add metadata
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
        doc.text(`Total Registrations: ${filteredRegistrations.length}`, 14, 34)

        // Prepare table data
        const tableData = filteredRegistrations.map(row => {
            const leader = row.members?.find(m => m.role === 'leader') || {}
            return [
                row.team_name || 'N/A',
                row.event_name || 'N/A',
                row.college_name || 'N/A',
                row.member_count || '0',
                leader.phone_number || 'N/A',
                row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'
            ]
        })

        // Add table
        autoTable(doc, {
            startY: 40,
            head: [['Team Name', 'Event', 'College', 'Members', 'Leader Phone', 'Date']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [168, 85, 247],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'left'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 40 },
                2: { cellWidth: 50 },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 35 },
                5: { cellWidth: 30 }
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        })

        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.setTextColor(150)
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            )
        }

        // Save the PDF
        doc.save(`team-registrations-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    const handleExportOD = () => {
        if (!selectedEventFilter) {
            alert("Please select a specific event from the filter first to export an OD list.");
            return;
        }

        const filteredByEvent = registrations.filter(r => r.event_name === selectedEventFilter);
        exportODListExcel(filteredByEvent, selectedEventFilter);
    }

    const filteredRegistrations = registrations.filter(reg => {
        if (!searchTerm) return true
        const search = searchTerm.toLowerCase()
        return (
            reg.team_name?.toLowerCase().includes(search) ||
            reg.event_name?.toLowerCase().includes(search) ||
            reg.college_name?.toLowerCase().includes(search) ||
            reg.project_idea?.toLowerCase().includes(search)
        )
    })

    const stats = {
        total: filteredRegistrations.length,
        totalMembers: filteredRegistrations.reduce((acc, reg) => acc + (reg.member_count || 0), 0),
        events: new Set(filteredRegistrations.map(r => r.event_name)).size
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm">Total Registrations</p>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm">Total Participants</p>
                            <p className="text-3xl font-bold text-white">{stats.totalMembers}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-white/40 text-sm">Events</p>
                            <p className="text-3xl font-bold text-white">{stats.events}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by team name, event, college, or project..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all"
                        />
                    </div>

                    {/* Date Filters */}
                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
                        />
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold disabled:opacity-50"
                        >
                            <Filter className="w-5 h-5" />
                            Filter
                        </button>
                    </div>

                    {/* Export Button */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportOD}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <ClipboardList className="w-5 h-5" />
                            OD List
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <Download className="w-5 h-5" />
                            CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <FileDown className="w-5 h-5" />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Registrations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full mx-auto mb-4"></div>
                        <p className="text-white/40">Loading registrations...</p>
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="lg:col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 text-lg">No registrations found</p>
                        <p className="text-white/20 text-sm mt-2">Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    filteredRegistrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{registration.team_name || 'Untitled Team'}</h3>
                                    <p className="text-orange-400 text-sm font-semibold">{registration.event_name || 'General Event'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedRegistration(registration)}
                                        className="w-9 h-9 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center transition-all"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4 text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(registration.id)}
                                        className="w-9 h-9 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 flex items-center justify-center transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-sm">{registration.college_name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">{registration.member_count || 0} Team Members</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        {registration.created_at ? new Date(registration.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>

                                {registration.project_idea && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-white/40 mb-1">Project Idea</p>
                                        <p className="text-sm text-white/80 line-clamp-2">{registration.project_idea}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedRegistration && createPortal(
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedRegistration(null)}>
                    <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedRegistration.team_name}</h2>
                                <p className="text-orange-400 font-semibold">{selectedRegistration.event_name}</p>
                            </div>
                            <button
                                onClick={() => setSelectedRegistration(null)}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-white/40 text-sm mb-2">College</p>
                                <p className="text-white text-lg">{selectedRegistration.college_name || 'N/A'}</p>
                            </div>

                            {selectedRegistration.project_idea && (
                                <div>
                                    <p className="text-white/40 text-sm mb-2">Project Idea</p>
                                    <p className="text-white/80">{selectedRegistration.project_idea}</p>
                                </div>
                            )}

                            {selectedRegistration.project_description && (
                                <div>
                                    <p className="text-white/40 text-sm mb-2">Project Description</p>
                                    <p className="text-white/80">{selectedRegistration.project_description}</p>
                                </div>
                            )}

                            {selectedRegistration.members && Array.isArray(selectedRegistration.members) && (
                                <div>
                                    <p className="text-white/40 text-sm mb-4">Team Members ({selectedRegistration.members.length})</p>
                                    <div className="space-y-3">
                                        {selectedRegistration.members.map((member, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-white font-semibold">{member.name || 'N/A'}</p>
                                                        <p className="text-white/60 text-sm">{member.reg_no || 'N/A'}</p>
                                                    </div>
                                                    {member.role === 'leader' && (
                                                        <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">
                                                            Leader
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-white/40">Branch</p>
                                                        <p className="text-white/80">{member.branch || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40">Year</p>
                                                        <p className="text-white/80">{member.year || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40">Section</p>
                                                        <p className="text-white/80">{member.section || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40">Phone</p>
                                                        <p className="text-white/80 truncate">{member.phone_number || 'N/A'}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-white/40">Email</p>
                                                        <p className="text-white/80 truncate">{member.email_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-white/40 text-sm">Registered on {new Date(selectedRegistration.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
