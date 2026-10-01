import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, Lock, ShieldCheck } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

export const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let valid = true;
    let err = {};

    if (!name.trim()) {
      err.name = 'Full name is required';
      valid = false;
    }

    if (!email.trim()) {
      err.email = 'Email address is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      err.email = 'Invalid email address format';
      valid = false;
    }

    if (!phone.trim()) {
      err.phone = 'Phone number is required';
      valid = false;
    }

    if (!password) {
      err.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      err.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (password !== confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({ name, email, phone, password, isAdmin });
    } catch (error) {
      Alert.alert('Registration Error', error.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 24 }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6 items-center">
          <View className="w-12 h-12 rounded-xl bg-forest-900 items-center justify-center mb-2 shadow-sm">
            <Text className="text-lg font-black text-cream-50">HS</Text>
          </View>
          <Text className="text-2xl font-extrabold text-forest-900">Create HostelSpot Account</Text>
          <Text className="text-xs text-charcoal-500 text-center mt-0.5">
            Join HostelSpot for premium boutique student accommodations
          </Text>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm">
          <Text className="text-xs font-bold text-clay-600 uppercase tracking-wider mb-4">
            Personal & Contact Details
          </Text>

          <AppInput
            label="Full Name"
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
            error={errors.name}
            leftIcon={<User color="#6D777C" size={18} />}
          />

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
            label="Phone Number"
            placeholder="Enter Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon={<Phone color="#6D777C" size={18} />}
          />

          <Text className="text-xs font-bold text-clay-600 uppercase tracking-wider my-2">
            Security & Role
          </Text>

          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            leftIcon={<Lock color="#6D777C" size={18} />}
          />

          <AppInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            leftIcon={<Lock color="#6D777C" size={18} />}
          />

          <View className="flex-row items-center my-3 bg-cream-50 p-3.5 rounded-2xl border border-cream-200">
            <ShieldCheck color="#122C23" size={20} className="mr-3" />
            <View className="flex-1 ml-2">
              <Text className="text-sm font-bold text-forest-900">Register as Property Administrator</Text>
              <Text className="text-[11px] text-charcoal-500">Grants inventory & booking management controls</Text>
            </View>
            <Switch
              value={isAdmin}
              onValueChange={setIsAdmin}
              trackColor={{ false: '#E6E0D6', true: '#E4ECE7' }}
              thumbColor={isAdmin ? '#122C23' : '#A0A9AE'}
            />
          </View>

          <AppButton
            title="Create HostelSpot Account"
            onPress={handleRegister}
            loading={loading}
            className="mt-4"
          />
        </View>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-charcoal-500 text-sm">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-forest-900 font-bold text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
