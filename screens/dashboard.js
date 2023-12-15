import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import StudentService from '../services/student_services';
import ParentService from '../services/parent_services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; 

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [Student_data, setStudent_data] = useState([]);
  const [Selectstudent_ID, setSelectstudent_ID] = useState();

  const handleStudentChange = (newValue) => {
    setSelectstudent_ID(newValue);
  };

  const Dashboard_data = [
    {
      id: 1,
      name: 'NoticeBoard',
      description: 'Explore announcements and important updates on the NoticeBoard.',
      Route: 'NoticeBoard',
      image: require('../assets/images/splash_24.png'),
    },
    {
      id: 2,
      name: 'Fee History',
      description: 'Track your payment history and review financial transactions.',
      Route: 'FeeHistory',
      image: require('../assets/images/splash_26.png'),
    },
    {
      id: 3,
      name: 'Attendance',
      description: 'Monitor attendance records and keep track of schedules.',
      Route: 'Calendar',
      image: require('../assets/images/splash_28.png'),
    },
    {
      id: 4,
      name: 'Complain',
      description: 'Report issues or concerns through our dedicated complaint system.',
      Route: 'Chat',
      image: require('../assets/images/splash_29.png'),
    },
    {
      id: 5,
      name: 'Contact Us',
      description: 'Reach out to us for assistance or inquiries through Contact Us.',
      Route: 'ContactUs',
      image: require('../assets/images/splash_30.png'),
    },
    {
      id: 6,
      name: 'Introduction',
      description: 'Discover an overview and introductory information about our services.',
      Route: 'Introduction',
      image: require('../assets/images/splash_31.png'),
    },
  ];


  const getparent_data = async () => {
    const api = new ParentService();

    try {
      let partnerId = await AsyncStorage.getItem('partner_id');
      const res = await api.FetchParent(partnerId);
      const parent_Id = res.data.data[0].id;
      await getstudent_data(parent_Id);
    } catch (error) { 
      console.error('Error fetching parent data:', error);
    }  
  }; 

  const getstudent_data = async (id) => {  
    const api = new StudentService();
    try { 
      const res = await api.FetchStudent(id);
      const students = res.data.data;
      setStudent_data(students);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getparent_data();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const DashboardItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.plantContainer} onPress={onPress}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.plantDetails}>
        <Text style={styles.plantName}>{item.name}</Text>
        <Text style={styles.plantDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const showAlert = (message) => {
    Toast.show({
      text1: 'Validation',
      text2: message,
      type: 'error',
      position: 'bottom',
     
    });
  };

  const handlePress = (item) => {
    
    if (Selectstudent_ID == undefined) {
        showAlert('Please select a student.');
        return;
    } else {
      navigation.navigate(item.Route, { selectedStudentId: Selectstudent_ID });
    }
  };
 
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View> */}
      <View style={styles.content}>
        <SelectDropdown
          data={Student_data.map((student) => student.name)}
          onSelect={(selectedItem) => {
            const selectedStudent = Student_data.find((student) => student.name === selectedItem);
            if (selectedStudent) {
              handleStudentChange(selectedStudent.id);
            }
          }} 
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          defaultButtonText="Select a Student" 
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText} 
          renderDropdownIcon={() => (
            <View style={styles.dropdownIconContainer}>
              <Text style={styles.dropdownIcon}>▼</Text>
            </View>
          )}
          dropdownStyle={styles.dropdown}
          dropdownTextStyle={styles.dropdownText}
        />
      </View>

      <View style={styles.container}>
        <FlatList
          data={Dashboard_data}
          renderItem={({ item }) => (
            <DashboardItem
              item={item}
              onPress={() => {
                handlePress(item);
              }}
            />
          )}
        />
      </View>
      <Toast  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'green',
    height: '15%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 30,
  },
  content: {
    width: '100%',
    padding: 35,
    marginLeft: 30,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: '85%',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 10,
  },
  dropdownIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  dropdownIcon: {
    fontSize: 16,
    color: 'black',
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
  },
  plantContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginBottom: 10,
    backgroundColor: 'green',
    margin: 20,
    borderRadius: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  plantDetails: {
    flex: 1,
    paddingLeft: 20,
    color: 'white',
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  plantDescription: {
    fontSize: 14,
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;
