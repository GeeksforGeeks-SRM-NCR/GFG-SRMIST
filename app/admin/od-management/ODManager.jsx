'use client'

import React, { useState, useMemo } from 'react'
import { Search, FileSpreadsheet, CheckSquare, Square, Download, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportODListExcel } from '@/lib/exportODList'

export default function ODManager({ registrations, events }) {
    const [selectedEventId, setSelectedEventId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTeamIds, setSelectedTeamIds] = useState(new Set())
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // 0) Filter events to only active/upcoming or max 1 week old
    const filteredEvents = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return events.filter(ev => {
            const dateStr = ev.fields?.date?.['en-US'];
            if (!dateStr) return true; // Keep if no date assigned
            const evDate = new Date(dateStr);
            return evDate >= oneWeekAgo;
        });
    }, [events]);

    // 1) Get name of currently selected event
    const activeEventName = useMemo(() => {
        if (!selectedEventId) return '';
        const ev = events.find(e => e.sys.id === selectedEventId);
        return ev?.fields?.title?.['en-US'] || '';
    }, [selectedEventId, events]);

    // 2) Filter teams to only those registered for the selected event name
    const teamsForEvent = useMemo(() => {
        if (!activeEventName) return [];
        return registrations.filter(r => r.event_name === activeEventName);
    }, [activeEventName, registrations]);

    // 3) Apply search term filter on top of the event filter
    const displayedTeams = useMemo(() => {
        if (!searchTerm) return teamsForEvent;
        const lowerSearch = searchTerm.toLowerCase();
        return teamsForEvent.filter(team => {
            return (
                team.team_name?.toLowerCase().includes(lowerSearch) ||
                team.college_name?.toLowerCase().includes(lowerSearch) ||
                team.leader_name?.toLowerCase().includes(lowerSearch) ||
                team.leader_email?.toLowerCase().includes(lowerSearch)
            );
        });
    }, [teamsForEvent, searchTerm]);

    // Toggle a single team
    const toggleTeam = (teamId) => {
        const next = new Set(selectedTeamIds);
        if (next.has(teamId)) {
            next.delete(teamId);
        } else {
            next.add(teamId);
        }
        setSelectedTeamIds(next);
    }

    // Toggle all displayed teams
    const toggleAll = () => {
        if (selectedTeamIds.size === displayedTeams.length && displayedTeams.length > 0) {
            // Deselect all
            setSelectedTeamIds(new Set());
        } else {
            // Select all visible
            const next = new Set(displayedTeams.map(t => t.id));
            setSelectedTeamIds(next);
        }
    }

    const handleGenerateOD = () => {
        if (selectedTeamIds.size === 0) {
            alert("No teams selected. Please select at least one team.");
            return;
        }

        // Get actual full registration objects for the selected IDs
        const selectedRegistrations = teamsForEvent.filter(t => selectedTeamIds.has(t.id));

        // Let the shared utility do the formatting and downloading
        exportODListExcel(selectedRegistrations, activeEventName);
    };

    return (
        <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">

                {/* Controls Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Event Selector */}
                    <div className="relative isolate z-50">
                        <label className="block text-sm font-medium text-blue-400 mb-2">Select Event to Manage</label>
                        <div
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-white truncate">
                                {activeEventName || '-- Choose an Event --'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute w-full mt-2 bg-[#121214] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto overflow-x-hidden"
                                >
                                    <div
                                        className="px-4 py-3 hover:bg-white/5 cursor-pointer text-white/50 border-b border-white/5 text-sm"
                                        onClick={() => {
                                            setSelectedEventId('');
                                            setSelectedTeamIds(new Set());
                                            setSearchTerm('');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        -- Clear Selection --
                                    </div>
                                    {filteredEvents.map(ev => {
                                        const title = ev.fields?.title?.['en-US'] || 'Untitled Event';
                                        const isSelected = selectedEventId === ev.sys.id;
                                        return (
                                            <div
                                                key={ev.sys.id}
                                                className={`px-4 py-3 cursor-pointer transition-colors text-sm ${isSelected ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-white hover:bg-white/5'}`}
                                                onClick={() => {
                                                    setSelectedEventId(ev.sys.id);
                                                    setSelectedTeamIds(new Set());
                                                    setSearchTerm('');
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {title}
                                            </div>
                                        );
                                    })}
                                    {filteredEvents.length === 0 && (
                                        <div className="px-4 py-3 text-white/40 italic text-sm">
                                            No recent events found.
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search / Filter */}
                    <div>
                        <label className="block text-sm font-medium text-white/50 mb-2">Search Teams</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search by team name, leader, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                minLength={2}
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/5 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                Eligible Teams
                            </h2>
                            {activeEventName && (
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                                    {displayedTeams.length} Found
                                </span>
                            )}
                        </div>

                        {activeEventName && (
                            <button
                                onClick={handleGenerateOD}
                                disabled={selectedTeamIds.size === 0}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${selectedTeamIds.size > 0
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white cursor-pointer'
                                    : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                                    }`}
                            >
                                <Download className="w-4 h-4" />
                                Generate OD ({selectedTeamIds.size})
                            </button>
                        )}
                    </div>

                    {!activeEventName ? (
                        <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]">
                            <FileSpreadsheet className="w-12 h-12 text-blue-500/20 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white/60">Select an event to view teams</h3>
                        </div>
                    ) : displayedTeams.length === 0 ? (
                        <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/[0.02]">
                            <p className="text-white/40">No teams found matching your search criteria.</p>
                        </div>
                    ) : (
                        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-white/60">
                                            <th className="p-4 w-16 text-center">
                                                <button
                                                    onClick={toggleAll}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center mx-auto"
                                                >
                                                    {selectedTeamIds.size === displayedTeams.length && displayedTeams.length > 0 ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-400" />
                                                    ) : (
                                                        <Square className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium uppercase tracking-wider text-xs">Team Name</th>
                                            <th className="p-4 font-medium uppercase tracking-wider text-xs">Leader</th>
                                            <th className="p-4 font-medium uppercase tracking-wider text-xs">College</th>
                                            <th className="p-4 font-medium uppercase tracking-wider text-xs">Members</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayedTeams.map(team => {
                                            const isSelected = selectedTeamIds.has(team.id);
                                            return (
                                                <tr
                                                    key={team.id}
                                                    onClick={() => toggleTeam(team.id)}
                                                    className={`group transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    <td className="p-4 text-center">
                                                        {isSelected ? (
                                                            <CheckSquare className="w-5 h-5 text-blue-400 mx-auto" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors mx-auto" />
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                            {team.team_name || 'Individual'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-white text-sm">{team.leader_name}</span>
                                                            <span className="text-white/40 text-xs">{team.leader_email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="text-white/60 text-sm truncate max-w-[200px] block">
                                                            {team.college_name || 'SRMIST'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="inline-flex py-1 px-3 bg-white/5 rounded-full text-xs font-semibold border border-white/5">
                                                            {team.members ? team.members.length : 0} Members
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
