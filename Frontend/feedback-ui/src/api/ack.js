const API_BASE = import.meta.env.VITE_API_BASE;
export const acknowledgeFeedback = async (feedbackId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE}/api/ack/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ feedback: feedbackId }),
  });

  if (!res.ok) throw new Error("Acknowledgment failed");
  return await res.json();
};
