'use client'

import { useState, useTransition, useMemo } from 'react'
import { toggleRecruitmentStatus, fetchRecruitments } from './actions'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function RecruitmentManager({ initialRecruitmentStatus, initialData = [] }) {
    const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(initialRecruitmentStatus)
    const [isPending, startTransition] = useTransition()

    const [recruitments, setRecruitments] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeDomain, setActiveDomain] = useState('All Domains')

    const handleToggle = async () => {
        const newState = !isRecruitmentOpen
        setIsRecruitmentOpen(newState)

        startTransition(async () => {
            try {
                await toggleRecruitmentStatus(newState)
            } catch (error) {
                console.error('Failed to toggle status:', error)
                setIsRecruitmentOpen(!newState)
                alert('Failed to update recruitment status')
            }
        })
    }

    const DOMAIN_MAP = {
        'Creative': ['Creative', 'Creatives', 'Photography'],
        'Event Management': ['Events', 'Event Management'],
        'PR & Marketing': ['Corporate', 'PR', 'Marketing', 'PR & Marketing'],
        'Social Media': ['Social Media'],
        'Technical': ['Technical']
    }

    const getMappedDomain = (preference) => {
        if (!preference) return 'Other'
        const pref = preference.toLowerCase()
        for (const [domain, aliases] of Object.entries(DOMAIN_MAP)) {
            if (aliases.some(alias => pref.includes(alias.toLowerCase()))) {
                return domain
            }
        }
        return 'Other'
    }

    const stats = useMemo(() => {
        const counts = {
            'All Domains': recruitments.length
        }

        Object.keys(DOMAIN_MAP).forEach(domain => {
            counts[domain] = recruitments.filter(r =>
                getMappedDomain(r.team_preference) === domain
            ).length
        })

        counts['Other'] = recruitments.filter(r =>
            getMappedDomain(r.team_preference) === 'Other'
        ).length

        return counts
    }, [recruitments])

    const filteredRecruitments = useMemo(() => {
        return recruitments.filter(r => {
            const matchesSearch = (
                r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.email_personal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.team_preference?.toLowerCase().includes(searchTerm.toLowerCase())
            )

            const mappedDomain = getMappedDomain(r.team_preference)
            const matchesDomain = activeDomain === 'All Domains' ||
                mappedDomain === activeDomain

            return matchesSearch && matchesDomain
        })
    }, [recruitments, searchTerm, activeDomain])

    const handleExportPDF = () => {
        if (filteredRecruitments.length === 0) {
            alert('No data to export')
            return
        }

        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text('Recruitment Applications Report', 14, 20)
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28)
        doc.text(`Total Applications: ${filteredRecruitments.length}`, 14, 34)

        const tableData = filteredRecruitments.map(row => [
            row.name || 'N/A',
            row.reg_no || 'N/A',
            row.email_personal || 'N/A',
            row.phone || 'N/A',
            row.year || 'N/A',
            row.branch || 'N/A',
            row.team_preference || 'N/A',
            row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A'
        ])

        autoTable(doc, {
            startY: 40,
            head: [['Name', 'Reg No', 'Email', 'Phone', 'Year', 'Branch', 'Domain', 'Date']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [34, 197, 94] },
            styles: { fontSize: 8 }
        })

        doc.save(`recruitment-export-${activeDomain}-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    const exportSinglePDF = (applicant) => {
        const doc = new jsPDF()
        doc.setFontSize(20)
        doc.text('Applicant Details', 14, 20)

        const details = [
            ['Name', applicant.name],
            ['Registration Number', applicant.reg_no],
            ['Email (Personal)', applicant.email_personal],
            ['Email (College)', applicant.email_college],
            ['Phone', applicant.phone],
            ['Year', applicant.year],
            ['Branch', applicant.branch],
            ['Section', applicant.section],
            ['Domain Preference', applicant.team_preference],
            ['Technical Skills', applicant.techincal_skills || 'N/A'],
            ['Design Skills', applicant.design_skills || 'N/A'],
            ['Description', applicant.description || 'N/A'],
            ['Resume Link', applicant.resume_link || 'N/A'],
            ['Applied Date', new Date(applicant.created_at).toLocaleString()]
        ]

        autoTable(doc, {
            startY: 30,
            body: details,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 }
        })

        doc.save(`${applicant.name.replace(/\s+/g, '_')}_application.pdf`)
    }

    const availableDomains = useMemo(() => {
        const base = ['All Domains', ...Object.keys(DOMAIN_MAP)]
        if (stats['Other'] > 0) base.push('Other')
        return base
    }, [stats])

    return (
        <div className="space-y-8">
            {/* Top Bar: Search and Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-white/30 group-focus-within:text-white/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, reg no, or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-[#111111] transition-all"
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3.5 flex items-center gap-2">
                        <span className="text-white/40 text-sm font-medium">Total:</span>
                        <span className="text-white font-bold text-lg">{stats['All Domains']}</span>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="flex-1 md:flex-none bg-white text-black font-bold py-3.5 px-8 rounded-2xl border border-white/10 hover:bg-white/90 transition-all shadow-lg active:scale-95"
                    >
                        Export All to PDF
                    </button>
                </div>
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap gap-3">
                {availableDomains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => setActiveDomain(domain)}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 border flex items-center gap-2 ${activeDomain === domain
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-[#111111]/80 text-white/60 border-white/5 hover:border-white/20 hover:bg-[#111111]'
                            }`}
                    >
                        {domain}
                        <span className={`text-xs ml-1 ${activeDomain === domain ? 'text-black/60' : 'text-white/30'}`}>
                            ({stats[domain] || 0})
                        </span>
                    </button>
                ))}
            </div>

            {/* Application Sections/Table */}
            <div className="space-y-8">
                {(activeDomain === 'All Domains' ? availableDomains.filter(d => d !== 'All Domains') : [activeDomain]).map((domain) => {
                    const domainApps = filteredRecruitments.filter(r => getMappedDomain(r.team_preference) === domain)
                    if (domainApps.length === 0 && activeDomain !== 'All Domains') return (
                        <div key={domain} className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center">
                            <p className="text-white/40">No applicants found for this domain.</p>
                        </div>
                    )
                    if (domainApps.length === 0) return null

                    return (
                        <div key={domain} className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white">{domain}</h3>
                                <span className="bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-white/60">
                                    {domainApps.length} applicants
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-white/40 text-[0.8rem] border-b border-white/5 uppercase tracking-wider">
                                            <th className="px-4 py-3 font-bold">Name</th>
                                            <th className="px-3 py-3 font-bold">Reg. No.</th>
                                            <th className="px-3 py-3 font-bold">Email</th>
                                            <th className="px-3 py-3 font-bold">Phone</th>
                                            <th className="px-3 py-3 font-bold">Year</th>
                                            <th className="px-3 py-3 font-bold">Branch</th>
                                            <th className="px-3 py-3 font-bold">Date</th>
                                            <th className="px-4 py-3 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white/80">
                                        {domainApps.map((row, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-4 py-3 font-medium text-white text-sm whitespace-nowrap">{row.name}</td>
                                                <td className="px-3 py-3 font-mono text-xs opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{row.reg_no}</td>
                                                <td className="px-3 py-3 text-xs opacity-60 group-hover:opacity-100 transition-opacity truncate max-w-[150px]">{row.email_personal}</td>
                                                <td className="px-3 py-3 text-xs opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{row.phone}</td>
                                                <td className="px-3 py-3 text-xs">{row.year}{row.year === 1 ? 'st' : row.year === 2 ? 'nd' : row.year === 3 ? 'rd' : 'th'}</td>
                                                <td className="px-3 py-3 text-xs opacity-80 whitespace-nowrap">{row.branch}</td>
                                                <td className="px-3 py-3 text-xs opacity-60 whitespace-nowrap">
                                                    {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB') : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => exportSinglePDF(row)}
                                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
                                                        >
                                                            PDF
                                                        </button>
                                                        <a
                                                            href={row.resume_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all"
                                                        >
                                                            Resume
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recruitment Status Control (Moved to bottom or kept separate) */}
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 mt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Recruitment Toggle</h4>
                        <p className="text-white/40 text-sm">Control the visibility of the recruitment form for students.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${isRecruitmentOpen ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'} animate-pulse`} />
                            <span className={`font-bold tracking-widest ${isRecruitmentOpen ? 'text-green-500' : 'text-red-500'}`}>
                                {isRecruitmentOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggle}
                            disabled={isPending}
                            className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ${isRecruitmentOpen ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/5 border border-white/10'
                                }`}
                        >
                            <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-xl transition-transform duration-300 ${isRecruitmentOpen ? 'translate-x-11' : 'translate-x-1.5'
                                }`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
