import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaList,
  FaChartLine,
  FaCalculator,
  FaLightbulb,
  FaChartBar,
} from "react-icons/fa";

const links = [
  { to: "/", label: "Dashboard", icon: <FaHome /> },
  { to: "/api-management", label: "API Management", icon: <FaPlus /> },
  { to: "/api-list", label: "API List", icon: <FaList /> },
  { to: "/energy-calculation", label: "Energy Calc", icon: <FaCalculator /> },
  { to: "/suggestions", label: "Suggestions", icon: <FaLightbulb /> },
  { to: "/ranking", label: "Ranking", icon: <FaChartBar /> },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex gap-1 px-4 py-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
