export const normalizeImageUrl = (url) => {
    if (!url) return '/default-profile.jpg'; 

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
    }

    return `${window.location.origin}/swings/uploads/${url}`;
};