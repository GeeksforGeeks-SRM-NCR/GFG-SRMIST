"use server";
import { createAdminClient } from '@/lib/supabase-server';

export async function submitTeamRegistration(data) {
    try {
        const supabase = await createAdminClient();


        const members = [
            {
                name: data.leader.name,
                reg_no: data.leader.reg_no,
                year: data.leader.year,
                branch: data.leader.branch,
                section: data.leader.section,
                email_id: data.leader.email_id,
                role: 'leader'
            },
            ...data.teamMembers.map(member => ({
                name: member.name,
                reg_no: member.reg_no,
                year: member.year,
                branch: member.branch,
                section: member.section,
                email_id: member.email_id,
                role: 'member'
            }))
        ];

        const memberCount = members.length;

        if (memberCount > 7) {
            throw new Error('Maximum 7 members allowed (1 leader + 6 team members)');
        }

        // Use team name from form data
        const teamName = data.team_name;

        // Use college name from form data (with default)
        const collegeName = data.college_name || 'SRM Institute of Science and Technology';

        const registrationData = {
            event_name: data.event_name || 'General Registration',
            team_name: teamName,
            college_name: collegeName,
            members: members,
            member_count: memberCount,
            project_idea: data.project_idea || 'Not Applicable',
            project_description: data.project_description || 'Not Applicable'
        };

        console.log('Inserting registration data:', registrationData);

        // Insert into Supabase
        const { data: insertedData, error } = await supabase
            .from('registrations')
            .insert([registrationData])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Failed to submit registration: ${error.message}`);
        }

        console.log('Successfully inserted registration:', insertedData);

        return {
            success: true,
            data: insertedData[0],
            message: 'Registration submitted successfully!'
        };

    } catch (error) {
        console.error('Error in submitTeamRegistration:', error);
        throw error;
    }
}
