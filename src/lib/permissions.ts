
import { defineAbility } from '@casl/ability';
import type { User, UserRole } from '@/types';

export const definePermissions = (user: User | null) => {
  const role = user?.role || 'guest';
  
  return defineAbility((can, cannot) => {
    // Guest permissions (when not logged in)
    can('access', 'login');
    
    if (role === 'manager') {
      // Manager permissions
      can('manage', 'all');
      can('access', 'dashboard');
      can('create', 'category');
      can('update', 'category');
      can('delete', 'category');
      can('create', 'menu');
      can('update', 'menu');
      can('delete', 'menu');
      can('create', 'table');
      can('update', 'table');
      can('delete', 'table');
      can('view', 'reports');
      can('complete', 'order');
      can('archive', 'order');
      can('view', 'new-order');
      can('create', 'new-order');
      can('view', 'orders');
      can('view', 'profile');
    }
    
    if (role === 'waiter') {
      // Waiter permissions
      can('access', 'dashboard');
      can('view', 'tables');
      can('create', 'order');
      can('view', 'new-order');
      can('create', 'new-order');
      can('update', 'order');
      can('view', 'menu');
      can('view', 'orders', { 'waiter.id': user?.id });
      can('view', 'profile');
    }
    
    if (role === 'chef') {
      // Chef permissions
      can('access', 'dashboard');
      can('update', 'orderItem', { status: 'pending' });
      can('view', 'orders');
      can('view', 'menu');
      can('view', 'profile');
    }
  });
};
