import { User } from '../types';
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
    role: 'user'
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
