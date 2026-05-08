import { validProfiles } from '../config/profileConfig';
const KEY = 'accessProfile';
export function getAccessProfile() { const profile = localStorage.getItem(KEY); return validProfiles.includes(profile) ? profile : null; }
export function saveAccessProfile(profile) { if (validProfiles.includes(profile)) localStorage.setItem(KEY, profile); }
export function clearAccessProfile() { localStorage.removeItem(KEY); }
