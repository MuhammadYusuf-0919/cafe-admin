
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MenuItemSkeleton, CategorySkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Can } from "@/components/permission/Can";
import { Category, MenuItem } from "@/types";
import { Edit, Plus, Search, Tag } from "lucide-react";

const Menu = () => {
  const { user } = useAuth();
  const { categories, menuItems, loading, updateMenuItem } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Filtered menu items based on search and category
  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "all" || item.categoryId === selectedCategory) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle item availability
  const toggleItemAvailability = (itemId: string, currentAvailability: boolean) => {
    updateMenuItem(itemId, { available: !currentAvailability });
  };

  // Edit item handler
  const handleEditItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsEditDialogOpen(true);
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

  return (
    <AppLayout title="Menu">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Menu</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and manage menu items
            </p>
          </div>
          <Can I="create" a="menu">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="teal"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Menu Item
            </Button>
          </Can>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex-1">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full h-auto flex-wrap">
              <TabsTrigger value="all" className="flex-grow">
                All Items
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-grow"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <MenuItemCard
                  item={item}
                  categories={categories}
                  onEdit={() => handleEditItem(item)}
                  onToggleAvailability={() =>
                    toggleItemAvailability(item.id, item.available)
                  }
                  canEdit={user?.role === "manager"}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No menu items found. Try a different search or category.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Menu Item Dialog would go here */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Menu item creation form would go here
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog would go here */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Menu item edit form would go here
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  categories: Category[];
  onEdit: () => void;
  onToggleAvailability: () => void;
  canEdit: boolean;
}

const MenuItemCard = ({
  item,
  categories,
  onEdit,
  onToggleAvailability,
  canEdit,
}: MenuItemCardProps) => {
  // Find category name
  const category = categories.find((c) => c.id === item.categoryId);

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No Image</span>
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {category.name}
          </div>
        )}
        {canEdit && (
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="bg-white/80 hover:bg-white text-gray-700 h-8 w-8 rounded-full"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.name}</h3>
          <div className="text-teal-600 dark:text-teal-400 font-bold">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
          {item.description || "No description available."}
        </p>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 text-sm text-gray-600 dark:text-gray-300">Available:</div>
            <Switch
              checked={item.available}
              onCheckedChange={onToggleAvailability}
              disabled={!canEdit}
            />
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs ${
              item.available
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {item.available ? "In Stock" : "Out of Stock"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Menu;
