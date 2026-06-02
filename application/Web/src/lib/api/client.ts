// Web-side re-export of the shared API client.
// withCredentials is already set in @sitestack/api-client — httpOnly cookies
// are sent automatically on every request without touching the token in JS.
export { apiClient } from "@sitestack/api-client";
