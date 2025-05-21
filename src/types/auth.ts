
export interface AuthContextType {
  user: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export enum AuthMode {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  FORGOT_EMAIL = 'forgot-email'
}
