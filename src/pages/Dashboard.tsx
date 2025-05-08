
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { OrderSkeleton, TablesSkeleton } from "@/components/skeleton-loader";
import {
  ChefHat,
  Users,
  Coffee,
  ClipboardList,
  Menu,
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const { orders, tables, loading } = useData();
  const navigate = useNavigate();

  // Calculated statistics
  const activeOrders = orders.filter(order => order.status === "active").length;
  const pendingItems = orders.flatMap(order =>
    order.items.filter(item => item.status === "pending")
  ).length;
  const occupiedTables = tables.filter(table => table.status === "occupied").length;
  const completedOrders = orders.filter(order => order.status === "completed").length;

  const renderRoleDashboard = () => {
    switch (user?.role) {
      case "manager":
        return <ManagerDashboard />;
      case "chef":
        return <ChefDashboard />;
      case "waiter":
        return <WaiterDashboard />;
      default:
        return <div>Noma'lum rol</div>;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  const iconMap = {
    activeOrders: <ClipboardList className="h-8 w-8 text-blue-500" />,
    pendingItems: <Clock className="h-8 w-8 text-yellow-500" />,
    occupiedTables: <Coffee className="h-8 w-8 text-green-500" />,
    completedOrders: <CheckCircle className="h-8 w-8 text-purple-500" />,
  };

  return (
    <AppLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Xush kelibsiz, {user?.name || "Foydalanuvchi"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bugun Mesa Order Oasisda nimalar sodir bo'lmoqda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-4 w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-4 w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-4 w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="mt-4 w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {iconMap.activeOrders}
                    <span className="text-3xl font-bold">{activeOrders}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Faol buyurtmalar</h3>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {iconMap.pendingItems}
                    <span className="text-3xl font-bold">{pendingItems}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Kutilayotgan elementlar</h3>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {iconMap.occupiedTables}
                    <span className="text-3xl font-bold">{occupiedTables}/{tables.length}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Band qilingan stollar</h3>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {iconMap.completedOrders}
                    <span className="text-3xl font-bold">{completedOrders}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Tugallangan buyurtmalar</h3>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {renderRoleDashboard()}
      </motion.div>
    </AppLayout>
  );
};

const ManagerDashboard = () => {
  const { orders, tables, categories, menuItems } = useData();
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Menyu boshqaruvi",
      description: "Menyu elementlari va toifalarini qo'shish, tahrirlash yoki o'chirish",
      icon: <Menu className="h-6 w-6" />,
      action: () => navigate("/menu"),
    },
    {
      title: "Stollar boshqaruvi",
      description: "Restoran stollari va tartibini boshqaring",
      icon: <Coffee className="h-6 w-6" />,
      action: () => navigate("/tables-management"),
    },
    {
      title: "Xodimlar haqida umumiy ma'lumot",
      description: "Xodimlarning ishlashi va jadvallarini ko'ring",
      icon: <Users className="h-6 w-6" />,
      action: () => navigate("/staff-overview"),
    },
    {
      title: "Sotish hisobotlari",
      description: "Kundalik va oylik savdoni tahlil qiling",
      icon: <ClipboardList className="h-6 w-6" />,
      action: () => navigate("/reports"),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Tezkor harakatlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={i}
              className="h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <Card
                className="h-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={link.action}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-restaurant-primary/10 rounded-full mb-4">
                      {link.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {link.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Oxirgi buyurtmalar</span>
              <Button
                variant="ghost"
                className="text-restaurant-primary flex items-center gap-1 text-sm"
                onClick={() => navigate("/orders")}
              >
                Hammasini ko‘rish <ArrowRight className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3)
                .map((order) => (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        Stol {order.table.number}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.items.length} items · ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                          : order.status === "completed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Restoran haqida umumiy ma'lumot</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Menyu elementlari</p>
                <p className="text-2xl font-semibold">{menuItems.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Kategoriyalar</p>
                <p className="text-2xl font-semibold">{categories.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Stollar</p>
                <p className="text-2xl font-semibold">{tables.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Bugungi daromad</p>
                <p className="text-2xl font-semibold">
                  $
                  {orders
                    .filter(
                      (order) =>
                        new Date(order.createdAt).toDateString() ===
                        new Date().toDateString()
                    )
                    .reduce((sum, order) => sum + order.total, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ChefDashboard = () => {
  const { orders, updateOrderItemStatus } = useData();
  const navigate = useNavigate();

  // Get active orders with pending or cooking items
  const activeOrders = orders.filter(
    (order) =>
      order.status === "active" &&
      order.items.some(
        (item) => item.status === "pending" || item.status === "cooking"
      )
  );

  const handleUpdateStatus = (
    orderId: string,
    itemId: string,
    currentStatus: string
  ) => {
    let newStatus: "cooking" | "ready" = "cooking";
    if (currentStatus === "cooking") {
      newStatus = "ready";
    }
    updateOrderItemStatus(orderId, itemId, newStatus);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Oshxona buyurtmalari</h2>
        <Button
          onClick={() => navigate("/orders")}
          className="restaurant-button-outline"
        >
          Barcha buyurtmalarni ko'rish
        </Button>
      </div>

      {activeOrders.length === 0 ? (
        <Card className="bg-gray-50 dark:bg-gray-800 p-8 text-center">
          <ChefHat className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Hammasi ushlandi!</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Sizning e'tiboringizni talab qiladigan kutilayotgan buyurtmalar yo'q.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800 py-4">
                <CardTitle className="flex justify-between items-center text-base">
                  <span>
                    Stol {order.table.number} · Buyurtma #{order.id.slice(-4)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {order.items
                    .filter(
                      (item) =>
                        item.status === "pending" || item.status === "cooking"
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-4"
                      >
                        <div className="flex items-center">
                          <span className="font-mono text-lg mr-3">
                            {item.quantity}x
                          </span>
                          <div>
                            <h4 className="font-medium">{item.menuItem.name}</h4>
                            {item.notes && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Eslatma: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Button
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                item.id,
                                item.status
                              )
                            }
                            className={
                              item.status === "pending"
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }
                            size="sm"
                          >
                            {item.status === "pending"
                              ? "Ovqat pishirishni boshlang"
                              : "Tayyor deb belgilang"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const WaiterDashboard = () => {
  const { tables, orders } = useData();
  const navigate = useNavigate();

  // Get tables that are free
  const freeTables = tables.filter((table) => table.status === "free");

  // Get active orders for this waiter
  const activeOrders = orders.filter(
    (order) =>
      order.status === "active" &&
      order.items.some((item) => item.status === "ready")
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mavjud stollar</h2>
          <Button
            onClick={() => navigate("/tables")}
            className="restaurant-button-outline"
          >
            Barcha stollarni ko'rish
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {freeTables.length === 0 ? (
            <Card className="col-span-full bg-gray-50 dark:bg-gray-800 p-8 text-center">
              <Coffee className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Stollar mavjud emas</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Hozircha barcha stollar band yoki oldindan buyurtma qilingan.
              </p>
            </Card>
          ) : (
            freeTables.map((table) => (
              <Card
                key={table.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/tables`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-green-700 dark:text-green-300">
                      {table.number}
                    </span>
                  </div>
                  <h3 className="font-medium">Stol {table.number}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {table.capacity} O'rindiqlar
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Buyurtmalar Xizmatga tayyor</h2>
          <Button
            onClick={() => navigate("/orders")}
            className="restaurant-button-outline w-full sm:w-auto"
          >
            Barcha buyurtmalarni ko'rish
          </Button>
        </div>


        {activeOrders.length === 0 ? (
          <Card className="bg-gray-50 dark:bg-gray-800 p-8 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Xizmat ko'rsatish uchun buyurtmalar yo'q</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Xizmat qilish kerak bo'lgan tayyor mahsulotlar yo'q.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 py-4">
                  <CardTitle className="flex justify-between items-center text-base">
                    <span>
                      Stol {order.table.number} · Buyurtma #{order.id.slice(-4)}
                    </span>
                    <Button
                      onClick={() => navigate(`/orders`)}
                      className="text-sm restaurant-button"
                      size="sm"
                    >
                      Elementlarga xizmat ko'rsatish
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {order.items
                      .filter((item) => item.status === "ready")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded"
                        >
                          <span className="font-mono mr-3">{item.quantity}x</span>
                          <span>{item.menuItem.name}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
