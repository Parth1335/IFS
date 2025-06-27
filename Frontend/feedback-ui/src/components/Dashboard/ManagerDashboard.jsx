import React, { useEffect, useState, useContext } from "react";
import {
    createFeedback,
    fetchFeedbacks,
    updateFeedback,
    deleteFeedback,
    acknowledgeFeedback
} from "../../api/feedback";
import { fetchTeamMembers } from "../../api/team";
import UserContext from "../../context/UserContext";
import { createUser } from "../../api/users";


const ManagerDashboard = () => {
    const { user } = useContext(UserContext);
    const [team, setTeam] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [formData, setFormData] = useState({
        employee: "",
        strengths: "",
        improvements: "",
        sentiment: "neutral",
    });
    const [editingId, setEditingId] = useState(null);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "employee", // default
    });

    // Fetch team and feedbacks
    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamData = await fetchTeamMembers();
                const feedbackData = await fetchFeedbacks();
                setTeam(teamData);
                setFeedbacks(feedbackData);
            } catch (error) {
                console.error("Error loading data:", error.message);
            }
        };
        fetchData();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateFeedback(editingId, formData);
            } else {
                await createFeedback(formData);
            }
            const updated = await fetchFeedbacks();
            setFeedbacks(updated);
            setFormData({ employee: "", strengths: "", improvements: "", sentiment: "neutral" });
            setEditingId(null);
        } catch (error) {
            console.error("Error submitting feedback:", error.message);
        }
    };

    const handleEdit = (fb) => {
        setFormData({
            employee: fb.employee.id,
            strengths: fb.strengths,
            improvements: fb.improvements,
            sentiment: fb.sentiment,
        });
        setEditingId(fb.id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteFeedback(id);
            const updated = await fetchFeedbacks();
            setFeedbacks(updated);
        } catch (error) {
            console.error("Error deleting feedback:", error.message);
        }
    };

    const handleUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            alert("User created successfully!");
            setNewUser({ username: "", email: "", password: "", role: "employee" });

            // Optional: Refresh team
            const updatedTeam = await fetchTeamMembers();
            setTeam(updatedTeam);
        } catch (error) {
            console.error("User creation failed:", error.message);
            alert("Failed to create user.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="w-full md:w-1/4 bg-white text-black p-4 shadow-md">
                <h2 className="text-lg font-bold mb-4">Team Members</h2>
                <ul>
                    {team.map((member) => (
                        <li key={member.id} className="mb-2">{member.username}</li>
                    ))}
                </ul>
            </div>

            <div className="flex-grow p-6 flex flex-col items-center justify-start space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl text-black">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl text-black">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleUserSubmit} className="grid gap-4">
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={newUser.username}
                                onChange={handleUserChange}
                                className="p-2 border rounded"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={handleUserChange}
                                className="p-2 border rounded"
                                required
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={handleUserChange}
                                className="p-2 border rounded"
                                required
                            />
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleUserChange}
                                className="p-2 border rounded"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-green-700"
                            >
                                Create User
                            </button>
                        </form>
                    </div>
                    <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Feedback" : "Give Feedback"}</h2>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <select
                            name="employee"
                            value={formData.employee}
                            onChange={handleChange}
                            className="p-2 border rounded"
                            required
                        >
                            <option value="">Select Employee</option>
                            {team.map((member) => (
                                <option key={member.id} value={member.id}>{member.username}</option>
                            ))}
                        </select>
                        <textarea
                            name="strengths"
                            placeholder="Strengths"
                            value={formData.strengths}
                            onChange={handleChange}
                            className="p-2 border rounded"
                            required
                        />
                        <textarea
                            name="improvements"
                            placeholder="Areas of Improvement"
                            value={formData.improvements}
                            onChange={handleChange}
                            className="p-2 border rounded"
                            required
                        />
                        <select
                            name="sentiment"
                            value={formData.sentiment}
                            onChange={handleChange}
                            className="p-2 border rounded"
                            required
                        >
                            <option value="positive">Positive</option>
                            <option value="neutral">Neutral</option>
                            <option value="negative">Negative</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                        >
                            {editingId ? "Update" : "Submit"}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl text-black">
                    <h2 className="text-xl font-bold mb-4">Given Feedbacks</h2>
                    {feedbacks.map((fb) => (
                        <div key={fb.id} className="mb-4 border-b pb-2">
                            <p><strong>To:</strong> {fb.employee.User}</p>
                            <p><strong>Strengths:</strong> {fb.strengths}</p>
                            <p><strong>Improvements:</strong> {fb.improvements}</p>
                            <p><strong>Sentiment:</strong> {fb.sentiment}</p>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleEdit(fb)}
                                    className="text-blue-600 font-medium mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(fb.id)}
                                    className="text-red-600 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



export default ManagerDashboard;
