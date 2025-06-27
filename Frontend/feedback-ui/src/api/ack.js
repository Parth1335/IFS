export const acknowledgeFeedback = async (feedbackId) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:8000/api/ack/", {
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
