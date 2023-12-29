import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import CSTextField from '../components/Input';
import UsersService from '../services/login_services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; 

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const spinValue = new Animated.Value(0);

  const startLoaderAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    if (loading) {
      startLoaderAnimation();
    }
  }, [loading]);

  const showAlert = (message) => {
    Toast.show({
      text1: 'Error',
      text2: message,
      type: 'error',
      position: 'bottom',
      bottomOffset: 10,
      style: { marginHorizontal: 10 },
    });
  };

  const handleLogin = async () => {
    if (!username.trim()) { 
      showAlert('Please Enter Email');
      return;
    }

    if (!password.trim()) {
      showAlert('Please Enter Password');
      return;
    }

    let formData = {
      db: "AL-HAMD-SCHOOL-DB",
      login: username,
      password: password,
    };

     let formdata2 = {
      "jsonrpc": "2.0",
      "params": {
        "db": "AL-HAMD-SCHOOL-DB",
        "login": `${username}`,
        "password": `${password}`,
      }
    }; 

    const apidata = new UsersService();

    try {
      setLoading(true);

      const res = await apidata.loginUser(formData);
      console.log(res.data)
      if (res.data && res.data.result && res.data.result.access_token && res.data.result.is_in_teacher || res.data.result.is_in_parent) {
        const accessToken = res.data.result.access_token;
        const is_teacher = res.data.result.is_in_teacher;
        const is_parent = res.data.result.is_in_parent;
        const setCookieHeader = res.headers['set-cookie'];
        const sessionId = `session_id=${setCookieHeader[0].split(';')[0].split('=')[1]}`;
        const partnerId = res.data.result.partner_id;
        AsyncStorage.setItem('access_token', accessToken);
        AsyncStorage.setItem('partner_id', String(partnerId));
        AsyncStorage.setItem('Cookie', sessionId);
        AsyncStorage.setItem('is_teacher', String(is_teacher));
        AsyncStorage.setItem('is_parent', String(is_parent));
        
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLoading(false);
       
        navigation.navigate('Drawer');
        setUsername('')
        setPassword('')
    } else {
        setLoading(false);
        showAlert('Login failed. Please check your credentials.');
    }
    } catch (error) {
      setLoading(false);
      showAlert('Login failed. Please check your credentials.');
      console.log(error);
    }

   
 
    // try {
    //   const responed = await apidata.AuthUser(formdata2);
     
    // } catch (error) {
    //   setLoading(false);
    //   showAlert('Login failed. Please check your credentials.');
    //   console.log(error);
    // }
   

  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(()=>{
    setUsername('')
    setPassword('')
  },[])

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Al Hamd School</Text>
        <Text style={styles.paragraph}>
          Sign in with your email and password
        </Text>
      </View>
      <View style={styles.formContainer}>
        <CSTextField 
         value={username}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          imageSource={require('../assets/images/user.png')}
        />
        <CSTextField
         value={password}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true} 
          imageSource={require('../assets/images/lock.png')}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {loading ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ActivityIndicator size="small" color="#fff" />
            </Animated.View>
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast  />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 70,
  },
  formContainer: {
    padding: 35,
  },
  headerText: {
    textAlign: 'center',
    color: 'green',
    fontWeight: '800',
    fontSize: 40,
  },
  paragraph: {
    textAlign: 'center',
    color: 'gray',
    fontWeight: '800',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'center',
  },
});

export default LoginScreen;
