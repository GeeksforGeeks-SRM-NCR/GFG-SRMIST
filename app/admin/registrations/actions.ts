"use server";

import { createAdminClient } from "@/lib/supabase-server";

export async function fetchRegistrations(startDate?: string, endDate?: string) {
	try {
		const supabase = await createAdminClient();

		let query = supabase
			.from("registrations")
			.select("*")
			.order("created_at", { ascending: false });

		if (startDate) {
			query = query.gte("created_at", startDate);
		}
		if (endDate) {
			query = query.lte("created_at", endDate);
		}

		const { data, error } = await query;

		if (error) {
			console.error("Error fetching registrations:", error);
			return [];
		}

		return (data || []).map((item: any) => {
			const membersList = Array.isArray(item.members) ? item.members : [];
			const leaderOrFirst =
				membersList.find((m: any) => m.role === "leader") ||
				membersList[0] ||
				{};
			const projectIdea =
				item.project_idea ||
				leaderOrFirst.project_idea ||
				membersList.find((m: any) => m.project_idea)?.project_idea ||
				"";
			const projectDescription =
				item.project_description ||
				leaderOrFirst.project_description ||
				membersList.find((m: any) => m.project_description)?.project_description ||
				"";
			const collegeName =
				item.college_name ||
				leaderOrFirst.college_name ||
				"SRM Institute of Science and Technology";

			return {
				...item,
				event_name: item.event_name || item.event_id || "General Event",
				member_count: item.member_count ?? membersList.length,
				college_name: collegeName,
				project_idea: projectIdea,
				project_description: projectDescription,
			};
		});
	} catch (error) {
		console.error("Error in fetchRegistrations:", error);
		return [];
	}
}

export async function deleteRegistration(id: string) {
	try {
		const supabase = await createAdminClient();

		const { error } = await supabase
			.from("registrations")
			.delete()
			.eq("id", id);

		if (error) {
			return { error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Error deleting registration:", error);
		return { error: "Failed to delete registration" };
	}
}
