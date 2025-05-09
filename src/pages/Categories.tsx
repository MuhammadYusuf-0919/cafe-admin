import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CategorySkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Can } from "@/components/permission/Can";
import { Category } from "@/types";
import { Edit, Plus, Trash2, Tag, LayoutDashboard, MenuIcon, User } from "lucide-react";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { user } = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useData();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtered categories based on search
  const filteredCategories = categories.filter(
    (category) => category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle dialog open for edit
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setIsEditDialogOpen(true);
  };

  // Handle dialog open for delete
  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Handle add category
  const handleAddCategory = () => {
    if (categoryName.trim() === "") {
      toast.error("Kategoriya nomi boʻsh boʻlishi mumkin emas");
      return;
    }
    
    addCategory({
      name: categoryName,
      description: categoryDescription
    });
    
    setCategoryName("");
    setCategoryDescription("");
    setIsAddDialogOpen(false);
    toast.success("Kategoriya muvaffaqiyatli qo‘shildi");
  };

  // Handle update category
  const handleUpdateCategory = () => {
    if (!selectedCategory) return;
    
    if (categoryName.trim() === "") {
      toast.error("Kategoriya nomi boʻsh boʻlishi mumkin emas");
      return;
    }
    
    updateCategory(selectedCategory.id, {
      ...selectedCategory,
      name: categoryName,
      description: categoryDescription
    });
    
    setCategoryName("");
    setCategoryDescription("");
    setSelectedCategory(null);
    setIsEditDialogOpen(false);
    toast.success("Kategoriya muvaffaqiyatli yangilandi");
  };

  // Handle delete category
  const handleConfirmDelete = () => {
    if (!selectedCategory) return;
    
    deleteCategory(selectedCategory.id);
    setSelectedCategory(null);
    setIsDeleteDialogOpen(false);
    toast.success("Kategoriya muvaffaqiyatli oʻchirildi");
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
    <AppLayout title="Categories">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Categories</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your menu categories
            </p>
          </div>
          <Can I="create" a="category">
            <Button
              onClick={() => {
                setCategoryName("");
                setCategoryDescription("");
                setIsAddDialogOpen(true);
              }}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </Can>
        </div>
      </motion.div>

      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
          />
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <CategoryCard
                  category={category}
                  onEdit={() => handleEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category)}
                  canManage={user?.role === "manager"}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No categories found. {user?.role === "manager" ? "Add one to get started." : ""}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Add Category</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="categoryDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</Label>
              <Input
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
                placeholder="Enter category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}
              className="border-0 shadow-md hover:shadow-lg">
              Cancel
            </Button>
            <Button onClick={handleAddCategory}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/20">
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="editCategoryName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</Label>
              <Input
                id="editCategoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="editCategoryDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</Label>
              <Input
                id="editCategoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="mt-2 border-0 shadow-md focus:ring-2 focus:ring-teal-500"
                placeholder="Enter category description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}
              className="border-0 shadow-md hover:shadow-lg">
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}
              className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/20">
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-500">Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
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

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg p-3 z-50 pb-safe">
          <div className="flex justify-around">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center space-y-1"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/menu")}
              className="flex flex-col items-center space-y-1"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="text-xs">Menu</span>
            </Button>
            <Button 
              variant="teal" 
              size="sm"
              onClick={() => navigate("/categories")}
              className="flex flex-col items-center space-y-1"
            >
              <Tag className="h-5 w-5" />
              <span className="text-xs">Categories</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center space-y-1"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  canManage: boolean;
}

const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  canManage,
}: CategoryCardProps) => {
  // Function to get category color
  const getCategoryColor = () => {
    const colors = [
      "from-teal-500 to-teal-600 text-white",
      "from-teal-600 to-teal-700 text-white",
      "from-teal-400 to-teal-500 text-white",
      "from-teal-500 to-teal-600 text-white",
      "from-teal-600 to-teal-500 text-white",
      "from-teal-500 to-teal-400 text-white"
    ];
    
    // Use consistent color based on category id
    const colorIndex = parseInt(category.id, 10) % colors.length;
    return colors[Math.abs(colorIndex)];
  };
  
  // Memoize the color to ensure it doesn't change on re-renders
  const [colorClass] = useState(getCategoryColor());
  
  return (
    <Card className="overflow-hidden group hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
      <CardContent className="p-0 h-full">
        <div className="h-full flex flex-col">
          <div className={`bg-gradient-to-r ${colorClass} p-6 text-center flex-grow flex items-center justify-center`}>
            <h3 className="font-bold text-2xl">{category.name}</h3>
          </div>
          
          {category.description && (
            <div className="p-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800">
              <p>{category.description}</p>
            </div>
          )}
          
          {canManage && (
            <div className="flex justify-end p-3 bg-white dark:bg-gray-800 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 mr-2 text-teal-600 hover:text-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/20"
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Categories;
