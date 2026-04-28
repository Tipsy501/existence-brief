import CryptoJS from 'crypto-js';
import { supabase } from './supabase';

const ENCRYPTION_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-security-key-eb-2024';

/**
 * Encrypts and saves data to localStorage
 */
export const secureSave = (key: string, data: any) => {
  try {
    const stringified = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringified, ENCRYPTION_KEY).toString();
    localStorage.setItem(`eb_secure_${key}`, encrypted);
  } catch (err) {
    console.error('Encryption Error:', err);
  }
};

/**
 * Retrieves and decrypts data from localStorage
 */
export const secureLoad = (key: string) => {
  try {
    const encrypted = localStorage.getItem(`eb_secure_${key}`);
    if (!encrypted) return null;
    
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.warn('Decryption Error (data may be invalid or key changed):', err);
    return null;
  }
};

/**
 * Clears all EB specific storage
 */
export const clearEBStorage = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('eb_secure_') || key.startsWith('sb-')) {
      localStorage.removeItem(key);
    }
  });
  sessionStorage.clear();
};

/**
 * Log Auth event to Supabase
 */
export const logAuthEvent = async (event: string, details: any = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert([{
      event_type: event,
      user_id: user?.id || 'anonymous',
      details,
      ip_address: 'client-logged', // In a full backend we'd get real IP
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.error('Logging Error:', err);
  }
};
