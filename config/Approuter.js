import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
import Toast from 'react-native-toast-message'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddNoticeScreen from '../screens/addnoticeboard';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }) {
  const [Is_parent,setIs_parent] = useState()
  const [Is_teacher,setIs_teacher] = useState()
  const showAlert = (message) => {
    Toast.show({
      text1: 'Validation',
      text2: message,
      type: 'error',
      position: 'bottom',
     
    });
  };

  const handlenavigate=async(item)=>{
    let Selectstudent_ID = await AsyncStorage.getItem('Student_id');
    let Selectclass_ID = await AsyncStorage.getItem('Class_id');
    console.log(Selectclass_ID,"bbbbb")
    console.log(Selectstudent_ID,"bbbbb")
    if (Selectstudent_ID == null && Selectclass_ID == null) {
      showAlert('Please select a student.');
      return;
  } else {
    if(Selectstudent_ID == null){
      navigation.navigate(item, {selectedClassId: Number(Selectclass_ID)});
    }else{
     navigation.navigate(item,{selectedStudentId: Number(Selectstudent_ID) });
    }
  }
  }

  const handleSignOut = () => {
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('partner_id');
    AsyncStorage.removeItem('Cookie');
    AsyncStorage.removeItem('Student_id');
    AsyncStorage.removeItem('Class_id');
    navigation.navigate('LoginScreen');
  };

  const usertype = async()=>{
    let is_parent = await AsyncStorage.getItem('is_parent');
    const isParentBoolean = is_parent === 'true';
    let is_teacher = await AsyncStorage.getItem('is_teacher');
    const isTeacherBoolean = is_teacher === 'true';
    console.log(is_teacher,"is_teacher")
    console.log(isTeacherBoolean,"isTeacherBoolean")
    setIs_parent(isParentBoolean);
    setIs_teacher(isTeacherBoolean)
  }

  useEffect(()=>{
    usertype()
  },[Is_parent,Is_teacher])

  return (
    <>
    <View style={styles.header}>
    <Image
      source={require('../assets/images/logo22.png')} 
      style={styles.logo}
    />
  </View>
    <View style={styles.container}>
   

    <TouchableOpacity style={styles.drawerItem} onPress={()=>{handlenavigate('Dashboard')}}>
    <Image source={require('../assets/images/splash_51.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Dashboard</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('NoticeBoard')}>
    <Image source={require('../assets/images/splash_24.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Notice Board</Text>
    </TouchableOpacity>
    {Is_parent&&
    <>
    
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('FeeHistory')}>
    <Image source={require('../assets/images/splash_26.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Fee History </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('Calendar')}>
    <Image source={require('../assets/images/splash_28.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Attendance</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('Complain')}>
    <Image source={require('../assets/images/splash_29.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Complain</Text>
    </TouchableOpacity>
    </>
}
{Is_teacher&&
    <>
    
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('Add Noticeboard')}>
    <Image source={require('../assets/images/addno.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Add NoticeBoard</Text>
    </TouchableOpacity>

    </>
}
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('ContactUs')}>
    <Image source={require('../assets/images/splash_30.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Contact Us </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.drawerItem} onPress={() => handlenavigate('Introduction')}>
    <Image source={require('../assets/images/splash_31.png')} style={styles.image} />
      <Text style={styles.drawerItemText}>Introduction </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
    <Image source={require('../assets/images/logout.jpg')} style={styles.image} />
      <Text style={styles.drawerItemText}>Sign Out</Text>
    </TouchableOpacity>
  </View>
  </>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
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
      {/* <Drawer.Screen name="NoticeBoard" component={NoticeBoard} />
      <Drawer.Screen name="FeeHistory" component={FeeHistory} />
      <Drawer.Screen name="Calendar" component={AttendanceCalendar} />
      <Drawer.Screen name="Complain" component={Chat} />
      <Drawer.Screen name="ContactUs" component={ContactUs} />
      <Drawer.Screen name="Introduction" component={Introduction} /> */}
    </Drawer.Navigator>
  );
}

function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f2f2f2',
          },
          headerShadowVisible: false,
        }}
      >
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
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen 
      options={{
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
        name="NoticeBoard" component={NoticeBoard} />
        <Stack.Screen name="FeeHistory" 
         options={{
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
        component={FeeHistory} />
        <Stack.Screen
         options={{
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
        name="Calendar" component={AttendanceCalendar} />
        <Stack.Screen
         options={{
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
        name="Complain" component={Chat} />
        <Stack.Screen 
         options={{
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
        name="ContactUs" component={ContactUs} />
        <Stack.Screen
         options={{
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
        name="Introduction" component={Introduction} />
        <Stack.Screen 
         options={{
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
        name="Add Noticeboard" component={AddNoticeScreen} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'green',
  },
  header: {
    alignItems: 'center',
    
  },
  logo: {
    width: '100%',
    height: 111, 
    resizeMode: 'contain',
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    width: 200,
    color: 'black', 
  },
  image: {
    width: 40,
    height: 20,
    borderRadius: 40,
  },
  drawerItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 15, 
    flexDirection: 'row',
    alignItems: 'center', 
  },
  drawerItemText: {
    fontSize: 15,
    marginLeft: 20, // Adjusted spacing
    color: 'white',
  },
  signOutButton: {
    marginTop: 'auto',
    // backgroundColor: 'red',
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10, // Added border radius
  },
  signOutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
  },
});

export default AppRouter;
