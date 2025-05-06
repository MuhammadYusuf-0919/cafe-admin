
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Category, MenuItem, Table, Order, OrderItem, SalesReport } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Mock data
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Appetizers', description: 'Starters and light bites' },
  { id: '2', name: 'Main Course', description: 'Hearty main dishes' },
  { id: '3', name: 'Desserts', description: 'Sweet treats' },
  { id: '4', name: 'Beverages', description: 'Drinks and refreshments' }
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Garlic Bread',
    price: 4.99,
    description: 'Toasted bread with garlic butter',
    categoryId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Bruschetta',
    price: 6.99,
    description: 'Toasted bread topped with tomatoes, garlic, and basil',
    categoryId: '1',
    available: true,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Grilled Salmon',
    price: 18.99,
    description: 'Salmon fillet with lemon and herbs',
    categoryId: '2',
    available: true,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Steak',
    price: 24.99,
    description: 'Prime cut beef steak with garlic butter',
    categoryId: '2',
    available: true,
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Chocolate Cake',
    price: 7.99,
    description: 'Rich chocolate layer cake',
    categoryId: '3',
    available: true,
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Ice Cream Sundae',
    price: 5.99,
    description: 'Vanilla ice cream with chocolate sauce and a cherry',
    categoryId: '3',
    available: true,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Coffee',
    price: 2.99,
    description: 'Freshly brewed coffee',
    categoryId: '4',
    available: true,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Fresh Juice',
    price: 3.99,
    description: 'Orange, apple, or pineapple juice',
    categoryId: '4',
    available: true,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=500&auto=format&fit=crop'
  }
];

const MOCK_TABLES: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'free' },
  { id: '2', number: 2, capacity: 4, status: 'occupied' },
  { id: '3', number: 3, capacity: 6, status: 'free' },
  { id: '4', number: 4, capacity: 2, status: 'reserved' },
  { id: '5', number: 5, capacity: 4, status: 'free' },
  { id: '6', number: 6, capacity: 8, status: 'free' },
  { id: '7', number: 7, capacity: 2, status: 'free' },
  { id: '8', number: 8, capacity: 4, status: 'occupied' }
];

const generateMockOrders = (tables: Table[], menuItems: MenuItem[]): Order[] => {
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: '1',
      tableId: '2',
      table: tables.find(t => t.id === '2')!,
      items: [
        {
          id: '1',
          menuItemId: '3',
          menuItem: menuItems.find(i => i.id === '3')!,
          quantity: 2,
          status: 'served'
        },
        {
          id: '2',
          menuItemId: '7',
          menuItem: menuItems.find(i => i.id === '7')!,
          quantity: 2,
          status: 'served'
        }
      ],
      status: 'active',
      total: 43.96,
      waiter: {
        id: '3',
        name: 'Waiter User',
        role: 'waiter'
      },
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0)
    },
    {
      id: '2',
      tableId: '8',
      table: tables.find(t => t.id === '8')!,
      items: [
        {
          id: '3',
          menuItemId: '4',
          menuItem: menuItems.find(i => i.id === '4')!,
          quantity: 1,
          status: 'pending'
        },
        {
          id: '4',
          menuItemId: '1',
          menuItem: menuItems.find(i => i.id === '1')!,
          quantity: 1,
          status: 'cooking'
        }
      ],
      status: 'active',
      total: 29.98,
      waiter: {
        id: '3',
        name: 'Waiter User',
        role: 'waiter'
      },
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0)
    },
    {
      id: '3',
      tableId: '5',
      table: tables.find(t => t.id === '5')!,
      items: [
        {
          id: '5',
          menuItemId: '2',
          menuItem: menuItems.find(i => i.id === '2')!,
          quantity: 2,
          status: 'ready'
        }
      ],
      status: 'completed',
      total: 13.98,
      waiter: {
        id: '3',
        name: 'Waiter User',
        role: 'waiter'
      },
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1)
    },
    {
      id: '4',
      tableId: '6',
      table: tables.find(t => t.id === '6')!,
      items: [
        {
          id: '6',
          menuItemId: '5',
          menuItem: menuItems.find(i => i.id === '5')!,
          quantity: 3,
          status: 'served'
        },
        {
          id: '7',
          menuItemId: '8',
          menuItem: menuItems.find(i => i.id === '8')!,
          quantity: 3,
          status: 'served'
        }
      ],
      status: 'completed',
      total: 35.94,
      waiter: {
        id: '3',
        name: 'Waiter User',
        role: 'waiter'
      },
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2)
    }
  ];
};

