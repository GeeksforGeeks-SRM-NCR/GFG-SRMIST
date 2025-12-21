import React from 'react';
import { createClient } from '@/lib/supabase-server';
import LeaderboardClient from './LeaderboardClient';

export const revalidate = 30;

// Demo dataset for leaderboard
const DEMO_LEADERBOARD = [
    {
        user_id: 'alice-johnson-2024',
        total_solved: 156,
        username: 'Alice Johnson'
    },
    {
        user_id: 'bob-smith-dev',
        total_solved: 142,
        username: 'Bob Smith'
    },
    {
        user_id: 'charlie-brown-coder',
        total_solved: 128,
        username: 'Charlie Brown'
    },
    {
        user_id: 'diana-prince-tech',
        total_solved: 115,
        username: 'Diana Prince'
    },
    {
        user_id: 'ethan-hunt-algo',
        total_solved: 98,
        username: 'Ethan Hunt'
    },
    {
        user_id: 'fiona-gallagher-dev',
        total_solved: 87,
        username: 'Fiona Gallagher'
    },
    {
        user_id: 'george-martin-code',
        total_solved: 76,
        username: 'George Martin'
    },
    {
        user_id: 'hannah-baker-tech',
        total_solved: 65,
        username: 'Hannah Baker'
    },
    {
        user_id: 'ian-malcolm-dsa',
        total_solved: 54,
        username: 'Ian Malcolm'
    },
    {
        user_id: 'julia-roberts-prog',
        total_solved: 43,
        username: 'Julia Roberts'
    }
];

async function getFullLeaderboard() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .order('total_solved', { ascending: false })
            .limit(100);
        
        // Return demo data if no real data exists
        if (!data || data.length === 0) {
            return DEMO_LEADERBOARD;
        }
        
        return data;
    } catch (e) {
        // Return demo data on error
        return DEMO_LEADERBOARD;
    }
}

export default async function LeaderboardPage() {
    const leaderboard = await getFullLeaderboard();

    return <LeaderboardClient leaderboard={leaderboard} />;
}
