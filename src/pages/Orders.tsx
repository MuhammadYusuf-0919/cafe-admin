// import { useState, useEffect } from "react";
// import { useData } from "@/context/DataContext";
// import { AppLayout } from "@/components/layout/app-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { motion } from "framer-motion";
// import { useAuth } from "@/context/AuthContext";
// import { Can } from "@/components/permission/Can";
// import { Order, OrderItem } from "@/types";
// import { 
//   Clock, 
//   CheckCircle2, 
//   XCircle, 
//   Search, 
//   Coffee, 
//   User, 
//   Calendar, 
//   DollarSign,
//   ClipboardList,
//   LayoutDashboard,
//   MenuIcon
// } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { useMediaQuery } from "@/hooks/use-mobile";
// import { useNavigate } from "react-router-dom";

// const Orders = () => {
//   const { user } = useAuth();
//   const { orders, completeOrder, cancelOrder, updateOrderItemStatus, loading } = useData();
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string | null>(null);

//   // Filtered and sorted orders
//   const filteredOrders = orders.filter((order) => {
//     // Status filter
//     if (statusFilter && order.status !== statusFilter) {
//       return false;
//     }

//     // Search filter
//     if (searchQuery) {
//       const searchLower = searchQuery.toLowerCase();
//       return (
//         order.table.number.toString().includes(searchLower) ||
//         order.status.toLowerCase().includes(searchLower) ||
//         order.waiter.name.toLowerCase().includes(searchLower)
//       );
//     }

//     return true;
//   });

