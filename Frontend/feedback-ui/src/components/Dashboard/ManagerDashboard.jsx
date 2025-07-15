import React, { useEffect, useState, useContext } from "react";
import {
    createFeedback,
    fetchFeedbacks,
    updateFeedback,
    deleteFeedback,
} from "../../api/feedback";
import { fetchTeamMembers } from "../../api/team";
import { createUser } from "../../api/users";
import UserContext from "../../context/UserContext";
import { updateUser, deleteUser } from "../../api/users";

const ManagerDashboard = () => {
    const { user } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState("feedback");
    const [team, setTeam] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        employee: "",
        strengths: "",
        improvements: "",
        sentiment: "neutral",
    });
    const [editingId, setEditingId] = useState(null);

    const [newUserData, setNewUserData] = useState({
        username: "",
        email: "",
        password: "",
        role: "employee",
    });

    // Fetch team & feedbacks
    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamData = await fetchTeamMembers();
                const feedbackData = await fetchFeedbacks();
                setTeam(teamData);
                setFeedbacks(feedbackData);
            } catch (err) {
                console.error("Error loading data:", err.message);
            }
        };
        fetchData();
    }, []);

    const handleFeedbackChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitFeedback = async (e) => {
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

    const handleDelete = async (id) => {
        try {
            await deleteFeedback(id);
            const updated = await fetchFeedbacks();
            setFeedbacks(updated);
        } catch (error) {
            console.error("Error deleting feedback:", error.message);
        }
    };

    const handleEdit = (fb) => {
        setFormData({
            employee: fb.employee,
            strengths: fb.strengths,
            improvements: fb.improvements,
            sentiment: fb.sentiment,
        });
        setEditingId(fb.id);
    };

    const handleUserInputChange = (e) => {
        setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
    };
    const handleUpdateUser = async (userToUpdate) => {
        try {
            await updateUser(userToUpdate.id, userToUpdate);
            const updatedTeam = await fetchTeamMembers();
            setTeam(updatedTeam);
            setEditingUser(null);
            alert("User updated successfully!");
        } catch (error) {
            console.error("Failed to update user:", error.message);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(newUserData);
            const updatedTeam = await fetchTeamMembers();
            setTeam(updatedTeam);
            setNewUserData({ username: "", email: "", password: "", role: "employee" });
            alert("User added successfully");
        } catch (error) {
            console.error("User creation failed:", error.message);
        }
    };
    const handleDeleteUser = async (id) => {
  if (!window.confirm("Are you sure you want to delete this employee?")) return;
  try {
    await deleteUser(id);
    const updatedTeam = await fetchTeamMembers();
    setTeam(updatedTeam);
    alert("User deleted successfully!");
  } catch (error) {
    console.error("Failed to delete user:", error.message);
  }
};

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-white text-black p-6 shadow-lg flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-2">Welcome, {user?.username}</h2>
                    <p className="text-sm text-gray-700 mb-4">Role: {user?.role}</p>

                    <button onClick={() => setActiveTab("feedback")} className="block w-full py-2 text-left hover:bg-blue-100 rounded px-2 mb-1">
                        Give Feedback
                    </button>
                    <button onClick={() => setActiveTab("add")} className="block w-full py-2 text-left hover:bg-blue-100 rounded px-2 mb-1">
                        Add Employee
                    </button>
                    <button onClick={() => setActiveTab("manage")} className="block w-full py-2 text-left hover:bg-blue-100 rounded px-2 mb-1">
                        Manage Employees
                    </button>
                </div>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                    className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6 space-y-6">
                {activeTab === "feedback" && (
                    <>
                        <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                            <h2 className="text-xl font-bold mb-4">
                                {editingId ? "Edit Feedback" : "Give Feedback"}
                            </h2>
                            <form onSubmit={handleSubmitFeedback} className="grid gap-4">
                                <select name="employee" value={formData.employee} onChange={handleFeedbackChange} className="p-2 border rounded" required>
                                    <option value="">Select Employee</option>
                                    {team.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.username}
                                        </option>
                                    ))}
                                </select>
                                <textarea name="strengths" placeholder="Strengths" value={formData.strengths} onChange={handleFeedbackChange} className="p-2 border rounded" />
                                <textarea name="improvements" placeholder="Areas of Improvement" value={formData.improvements} onChange={handleFeedbackChange} className="p-2 border rounded" />
                                <select name="sentiment" value={formData.sentiment} onChange={handleFeedbackChange} className="p-2 border rounded">
                                    <option value="positive">Positive</option>
                                    <option value="neutral">Neutral</option>
                                    <option value="negative">Negative</option>
                                </select>
                                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                                    {editingId ? "Update" : "Submit"}
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                            <h2 className="text-xl font-bold mb-4">Given Feedbacks</h2>
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="mb-4 border-b pb-2">
                                    <p>
                                        <strong>To:</strong> {team.find((t) => t.id === fb.employee)?.username || "Unknown"}
                                    </p>
                                    <p><strong>Strengths:</strong> {fb.strengths}</p>
                                    <p><strong>Improvements:</strong> {fb.improvements}</p>
                                    <p><strong>Sentiment:</strong> {fb.sentiment}</p>
                                    <div className="mt-2">
                                        <button onClick={() => handleEdit(fb)} className="text-blue-600 font-medium mr-4">Edit</button>
                                        <button onClick={() => handleDelete(fb.id)} className="text-red-600 font-medium">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "add" && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                        <form onSubmit={handleUserSubmit} className="grid gap-4">
                            <input type="text" name="username" placeholder="Username" value={newUserData.username} onChange={handleUserInputChange} className="p-2 border rounded" />
                            <input type="email" name="email" placeholder="Email" value={newUserData.email} onChange={handleUserInputChange} className="p-2 border rounded" />
                            <input type="password" name="password" placeholder="Password" value={newUserData.password} onChange={handleUserInputChange} className="p-2 border rounded" />
                            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Create</button>
                        </form>
                    </div>
                )}

                {activeTab === "manage" && (
                    <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                        <h2 className="text-xl font-bold mb-4">Manage Employees</h2>

                        {team.map((member) => (
                            <div key={member.id} className="border-b py-3">
                                {editingUser && editingUser.id === member.id ? (
                                    // Inline Edit Form
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editingUser.username}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, username: e.target.value })
                                            }
                                            className="p-2 border rounded w-full"
                                        />
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) =>
                                                setEditingUser({ ...editingUser, email: e.target.value })
                                            }
                                            className="p-2 border rounded w-full"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateUser(editingUser)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingUser(null)}
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Default View
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{member.username}</p>
                                            <p className="text-sm text-gray-600">{member.email}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setEditingUser(member)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(member.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
