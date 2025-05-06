
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/context/DataContext";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-mobile";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Category, MenuItem } from "@/types";

const NewOrder = () => {
  const { 
    categories, 
    menuItems, 
    activeTable, 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    submitOrder,
    loading 
  } = useData();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("menu");

  useEffect(() => {
    if (!loading && !activeTable) {
      toast.error("Please select a table first");
      // navigate("/tables");
    } else {
      console.log(activeTable)
    }
  }, [activeTable, loading, navigate]);

  useEffect(() => {
    // Set the first category as selected if none is selected
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "" || item.categoryId === selectedCategory) &&
      (searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getItemsInCart = (menuItemId: string) => {
    const cartItem = cart.find((item) => item.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    addToCart(menuItem, 1);
    toast.success(`Added ${menuItem.name} to order`);
  };

  const handleRemoveFromCart = (menuItemId: string) => {
    const cartItemIndex = cart.findIndex(
      (item) => item.menuItem.id === menuItemId
    );
    if (cartItemIndex !== -1) {
      const currentQuantity = cart[cartItemIndex].quantity;
      if (currentQuantity > 1) {
        updateCartItem(cartItemIndex, currentQuantity - 1);
      } else {
        removeFromCart(cartItemIndex);
      }
    }
  };

  const handleDeleteFromCart = (index: number) => {
    removeFromCart(index);
  };

  const handleSubmitOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    submitOrder();
    toast.success("Order placed successfully!");
    navigate("/tables");
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
    <AppLayout title={`New Order - Table ${activeTable?.number || ""}`}>
      <div className="flex gap-4 h-[calc(100vh-7rem)] overflow-hidden flex-col md:flex-row">
        {/* Left panel - Menu */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tables")}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Tables
            </Button>
            <div className="text-xl font-semibold flex items-center text-teal-600 dark:text-teal-400">
              Table {activeTable?.number} - New Order
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="menu" className="flex-1 bg-primary rounded-r-none border-r-1 border">Menu</TabsTrigger>
              <TabsTrigger value="cart" className="flex-1 bg-primary rounded-l-none md:hidden">
                Cart ({cart.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="flex-1 flex flex-col overflow-hidden">
              <div className="mb-4">
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="scrollbar-thin overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "teal" : "outline"}
                      className="whitespace-nowrap"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 mt-4">
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredItems.map((item) => {
                    const itemsInCart = getItemsInCart(item.id);
                    return (
                      <motion.div key={item.id} variants={itemVariants}>
                        <Card className="h-full flex flex-col shadow-md hover:shadow-lg">
                          {item.image && (
                            <div className="w-full h-40 overflow-hidden rounded-t-xl">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4 flex-grow">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {item.description || "No description available"}
                            </p>
                            <p className="font-bold text-teal-600 dark:text-teal-400">
                              ${item.price.toFixed(2)}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            {itemsInCart > 0 ? (
                              <div className="flex items-center justify-between w-full">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="mx-2 font-semibold">
                                  {itemsInCart}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                onClick={() => handleAddToCart(item)}
                                className="w-full"
                                variant="teal"
                                disabled={!item.available}
                              >
                                Add to Order
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {filteredItems.length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No menu items found. Try a different category or search term.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="cart" className="md:hidden flex-1 flex flex-col">
              <CartPanel 
                cart={cart}
                onUpdateQuantity={(index, quantity) => updateCartItem(index, quantity)}
                onRemoveItem={handleDeleteFromCart}
                onClearCart={clearCart}
                onSubmitOrder={handleSubmitOrder}
                calculateTotal={calculateTotal}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel - Cart (visible on larger screens) */}
        <div className="hidden md:flex w-96 flex-col overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
              <CartPanel 
                cart={cart}
                onUpdateQuantity={(index, quantity) => updateCartItem(index, quantity)}
                onRemoveItem={handleDeleteFromCart}
                onClearCart={clearCart}
                onSubmitOrder={handleSubmitOrder}
                calculateTotal={calculateTotal}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

interface CartPanelProps {
  cart: any[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onSubmitOrder: () => void;
  calculateTotal: () => number;
}

const CartPanel = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  calculateTotal,
}: CartPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add items from the menu to get started
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.menuItem.id}-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="mb-4"
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.menuItem.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.menuItem.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onRemoveItem(index)}
                            className="text-gray-500 hover:text-red-500 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center shadow-sm rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(index, item.quantity - 1);
                              } else {
                                onRemoveItem(index);
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="w-8 text-center">
                            {item.quantity}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                          Note: {item.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="shadow-inner bg-gray-50 dark:bg-gray-900 mt-auto pt-4 space-y-4 p-4 rounded-b-lg">
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCart}
                className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                Clear Cart
              </Button>
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Subtotal
                </div>
                <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
                  ${calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              variant="teal"
              size="lg"
              onClick={onSubmitOrder}
              className="w-full"
            >
              Place Order <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NewOrder;
