
export type UserRole = 'manager' | 'chef' | 'waiter';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  categoryId: string;
  available: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'free' | 'occupied' | 'reserved';
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  status: 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled';
}

export interface Order {
  id: string;
  tableId: string;
  table: Table;
  items: OrderItem[];
  status: 'active' | 'completed' | 'cancelled';
  total: number;
  waiter: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesReport {
  date: string;
  total: number;
  orderCount: number;
  itemsSold: number;
}
