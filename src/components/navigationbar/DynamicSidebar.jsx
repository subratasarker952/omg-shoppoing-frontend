import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DYNAMIC_MENU } from "../../constants/appData";
import { LayoutDashboard } from "lucide-react";

// ১. Menu Configuration (Sidebar logic theke data alada kora)

const DynamicSidebar = () => {
  const { user } = useAuth();
  const role = user?.role?.name?.toLowerCase(); // Role-ti lower case e convert kora safe

  // Reusable Class Logic
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-1.5 rounded-lg transition ${isActive ? "bg-base-200 font-semibold text-primary" : "hover:bg-base-200 text-base-content/80"
    }`;

  // Role er upor vitti kore menu item gulo nite hobe
  const roleSpecificLinks = DYNAMIC_MENU[role] || [];

  return (
    <aside className="w-64 min-h-screen bg-base-100 border-r border-base-300 p-4">
      {/* Logo Section */}
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold tracking-tight text-primary">Dashboard</h1>
      </div>

      <nav className="flex flex-col gap-0.5">
        {/* Common Link (Everyone sees this) */}
        <NavLink to="/dashboard" end className={getLinkClass}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Separator (Optional but looks professional) */}
        <div className="border-t border-base-200" />

        {/* Dynamic Role-Based Links */}
        {roleSpecificLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={getLinkClass}>
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DynamicSidebar;