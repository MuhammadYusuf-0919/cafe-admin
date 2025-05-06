import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TablesSkeleton } from "@/components/skeleton-loader";
import { Plus, Coffee, ArrowRight, User, Users } from "lucide-react";
import { Table } from "@/types";
import { useMediaQuery } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Tables = () => {
  const { tables, menuItems, categories, activeTable, setActiveTable, loading } = useData();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleTableSelect = (table: Table) => {
    if (table.status == "free" || table.status == "occupied") {
      setSelectedTable(table);
      setShowOrderDialog(true);
    }
  };

  const handleStartOrder = () => {
    if (selectedTable.id) {
      console.log("Starting order for table: ", selectedTable);
      setActiveTable(selectedTable && selectedTable);
      setShowOrderDialog(false);
  
      window.location.href = "/new-order";
    } else {
      console.warn("No selected table found");
    }
  };
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "free":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "free":
        return "bg-green-100 dark:bg-green-900/20";
      case "occupied":
        return "bg-red-100 dark:bg-red-900/20";
      case "reserved":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "free":
        return "Available";
      case "occupied":
        return "Occupied";
      case "reserved":
        return "Reserved";
      default:
        return status;
    }
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <AppLayout title="Tables">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Restaurant Tables</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a table to place an order or view its status
            </p>
          </div>
          <Button
            variant="teal"
            className="flex items-center gap-2"
            onClick={() => window.location.href = "/tables-management"}
          >
            Manage Tables <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <TablesSkeleton />
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table, i) => (
            <motion.div
              key={table.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={tableVariants}
              whileHover={{ translateY: -5 }}

              className="cursor-pointer"
            >
              <Card onClick={() => handleTableSelect(table)} className={`${getStatusBg(table.status)} border-2 ${table.status === "free" ? "border-green-400 dark:border-green-700" : "border-transparent"}`}>
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto mb-4">
                    <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md mx-auto">
                      <Coffee className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                      <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 border-2 border-current text-sm font-bold text-teal-600 dark:text-teal-400">
                        {table.number}
                      </span>
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(table.status)} border-2 border-white dark:border-gray-800`}
                    ></span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Table {table.number}
                  </h3>
                  <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Users className="mr-1 h-4 w-4" /> {table.capacity} Seats
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${table.status === "free" ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" :
                        table.status === "occupied" ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" :
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"}
                    `}
                  >
                    {getStatusText(table.status)}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-600 dark:text-teal-400">Table {selectedTable?.number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${selectedTable?.status ? getStatusColor(selectedTable.status) : "bg-gray-500"
                  }`}
              ></div>
              <span className="font-medium capitalize">
                {selectedTable?.status || "Unknown"}
              </span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Users className="mr-2 h-4 w-4" />
              <span>{selectedTable?.capacity} seat capacity</span>
            </div>

            {selectedTable?.status === "free" ? (
              <Button
                onClick={handleStartOrder}
                variant="teal"
                className="w-full mt-4"
              >
                Start New Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : selectedTable?.status === "occupied" ? (
              <Button
                onClick={handleStartOrder}
                variant="teal"
                className="w-full mt-4"
              >
                View/Update Order <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button disabled className="w-full mt-4">
                Reserved
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Tables;
