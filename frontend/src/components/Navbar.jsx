import { useContext, useState } from "react";
import { NotebookPen, CheckCircle2, LogIn, LogOut,UserCircle2 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { notesContext } from "../context/NotesContext";

const Navbar = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useContext(notesContext);

  const NAV_ITEMS = [
    {
      key: "notes",
      label: "Your Notes",
      tooltip: "Everything you're still working on",
      icon: NotebookPen,
      to: "/notes",
    },
    {
      key: "completed",
      label: "Completed Notes",
      tooltip: "Notes you've checked off and archived",
      icon: CheckCircle2,
      to: "/completed-notes",
    },
    {
      key: "profile",
      label: "Profile",
      tooltip: "Manage your profile settings",
      icon: UserCircle2,
      to: "/profile",
    },
    {
      key: "login",
      label: token ? "Logout" : "Login",
      tooltip: token ? "Sign out of your account" : "Sign in to sync your notes",
      icon: token ? LogOut : LogIn,
      to: "/login",
    },
  ];

  const handleAuthClick = (event, key) => {
    if (token && key === "login") {
      event.preventDefault();
      setToken("");
      navigate("/login");
    }
  };

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                   flex items-center gap-1 sm:gap-2
                   rounded-full border border-white/10
                   bg-[#1C1B1F]/90 backdrop-blur-md
                   shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                   px-2 py-2"
    >
      {NAV_ITEMS.map(({ key, label, tooltip, icon: Icon, to }) => {
        const isActive =
          key === "notes"
            ? location.pathname === "/notes"
            : key === "completed"
              ? location.pathname === "/completed-notes"
              : key === "profile"
                ? location.pathname === "/profile"
              : location.pathname === "/login";
        const isHovered = hovered === key;

        return (
          <div key={key} className="relative">
            {/* Tooltip */}
            <div
              role="tooltip"
              className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2
                            whitespace-nowrap rounded-lg bg-[#1C1B1F] px-3 py-1.5
                            text-xs font-medium text-[#F5F1E8]
                            border border-white/10 shadow-lg
                            transition-all duration-200 ease-out
                            ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}
            >
              {tooltip}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2
                             rotate-45 bg-[#1C1B1F] border-l border-t border-white/10"
              />
            </div>
            <NavLink to={to} className="relative z-10">
              <button
                type="button"
                onClick={(event) => handleAuthClick(event, key)}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(key)}
                onBlur={() => setHovered(null)}
                aria-label={label}
                className={`group flex items-center gap-2 rounded-full
                            px-3.5 py-2 sm:px-4 sm:py-2.5
                            text-sm font-medium
                            transition-all duration-200 ease-out
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A33D]/70
                            ${
                              isActive
                                ? "bg-[#FEEFCA] text-[#1C1B1F] shadow-inner"
                                : "text-[#F5F1E8]/70 hover:text-[#F5F1E8] hover:bg-white/5"
                            }`}
              >
                <Icon size={17} strokeWidth={isActive ? 2.4 : 2} className="shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </NavLink>
          </div>
        );
      })}
    </nav>
  );
};
export default Navbar;
