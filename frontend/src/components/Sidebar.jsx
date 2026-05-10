import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, PlaneTakeoff, Map, Plus, Search,
  Activity, Wallet, CheckSquare, StickyNote,
  Share2, User, Bot, Shield,
} from "lucide-react";

const links = [
  { to: "/dashboard",       icon: <LayoutDashboard size={18} />, label: "Dashboard"        },
  { to: "/my-trips",        icon: <Map size={18} />,             label: "My Trips"         },
  { to: "/create-trip",     icon: <Plus size={18} />,            label: "Create Trip"      },
  { to: "/city-search",     icon: <Search size={18} />,          label: "City Search"      },
  { to: "/activity-search", icon: <Activity size={18} />,        label: "Activities"       },
  { to: "/ai-planner",      icon: <Bot size={18} />,             label: "AI Planner"       },
  { to: "/profile",         icon: <User size={18} />,            label: "Profile"          },
  { to: "/admin",           icon: <Shield size={18} />,          label: "Admin"            },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
        onClick={onClose}
      />
    )}

    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 glass-dark border-r border-white/5
        z-40 flex flex-col py-4 px-3 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      <div className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <p className="text-white/20 text-xs text-center">Traveloop v1.0</p>
      </div>
    </aside>
  </>
);

export default Sidebar;