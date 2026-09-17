"use server";
import { createAdminClient } from "@/lib/supabase-server";

interface TeamMember {
	name: string;
	reg_no: string;
	year: string;
	branch: string;
	section: string;
	email_id: string;
	phone_number: string;
}

interface TeamRegistrationData {
	leader: TeamMember;
	teamMembers: TeamMember[];
	team_name: string;
	college_name?: string;
	event_name?: string;
	project_idea?: string;
	project_description?: string;
}

export async function submitTeamRegistration(data: TeamRegistrationData) {
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
				phone_number: data.leader.phone_number,
				role: "leader",
				college_name: data.college_name || "SRM Institute of Science and Technology",
				project_idea: data.project_idea || "Not Applicable",
				project_description: data.project_description || "Not Applicable",
			},
			...data.teamMembers.map((member) => ({
				name: member.name,
				reg_no: member.reg_no,
				year: member.year,
				branch: member.branch,
				section: member.section,
				email_id: member.email_id,
				phone_number: member.phone_number,
				role: "member",
				college_name: data.college_name || "SRM Institute of Science and Technology",
			})),
		];

		const memberCount = members.length;

		if (memberCount < 2) {
			return {
				success: false,
				message:
					"Minimum 2 members required (1 leader + at least 1 team member)",
			};
		}

		if (memberCount > 4) {
			return {
				success: false,
				message: "Maximum 4 members allowed (1 leader + 3 team members)",
			};
		}

		// Use team name from form data
		const teamName = data.team_name?.trim();

		if (!teamName) {
			return {
				success: false,
				message: "Team name is required.",
			};
		}

		// Use college name from form data (with default)
		const collegeName =
			data.college_name || "SRM Institute of Science and Technology";

		const eventNameForQuery = data.event_name || "General Registration";

		// Check for duplicate team name (case-insensitive) using event_id column
		const { data: existingTeams, error: checkError } = await supabase
			.from("registrations")
			.select("id")
			.eq("event_id", eventNameForQuery)
			.ilike("team_name", teamName)
			.limit(1);

		if (checkError) {
			console.error("Error checking for duplicate team names:", checkError);
			return {
				success: false,
				message: "Failed to verify team name availability. Please try again.",
			};
		}

		if (existingTeams && existingTeams.length > 0) {
			return {
				success: false,
				message: `The team name "${teamName}" is already taken for this event. Please choose another name.`,
			};
		}

		const registrationData = {
			event_id: eventNameForQuery,
			team_name: teamName,
			members: members,
		};

		console.log("Inserting registration data:", registrationData);

		// Insert into Supabase
		const { data: insertedData, error } = await supabase
			.from("registrations")
			.insert([registrationData])
			.select();

		if (error) {
			console.error("Supabase error:", error);
			return {
				success: false,
				message: `Failed to submit registration: ${error.message}`,
			};
		}

		console.log("Successfully inserted registration:", insertedData);

		return {
			success: true,
			data: insertedData[0],
			message: "Registration submitted successfully!",
		};
	} catch (error) {
		console.error("Error in submitTeamRegistration:", error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "An unexpected error occurred while submitting registration. Please try again.",
		};
	}
}
