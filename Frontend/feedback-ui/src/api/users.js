export const createUser = async (userData) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch("http://localhost:8000/api/users/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();

        // Format field-specific errors into a single string
        let message = "Failed to create user";
        if (error.detail) {
            message = error.detail;
        } else {
            message = Object.entries(error)
                .map(([key, value]) => `${key}: ${value.join(", ")}`)
                .join(" | ");
        }

        throw new Error(message);
    }

    return await response.json();
};