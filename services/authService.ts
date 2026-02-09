import { User, Badge } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_USER = 'lumina_auth_user';
const STORAGE_KEY_USERS_DB = 'lumina_users_db';

// Simulate a database of users
const getUsersDB = (): User[] => {
  const db = localStorage.getItem(STORAGE_KEY_USERS_DB);
  return db ? JSON.parse(db) : [];
};

const saveUsersDB = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
};

export const login = async (email: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsersDB();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found. Please sign up.');
  }
  
  // Migration for old users without XP
  if (user.xp === undefined) {
      user.xp = 0;
      user.level = 1;
      user.badges = [];
  }
  
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  return user;
};

export const signup = async (name: string, email: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const users = getUsersDB();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists.');
  }
  
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
    role: 'user',
    xp: 0,
    level: 1,
    badges: []
  };
  
  users.push(newUser);
  saveUsersDB(users);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_USER);
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEY_USER);
  return data ? JSON.parse(data) : null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // Mock finding a user
  await new Promise(resolve => setTimeout(resolve, 500));
  const users = getUsersDB();
  return users.find(u => u.email === email) || null;
};

export const addXp = (amount: number): { user: User, leveledUp: boolean } => {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No user");

    const oldLevel = currentUser.level;
    currentUser.xp += amount;
    // Simple level formula: Level = floor(sqrt(XP / 100)) + 1
    // 0 XP = Lvl 1. 100 XP = Lvl 2. 400 XP = Lvl 3.
    currentUser.level = Math.floor(Math.sqrt(currentUser.xp / 100)) + 1;
    
    const leveledUp = currentUser.level > oldLevel;

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    
    // Update DB as well
    const users = getUsersDB();
    const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
    saveUsersDB(updatedUsers);

    return { user: currentUser, leveledUp };
};

export const getLeaderboard = async (): Promise<User[]> => {
    // Mock leaderboard data
    await new Promise(resolve => setTimeout(resolve, 600));
    const users = getUsersDB();
    
    // Generate some fake users if db is empty or small
    if (users.length < 5) {
        const fakeUsers: User[] = [
            { id: 'f1', name: 'Alex Rivera', email: 'alex@ex.com', role: 'user', xp: 2450, level: 5, badges: [], avatar: 'https://i.pravatar.cc/150?u=a' },
            { id: 'f2', name: 'Sarah Chen', email: 'sarah@ex.com', role: 'user', xp: 1800, level: 4, badges: [], avatar: 'https://i.pravatar.cc/150?u=b' },
            { id: 'f3', name: 'Mike Johnson', email: 'mike@ex.com', role: 'user', xp: 950, level: 3, badges: [], avatar: 'https://i.pravatar.cc/150?u=c' },
            { id: 'f4', name: 'Emily Davis', email: 'emily@ex.com', role: 'user', xp: 3200, level: 6, badges: [], avatar: 'https://i.pravatar.cc/150?u=d' },
        ];
        return [...users, ...fakeUsers].sort((a,b) => b.xp - a.xp);
    }
    
    return users.sort((a,b) => b.xp - a.xp);
};