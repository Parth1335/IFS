import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import Sidebar from "../SideBar";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-500 to-purple-600">
        {user && (user.role === "manager" || user.role === "employee") && <Sidebar />}
        <div className="flex-grow p-6">
          {/* Main content area */}
          <div className="flex-grow flex flex-col items-center justify-start p-10 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
              {user.role === 'manager' ? (
                <ManagerDashboard />
              ) : user.role === 'employee' ? (
                <EmployeeDashboard />
              ) : (
                <div>Unauthorized role</div>
              )}
            </div>
          </div>
        </div>
      </div>
      );
};

      export default Dashboard;
