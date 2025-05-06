
import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import {
  Moon,
  Sun,
  Save,
  RefreshCw,
  Bell,
  Printer,
  Database,
  CloudUpload,
} from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const settingsGroups = [
    {
      title: "Appearance",
      items: [
        {
          name: "Dark Mode",
          description: "Enable dark mode for the application",
          element: (
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          ),
          icon: theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
        },
        {
          name: "Compact Mode",
          description: "Reduce spacing for a more compact view",
          element: <Switch />,
          icon: <RefreshCw className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          name: "Order Alerts",
          description: "Receive alerts for new orders",
          element: <Switch defaultChecked />,
          icon: <Bell className="h-5 w-5" />,
        },
        {
          name: "Kitchen Notifications",
          description: "Receive alerts when orders are ready",
          element: <Switch defaultChecked />,
          icon: <Bell className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Receipts & Printing",
      items: [
        {
          name: "Auto-Print Receipts",
          description: "Automatically print receipts for new orders",
          element: <Switch />,
          icon: <Printer className="h-5 w-5" />,
        },
        {
          name: "Receipt Footer Text",
          description: "Custom text to display at the bottom of receipts",
          element: (
            <Input
              defaultValue="Thank you for dining with us!"
              className="max-w-md"
            />
          ),
          icon: <Printer className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          name: "Backup Data",
          description: "Create a backup of all restaurant data",
          element: (
            <Button variant="outline" size="sm">
              Create Backup
            </Button>
          ),
          icon: <Database className="h-5 w-5" />,
        },
        {
          name: "Automatic Backups",
          description: "Create daily backups automatically",
          element: <Switch defaultChecked />,
          icon: <CloudUpload className="h-5 w-5" />,
        },
      ],
    },
  ];

  return (
    <AppLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your restaurant system preferences
            </p>
          </div>
          <Button onClick={handleSave} className="restaurant-button" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>

      <div className="space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{group.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.items.map((item, itemIndex) => (
                    <div key={item.name}>
                      {itemIndex > 0 && <Separator className="my-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div>{item.element}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Settings;
