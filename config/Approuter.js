// Import necessary dependencies
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from '../screens/splashscreen';
import LoginScreen from '../screens/login';
import Dashboard from '../screens/dashboard';
import NoticeBoard from '../screens/noticeboard';
import FeeHistory from '../screens/feehistory';
import AttendanceCalendar from '../screens/calendar';
import Chat from '../screens/chat';
import ContactUs from '../screens/contactus';
import Introduction from '../screens/introductionpage';

// Create stack and drawer navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Define the screens to be included in the drawer navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'green',
        height: 100,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
      },
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
      },
      headerTitleAlign: 'center',
      headerTintColor: 'white',
      headerShadowVisible: false,
    }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="NoticeBoard" component={NoticeBoard} />
      <Drawer.Screen name="FeeHistory" component={FeeHistory} />
      <Drawer.Screen name="Calendar" component={AttendanceCalendar} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
      <Drawer.Screen name="Introduction" component={Introduction} />
    </Drawer.Navigator>
  );
}

// Main AppRouter component
function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f2f2f2',
          },
          headerShadowVisible: false,
        }}>
        <Stack.Screen name="SplashScreen" options={{ headerShown: false }} component={SplashScreen} />
        <Stack.Screen
          name="LoginScreen"
          options={{
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
          }}
          component={LoginScreen}
        />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRouter;
