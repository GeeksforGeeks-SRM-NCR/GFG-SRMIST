import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// This endpoint recalculates the user's total score from scratch
// and updates their profile. This is a workaround for a buggy trigger.
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch all of the user's submissions
        const { data: submissions, error: submissionsError } = await supabase
            .from('user_submissions')
            .select('problem_slug, points_awarded')
            .eq('user_id', user.id);

        if (submissionsError) {
            throw submissionsError;
        }

        // 2. Calculate the correct total score in code
        const bestScores = new Map<string, number>();

        for (const sub of submissions) {
            const slug = sub.problem_slug;
            const score = sub.points_awarded || 0;
            
            if (!bestScores.has(slug) || score > bestScores.get(slug)!) {
                bestScores.set(slug, score);
            }
        }

        let totalPoints = 0;
        for (const score of bestScores.values()) {
            totalPoints += score; // points_awarded is already an integer
        }

        // 3. Update the user's profile with the correct score
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ total_points: totalPoints })
            .eq('id', user.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            message: 'Score recalculated successfully.',
            new_total_points: totalPoints,
        });

    } catch (error: any) {
        console.error('Score Recalculation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
