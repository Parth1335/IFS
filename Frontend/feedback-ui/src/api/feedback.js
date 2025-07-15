const API_BASE = import.meta.env.VITE_API_BASE;
export const createFeedback = async (feedbackData) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE}/api/`feedbacks/create/, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
        throw new Error("Failed to create feedback");
    }

    return await response.json();
};

export const fetchFeedbacks = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API_BASE}/api/feedbacks/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch feedbacks");
    return await res.json();
};  


export const updateFeedback = async (id, updatedData) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE}/api/feedbacks/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update feedback");
  return await response.json();
};

export const deleteFeedback = async (id) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE}/api/feedbacks/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete feedback");
};

export const acknowledgeFeedback = async (feedbackId) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE}/api/ack/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ feedback: feedbackId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to acknowledge feedback");
  }

  return await response.json(); // or a success message if your backend returns one
};
