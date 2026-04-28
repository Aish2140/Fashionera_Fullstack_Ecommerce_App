export function getOptimizedImageUrl(url, width = 640, quality = 70) {
    const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60";

    if (!url || typeof url !== "string") {
        return fallback;
    }

    const trimmed = url.trim();

    // Unsplash/raw image URLs can be very large. Force transformed delivery.
    if (trimmed.includes("images.unsplash.com")) {
        const separator = trimmed.includes("?") ? "&" : "?";
        return `${trimmed}${separator}auto=format&fit=crop&w=${width}&q=${quality}`;
    }

    return trimmed;
}