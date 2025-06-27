import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white text-black p-6 shadow-lg rounded-r-3xl flex flex-col justify-between">
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-2">
            Welcome, {user.username}
          </h2>
          <p className="text-sm text-gray-700">Role: {user.role}</p>
          {user.email && (
            <p className="text-sm text-gray-700">Email: {user.email}</p>
          )}
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
