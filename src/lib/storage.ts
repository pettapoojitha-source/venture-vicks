import { UserProfile, Venture } from '../types';
import { DEMO_QUICKPRINT_VENTURE } from '../data/demoVenture';
import { supabase, isSupabaseConfigured } from './supabase';

const USERS_KEY = 'venture_wicks_users_v1';
const CURRENT_USER_KEY = 'venture_wicks_current_user_v1';
const VENTURES_KEY = 'venture_wicks_ventures_v1';

// Default initial user for instant demo exploration
export const DEFAULT_USER: UserProfile = {
  id: 'user-demo-01',
  email: 'founder@venturewicks.com',
  username: 'alex_founder',
  fullName: 'Alex Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  isGoogleUser: false,
  createdAt: new Date().toISOString()
};

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const init = [DEFAULT_USER];
      localStorage.setItem(USERS_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  } catch {
    return [DEFAULT_USER];
  }
}

export function saveStoredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default to logged-in Alex Vance for frictionless hackathon trial,
      // or user can log out/switch account at will
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user', err);
  }
}

export function clearCurrentUser() {
  setCurrentUser(null);
}

export function getStoredVentures(): Venture[] {
  try {
    const raw = localStorage.getItem(VENTURES_KEY);
    if (!raw) {
      const initial = [DEMO_QUICKPRINT_VENTURE];
      localStorage.setItem(VENTURES_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: Venture[] = JSON.parse(raw);
    // Ensure QuickPrint demo always exists
    if (!parsed.some(v => v.id === DEMO_QUICKPRINT_VENTURE.id)) {
      parsed.unshift(DEMO_QUICKPRINT_VENTURE);
      localStorage.setItem(VENTURES_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEMO_QUICKPRINT_VENTURE];
  }
}

export function saveStoredVentures(ventures: Venture[]) {
  try {
    localStorage.setItem(VENTURES_KEY, JSON.stringify(ventures));
  } catch (err) {
    console.error('Failed to save ventures to storage', err);
  }
}

export async function syncVentureToSupabase(venture: Venture): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('ventures').upsert({
      id: venture.id,
      user_id: venture.userId,
      name: venture.name,
      industry: venture.industry,
      stage: venture.stage,
      tagline: venture.tagline,
      pitch_completion: venture.pitchCompletion,
      critic_status: venture.criticStatus,
      data: venture,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Supabase sync skipped or errored (fallback to local state):', err);
  }
}

export async function syncVenturesWithSupabase(ventures: Venture[], userId?: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !userId) return;
  try {
    for (const v of ventures) {
      await syncVentureToSupabase(v);
    }
  } catch (err) {
    console.warn('Batch Supabase sync skipped:', err);
  }
}

export function isUsernameAvailable(username: string, excludeUserId?: string): boolean {
  const users = getStoredUsers();
  const normalized = username.trim().toLowerCase();
  return !users.some(u => u.username.toLowerCase() === normalized && u.id !== excludeUserId);
}
