import { useState, useMemo } from 'react';
import { X, Check, AlertCircle, Eye, EyeOff, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';
import { UserProfile } from '../types';
import { isUsernameAvailable, getStoredUsers, saveStoredUsers, setCurrentUser } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { VentureLogo } from './VentureLogo';

type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Live password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-[#E5DDD2]' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-yellow-600' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
      default:
        return { score: 0, label: 'Very Weak', color: 'bg-red-400' };
    }
  }, [password]);

  // Username validation
  const usernameError = useMemo(() => {
    if (mode !== 'signup' || !username) return '';
    if (username.length < 3) return 'Username must be at least 3 characters.';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Only letters, numbers, and underscores.';
    if (!isUsernameAvailable(username)) return 'This username is already taken.';
    return '';
  }, [username, mode]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setFullName('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            username: data.user.user_metadata?.username || email.split('@')[0],
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            createdAt: data.user.created_at || new Date().toISOString()
          };
          setCurrentUser(userProfile);
          onAuthSuccess(userProfile);
          onClose();
          return;
        }
      }

      // Local / preview fallback validation
      const users = getStoredUsers();
      const matched = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase()
      );

      if (matched) {
        setCurrentUser(matched);
        onAuthSuccess(matched);
        onClose();
      } else {
        // Create seamless session if demo tester
        const newDemoUser: UserProfile = {
          id: `user-${Date.now()}`,
          email: email.includes('@') ? email : `${email}@venturewicks.com`,
          username: email.split('@')[0],
          fullName: email.split('@')[0].replace('_', ' ').toUpperCase(),
          createdAt: new Date().toISOString()
        };
        users.push(newDemoUser);
        saveStoredUsers(users);
        setCurrentUser(newDemoUser);
        onAuthSuccess(newDemoUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (usernameError) {
      setErrorMessage(usernameError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (passwordStrength.score < 2) {
      setErrorMessage('Please create a stronger password (minimum 8 characters).');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.toLowerCase().trim(),
              full_name: fullName.trim()
            }
          }
        });
        if (error) throw error;
        setSuccessMessage('Email verification link sent! Please check your inbox.');
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email,
            username: username.toLowerCase().trim(),
            fullName: fullName.trim(),
            createdAt: new Date().toISOString()
          };
          setCurrentUser(newUser);
          setTimeout(() => {
            onAuthSuccess(newUser);
            onClose();
          }, 1200);
          return;
        }
      }

      // Local / demo storage registration
      const users = getStoredUsers();
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: email.trim(),
        username: username.toLowerCase().trim(),
        fullName: fullName.trim(),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveStoredUsers(users);
      setCurrentUser(newUser);
      setSuccessMessage('Account created successfully! Verification email dispatched.');
      setTimeout(() => {
        onAuthSuccess(newUser);
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        return;
      }

      // Simulated Google OAuth Flow
      const googleUser: UserProfile = {
        id: 'google-user-01',
        email: 'founder.google@venturewicks.com',
        username: 'google_founder',
        fullName: 'Alex Google Vance',
        isGoogleUser: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        createdAt: new Date().toISOString()
      };
      const users = getStoredUsers();
      if (!users.some((u) => u.id === googleUser.id)) {
        users.push(googleUser);
        saveStoredUsers(users);
      }
      setCurrentUser(googleUser);
      onAuthSuccess(googleUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setSuccessMessage(`Password reset instructions sent to ${email}`);
    setTimeout(() => {
      setMode('login');
      setSuccessMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191716]/40 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] border border-[#E7DFD5] rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#ECE4DA] flex items-center justify-between">
          <VentureLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7D756C] hover:text-[#191716] hover:bg-[#EFE9DF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {mode === 'login' && (
            <div>
              <h3 className="font-serif text-2xl text-[#191716] font-bold mb-1">Welcome back</h3>
              <p className="text-xs text-[#6E665E] mb-6">Enter your credentials to access your venture workspace.</p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3731] mb-1">Email or Username</label>
                  <div className="relative">
                    <input
                      id="login-email"
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@venturewicks.com"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                    />
                    <Mail className="w-3.5 h-3.5 text-[#9C948A] absolute right-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#3D3731]">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                      }}
                      className="text-[11px] text-[#D96B27] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#9C948A] hover:text-[#191716]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-[#191716] hover:bg-[#2F2A26] transition-colors shadow-xs"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8DFD4]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#8C8379] bg-[#FAF8F5] px-2">
                  Or continue with
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2 px-4 rounded-md text-xs font-medium text-[#292522] bg-white border border-[#DDD5C9] hover:bg-[#F7F3EC] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="mt-5 text-center text-xs text-[#6B6259]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    resetForm();
                  }}
                  className="font-semibold text-[#D96B27] hover:underline"
                >
                  Create one now
                </button>
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <h3 className="font-serif text-2xl text-[#191716] font-bold mb-1">Start Your Venture</h3>
              <p className="text-xs text-[#6E665E] mb-5">Create your founder profile to preserve your pitch decks.</p>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3731] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#3D3731]">Unique Username</label>
                    {username && !usernameError && (
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Available
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="alex_founder"
                      className={`w-full px-3.5 py-2 text-xs bg-white border rounded-md focus:outline-hidden focus:ring-2 ${
                        usernameError
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#D9D1C5] focus:ring-[#D96B27]/30 focus:border-[#D96B27]'
                      }`}
                    />
                    <UserIcon className="w-3.5 h-3.5 text-[#9C948A] absolute right-3 top-2.5" />
                  </div>
                  {usernameError && <p className="text-[10px] text-red-600 mt-1">{usernameError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3731] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#3D3731]">Password</label>
                    <span className="text-[10px] text-[#786F66]">
                      Strength: <strong className="font-semibold">{passwordStrength.label}</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#9C948A] hover:text-[#191716]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator Bar */}
                  <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-[#E5DDD2]'}`}></div>
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-[#E5DDD2]'}`}></div>
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-[#E5DDD2]'}`}></div>
                    <div className={`h-1 rounded-full ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-[#E5DDD2]'}`}></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3731] mb-1">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19] transition-colors shadow-xs mt-2"
                >
                  {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-[#6B6259]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetForm();
                  }}
                  className="font-semibold text-[#D96B27] hover:underline"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <div>
              <h3 className="font-serif text-2xl text-[#191716] font-bold mb-1">Reset Password</h3>
              <p className="text-xs text-[#6E665E] mb-5">Enter your email and we'll send you instructions to reset your password.</p>

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3731] mb-1">Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="founder@venturewicks.com"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#D9D1C5] rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-[#191716] hover:bg-[#2F2A26] transition-colors"
                >
                  Send Reset Link
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-[#6B6259]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetForm();
                  }}
                  className="text-xs text-[#736B63] hover:text-[#191716] underline"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
