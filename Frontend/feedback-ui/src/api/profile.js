const API_BASE = import.meta.env.VITE_API_BASE; 
export const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE}/api/profile/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await response.json();
};
