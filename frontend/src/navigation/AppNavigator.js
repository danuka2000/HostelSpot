import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Home, Compass, CalendarCheck, User, LayoutDashboard, BedDouble, ClipboardList } from 'lucide-react-native';

import { AuthContext } from '../context/AuthContext';
import HomeScreen from '../screens/rooms/HomeScreen';
import RoomListScreen from '../screens/rooms/RoomListScreen';
import RoomDetailsScreen from '../screens/rooms/RoomDetailsScreen';
import CreateBookingScreen from '../screens/bookings/CreateBookingScreen';
import MyBookingsScreen from '../screens/bookings/MyBookingsScreen';
import BookingDetailsScreen from '../screens/bookings/BookingDetailsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageRoomsScreen from '../screens/admin/ManageRoomsScreen';
import AddEditRoomScreen from '../screens/admin/AddEditRoomScreen';
import ManageBookingsScreen from '../screens/admin/ManageBookingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const commonScreenOptions = {
  headerBackTitleVisible: false,
  headerStyle: { backgroundColor: '#FAF8F5' },
  headerTitleStyle: { color: '#122C23', fontWeight: 'bold' },
  headerTintColor: '#122C23',
  headerShadowVisible: false
};

// Student Stack Navigators
const StudentHomeStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{ title: 'Residence Info' }} />
    <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Reserve Room' }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Reservation Details' }} />
  </Stack.Navigator>
);

const StudentRoomsStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="RoomListMain" component={RoomListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} options={{ title: 'Residence Info' }} />
    <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'Reserve Room' }} />
  </Stack.Navigator>
);

const StudentBookingsStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="MyBookingsMain" component={MyBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Reservation Ticket' }} />
  </Stack.Navigator>
);

// Admin Dedicated Stack Navigators
const AdminDashboardStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="AdminDashboardMain" component={AdminDashboardScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ManageRooms" component={ManageRoomsScreen} options={{ title: 'Inventory Management' }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'New Residence' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Residence' }} />
    <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} options={{ title: 'Approval Queue' }} />
  </Stack.Navigator>
);

const AdminRoomsStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="ManageRoomsMain" component={ManageRoomsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'New Residence' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Residence' }} />
  </Stack.Navigator>
);

const AdminRequestsStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="ManageBookingsMain" component={ManageBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Review Application' }} />
  </Stack.Navigator>
);

const SharedProfileStack = () => (
  <Stack.Navigator screenOptions={commonScreenOptions}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Overview' }} />
    <Stack.Screen name="ManageRooms" component={ManageRoomsScreen} options={{ title: 'Manage Residences' }} />
    <Stack.Screen name="AddRoom" component={AddEditRoomScreen} options={{ title: 'New Residence' }} />
    <Stack.Screen name="EditRoom" component={AddEditRoomScreen} options={{ title: 'Edit Residence' }} />
    <Stack.Screen name="ManageBookings" component={ManageBookingsScreen} options={{ title: 'Approval Queue' }} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.isAdmin || false;

  const tabNavigatorOptions = {
    headerShown: false,
    tabBarActiveTintColor: '#122C23',
    tabBarInactiveTintColor: '#6D777C',
    tabBarStyle: {
      backgroundColor: '#FAF8F5',
      borderTopColor: '#E6E0D6',
      height: 64,
      paddingBottom: 10,
      paddingTop: 8,
      elevation: 4
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.2
    }
  };

  if (isAdmin) {
    return (
      <Tab.Navigator screenOptions={tabNavigatorOptions}>
        <Tab.Screen
          name="AdminDashboardTab"
          component={AdminDashboardStack}
          options={{
            tabBarLabel: 'Overview',
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={22} />
          }}
        />
        <Tab.Screen
          name="AdminRoomsTab"
          component={AdminRoomsStack}
          options={{
            tabBarLabel: 'Residences',
            tabBarIcon: ({ color, size }) => <BedDouble color={color} size={22} />
          }}
        />
        <Tab.Screen
          name="AdminRequestsTab"
          component={AdminRequestsStack}
          options={{
            tabBarLabel: 'Approvals',
            tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={22} />
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={SharedProfileStack}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color, size }) => <User color={color} size={22} />
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={tabNavigatorOptions}>
      <Tab.Screen
        name="HomeTab"
        component={StudentHomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={22} />
        }}
      />
      <Tab.Screen
        name="RoomsTab"
        component={StudentRoomsStack}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={22} />
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={StudentBookingsStack}
        options={{
          tabBarLabel: 'Reservations',
          tabBarIcon: ({ color, size }) => <CalendarCheck color={color} size={22} />
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={SharedProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={22} />
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
