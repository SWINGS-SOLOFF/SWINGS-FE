// src/utils/imageUtils.js
// 이미지 URL 정규화
export const normalizeImageUrl = (url) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    if (url.startsWith('/')) {
        return `http://localhost:8090${url}`;
    }

    return `http://localhost:8090/swings/uploads/${url}`;
};