const generateMockSalesReports = (): SalesReport[] => {
  const reports: SalesReport[] = [];
  const today = new Date();
  
  // Generate data for last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Random data with a realistic pattern
    const baseAmount = 500 + Math.random() * 300;
    const weekdayFactor = date.getDay() === 0 || date.getDay() === 6 ? 1.5 : 1;
    
    reports.push({
      date: dateString,
      total: Math.round(baseAmount * weekdayFactor * 100) / 100,
      orderCount: Math.floor(baseAmount / 50 * weekdayFactor),
      itemsSold: Math.floor(baseAmount / 20 * weekdayFactor)
    });
  }
  
  return reports.sort((a, b) => a.date.localeCompare(b.date));
};

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface DataContextType {
  categories: Category[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  salesReports: SalesReport[];
  cart: CartItem[];
  activeTable: Table | null;
  
  // Category CRUD
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Menu Item CRUD
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Table CRUD
  addTable: (table: Omit<Table, 'id'>) => void;
  updateTable: (id: string, data: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  
  // Order Management
  setActiveTable: (table: Table | null) => void;
  addToCart: (menuItem: MenuItem, quantity: number, notes?: string) => void;
  updateCartItem: (index: number, quantity: number, notes?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  submitOrder: () => void;
  
  // Chef Operations
  updateOrderItemStatus: (orderId: string, orderItemId: string, status: OrderItem['status']) => void;
  
  // Manager Operations
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  
  loading: boolean;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  
  // State for waiter ordering
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTable, setActiveTable] = useState<Table | null>(null);
  
  // Initial data loading
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setCategories(MOCK_CATEGORIES);
    setMenuItems(MOCK_MENU_ITEMS);
    setTables(MOCK_TABLES);
    
    const mockOrders = generateMockOrders(MOCK_TABLES, MOCK_MENU_ITEMS);
    setOrders(mockOrders);
    
    const mockReports = generateMockSalesReports();
    setSalesReports(mockReports);
    
    setLoading(false);
  };
  
  const refreshData = () => {
    loadData();
  };
  
  // Category CRUD operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success(`Category "${category.name}" added successfully`);
  };
  
  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => 
      prev.map(cat => (cat.id === id ? { ...cat, ...data } : cat))
    );
    toast.success('Category updated successfully');
  };
  
  const deleteCategory = (id: string) => {
    // Check if any menu items use this category
    const hasMenuItems = menuItems.some(item => item.categoryId === id);
    if (hasMenuItems) {
      toast.error('Cannot delete category that has menu items');
      return;
    }
    
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast.success('Category deleted successfully');
  };
  
  // Menu Item CRUD operations
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    };
    setMenuItems(prev => [...prev, newItem]);
    toast.success(`Menu item "${item.name}" added successfully`);
  };
  
  const updateMenuItem = (id: string, data: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(item => (item.id === id ? { ...item, ...data } : item))
    );
    toast.success('Menu item updated successfully');
  };
  
  const deleteMenuItem = (id: string) => {
    // Check if any orders use this menu item
    const hasOrders = orders.some(order => 
      order.items.some(item => item.menuItemId === id)
    );
    
    if (hasOrders) {
      toast.error('Cannot delete menu item that has orders');
      return;
    }
    
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast.success('Menu item deleted successfully');
  };
  
  // Table CRUD operations
  const addTable = (table: Omit<Table, 'id'>) => {
    const newTable = {
      ...table,
      id: Date.now().toString()
    };
    setTables(prev => [...prev, newTable]);
    toast.success(`Table #${table.number} added successfully`);
  };
  
  const updateTable = (id: string, data: Partial<Table>) => {
    setTables(prev => 
      prev.map(table => (table.id === id ? { ...table, ...data } : table))
    );
    toast.success('Table updated successfully');
  };
  
  const deleteTable = (id: string) => {
    // Check if any orders use this table
    const hasOrders = orders.some(order => order.tableId === id);
    if (hasOrders) {
      toast.error('Cannot delete table that has orders');
      return;
    }
    
    setTables(prev => prev.filter(table => table.id !== id));
    toast.success('Table deleted successfully');
  };
  
  // Cart and Order Management
  const addToCart = (menuItem: MenuItem, quantity: number, notes?: string) => {
    if (quantity <= 0) return;
    
    const existingItemIndex = cart.findIndex(item => item.menuItem.id === menuItem.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      updatedCart[existingItemIndex].notes = notes || updatedCart[existingItemIndex].notes;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem, quantity, notes }]);
    }
    
    toast.success(`Added ${quantity}x ${menuItem.name} to cart`);
  };
  
  const updateCartItem = (index: number, quantity: number, notes?: string) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    setCart(prev => {
      const updatedCart = [...prev];
      updatedCart[index] = {
        ...updatedCart[index],
        quantity,
        notes: notes !== undefined ? notes : updatedCart[index].notes
      };
      return updatedCart;
    });
  };
  
  const removeFromCart = (index: number) => {
    setCart(prev => {
      const updatedCart = [...prev];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
    toast.info('Item removed from cart');
  };
  
  const clearCart = () => {
    setCart([]);
    setActiveTable(null);
  };
  
  const submitOrder = () => {
    if (!activeTable) {
      toast.error('Please select a table first');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    if (!user || user.role !== 'waiter') {
      toast.error('Only waiters can submit orders');
      return;
    }
    
    // Calculate total
    const total = cart.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    // Create order items
    const orderItems: OrderItem[] = cart.map((item, index) => ({
      id: `new-${index}-${Date.now()}`,
      menuItemId: item.menuItem.id,
      menuItem: item.menuItem,
      quantity: item.quantity,
      notes: item.notes,
      status: 'pending'
    }));
    
    // Create the new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: activeTable.id,
      table: activeTable,
      items: orderItems,
      status: 'active',
      total,
      waiter: user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to orders
    setOrders(prev => [...prev, newOrder]);
    
    // Update table status
    updateTable(activeTable.id, { status: 'occupied' });
    
    // Clear cart and active table
    clearCart();
    
    toast.success('Order submitted successfully');
  };
  
  // Chef Operations
  const updateOrderItemStatus = (orderId: string, orderItemId: string, status: OrderItem['status']) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        const updatedItems = order.items.map(item =>
          item.id === orderItemId ? { ...item, status } : item
        );
        
        return {
          ...order,
          items: updatedItems,
          updatedAt: new Date()
        };
      })
    );
    
    toast.success(`Item status updated to ${status}`);
  };
  
  // Manager Operations
  const completeOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        // Free up the table
        updateTable(order.tableId, { status: 'free' });
        
        return {
          ...order,
          status: 'completed',
          updatedAt: new Date()
        };
      })
    );
    
    toast.success('Order completed successfully');
  };
  
  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        
        // Free up the table
        updateTable(order.tableId, { status: 'free' });
        
        return {
          ...order,
          status: 'cancelled',
          updatedAt: new Date()
        };
      })
    );
    
    toast.info('Order cancelled');
  };
  
  return (
    <DataContext.Provider
      value={{
        categories,
        menuItems,
        tables,
        orders,
        salesReports,
        cart,
        activeTable,
        
        addCategory,
        updateCategory,
        deleteCategory,
        
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        
        addTable,
        updateTable,
        deleteTable,
        
        setActiveTable,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        submitOrder,
        
        updateOrderItemStatus,
        
        completeOrder,
        cancelOrder,
        
        loading,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
