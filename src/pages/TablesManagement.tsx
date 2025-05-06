
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { TablesSkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Table } from "@/types";
import { Edit, Trash2, Plus, Search, Coffee, Users } from "lucide-react";
import { toast } from "sonner";

const TablesManagement = () => {
  const { user } = useAuth();
  const { tables, addTable, updateTable, deleteTable, loading } = useData();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tableNumber, setTableNumber] = useState<number>(0);
  const [tableCapacity, setTableCapacity] = useState<number>(2);
  const [tableStatus, setTableStatus] = useState<string>("free");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtered tables based on search
  const filteredTables = tables.filter(
    (table) => 
      table.number.toString().includes(searchQuery) || 
      table.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.capacity.toString().includes(searchQuery)
  );

  // Sort tables by number
  const sortedTables = [...filteredTables].sort((a, b) => a.number - b.number);

  // Handle dialog open for edit
  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setTableNumber(table.number);
    setTableCapacity(table.capacity);
    setTableStatus(table.status);
    setIsEditDialogOpen(true);
  };

  // Handle dialog open for delete
  const handleDeleteTable = (table: Table) => {
    setSelectedTable(table);
    setIsDeleteDialogOpen(true);
  };

  // Handle add table
  const handleAddTable = () => {
    if (tableNumber <= 0) {
      toast.error("Table number must be greater than 0");
      return;
    }
    
    // Check if table number already exists
    const tableExists = tables.some(table => table.number === tableNumber);
    if (tableExists) {
      toast.error(`Table ${tableNumber} already exists`);
      return;
    }
    
    addTable({
      number: tableNumber,
      capacity: tableCapacity,
      status: tableStatus as "free" | "occupied" | "reserved"
    });
    
    setTableNumber(0);
    setTableCapacity(2);
    setTableStatus("free");
    setIsAddDialogOpen(false);
    toast.success(`Table ${tableNumber} added successfully`);
  };

  // Handle update table
  const handleUpdateTable = () => {
    if (!selectedTable) return;
    
    if (tableNumber <= 0) {
      toast.error("Table number must be greater than 0");
      return;
    }
    
    // Check if the new table number already exists (except the current table)
    const tableExists = tables.some(table => 
      table.number === tableNumber && table.id !== selectedTable.id
    );
    
    if (tableExists) {
      toast.error(`Table ${tableNumber} already exists`);
      return;
    }
    
    updateTable(selectedTable.id, {
      ...selectedTable,
      number: tableNumber,
      capacity: tableCapacity,
      status: tableStatus as "free" | "occupied" | "reserved"
    });
    
    setSelectedTable(null);
    setIsEditDialogOpen(false);
    toast.success(`Table ${tableNumber} updated successfully`);
  };

  // Handle delete table
  const handleConfirmDelete = () => {
    if (!selectedTable) return;
    
    deleteTable(selectedTable.id);
    setSelectedTable(null);
    setIsDeleteDialogOpen(false);
    toast.success(`Table ${selectedTable.number} deleted successfully`);
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

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "free":
        return "bg-emerald-500";
      case "occupied":
        return "bg-rose-500";
      case "reserved":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
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

  return (
    <AppLayout title="Tables Management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Tables Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Add, edit, or remove tables from your restaurant
            </p>
          </div>
          <Button
            onClick={() => {
              setTableNumber(tables.length > 0 ? Math.max(...tables.map(t => t.number)) + 1 : 1);
              setTableCapacity(2);
              setTableStatus("free");
              setIsAddDialogOpen(true);
            }}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Table
          </Button>
        </div>
      </motion.div>

      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <TablesSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedTables.length > 0 ? (
            sortedTables.map((table) => (
              <motion.div key={table.id} variants={itemVariants}>
                <TableCard
                  table={table}
                  onEdit={() => handleEditTable(table)}
                  onDelete={() => handleDeleteTable(table)}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No tables found. Add one to get started.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Add Table</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="tableNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                min={1}
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value) || 0)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="tableCapacity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Seating Capacity</Label>
              <Input
                id="tableCapacity"
                type="number"
                min={1}
                max={20}
                value={tableCapacity}
                onChange={(e) => setTableCapacity(parseInt(e.target.value) || 2)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="tableStatus" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
              <Select value={tableStatus} onValueChange={setTableStatus}>
                <SelectTrigger id="tableStatus" className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}
              className="border-0 shadow-md hover:shadow-lg">
              Cancel
            </Button>
            <Button onClick={handleAddTable}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-teal-500/20">
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Edit Table</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="editTableNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Table Number</Label>
              <Input
                id="editTableNumber"
                type="number"
                min={1}
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value) || 0)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editTableCapacity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Seating Capacity</Label>
              <Input
                id="editTableCapacity"
                type="number"
                min={1}
                max={20}
                value={tableCapacity}
                onChange={(e) => setTableCapacity(parseInt(e.target.value) || 2)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editTableStatus" className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
              <Select value={tableStatus} onValueChange={setTableStatus}>
                <SelectTrigger id="editTableStatus" className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}
              className="border-0 shadow-md hover:shadow-lg">
              Cancel
            </Button>
            <Button onClick={handleUpdateTable}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-teal-500/20">
              Update Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Table Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-500">Delete Table</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete Table #{selectedTable?.number}? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}
              className="border-0 shadow-md hover:shadow-lg">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/20 border-0">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

interface TableCardProps {
  table: Table;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const TableCard = ({
  table,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText,
}: TableCardProps) => {
  return (
    <Card className="overflow-hidden group hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="relative mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto text-white">
            <Coffee className="h-9 w-9" />
          </div>
          <div className="absolute -top-1 right-0 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md text-lg font-bold text-teal-600">
            {table.number}
          </div>
          <div className={`absolute -bottom-1 right-0 w-4 h-4 rounded-full ${getStatusColor(table.status)} border-2 border-white dark:border-gray-800`}></div>
        </div>
        
        <div className="text-center mb-3">
          <h3 className="text-lg font-medium">Table {table.number}</h3>
          <div className="flex items-center justify-center mt-1">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{table.capacity} Seats</span>
          </div>
        </div>
        
        <div className="text-center mt-auto">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            table.status === "free" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : 
            table.status === "occupied" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300" : 
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
          }`}>
            {getStatusText(table.status)}
          </span>
        </div>
        
        <div className="flex justify-center mt-3 space-x-2 pt-3 border-t border-gray-100 dark:border-gray-800 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-teal-600 hover:text-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/20"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablesManagement;
