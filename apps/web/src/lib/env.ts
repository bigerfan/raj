const apiUrl = process.env.API_URL;
if (!apiUrl) throw new Error("API_URL is not set");

export const env = { API_URL: apiUrl };
