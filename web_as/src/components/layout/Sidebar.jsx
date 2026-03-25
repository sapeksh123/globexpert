import { NavLink } from "react-router-dom";
import { LuBox, LuChartColumnBig, LuLogOut, LuPackageSearch, LuStore, LuUsers } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LuChartColumnBig, roles: ["ADMIN", "SELLER"] },
  { to: "/catalog", label: "Catalog", icon: LuBox, roles: ["ADMIN", "SELLER"] },
  { to: "/orders", label: "Orders", icon: LuPackageSearch, roles: ["ADMIN", "SELLER"] },
  { to: "/sellers", label: "Sellers", icon: LuStore, roles: ["ADMIN"] },
  { to: "/users", label: "Users", icon: LuUsers, roles: ["ADMIN"] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { showConfirmToast } = useToast();

  const onLogout = () => {
    showConfirmToast("Do you wanna logout?", () => {
      onClose();
      logout();
    });
  };

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[84vw] max-w-60 flex-col border-r border-white/20 bg-[#0e1b32] p-4 text-slate-100 transition-transform lg:static lg:h-auto lg:w-60 lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-teal-300">Globexpert</p>
        <h1 className="mt-2 text-lg font-semibold sm:text-xl">Control Room</h1>
      </div>

      <nav className="mt-7 space-y-1.5">
        {links
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm sm:text-[15px] transition ${
                  isActive ? "bg-teal-500/20 text-white" : "text-slate-300 hover:bg-white/10"
                }`
              }
            >
              <item.icon className="text-base" />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
      >
        <LuLogOut />
        Logout
      </button>
      </aside>
    </>
  );
}
