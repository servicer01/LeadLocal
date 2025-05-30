import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkUser = async () => {
      try {
        const { data } = await authService.getSession();
        if (data.session) {
          const { data: userData } = await authService.getCurrentUser();
          
          // In a real app, you would fetch the user profile data from your database
          // This is a simplified version
          if (userData.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email || '',
              role: 'user', // Default role
              created_at: userData.user.created_at || new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Failed to authenticate');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    
    // Subscribe to auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // In a real app, you would fetch the user profile from your database
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'user', // Default role
          created_at: session.user.created_at || new Date().toISOString(),
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: signInError } = await authService.signIn(email, password);
      
      if (signInError) {
        throw new Error(signInError.message);
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          role: 'user', // Default role
          created_at: data.user.created_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: signUpError } = await authService.signUp(email, password);
      
      if (signUpError) {
        throw new Error(signUpError.message);
      }
      
      // Usually, we'd wait for email confirmation here
      // This is simplified for the demo
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign up');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign out');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        throw new Error(resetError.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to reset password');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};