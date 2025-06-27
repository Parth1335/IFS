import React, { useEffect, useState, useContext } from "react";
import { fetchFeedbacks, acknowledgeFeedback } from "../../api/feedback";
import UserContext from "../../context/UserContext";

const EmployeeDashboard = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedbacks();
        setFeedbacks(data);
      } catch (error) {
        console.error("Failed to load feedbacks", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeFeedback(id);
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === id ? { ...fb, acknowledged: true } : fb
        )
      );
    } catch (error) {
      console.error("Acknowledgment failed:", error.message);
    }
  };

  if (loading) return <div className="text-white p-4">Loading feedbacks...</div>;

  return (
    <div className="w-full p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Your Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedbacks available.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb.id} className="border p-4 rounded mb-4 shadow">
            <p><strong>Strengths:</strong> {fb.strengths}</p>
            <p><strong>Improvements:</strong> {fb.improvements}</p>
            <p><strong>Sentiment:</strong> {fb.sentiment}</p>
            <p><strong>Given by:</strong> {fb.manager.username}</p>
            {fb.acknowledged ? (
              <p className="text-green-600 font-semibold mt-2">Acknowledged ✅</p>
            ) : (
              <button
                onClick={() => handleAcknowledge(fb.id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmployeeDashboard;
