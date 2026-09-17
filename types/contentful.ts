// ============================================
// CONTENTFUL CONTENT TYPE FIELD DEFINITIONS
// ============================================

/**
 * Coding Problem - content_type: 'codingProblem'
 */
export interface CodingProblemFields {
	title: string;
	slug: string;
	difficulty: "Easy" | "Medium" | "Hard";
	description: unknown;
	testCases: CodingTestCase[];
	expectedComplexity?: string;
	optimalLOC?: number;
	points?: number;
}

export interface CodingTestCase {
	input: string;
	output: string;
}

/**
 * Member Profile - content_type: 'memberProfile'
 */
export interface MemberProfileFields {
	name: string;
	role: string;
	team: string;
	year: string;
	order?: number;
	bio?: unknown;
	email?: string;
	github?: string;
	linkedin?: string;
	instagram?: string;
	coLead?: string;
	generalMembers?: string;
	photo?: ContentfulAssetLink;
	socialLinks?: string;
}

/**
 * Event - content_type: 'event'
 */
export interface EventFields {
	title: string;
	slug: string;
	description: unknown;
	shortDescription?: string;
	date: string;
	endDate?: string;
	venue?: string;
	noMembers?: string | number;
	eventType?: string;
	coverImage?: ContentfulAssetLink;
	galleryImages?: ContentfulAssetLink[];
	registrationLink?: string;
	isRegOpen?: boolean;
	tags?: string[];
}

/**
 * Global Settings - content_type: 'globalSettings'
 */
export interface GlobalSettingsFields {
	isRecruitmentOpen: boolean;
	recruitmentMessage?: string;
	featuredEvent?: unknown;
	announcementBanner?: string;
	maintenanceMode?: boolean;
}

// ============================================
// CONTENTFUL MANAGEMENT API HELPERS
// ============================================

export interface ContentfulAssetLink {
	sys: {
		type: "Link";
		linkType: "Asset";
		id: string;
	};
}

export type LocalizedField<T> = {
	"en-US": T;
};

/**
 * Rich text document structure
 */
export interface ContentfulRichTextDocument {
	nodeType: "document";
	data: Record<string, unknown>;
	content: ContentfulRichTextNode[];
}

export interface ContentfulRichTextNode {
	nodeType: string;
	data?: Record<string, unknown>;
	content?: ContentfulRichTextNode[];
	value?: string;
	marks?: Array<{ type: string }>;
}
