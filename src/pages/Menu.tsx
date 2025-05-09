
// import { useState, useEffect } from "react";
// import { useData } from "@/context/DataContext";
// import { AppLayout } from "@/components/layout/app-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
// import { MenuItemSkeleton, CategorySkeleton } from "@/components/skeleton-loader";
// import { motion } from "framer-motion";
// import { useAuth } from "@/context/AuthContext";
// import { Can } from "@/components/permission/Can";
// import { Category, MenuItem } from "@/types";
// import { Edit, Plus, Search, Tag } from "lucide-react";

// const Menu = () => {
//   const { user } = useAuth();
//   const { categories, menuItems, loading, updateMenuItem } = useData();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

//   // Filtered menu items based on search and category
//   const filteredItems = menuItems.filter(
//     (item) =>
//       (selectedCategory === "all" || item.categoryId === selectedCategory) &&
//       (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   // Toggle item availability
//   const toggleItemAvailability = (itemId: string, currentAvailability: boolean) => {
//     updateMenuItem(itemId, { available: !currentAvailability });
//   };

//   // Edit item handler
//   const handleEditItem = (item: MenuItem) => {
//     setSelectedMenuItem(item);
//     setIsEditDialogOpen(true);
//   };

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

//   return (
//     <AppLayout title="Menu">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mb-6"
//       >
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Menu</h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Browse and manage menu items
//             </p>
//           </div>
//           <Can I="create" a="menu">
//             <Button
//               onClick={() => setIsAddDialogOpen(true)}
//               variant="teal"
//               className="flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" /> Add Menu Item
//             </Button>
//           </Can>
//         </div>
//       </motion.div>

