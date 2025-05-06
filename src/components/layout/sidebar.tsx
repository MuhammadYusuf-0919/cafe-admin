
import {
  Calendar,
  ChefHat,
  ClipboardList,
  Home,
  LayoutDashboard,
  Menu as MenuIcon,
  Settings,
  Users,
  Coffee,
  Utensils,
  BarChart,
  Tag,
  LayoutGrid
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/permission/Can";

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      className="h-screen w-64 bg-sidebar flex flex-col border-r border-gray-200 dark:border-gray-800"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="p-4">
        <motion.div 
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Utensils className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Mesa Oasis</h1>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center gap-3 p-2 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full text-white flex items-center justify-center font-bold">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              text="Dashboard"
              onClick={() => navigate("/dashboard")}
              active={isActive("/dashboard")}
            />

            <Can I="view" a="tables">
              <SidebarItem
                icon={<Coffee className="h-5 w-5" />}
                text="Tables"
                onClick={() => navigate("/tables")}
                active={isActive("/tables")}
              />
            </Can>

            <Can I="view" a="orders">
              <SidebarItem
                icon={<ClipboardList className="h-5 w-5" />}
                text="Orders"
                onClick={() => navigate("/orders")}
                active={isActive("/orders")}
              />
            </Can>

            <Can I="view" a="menu">
              <SidebarItem
                icon={<MenuIcon className="h-5 w-5" />}
                text="Menu"
                onClick={() => navigate("/menu")}
                active={isActive("/menu")}
              />
            </Can>

            <Can I="manage" a="all">
              <SidebarItem
                icon={<Tag className="h-5 w-5" />}
                text="Categories"
                onClick={() => navigate("/categories")}
                active={isActive("/categories")}
              />

              <SidebarItem
                icon={<LayoutGrid className="h-5 w-5" />}
                text="Tables Management"
                onClick={() => navigate("/tables-management")}
                active={isActive("/tables-management")}
              />

              <SidebarItem
                icon={<Users className="h-5 w-5" />}
                text="Staff Overview"
                onClick={() => navigate("/staff-overview")}
                active={isActive("/staff-overview")}
              />

              <SidebarItem
                icon={<BarChart className="h-5 w-5" />}
                text="Reports"
                onClick={() => navigate("/reports")}
                active={isActive("/reports")}
              />

              <SidebarItem
                icon={<Settings className="h-5 w-5" />}
                text="Settings"
                onClick={() => navigate("/settings")}
                active={isActive("/settings")}
              />
            </Can>
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  active?: boolean;
}

const SidebarItem = ({ icon, text, onClick, active }: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start relative text-[15px] font-medium",
        active
          ? "bg-sidebar-accent text-teal-600 dark:text-teal-400"
          : "text-gray-600 dark:text-gray-300 hover:bg-sidebar-accent hover:text-teal-600 dark:hover:text-teal-400"
      )}
      onClick={onClick}
    >
      {active && (
        <motion.span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-r from-teal-500 to-teal-600"
          layoutId="sidebar-active-indicator"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
      )}
      <span className="mr-3">{icon}</span>
      {text}
    </Button>
  );
};
