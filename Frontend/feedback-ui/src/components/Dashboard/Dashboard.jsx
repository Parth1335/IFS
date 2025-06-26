import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import { UserProvider } from "../../context/UserProvider";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {user.role === 'manager' ? (
        <ManagerDashboard></ManagerDashboard>
      ) : user.role === 'employee' ? (
        <EmployeeDashboard></EmployeeDashboard>
      ) : (
        <div>Unauthorized role</div>
      )}
    </div>
  );
};

export default Dashboard;