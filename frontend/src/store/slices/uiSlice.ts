import { createSlice } from "@reduxjs/toolkit";

// ==================== TYPES ====================
interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface UIState {
  // Sidebar / Drawer
  isCartDrawerOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;

  // Modals cho Admin (dùng chung, tránh pass props sâu)
  isDetailModalOpen: boolean;
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;

  // Toast / Notification
  notifications: Notification[];

  // Theme (sync với ThemeContext hiện có)
  isDarkMode: boolean;

  // Loading toàn cục (overlay)
  isGlobalLoading: boolean;
  globalLoadingMessage: string;
}

// ==================== INITIAL STATE ====================
const initialState: UIState = {
  isCartDrawerOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,

  isDetailModalOpen: false,
  isEditModalOpen: false,
  isAddModalOpen: false,

  notifications: [],

  isDarkMode: false,

  isGlobalLoading: false,
  globalLoadingMessage: "Đang xử lý...",
};

// ==================== SLICE ====================
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // ---- Cart Drawer ----
    openCartDrawer(state) {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },

    // ---- Tìm kiếm ----
    openSearch(state) {
      state.isSearchOpen = true;
    },
    closeSearch(state) {
      state.isSearchOpen = false;
    },

    // ---- Mobile Menu ----
    openMobileMenu(state) {
      state.isMobileMenuOpen = true;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },

    // ---- Admin Modals ----
    openDetailModal(state) {
      state.isDetailModalOpen = true;
    },
    closeDetailModal(state) {
      state.isDetailModalOpen = false;
    },
    openEditModal(state) {
      state.isEditModalOpen = true;
    },
    closeEditModal(state) {
      state.isEditModalOpen = false;
    },
    openAddModal(state) {
      state.isAddModalOpen = true;
    },
    closeAddModal(state) {
      state.isAddModalOpen = false;
    },
    closeAllModals(state) {
      state.isDetailModalOpen = false;
      state.isEditModalOpen = false;
      state.isAddModalOpen = false;
    },

    // ---- Theme ----
    setDarkMode(state, action: { payload: boolean }) {
      state.isDarkMode = action.payload;
    },
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },

    // ---- Global Loading ----
    showGlobalLoading(state, action: { payload?: string }) {
      state.isGlobalLoading = true;
      state.globalLoadingMessage = action.payload || "Đang xử lý...";
    },
    hideGlobalLoading(state) {
      state.isGlobalLoading = false;
    },

    // ---- Notifications ----
    addNotification(
      state,
      action: {
        payload: Omit<Notification, "id">;
      }
    ) {
      const id = Date.now().toString();
      state.notifications.push({ id, ...action.payload });
    },
    removeNotification(state, action: { payload: string }) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearAllNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openSearch,
  closeSearch,
  openMobileMenu,
  closeMobileMenu,
  openDetailModal,
  closeDetailModal,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  closeAllModals,
  setDarkMode,
  toggleDarkMode,
  showGlobalLoading,
  hideGlobalLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