//       <div className="mb-6 flex flex-col sm:flex-row gap-4">
//         <div className="relative w-full sm:w-64">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
//           <Input
//             placeholder="Search menu items..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         <div className="flex-1">
//           <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
//             <TabsList className="w-full h-auto flex-wrap">
//               <TabsTrigger value="all" className="flex-grow">
//                 All Items
//               </TabsTrigger>
//               {categories.map((category) => (
//                 <TabsTrigger
//                   key={category.id}
//                   value={category.id}
//                   className="flex-grow"
//                 >
//                   {category.name}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </Tabs>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           <MenuItemSkeleton />
//           <MenuItemSkeleton />
//           <MenuItemSkeleton />
//           <MenuItemSkeleton />
//           <MenuItemSkeleton />
//           <MenuItemSkeleton />
//         </div>
//       ) : (
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item) => (
//               <motion.div key={item.id} variants={itemVariants}>
//                 <MenuItemCard
//                   item={item}
//                   categories={categories}
//                   onEdit={() => handleEditItem(item)}
//                   onToggleAvailability={() =>
//                     toggleItemAvailability(item.id, item.available)
//                   }
//                   canEdit={user?.role === "manager"}
//                 />
//               </motion.div>
//             ))
//           ) : (
//             <div className="col-span-full py-20 text-center">
//               <p className="text-gray-500 dark:text-gray-400 text-lg">
//                 No menu items found. Try a different search or category.
//               </p>
//             </div>
//           )}
//         </motion.div>
//       )}

//       {/* Add Menu Item Dialog would go here */}
//       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Menu Item</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p className="text-center text-gray-500 dark:text-gray-400">
//               Menu item creation form would go here
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Menu Item Dialog would go here */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Menu Item</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <p className="text-center text-gray-500 dark:text-gray-400">
//               Menu item edit form would go here
//             </p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </AppLayout>
//   );
// };

// interface MenuItemCardProps {
//   item: MenuItem;
//   categories: Category[];
//   onEdit: () => void;
//   onToggleAvailability: () => void;
//   canEdit: boolean;
// }

// const MenuItemCard = ({
//   item,
//   categories,
//   onEdit,
//   onToggleAvailability,
//   canEdit,
// }: MenuItemCardProps) => {
//   // Find category name
//   const category = categories.find((c) => c.id === item.categoryId);

//   return (
//     <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
//       <div className="relative h-48 overflow-hidden">
//         {item.image ? (
//           <img
//             src={item.image}
//             alt={item.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//             <span className="text-gray-400 dark:text-gray-500">No Image</span>
//           </div>
//         )}
//         {category && (
//           <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
//             <Tag className="h-3 w-3 mr-1" />
//             {category.name}
//           </div>
//         )}
//         {canEdit && (
//           <div className="absolute top-2 right-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={onEdit}
//               className="bg-white/80 hover:bg-white text-gray-700 h-8 w-8 rounded-full"
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//           </div>
//         )}
//       </div>
//       <CardContent className="p-4 flex-grow flex flex-col">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{item.name}</h3>
//           <div className="text-teal-600 dark:text-teal-400 font-bold">
//             ${item.price.toFixed(2)}
//           </div>
//         </div>
//         <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
//           {item.description || "No description available."}
//         </p>
//         <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="mr-2 text-sm text-gray-600 dark:text-gray-300">Available:</div>
//             <Switch
//               checked={item.available}
//               onCheckedChange={onToggleAvailability}
//               disabled={!canEdit}
//             />
//           </div>
//           <div
//             className={`px-2 py-1 rounded-full text-xs ${
//               item.available
//                 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//                 : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
//             }`}
//           >
//             {item.available ? "In Stock" : "Out of Stock"}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default Menu;




import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MenuItemSkeleton, CategorySkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Can } from "@/components/permission/Can";
import { Category, MenuItem } from "@/types";
import { Edit, Eye, Plus, Search, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import { ScrollArea } from "@/components/ui/scroll-area";

const Menu = () => {
  const { user } = useAuth();
  const { categories, menuItems, loading, updateMenuItem, addMenuItem } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // New menu item form state
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    description: "",
    categoryId: "",
    available: true,
    image: ""
  });

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

  // Preview item handler
  const handlePreviewItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsPreviewDialogOpen(true);
  };

  // Handle form input changes
  const handleNewItemChange = (field: keyof Omit<MenuItem, "id">, value: any) => {
    setNewMenuItem(prev => ({
      ...prev,
      [field]: field === "price" ? parseFloat(value) || 0 : value
    }));
  };

  // Handle edit form changes
  const handleEditItemChange = (field: keyof MenuItem, value: any) => {
    if (!selectedMenuItem) return;

    setSelectedMenuItem(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: field === "price" ? parseFloat(value) || 0 : value
      };
    });
  };

  // Handle add menu item
  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.categoryId || newMenuItem.price <= 0) {
      toast.error("Iltimos, barcha zarur maydonlarni to'ldiring");
      return;
    }

    addMenuItem(newMenuItem);
    setIsAddDialogOpen(false);
    setNewMenuItem({
      name: "",
      price: 0,
      description: "",
      categoryId: "",
      available: true,
      image: ""
    });

    toast.success("Menyu elementi muvaffaqiyatli qo'shildi");
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!selectedMenuItem) return;

    if (!selectedMenuItem.name || !selectedMenuItem.categoryId || selectedMenuItem.price <= 0) {
      toast.error("Iltimos, barcha zarur maydonlarni to'ldiring");
      return;
    }

    updateMenuItem(selectedMenuItem.id, selectedMenuItem);
    setIsEditDialogOpen(false);
    toast.success("Menyu elementi muvaffaqiyatli yangilandi");
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
    <AppLayout title="Menyu">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">Menyu</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Menyu elementlarini ko'ring va boshqaring
            </p>
          </div>
          <Can I="create" a="menu">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="teal"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Taom qo'shish
            </Button>
          </Can>
        </div>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
          <Input
            placeholder="Taomlarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex-1">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full h-auto flex-wrap">
              <TabsTrigger value="all" className="flex-grow">
                Barcha taomlar
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
                  onPreview={() => handlePreviewItem(item)}
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
                Taomlar topilmadi. Boshqa qidiruv yoki kategoriyani sinab ko'ring.
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Menu Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">Taom qo'shish</DialogTitle>
          </DialogHeader>
          <ScrollArea className="dialog-content-scroll h-[400px] px-2">
            <div className="py-4 space-y-6 p-2">
              <ImageUpload
                value={newMenuItem.image}
                onChange={(value) => handleNewItemChange("image", value)}
                className="mb-4"
              />

              <div className="space-y-2">
                <Label htmlFor="name">Taom nomi *</Label>
                <Input
                  id="name"
                  value={newMenuItem.name}
                  onChange={(e) => handleNewItemChange("name", e.target.value)}
                  placeholder="Masalan: Palov"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Narxi *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newMenuItem.price || ""}
                  onChange={(e) => handleNewItemChange("price", e.target.value)}
                  placeholder="0.00"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategoriya *</Label>
                <Select
                  value={newMenuItem.categoryId}
                  onValueChange={(value) => handleNewItemChange("categoryId", value)}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tavsif</Label>
                <Textarea
                  id="description"
                  value={newMenuItem.description || ""}
                  onChange={(e) => handleNewItemChange("description", e.target.value)}
                  placeholder="Taom haqida qisqacha ma'lumot"
                  rows={3}
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newMenuItem.available}
                  onCheckedChange={(checked) => handleNewItemChange("available", checked)}
                />
                <Label htmlFor="available">Mavjud</Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Bekor qilish</Button>
            <Button variant="teal" onClick={handleAddMenuItem} className="gap-1">
              <Plus className="h-4 w-4" /> Qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">Taomni tahrirlash</DialogTitle>
          </DialogHeader>
          <ScrollArea className="dialog-content-scroll h-[400px] px-2">
            <div className="py-4 space-y-6 px-2">
              {selectedMenuItem && (
                <>
                  <ImageUpload
                    value={selectedMenuItem.image}
                    onChange={(value) => handleEditItemChange("image", value)}
                    className="mb-4"
                  />

                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Taom nomi *</Label>
                    <Input
                      id="edit-name"
                      value={selectedMenuItem.name}
                      onChange={(e) => handleEditItemChange("name", e.target.value)}
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Narxi *</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={selectedMenuItem.price || ""}
                      onChange={(e) => handleEditItemChange("price", e.target.value)}
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Kategoriya *</Label>
                    <Select
                      value={selectedMenuItem.categoryId}
                      onValueChange={(value) => handleEditItemChange("categoryId", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Tavsif</Label>
                    <Textarea
                      id="edit-description"
                      value={selectedMenuItem.description || ""}
                      onChange={(e) => handleEditItemChange("description", e.target.value)}
                      rows={3}
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit-available"
                      checked={selectedMenuItem.available}
                      onCheckedChange={(checked) => handleEditItemChange("available", checked)}
                    />
                    <Label htmlFor="edit-available">Mavjud</Label>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Bekor qilish</Button>
            <Button variant="teal" onClick={handleSaveEdit}>Saqlash</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Menu Item Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">Taom haqida ma'lumot</DialogTitle>
          </DialogHeader>
          <div className="dialog-content-scroll">
            {selectedMenuItem && (
              <div className="py-4">
                <div className="h-56 overflow-hidden rounded-md mb-4">
                  {selectedMenuItem.image ? (
                    <img
                      src={selectedMenuItem.image}
                      alt={selectedMenuItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500">Rasm yo'q</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">{selectedMenuItem.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold">${selectedMenuItem.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedMenuItem.available
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {selectedMenuItem.available ? "Mavjud" : "Mavjud emas"}
                    </span>
                  </div>
                </div>

                {selectedMenuItem.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Tavsif</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedMenuItem.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Kategoriya</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {categories.find(c => c.id === selectedMenuItem.categoryId)?.name || "Noma'lum"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>Yopish</Button>
            {user?.role === "manager" && (
              <Button
                variant="teal"
                onClick={() => {
                  setIsPreviewDialogOpen(false);
                  if (selectedMenuItem) handleEditItem(selectedMenuItem);
                }}
                className="gap-1"
              >
                <Edit className="h-4 w-4" /> Tahrirlash
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  categories: Category[];
  onEdit: () => void;
  onPreview: () => void;
  onToggleAvailability: () => void;
  canEdit: boolean;
}

const MenuItemCard = ({
  item,
  categories,
  onEdit,
  onPreview,
  onToggleAvailability,
  canEdit,
}: MenuItemCardProps) => {
  // Find category name
  const category = categories.find((c) => c.id === item.categoryId);

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
      <div
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={onPreview}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">Rasm yo'q</span>
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-2 py-1 text-xs rounded-full flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {category.name}
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="bg-white/80 hover:bg-white text-gray-700 h-8 w-8 rounded-full"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="bg-white/80 hover:bg-white text-gray-700 h-8 w-8 rounded-full"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3
            className="font-semibold text-lg text-gray-800 dark:text-gray-100 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            onClick={onPreview}
          >
            {item.name}
          </h3>
          <div className="text-teal-600 dark:text-teal-400 font-bold">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm flex-grow">
          {item.description || "Tavsif mavjud emas."}
        </p>
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 text-sm text-gray-600 dark:text-gray-300">Mavjudlik:</div>
            <Switch
              checked={item.available}
              onCheckedChange={onToggleAvailability}
              disabled={!canEdit}
            />
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs ${item.available
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
          >
            {item.available ? "Sotuvda" : "Mavjud emas"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Menu;
