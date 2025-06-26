import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { loginUser } from "../api/auth";
import { fetchUserProfile } from "../api/profile";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(username, password);
            console.log('Login Success', data.access);

            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);

            const profile = await fetchUserProfile();
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
            navigate("/dashboard");

        } catch (error) {
            console.error('Login Failed:', error.response?.data || error.message);
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    <form onSubmit={handleSubmit} className="grid gap-4 w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 rounded text-black"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 rounded text-black"
                        />
                        <button
                            type="submit"
                            className="bg-white text-blue-600 font-bold py-2 px-4 rounded hover:bg-gray-100"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

        </>
    )

}

export default Login;