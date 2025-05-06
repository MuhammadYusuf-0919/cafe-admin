
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/loading-spinner";
import { motion } from "framer-motion";
import { Can } from "@/components/permission/Can";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Coffee, ClipboardList, Menu as MenuIcon, User, ChefHat, BarChart, Settings, Tag, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from "../ui/toggle";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getMobileNavItems = () => {
    // Boshlanishda faqat umumiy (har bir foydalanuvchi uchun) elementlar:
    const items = [
      {
        title: "Dashboard", // Har doim boshida
        path: "/dashboard",
        icon: LayoutDashboard,
        permission: { action: "access", subject: "dashboard" }
      },
      {
        title: "Profile", // Har doim oxirida bo‘ladi
        path: "/profile",
        icon: User,
        permission: { action: "view", subject: "profile" }
      }
    ];
  
    // Rollarga tegishli elementlarni vaqtincha shu massivga to‘playmiz
    const roleItems = [];
  
    // Manager roli uchun navigatsiyalar
    if (user?.role === "manager") {
      roleItems.push(
        {
          title: "Tables",
          path: "/tables",
          icon: Coffee,
          permission: { action: "view", subject: "tables" }
        },
        {
          title: "Orders",
          path: "/orders",
          icon: ClipboardList,
          permission: { action: "view", subject: "orders" }
        },
        {
          title: "Menu",
          path: "/menu",
          icon: MenuIcon,
          permission: { action: "view", subject: "menu" }
        }
      );
    }
    // Waiter roli uchun navigatsiyalar
    else if (user?.role === "waiter") {
      roleItems.push(
        {
          title: "Tables",
          path: "/tables",
          icon: Coffee,
          permission: { action: "view", subject: "tables" }
        },
        {
          title: "Orders",
          path: "/orders",
          icon: ClipboardList,
          permission: { action: "view", subject: "orders" }
        },
        {
          title: "Menu",
          path: "/menu",
          icon: MenuIcon,
          permission: { action: "view", subject: "menu" }
        }
      );
    }
    // Chef roli uchun navigatsiyalar
    else if (user?.role === "chef") {
      roleItems.push(
        {
          title: "Orders",
          path: "/orders",
          icon: ClipboardList,
          permission: { action: "view", subject: "orders" }
        },
        {
          title: "Menu",
          path: "/menu",
          icon: MenuIcon,
          permission: { action: "view", subject: "menu" }
        }
      );
    }
  
    // Role'ga tegishli itemlarni oxirgi (Profile) elementdan oldin joylashtiramiz
    items.splice(items.length - 1, 0, ...roleItems);
  
    // Faqat 5 ta elementgacha cheklaymiz (mobil interfeys uchun)
    return items.slice(0, 5);
  };

  // Additional items that don't fit in the mobile navbar
  const getOverflowItems = () => {
    const allItems = [
      {
        title: "Categories",
        path: "/categories",
        icon: Tag,
        permission: { action: "manage", subject: "all" }
      },
      {
        title: "Tables Management",
        path: "/tables-management",
        icon: Coffee,
        permission: { action: "manage", subject: "all" }
      },
      {
        title: "Staff Overview",
        path: "/staff-overview",
        icon: User,
        permission: { action: "manage", subject: "all" }
      },
      {
        title: "Reports",
        path: "/reports",
        icon: BarChart,
        permission: { action: "manage", subject: "all" }
      },
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        permission: { action: "manage", subject: "all" }
      }
    ];

    return allItems;
  };

  const mobileNavItems = getMobileNavItems();
  const overflowItems = getOverflowItems();

  return (
    <div className="min-h-screen flex">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px]">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <ChefHat className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                          Mesa Oasis
                        </span>
                      </div>
                    </SheetTitle>
                    <SheetDescription>
                      <div className="flex items-center gap-3 p-2 my-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-4">
                    <div className="space-y-1">
                      {/* Show all navigation items in sidebar */}
                      {[...mobileNavItems, ...overflowItems].map((item) => (
                        <Can 
                          key={item.path} 
                          I={item.permission.action} 
                          a={item.permission.subject}
                          this={item.permission.attributes}
                        >
                          <Button
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => {
                              navigate(item.path);
                            }}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.title}
                          </Button>
                        </Can>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            
            <h1 className="text-xl font-semibold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
              {title || "Restaurant Management System"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/profile")}
              className="border-0 shadow-md hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300"
            >
              {user?.name || "Profile"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout()}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        <motion.main
          className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ paddingBottom: isMobile ? '70px' : undefined }}
        >
          {children}
        </motion.main>
{/* 
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50 pb-safe">
            <div className="flex justify-around">
              {mobileNavItems.map((item) => (
                <Can 
                  key={item.path} 
                  I={item.permission.action} 
                  a={item.permission.subject}
                  this={item.permission?.attributes}
                >
                  <Button 
                    variant={isActive(item.path) ? "teal" : "ghost"}
                    size="sm" 
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center space-y-1"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs">{item.title}</span>
                  </Button>
                </Can>
              ))}
            </div>
          </div>
        )} */}
        {isMobile && (
  <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50 pb-safe">
    <div className="flex justify-around">
      {mobileNavItems.map((item) => {
        const active = isActive(item.path); // Hozirgi route bilan solishtirib active status aniqlanadi

        return (
          <Can 
            key={item.path}
            I={item.permission.action}
            a={item.permission.subject}
            this={item.permission?.attributes}
          >
            <Toggle
              // variant="ghost" // Har doim ghost variant
              size="sm"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center space-y-1 p-0"
            >
              {/* Icon: active bo‘lsa rang o‘zgaradi */}
              <item.icon
                className={`h-5 w-5 ${active ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
              />
              {/* Text: active bo‘lsa rang o‘zgaradi */}
              <span className={`text-xs ${active ? "text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}>
                {item.title}
              </span>
            </Toggle>
          </Can>
        );
      })}
    </div>
  </div>
)}

      </div>
    </div>
  );
};
