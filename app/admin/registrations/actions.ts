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

		return (data || []).map((item: any) => ({
			...item,
			event_name: item.event_name || item.event_id,
		}));
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
