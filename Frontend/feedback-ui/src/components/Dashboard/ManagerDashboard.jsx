import UserContext from "../../context/UserContext";
import { UserProvider } from "../../context/UserProvider";
import { useContext } from "react";
const ManagerDashboard = () => {
    const { user } = useContext(UserContext);
    if (user.role!="manager") {
        return <div>Error...</div>;
    }
    return (
        <div>
            <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <h1>Hello Manager</h1>
                <div className="md:w-1/2 hidden md:block"></div>
                <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                    <form onSubmit={console.log } className="grid gap-4 w-full max-w-md">
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
        </div>
    );
};

export default ManagerDashboard;