import React, { useContext } from 'react';
import { View, Text, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, ShieldCheck, LogOut } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext';
import AppButton from '../../components/AppButton';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out of HostelSpot?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of HostelSpot?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: () => logout()
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Profile Identity Card */}
        <View className="items-center bg-white rounded-3xl p-6 mb-5 border border-cream-200 shadow-sm">
          <View className="w-20 h-20 rounded-full bg-forest-900 items-center justify-center mb-3 border-2 border-sage-200">
            <Text className="text-cream-50 text-3xl font-black">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text className="text-xl font-extrabold text-forest-900">{user?.name || 'Resident User'}</Text>
          <Text className="text-xs text-charcoal-500 font-medium mt-0.5">{user?.email}</Text>

          <View className="bg-sage-100 px-3.5 py-1 rounded-full mt-3 border border-sage-200 flex-row items-center">
            <ShieldCheck color="#122C23" size={14} className="mr-1" />
            <Text className="text-forest-900 text-xs font-bold uppercase tracking-wider ml-1">
              {user?.isAdmin ? 'PROPERTY ADMINISTRATOR' : 'VERIFIED RESIDENT'}
            </Text>
          </View>
        </View>

        {/* Grouped Account Details */}
        <View className="bg-white rounded-3xl p-5 mb-5 border border-cream-200 shadow-sm">
          <Text className="text-xs font-bold text-clay-600 uppercase tracking-widest mb-3">
            ACCOUNT INFORMATION
          </Text>

          <View className="flex-row items-center py-3 border-b border-cream-100">
            <User color="#6D777C" size={18} className="mr-3" />
            <View className="flex-1 ml-2">
              <Text className="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Full Name</Text>
              <Text className="text-sm font-semibold text-charcoal-900">{user?.name}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3 border-b border-cream-100">
            <Mail color="#6D777C" size={18} className="mr-3" />
            <View className="flex-1 ml-2">
              <Text className="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Email Address</Text>
              <Text className="text-sm font-semibold text-charcoal-900">{user?.email}</Text>
            </View>
          </View>

          <View className="flex-row items-center py-3">
            <Phone color="#6D777C" size={18} className="mr-3" />
            <View className="flex-1 ml-2">
              <Text className="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Phone Number</Text>
              <Text className="text-sm font-semibold text-charcoal-900">{user?.phone || 'Not provided'}</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Action */}
        <AppButton
          title="Sign Out"
          variant="danger"
          onPress={handleLogout}
          icon={<LogOut color="#B93838" size={16} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
