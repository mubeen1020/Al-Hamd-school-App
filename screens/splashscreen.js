import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import Swiper from 'react-native-swiper';

const SplashScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
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

  const images = [
    {
      source: require('../assets/images/splash_1.png'),
      style: { width: '100%', height: '50%', borderRadius: 10 },
    },
    {
      source: require('../assets/images/splash_33.png'),
      style: { width: '100%', height: '40%', borderRadius: 10 },
    },
    {
      source: require('../assets/images/splash_2.png'),
      style: { width: '100%', height: '50%', borderRadius: 10 },
    },
  ];

  const navigateToSignIn = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    AsyncStorage.removeItem('access_token');
    AsyncStorage.removeItem('partner_id');
    AsyncStorage.removeItem('Cookie');
    AsyncStorage.removeItem('Student_id');
    navigation.navigate('LoginScreen');
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Al Hamd School</Text>
        <Text style={styles.paragraph}>Parent and Teacher Portal</Text>
      </View>

      <Swiper
        showsButtons={false}
        loop={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        onIndexChanged={(index) => setCurrentPage(index)}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image
              style={[image.style]}
              source={image.source}
              resizeMode="cover"
            />
          </View>
        ))}
      </Swiper>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View key={index} style={styles.dotContainer}></View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={loading ? null : navigateToSignIn}
      >
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <ActivityIndicator size="small" color="#fff" />
          </Animated.View>
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  header: {
    position: 'relative',
    top: 50,
    width: '100%',
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
    fontSize: 10,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dotContainer: {
    marginHorizontal: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gray',
  },
  activeDot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
  },
  footer: {
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width:'100%',
    textAlign:'center'
  },
});

export default SplashScreen;
