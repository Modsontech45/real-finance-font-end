// sessionUtils.ts

import { User } from "../types";

// -------------------
// Session Storage Helpers
// -------------------

export const setSessionData = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, value);
    console.debug(`[SessionStorage] Set "${key}" =`, value);
  } catch (error) {
    console.error(`[SessionStorage] Failed to set key "${key}":`, error);
  }
};

export const getSessionData = (key: string): string | null => {
  try {
    const value = sessionStorage.getItem(key);
    console.debug(`[SessionStorage] Get "${key}" =`, value);
    return value;
  } catch (error) {
    console.error(`[SessionStorage] Failed to get key "${key}":`, error);
    return null;
  }
};

export const deleteSessionData = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
    console.debug(`[SessionStorage] Deleted "${key}"`);
  } catch (error) {
    console.error(`[SessionStorage] Failed to delete key "${key}":`, error);
  }
};

export const clearAllSessionData = (): void => {
  try {
    sessionStorage.clear();
    console.debug("[SessionStorage] Cleared all session data");
  } catch (error) {
    console.error("[SessionStorage] Failed to clear session:", error);
  }
};

// -------------------
// Local Storage Helpers
// -------------------

const setLocalData = (key: string, value: any): void => {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
    console.debug(`[LocalStorage] Set "${key}"`);
  } catch (error) {
    console.error(`[LocalStorage] Failed to set key "${key}":`, error);
  }
};

const getLocalData = <T = any>(key: string): T | null => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`[LocalStorage] Failed to parse key "${key}":`, error);
    return null;
  }
};

export const getAllLocalData = (): Record<string, any> => {
  const allData: Record<string, any> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key);
      try {
        allData[key] = JSON.parse(value as string);
      } catch {
        allData[key] = value;
      }
    }
  } catch (error) {
    console.error("[LocalStorage] Failed to retrieve all data:", error);
  }
  return allData;
};

export const deleteLocalData = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.debug(`[LocalStorage] Deleted "${key}"`);
  } catch (error) {
    console.error(`[LocalStorage] Failed to delete key "${key}":`, error);
  }
};

export const clearAllLocalData = (): void => {
  try {
    localStorage.clear();
    console.debug("[LocalStorage] Cleared all data");
  } catch (error) {
    console.error("[LocalStorage] Failed to clear:", error);
  }
};

// -------------------
// Company ID Helpers
// -------------------

export const setCompanyId = (companyId: string): void => {
  setSessionData("company_id", companyId);
};

export const getCompanyId = (): string | null => {
  return getSessionData("company_id");
};

export const isCompanySelected = (): boolean => {
  return !!getCompanyId();
};

// -------------------
// User Data Helpers (Updated to use User type)
// -------------------

export const setAdminData = (user: User): void => {
  setLocalData("admin", user);
};

export const getAdminData = (): User | null => {
  return getLocalData<User>("admin");
};

// -------------------
// Logout Helper
// -------------------

export const sessionLogout = (): void => {
  deleteSessionData("company_id");
  deleteLocalData("admin");
  deleteLocalData("authToken");
  window.location.href = "/";
};
