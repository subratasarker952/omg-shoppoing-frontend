import { useAuth } from "../../context/AuthContext";
import AdminReports from "./admin/reports/AdminReports";
import ManagerDashboard from "../private/manager/ManagerDashboard";
import MyDashboard from "./user/MyDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role.name) {
    case "admin":
      return <AdminReports />;
    case "manager":
      return <ManagerDashboard />;
    default:
      return <MyDashboard />;
  }
};

export default Dashboard;