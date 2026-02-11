// import React from 'react';
// import { createClient } from '@/lib/supabase-server';
// import LeaderboardClient from './LeaderboardClient';

// export const revalidate = 60; // Cache for 60 seconds

// async function getFullLeaderboard() {
//     try {
//         const supabase = await createClient();

//         const { data } = await supabase
//             .from('profiles')
//             .select('username, avatar_url, total_points, rank')
//             .order('total_points', { ascending: false })
//             .limit(50);

//         return data || [];
//     } catch (e) {
//         console.error("Leaderboard error:", e);
//         return [];
//     }
// }

// export default async function LeaderboardPage() {
//     const leaderboard = await getFullLeaderboard();

//     return <LeaderboardClient leaderboard={leaderboard} />;
// }


import React from 'react';
import { createClient } from '@/lib/supabase-server';
import LeaderboardClient from './LeaderboardClient';

// Revalidate every 30 seconds for fresh rankings
// Force dynamic rendering because we use cookies for user authentication
export const dynamic = 'force-dynamic';
// export const revalidate = 30;

/**
 * Fetch the complete leaderboard with rankings
 */
async function getFullLeaderboard() {
    try {
        const supabase = await createClient();

        // Fetch blacklisted emails
        const { data: blacklistData } = await supabase
            .from('blacklist')
            .select('email');

        const blacklistedEmails = new Set((blacklistData || []).map(b => b.email));

        // Fetch all users ordered by total points (descending)
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, total_points, rank, college_email')
            .order('total_points', { ascending: false })
            .limit(100); // Limit to top 100 users

        if (error) {
            console.error("Leaderboard fetch error:", error);
            return [];
        }

        // Filter out blacklisted users
        const filteredData = (data || []).filter(user => !blacklistedEmails.has(user.college_email || user.email));

        // Add dynamic ranking based on current position (after filtering)
        const rankedData = filteredData.map((user, index) => ({
            ...user,
            currentRank: index + 1, // Real-time calculated rank
            displayRank: user.rank || `#${index + 1}`, // Use stored rank or fallback
        }));

        return rankedData;
    } catch (e) {
        console.error("Leaderboard error:", e);
        return [];
    }
}

/**
 * Fetch platform statistics
 */
async function getLeaderboardStats() {
    try {
        const supabase = await createClient();

        // Get total number of users with points > 0
        const { count: totalUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('total_points', 0);

        if (usersError) {
            console.error("Error fetching total users:", usersError);
        }

        // Get total number of submissions
        const { count: totalSubmissions, error: submissionsError } = await supabase
            .from('user_submissions')
            .select('*', { count: 'exact', head: true });

        if (submissionsError) {
            console.error("Error fetching total submissions:", submissionsError);
        }

        // Get number of successful submissions (Passed status)
        const { count: successfulSubmissions, error: successError } = await supabase
            .from('user_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Passed');

        if (successError) {
            console.error("Error fetching successful submissions:", successError);
        }

        return {
            totalUsers: totalUsers || 0,
            totalSubmissions: totalSubmissions || 0,
            successfulSubmissions: successfulSubmissions || 0,
        };
    } catch (e) {
        console.error("Stats error:", e);
        return {
            totalUsers: 0,
            totalSubmissions: 0,
            successfulSubmissions: 0,
        };
    }
}

/**
 * Get current user's ranking information (if authenticated)
 */
async function getCurrentUserRank() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        // Fetch current user's profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, full_name, total_points, rank')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error("Error fetching current user profile:", error);
            return null;
        }

        // Calculate actual rank by counting users with more points
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('total_points', profile.total_points || 0);

        return {
            user_id: user.id,
            username: profile?.username || 'Anonymous',
            full_name: profile?.full_name || 'Anonymous User',
            total_points: profile?.total_points || 0,
            rank: profile?.rank,
            actualRank: (count || 0) + 1,
        };
    } catch (e) {
        console.error("Current user rank error:", e);
        return null;
    }
}

/**
 * Main Leaderboard Page Component (Server Component)
 */
export default async function LeaderboardPage() {
    // Fetch all data in parallel for better performance
    const [leaderboard, stats, currentUserRank] = await Promise.all([
        getFullLeaderboard(),
        getLeaderboardStats(),
        getCurrentUserRank()
    ]);

    return (
        <LeaderboardClient
            leaderboard={leaderboard}
            stats={stats}
            currentUserRank={currentUserRank}
        />
    );
}

/**
 * Generate metadata for the page
 */
export const metadata = {
    title: 'Global Leaderboard | GFG SRMIST',
    description: 'Compete with the best coders and climb the ranks in the GFG SRMIST coding platform',
    openGraph: {
        title: 'Global Leaderboard | GFG SRMIST',
        description: 'Compete with the best coders and climb the ranks',
        type: 'website',
    },
};