//   // Sort orders - newest first
//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//   });

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { 
//       opacity: 1, 
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100
//       }
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
//       case "completed":
//         return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
//       case "cancelled":
//         return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
//       case "cooking":
//       case "preparing":
//         return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
//       case "ready":
//         return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
//       case "served":
//         return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//     }
//   };

//   return (
//     <AppLayout title="Orders">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-6"
//       >
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Orders</h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               View and manage restaurant orders
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <Button
//               variant={statusFilter === null ? "teal" : "outline"}
//               size="sm"
//               onClick={() => setStatusFilter(null)}
//               className="border-0 shadow-sm"
//             >
//               All
//             </Button>
//             <Button
//               variant={statusFilter === "active" ? "teal" : "outline"}
//               size="sm"
//               onClick={() => setStatusFilter("active")}
//               className="border-0 shadow-sm"
//             >
//               Active
//             </Button>
//             <Button
//               variant={statusFilter === "completed" ? "teal" : "outline"}
//               size="sm"
//               onClick={() => setStatusFilter("completed")}
//               className="border-0 shadow-sm"
//             >
//               Completed
//             </Button>
//             <Button
//               variant={statusFilter === "cancelled" ? "teal" : "outline"}
//               size="sm"
//               onClick={() => setStatusFilter("cancelled")}
//               className="border-0 shadow-sm"
//             >
//               Cancelled
//             </Button>
//           </div>
//         </div>
//       </motion.div>

//       <div className="mb-6">
//         <div className="relative w-full sm:w-64">
//           <Input
//             placeholder="Search orders..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
//         </div>
//       </div>

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//       >
//         {loading ? (
//           <>
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <OrderCardSkeleton key={i} />
//             ))}
//           </>
//         ) : sortedOrders.length > 0 ? (
//           sortedOrders.map((order) => (
//             <motion.div key={order.id} variants={itemVariants}>
//               <OrderCard
//                 order={order}
//                 completeOrder={completeOrder}
//                 cancelOrder={cancelOrder}
//                 updateOrderItemStatus={updateOrderItemStatus}
//                 getStatusBadge={getStatusBadge}
//               />
//             </motion.div>
//           ))
//         ) : (
//           <div className="col-span-full py-20 text-center">
//             <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
//               <ClipboardList className="h-8 w-8 text-gray-500 dark:text-gray-400" />
//             </div>
//             <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
//               No orders found
//             </p>
//             <p className="text-gray-400 dark:text-gray-500 text-sm">
//               {searchQuery ? "Try a different search term" : "Orders will appear here once created"}
//             </p>
//           </div>
//         )}
//       </motion.div>

//       {isMobile && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50">
//           <div className="flex justify-around">
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               onClick={() => navigate("/dashboard")}
//               className="flex flex-col items-center space-y-1"
//             >
//               <LayoutDashboard className="h-5 w-5" />
//               <span className="text-xs">Dashboard</span>
//             </Button>
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               onClick={() => navigate("/tables")}
//               className="flex flex-col items-center space-y-1"
//             >
//               <Coffee className="h-5 w-5" />
//               <span className="text-xs">Tables</span>
//             </Button>
//             <Button 
//               variant="teal" 
//               size="sm"
//               onClick={() => navigate("/orders")}
//               className="flex flex-col items-center space-y-1"
//             >
//               <ClipboardList className="h-5 w-5" />
//               <span className="text-xs">Orders</span>
//             </Button>
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               onClick={() => navigate("/menu")}
//               className="flex flex-col items-center space-y-1"
//             >
//               <MenuIcon className="h-5 w-5" />
//               <span className="text-xs">Menu</span>
//             </Button>
//           </div>
//         </div>
//       )}
//     </AppLayout>
//   );
// };

// interface OrderCardProps {
//   order: Order;
//   completeOrder: (orderId: string) => void;
//   cancelOrder: (orderId: string) => void;
//   updateOrderItemStatus: (orderId: string, orderItemId: string, status: OrderItem['status']) => void;
//   getStatusBadge: (status: string) => string;
// }

// const OrderCard = ({
//   order,
//   completeOrder,
//   cancelOrder,
//   updateOrderItemStatus,
//   getStatusBadge
// }: OrderCardProps) => {
//   const [expanded, setExpanded] = useState(false);
//   const { user } = useAuth();

//   const handleStatusChange = (itemId: string, newStatus: OrderItem['status']) => {
//     updateOrderItemStatus(order.id, itemId, newStatus);
//   };

//   const handleComplete = () => {
//     completeOrder(order.id);
//     toast.success(`Order for Table ${order.table.number} completed`);
//   };

//   const handleCancel = () => {
//     cancelOrder(order.id);
//     toast.info(`Order for Table ${order.table.number} cancelled`);
//   };

//   // Check if all items are served
//   const allItemsServed = order.items.every(item => item.status === 'served');

//   // Get next status for an item
//   const getNextStatus = (currentStatus: string): OrderItem['status'] => {
//     switch (currentStatus) {
//       case 'pending':
//         return 'cooking';
//       case 'cooking':
//         return 'ready';
//       case 'ready':
//         return 'served';
//       default:
//         return 'pending';
//     }
//   };

//   return (
//     <Card className="overflow-hidden">
//       <CardContent className="p-0">
//         {/* Header */}
//         <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-bold text-xl flex items-center">
//                 <Coffee className="h-5 w-5 mr-2" />
//                 Table {order.table.number}
//               </h3>
//               <p className="text-teal-100 text-sm mt-1">
//                 {format(new Date(order.createdAt), "MMM d, yyyy • h:mm a")}
//               </p>
//             </div>
//             <span
//               className={`px-3 py-1.5 rounded-full text-xs font-medium bg-white/20`}
//             >
//               {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//             </span>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="p-6 flex flex-wrap gap-y-4">
//           <div className="w-1/2">
//             <p className="text-xs text-gray-500 dark:text-gray-400">Waiter</p>
//             <p className="font-medium flex items-center">
//               <User className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
//               {order.waiter.name}
//             </p>
//           </div>
//           <div className="w-1/2">
//             <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
//             <p className="font-medium flex items-center">
//               <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
//               ${order.total.toFixed(2)}
//             </p>
//           </div>
//           <div className="w-1/2">
//             <p className="text-xs text-gray-500 dark:text-gray-400">Items</p>
//             <p className="font-medium">{order.items.length} items</p>
//           </div>
//           <div className="w-1/2">
//             <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
//             <p className="font-medium flex items-center">
//               <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
//               {format(new Date(order.createdAt), "MMM d")}
//             </p>
//           </div>
//         </div>

//         {/* Expandable Items Section */}
//         <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
//           <div className="px-6 pb-4">
//             <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Order Items</h4>
//             <div className="space-y-3">
//               {order.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="font-medium">{item.menuItem.name}</p>
//                     <div className="flex items-center mt-1">
//                       <span className="text-sm text-gray-500 dark:text-gray-400">
//                         Qty: {item.quantity}
//                       </span>
//                       <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
//                         {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Status update actions for chef/waiter */}
//                   {order.status === "active" && (user?.role === "chef" || user?.role === "waiter") && (
//                     <div>
//                       {item.status !== 'served' && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleStatusChange(item.id, getNextStatus(item.status))}
//                           className="text-xs border-0 shadow-sm"
//                         >
//                           Mark as {getNextStatus(item.status)}
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between items-center">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setExpanded(!expanded)}
//             className="text-gray-600 dark:text-gray-400"
//           >
//             {expanded ? "Show Less" : "Show Details"}
//           </Button>

//           <div className="flex space-x-2">
//             {order.status === "active" && (
//               <>
//                 {/* Manager can complete/cancel orders */}
//                 {user?.role === "manager" && (
//                   <>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={handleCancel}
//                       className="border-0 shadow-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                     >
//                       <XCircle className="h-4 w-4 mr-1" />
//                       Cancel
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={handleComplete}
//                       disabled={!allItemsServed}
//                       className="border-0 shadow-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
//                     >
//                       <CheckCircle2 className="h-4 w-4 mr-1" />
//                       Complete
//                     </Button>
//                   </>
//                 )}

//                 {/* Waiter can mark order as ready or completed */}
//                 {user?.role === "waiter" && (
//                   <>
//                     {allItemsServed && (
//                       <Button
//                         size="sm"
//                         variant="teal"
//                         onClick={handleComplete}
//                         className="text-xs"
//                       >
//                         <CheckCircle2 className="h-4 w-4 mr-1" />
//                         Complete Order
//                       </Button>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const OrderCardSkeleton = () => (
//   <Card>
//     <CardContent className="p-0">
//       <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
//             <div className="h-4 w-24 bg-white/20 rounded mt-2 animate-pulse"></div>
//           </div>
//           <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
//         </div>
//       </div>
//       <div className="p-6">
//         <div className="grid grid-cols-2 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="space-y-1">
//               <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//               <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between">
//         <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//         <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//       </div>
//     </CardContent>
//   </Card>
// );

// export default Orders;





import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Can } from "@/components/permission/Can";
import { Order, OrderItem } from "@/types";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Coffee,
  User,
  Calendar,
  DollarSign,
  ClipboardList,
  LayoutDashboard,
  MenuIcon,
  Info,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Orders = () => {
  const { user } = useAuth();
  const { orders, completeOrder, cancelOrder, updateOrderItemStatus, loading } = useData();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtered and sorted orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.table.number.toString().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.waiter.name.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Sort orders - newest first
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Open details modal
  const openDetailsModal = (order: Order) => {
    setDetailsOrder(order);
    setIsDetailsOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cooking":
      case "preparing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "ready":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case "served":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Faol";
      case "completed":
        return "Yakunlangan";
      case "cancelled":
        return "Bekor qilingan";
      case "pending":
        return "Kutilmoqda";
      case "cooking":
        return "Tayyorlanmoqda";
      case "preparing":
        return "Tayyorlanmoqda";
      case "ready":
        return "Tayyor";
      case "served":
        return "Yetkazilgan";
      default:
        return status;
    }
  };

  return (
    <AppLayout title="Buyurtmalar">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Buyurtmalar</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Restoran buyurtmalarini ko'rish va boshqarish
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === null ? "teal" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="border-0 shadow-sm"
            >
              Hammasi
            </Button>
            <Button
              variant={statusFilter === "active" ? "teal" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
              className="border-0 shadow-sm"
            >
              Faol
            </Button>
            <Button
              variant={statusFilter === "completed" ? "teal" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="border-0 shadow-sm"
            >
              Yakunlangan
            </Button>
            <Button
              variant={statusFilter === "cancelled" ? "teal" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("cancelled")}
              className="border-0 shadow-sm"
            >
              Bekor qilingan
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Buyurtmalarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <motion.div key={order.id} variants={itemVariants}>
              <OrderCard
                order={order}
                completeOrder={completeOrder}
                cancelOrder={cancelOrder}
                updateOrderItemStatus={updateOrderItemStatus}
                getStatusBadge={getStatusBadge}
                onShowDetails={() => openDetailsModal(order)}
                translateStatus={translateStatus}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <ClipboardList className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Buyurtmalar topilmadi
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              {searchQuery ? "Boshqa qidiruv so'zini kiriting" : "Buyurtmalar yaratilgach, shu yerda ko'rinadi"}
            </p>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-teal-500" />
              Buyurtma tafsilotlari - Stol {detailsOrder?.table.number}
            </DialogTitle>
          </DialogHeader>

          {detailsOrder && (
            <>
              <ScrollArea className="flex-1 h-[400px] px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-3 text-teal-600 dark:text-teal-400">Buyurtma ma'lumotlari</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 dark:text-gray-400">Holati</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(detailsOrder.status)}`}>
                            {translateStatus(detailsOrder.status)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 dark:text-gray-400">Buyurtma sanasi</span>
                          <span>{format(new Date(detailsOrder.createdAt), "yyyy.MM.dd • HH:mm")}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 dark:text-gray-400">Umumiy summa</span>
                          <span className="font-semibold">${detailsOrder.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">Taomlar soni</span>
                          <span>{detailsOrder.items.length} ta</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-3 text-teal-600 dark:text-teal-400">Ofitsiant ma'lumotlari</h3>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-teal-200 dark:border-teal-900">
                          <AvatarFallback className="bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                            {detailsOrder.waiter.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{detailsOrder.waiter.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {detailsOrder.waiter.id}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {detailsOrder.waiter.role === "manager" ? "Menejer" :
                              detailsOrder.waiter.role === "waiter" ? "Ofitsiant" : "Oshpaz"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="font-semibold text-lg mb-3 text-teal-600 dark:text-teal-400">Buyurtma tarkibi</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Taom</TableHead>
                      <TableHead>Miqdori</TableHead>
                      <TableHead>Narxi</TableHead>
                      <TableHead>Holati</TableHead>
                      <TableHead>Jami</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailsOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.menuItem.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.menuItem.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                            {translateStatus(item.status)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${(item.quantity * item.menuItem.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right">Jami</TableCell>
                      <TableCell className="font-semibold">${detailsOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </ScrollArea>
              <div className="flex justify-end mt-6 space-x-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Yopish</Button>

                {detailsOrder.status === "active" && (
                  <>
                    {/* Manager can complete/cancel orders */}
                    {user?.role === "manager" && (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            cancelOrder(detailsOrder.id);
                            setIsDetailsOpen(false);
                            toast.info(`Stol ${detailsOrder.table.number} uchun buyurtma bekor qilindi`);
                          }}
                          className="bg-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Bekor qilish
                        </Button>

                        <Button
                          variant="teal"
                          onClick={() => {
                            completeOrder(detailsOrder.id);
                            setIsDetailsOpen(false);
                            toast.success(`Stol ${detailsOrder.table.number} uchun buyurtma yakunlandi`);
                          }}
                          disabled={!detailsOrder.items.every(item => item.status === 'served')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Yakunlash
                        </Button>
                      </>
                    )}

                    {/* Waiter can mark order as completed */}
                    {user?.role === "waiter" && detailsOrder.items.every(item => item.status === 'served') && (
                      <Button
                        variant="teal"
                        onClick={() => {
                          completeOrder(detailsOrder.id);
                          setIsDetailsOpen(false);
                          toast.success(`Stol ${detailsOrder.table.number} uchun buyurtma yakunlandi`);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Yakunlash
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>

          )}
        </DialogContent>
      </Dialog>

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50">
          <div className="flex justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center space-y-1"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs">Bosh sahifa</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tables")}
              className="flex flex-col items-center space-y-1"
            >
              <Coffee className="h-5 w-5" />
              <span className="text-xs">Stollar</span>
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center space-y-1"
            >
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs">Buyurtmalar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/menu")}
              className="flex flex-col items-center space-y-1"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="text-xs">Menyu</span>
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

interface OrderCardProps {
  order: Order;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderItemStatus: (orderId: string, orderItemId: string, status: OrderItem['status']) => void;
  getStatusBadge: (status: string) => string;
  translateStatus: (status: string) => string;
  onShowDetails: () => void;
}

const OrderCard = ({
  order,
  completeOrder,
  cancelOrder,
  updateOrderItemStatus,
  getStatusBadge,
  translateStatus,
  onShowDetails
}: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  const handleStatusChange = (itemId: string, newStatus: OrderItem['status']) => {
    updateOrderItemStatus(order.id, itemId, newStatus);
  };

  const handleComplete = () => {
    completeOrder(order.id);
    toast.success(`Stol ${order.table.number} uchun buyurtma yakunlandi`);
  };

  const handleCancel = () => {
    cancelOrder(order.id);
    toast.info(`Stol ${order.table.number} uchun buyurtma bekor qilindi`);
  };

  // Check if all items are served
  const allItemsServed = order.items.every(item => item.status === 'served');

  // Get next status for an item
  const getNextStatus = (currentStatus: string): OrderItem['status'] => {
    switch (currentStatus) {
      case 'pending':
        return 'cooking';
      case 'cooking':
        return 'ready';
      case 'ready':
        return 'served';
      default:
        return 'pending';
    }
  };

  const translateNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'pending':
        return 'Tayyorlanmoqda';
      case 'cooking':
        return 'Tayyor';
      case 'ready':
        return 'Yetkazilgan';
      default:
        return 'Kutilmoqda';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl flex items-center">
                <Coffee className="h-5 w-5 mr-2" />
                Stol {order.table.number}
              </h3>
              <p className="text-teal-100 text-sm mt-1">
                {format(new Date(order.createdAt), "yyyy.MM.dd • HH:mm")}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium bg-white/20`}
            >
              {translateStatus(order.status)}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 flex flex-wrap gap-y-4">
          <div className="w-1/2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Ofitsiant</p>
            <p className="font-medium flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              {order.waiter.name}
            </p>
          </div>
          <div className="w-1/2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Jami summa</p>
            <p className="font-medium flex items-center">
              <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              ${order.total.toFixed(2)}
            </p>
          </div>
          <div className="w-1/2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Taomlar</p>
            <p className="font-medium">{order.items.length} ta</p>
          </div>
          <div className="w-1/2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sana</p>
            <p className="font-medium flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              {format(new Date(order.createdAt), "MMM d")}
            </p>
          </div>
        </div>

        {/* Expandable Items Section */}
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-6 pb-4">
            <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Buyurtma tarkibi</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Miqdori: {item.quantity}
                      </span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {translateStatus(item.status)}
                      </span>
                    </div>
                  </div>

                  {/* Status update actions for chef/waiter */}
                  {order.status === "active" && (user?.role === "chef" || user?.role === "waiter") && (
                    <div>
                      {item.status !== 'served' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(item.id, getNextStatus(item.status))}
                          className="text-xs border-0 shadow-sm"
                        >
                          {translateNextStatus(item.status)}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 fle justify-between items-center">
          <div className="flex gap-2 justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              // className="bg-slate-500 hover:bg-slate-600"
              className='bg-secondary'
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Yopish
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Tarkibini ko‘rish
                </>
              )}
            </Button>

            <Button
              // variant="secondary"
              size="sm"
              onClick={onShowDetails}
            >
              <Info className="h-4 w-4" />
              Batafsil
            </Button>
          </div>

          {/* <div className="flex space-x-2">
            {order.status === "active" && (
              <>
              Manager can complete/cancel orders
                {user?.role === "manager" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-0 shadow-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Bekor qilish
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleComplete}
                      disabled={!allItemsServed}
                      className="border-0 shadow-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Yakunlash
                    </Button>
                  </>
                )}
                
                 Waiter can mark order as ready or completed
                {user?.role === "waiter" && (
                  <>
                    {allItemsServed && (
                      <Button
                        size="sm"
                        variant="teal"
                        onClick={handleComplete}
                        className="text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Yakunlash
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

const OrderCardSkeleton = () => (
  <div>
    <CardContent className="p-0">
      <div className="p-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-white/20 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-6 w-20 bg-white/20 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between rounded-b-xl">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </CardContent>
  </div>
);

export default Orders;