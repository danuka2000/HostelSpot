import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Mail, ShieldAlert } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const validateForm = () => {
    let valid = true;
    let err = {};
    setAuthError('');

    if (!email.trim()) {
      err.email = 'Email address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = 'Invalid email address format';
      valid = false;
    }

    if (!password) {
      err.password = 'Password is required';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setAuthError('');
    try {
      await login(email, password);
    } catch (error) {
      const msg = error.message || 'Invalid email or password credentials';
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="p-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View className="mb-8 items-center">
          <View className="w-16 h-16 rounded-2xl bg-forest-900 items-center justify-center mb-3 shadow-md border border-forest-800">
            <Text className="text-2xl font-black text-cream-50">HS</Text>
          </View>
          <Text className="text-3xl font-extrabold text-forest-900 tracking-tight">HostelSpot</Text>
          <Text className="text-xs font-bold text-clay-600 uppercase tracking-widest mt-1">
            BOUTIQUE RESIDENTIAL LIVING
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm">
          <Text className="text-xl font-bold text-forest-900 mb-1">Welcome Back</Text>
          <Text className="text-xs text-charcoal-500 mb-6 font-medium">
            Sign in to access your residence account & reservations
          </Text>

          {authError ? (
            <View className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 mb-4 flex-row items-center">
              <ShieldAlert color="#B93838" size={18} className="mr-2" />
              <Text className="text-rose-900 font-semibold text-xs flex-1 ml-2">
                {authError}
              </Text>
            </View>
          ) : null}

          <AppInput
            label="Email Address"
            placeholder="Enter Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Mail color="#6D777C" size={18} />}
          />

          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Lock color="#6D777C" size={18} />}
          />

          <AppButton
            title="Sign In to HostelSpot"
            onPress={handleLogin}
            loading={loading}
            className="mt-4"
          />
        </View>

        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-charcoal-500 text-sm">Need a residence account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-clay-600 font-bold text-sm">Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
