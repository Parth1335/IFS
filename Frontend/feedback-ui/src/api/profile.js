export const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:8000/api/profile/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }

    return await response.json();
};