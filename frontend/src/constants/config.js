import { Platform } from 'react-native';

const DEPLOYED_BACKEND_URL = 'https://hostel-spot-jade.vercel.app/api';
const LOCAL_BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || DEPLOYED_BACKEND_URL;
export const STORAGE_KEYS = {
  TOKEN: '@hostelspot_token',
  USER: '@hostelspot_user'
};
