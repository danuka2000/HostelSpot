import { Platform } from 'react-native';

const LOCAL_BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || LOCAL_BACKEND_URL;
export const STORAGE_KEYS = {
  TOKEN: '@hostelspot_token',
  USER: '@hostelspot_user'
};
