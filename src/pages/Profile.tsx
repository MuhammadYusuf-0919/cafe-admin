
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Profil muvaffaqiyatli yangilandi");
    }, 1000);
  };

  const roleColor = () => {
    switch (user?.role) {
      case "manager":
        return "bg-teal-500";
      case "chef":
        return "bg-teal-500";
      case "waiter":
        return "bg-teal-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AppLayout title="Your Profile">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and update your personal information
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>User Avatar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-4xl font-bold">
                        {user?.name?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute bottom-2 right-0 w-6 h-6 rounded-full ${roleColor()} border-2 border-white`}
                  ></span>
                </div>
                <Button variant="teal" className="w-full mb-2">Change Avatar</Button>
                <p className="text-sm text-muted-foreground text-center">
                  Upload a new avatar or choose from our gallery
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700"
                      defaultValue={user?.name}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                      value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700"
                    defaultValue={`${user?.role}@mesa.com`}
                  />
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 flex">
                    <input
                      type="password"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:border-gray-700"
                      defaultValue="********"
                      readOnly
                    />
                    <Button variant="outline" className="ml-2">
                      Change
                    </Button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleSave}
                    variant="teal"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
