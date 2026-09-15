const ALLOWED_ORIGINS = [
	"https://aerochain.vercel.app",
	"http://localhost:5173",
];

export function getCorsHeaders(
	requestOrigin: string | null,
): Record<string, string> {
	const origin =
		requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
			? requestOrigin
			: (ALLOWED_ORIGINS[0] ?? "https://aerochain.vercel.app");

	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
		"Access-Control-Max-Age": "86400",
	};
}

export function handlePreflight(request: Request): Response | null {
	if (request.method === "OPTIONS") {
		const origin = request.headers.get("origin");
		return new Response(null, {
			status: 204,
			headers: getCorsHeaders(origin),
		});
	}
	return null;
}
