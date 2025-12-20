import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, UserRole, AuthState, LoginCredentials, RegisterData, ApiResponse } from '@/types';
import { dataStore, delay, generateId, getCurrentUser, setCurrentUser, successResponse, errorResponse } from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<User>>;
  register: (data: RegisterData) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<ApiResponse<User>>;
  toggleUserActive: (userId: string) => Promise<ApiResponse<User>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      await delay(300, 500);
      const user = getCurrentUser();
      setState({
        user,
        isAuthenticated: !!user && user.isActive,
        isLoading: false,
      });
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    await delay();
    
    const user = dataStore.users.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
           u.passwordHash === credentials.password
    );

    if (!user) {
      return errorResponse('Credenciales inválidas');
    }

    if (!user.isActive) {
      return errorResponse('Tu cuenta está desactivada. Contacta al administrador.');
    }

    setCurrentUser(user);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });

    return successResponse(user);
  };

  const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
    await delay();

    // Check if email already exists
    const existingUser = dataStore.users.find(
      u => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (existingUser) {
      return errorResponse('El correo electrónico ya está registrado');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return errorResponse('Formato de correo electrónico inválido');
    }

    // Validate password length
    if (data.password.length < 6) {
      return errorResponse('La contraseña debe tener al menos 6 caracteres');
    }

    // Create new user (default role: STUDENT)
    const newUser: User = {
      id: generateId('user'),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: data.password,
      role: 'STUDENT',
      isActive: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      createdAt: new Date().toISOString(),
    };

    dataStore.users.push(newUser);
    setCurrentUser(newUser);
    
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });

    return successResponse(newUser);
  };

  const logout = async (): Promise<void> => {
    await delay(200, 400);
    setCurrentUser(null);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<ApiResponse<User>> => {
    await delay();

    const userIndex = dataStore.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return errorResponse('Usuario no encontrado');
    }

    dataStore.users[userIndex] = {
      ...dataStore.users[userIndex],
      role,
    };

    // Update current user if it's the same
    if (state.user?.id === userId) {
      setState(prev => ({
        ...prev,
        user: dataStore.users[userIndex],
      }));
    }

    return successResponse(dataStore.users[userIndex]);
  };

  const toggleUserActive = async (userId: string): Promise<ApiResponse<User>> => {
    await delay();

    const userIndex = dataStore.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return errorResponse('Usuario no encontrado');
    }

    dataStore.users[userIndex] = {
      ...dataStore.users[userIndex],
      isActive: !dataStore.users[userIndex].isActive,
    };

    return successResponse(dataStore.users[userIndex]);
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUserRole,
      toggleUserActive,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
