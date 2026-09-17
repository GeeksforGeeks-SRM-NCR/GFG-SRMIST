"use client";

import { useRouter } from "next/navigation";
import { EditEvent } from "@/app/admin/components/EditEvent";
import { updateEventDetails } from "../actions";

interface ContentfulAsset {
	sys: { id: string };
	fields: {
		title?: string;
		file?: { url?: string };
	};
}

interface EditEventClientProps {
	eventId: string;
	initialData: {
		title: string;
		date: string;
		venue: string;
		noMembers: string | number | "";
		registrationLink: string;
		description: string;
		isRegOpen: boolean;
	};
	coverImage: ContentfulAsset | null;
	galleryImages: ContentfulAsset[];
}

export default function EditEventClient({
	eventId,
	initialData,
	coverImage,
	galleryImages,
}: EditEventClientProps) {
	const router = useRouter();

	const handleBack = () => {
		router.push("/admin/events");
	};

	const handleSave = async (formData: FormData) => {
		await updateEventDetails(formData);
		router.refresh();
	};

	return (
		<EditEvent
			eventId={eventId}
			initialData={initialData}
			coverImage={
				coverImage as unknown as {
					sys: { id: string };
					fields: { file: Record<string, { url: string }> };
				} | null
			}
			galleryImages={
				galleryImages as unknown as {
					sys: { id: string };
					fields: { file: Record<string, { url: string }> };
				}[]
			}
			onBack={handleBack}
			onSave={handleSave}
		/>
	);
}
