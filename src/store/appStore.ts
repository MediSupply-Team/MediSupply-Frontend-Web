import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, User, Notification } from '@/types';

interface AppStore extends AppState {
  // Actions para user
  setUser: (user: User | null) => void;
  clearUser: () => void;
  
  // Actions para theme
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Actions para sidebar
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Actions para notifications
  addNotification: (notification: Omit<Notification, 'id' | 'fecha' | 'leida'>) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Computed values
  unreadNotificationsCount: () => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      theme: 'dark',
      sidebarCollapsed: false,
      notifications: [],
      
      // User actions
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      
      // Theme actions
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),
      
      // Sidebar actions
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Notification actions
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: `${Date.now()}-${Math.random()}`,
            fecha: new Date().toISOString(),
            leida: false,
          },
          ...state.notifications,
        ]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === id ? { ...notif, leida: true } : notif
        )
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(notif => notif.id !== id)
      })),
      
      clearAllNotifications: () => set({ notifications: [] }),
      
      // Computed values
      unreadNotificationsCount: () => {
        const state = get();
        return state.notifications.filter(notif => !notif.leida).length;
      },
    }),
    {
      name: 'medisupply-storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persistir ciertas partes del estado
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Hook para obtener solo el user (optimización)
export const useUser = () => useAppStore((state) => state.user);

// Hook para obtener solo el theme (optimización + SSR safe)
export const useTheme = () => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const setTheme = useAppStore((state) => state.setTheme);
  
  return { theme, toggleTheme, setTheme };
};

// Hook para obtener solo las notifications (optimización + SSR safe)
export const useNotifications = () => {
  const notifications = useAppStore((state) => state.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const markAsRead = useAppStore((state) => state.markNotificationAsRead);
  const removeNotification = useAppStore((state) => state.removeNotification);
  const clearAll = useAppStore((state) => state.clearAllNotifications);
  const unreadCount = useAppStore((state) => state.unreadNotificationsCount());
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    removeNotification,
    clearAll,
  };
};

// Hook para obtener solo el sidebar (optimización + SSR safe)
export const useSidebar = () => {
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggle = useAppStore((state) => state.toggleSidebar);
  const setCollapsed = useAppStore((state) => state.setSidebarCollapsed);
  
  return { collapsed, toggle, setCollapsed };
};