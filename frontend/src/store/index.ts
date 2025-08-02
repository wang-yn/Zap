import { create } from 'zustand';

// 应用状态接口
interface AppState {
  // 用户相关
  user: {
    isAuthenticated: boolean;
    userInfo: any | null;
  };
  
  // 项目相关
  projects: {
    list: any[];
    currentProject: any | null;
    loading: boolean;
  };
  
  // 编辑器相关
  editor: {
    currentPage: any | null;
    selectedComponent: string | null;
    clipboard: any | null;
  };
  
  // UI相关
  ui: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark';
    language: 'zh-CN' | 'en-US';
  };
}

// 应用动作接口
interface AppActions {
  // 用户相关动作
  setUserInfo: (userInfo: any) => void;
  logout: () => void;
  
  // 项目相关动作
  setProjects: (projects: any[]) => void;
  setCurrentProject: (project: any) => void;
  setProjectsLoading: (loading: boolean) => void;
  
  // 编辑器相关动作
  setCurrentPage: (page: any) => void;
  setSelectedComponent: (componentId: string | null) => void;
  setClipboard: (component: any) => void;
  
  // UI相关动作
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
}

// 创建store
export const useAppStore = create<AppState & AppActions>((set) => ({
  // 初始状态
  user: {
    isAuthenticated: false,
    userInfo: null,
  },
  
  projects: {
    list: [],
    currentProject: null,
    loading: false,
  },
  
  editor: {
    currentPage: null,
    selectedComponent: null,
    clipboard: null,
  },
  
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'zh-CN',
  },
  
  // 用户相关动作
  setUserInfo: (userInfo) => set((state) => ({
    user: {
      ...state.user,
      userInfo,
      isAuthenticated: !!userInfo,
    },
  })),
  
  logout: () => set(() => ({
    user: {
      isAuthenticated: false,
      userInfo: null,
    },
  })),
  
  // 项目相关动作
  setProjects: (projects) => set((state) => ({
    projects: {
      ...state.projects,
      list: projects,
    },
  })),
  
  setCurrentProject: (project) => set((state) => ({
    projects: {
      ...state.projects,
      currentProject: project,
    },
  })),
  
  setProjectsLoading: (loading) => set((state) => ({
    projects: {
      ...state.projects,
      loading,
    },
  })),
  
  // 编辑器相关动作
  setCurrentPage: (page) => set((state) => ({
    editor: {
      ...state.editor,
      currentPage: page,
    },
  })),
  
  setSelectedComponent: (componentId) => set((state) => ({
    editor: {
      ...state.editor,
      selectedComponent: componentId,
    },
  })),
  
  setClipboard: (component) => set((state) => ({
    editor: {
      ...state.editor,
      clipboard: component,
    },
  })),
  
  // UI相关动作
  toggleSidebar: () => set((state) => ({
    ui: {
      ...state.ui,
      sidebarCollapsed: !state.ui.sidebarCollapsed,
    },
  })),
  
  setTheme: (theme) => set((state) => ({
    ui: {
      ...state.ui,
      theme,
    },
  })),
  
  setLanguage: (language) => set((state) => ({
    ui: {
      ...state.ui,
      language,
    },
  })),
}));

// 导出一些常用的选择器
export const useUser = () => useAppStore((state) => state.user);
export const useProjects = () => useAppStore((state) => state.projects);
export const useEditor = () => useAppStore((state) => state.editor);
export const useUI = () => useAppStore((state) => state.ui);

export default useAppStore; 