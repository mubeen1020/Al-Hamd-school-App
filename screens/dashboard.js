import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import StudentService from '../services/student_services';
import ParentService from '../services/parent_services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; 
import TeacherService from '../services/teacher_services';
import ClassService from '../services/class_services';

const Dashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [Student_data, setStudent_data] = useState([]);
  const [Selectstudent_ID, setSelectstudent_ID] = useState();
  const [Selectclass_ID, setSelectclass_ID] = useState();
  const [Is_parent,setIs_parent] = useState()
  const [Is_teacher,setIs_teacher] = useState()
  const [Class_data, setClass_data] = useState([]);

  const handleStudentChange = (newValue) => {
    console.log(newValue,"newValue")
    AsyncStorage.setItem('Student_id', String(newValue));
    setSelectstudent_ID(newValue);
  };

  const handleClassChange = (newValue) => {
    console.log(newValue,"newValue")
    AsyncStorage.setItem('Class_id', String(newValue));
    setSelectclass_ID(newValue);
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
      Route: 'Complain',
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

  const Dashboard_teacher_data = [
    {
      id: 1,
      name: 'NoticeBoard',
      description: 'Explore announcements and important updates on the NoticeBoard.',
      Route: 'NoticeBoard',
      image: require('../assets/images/splash_24.png'),
    },
    {
      id: 2,
      name: 'Add NoticeBoard',
      description: 'Explore announcements and important updates on the NoticeBoard.',
      Route: 'Add Noticeboard',
      image: require('../assets/images/addno.png'),
    },
    {
      id: 3,
      name: 'Complain',
      description: 'Report issues or concerns through our dedicated complaint system.',
      Route: 'Complain',
      image: require('../assets/images/splash_29.png'),
    },
    {
      id: 4,
      name: 'Contact Us',
      description: 'Reach out to us for assistance or inquiries through Contact Us.',
      Route: 'ContactUs',
      image: require('../assets/images/splash_30.png'),
    },
    {
      id: 5,
      name: 'Introduction',
      description: 'Discover an overview and introductory information about our services.',
      Route: 'Introduction',
      image: require('../assets/images/splash_31.png'),
    },
  ];

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

  const getparent_data = async () => {
    const api = new ParentService();
   if(Is_parent){
    try {
      let partnerId = await AsyncStorage.getItem('partner_id');
     
     
      const res = await api.FetchParent(Number(partnerId));
      const parent_Id = res.data.data[0].id;
      await getstudent_data(parent_Id);
      
    } catch (error) { 
      console.error('Error fetching parent data:', error);
    }  
}
  
  }; 

  const getteacher_data = async () => {
    const api = new TeacherService();
   if(Is_teacher){
    try {
      let partnerId = await AsyncStorage.getItem('partner_id');
      const res = await api.FetchTeacher(Number(partnerId));
      const Teacher_Id = res.data.data[0].id;
      getclass_data(Teacher_Id)
      
    } catch (error) { 
      console.error('Error fetching Teacher data:', error);
    }  
}
  
  }; 

  const getstudent_data = async (id) => {  
    const api = new StudentService();
    try { 
      const res = await api.FetchStudent(id);
      const students = res.data.data;
      setStudent_data(students);
      AsyncStorage.setItem('Student_id', String(students[0]?.id));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const getclass_data = async (id) => {  
    const api = new ClassService();
    try { 
      const res = await api.FetchClass(id);
      const students = res.data.data;
      console.log(students[0].id)
      setClass_data(students);
      AsyncStorage.setItem('Class_id', String(students[0].id));
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    usertype()

    const fetchData =  () => {
      try {
         getteacher_data();
         getparent_data();
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [Is_parent,Is_teacher]);

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

  const handleteacherPress = (item, studentid) => {
    if (Selectclass_ID === undefined && studentid === undefined) {
      showAlert('Please select a class.');
      return;
    } else {
      const selectedId = Selectclass_ID !== undefined ? Selectclass_ID : studentid;
      navigation.navigate(item.Route, { selectedClassId: selectedId });
    }
  };

  const handlePress = (item, studentid) => {
    if (Selectstudent_ID === undefined && studentid === undefined) {
      showAlert('Please select a student.');
      return;
    } else {
      const selectedId = Selectstudent_ID !== undefined ? Selectstudent_ID : studentid;
      navigation.navigate(item.Route, { selectedStudentId: selectedId });
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
        <Text style={styles.headerText}>Dashboard</Text>a
      </View> */}
      <View style={styles.content}>
        {Is_parent&&
        <SelectDropdown
        data={Student_data.map((student) => student.name)}
        
        onSelect={(selectedItem) => {
          console.log(selectedItem,"selectedItemnt")
          const selectedStudent = Student_data.find((student) => student.name === selectedItem);
          if (selectedStudent) {
            handleStudentChange(selectedStudent.id);
          }
        }} 
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        defaultButtonText="Select a Student" 
        defaultValue={Student_data.length > 0 ? Student_data[0].name : ''}
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
        }

{Is_teacher&&
        <SelectDropdown
        data={Class_data.map((i) => i.name)}
        onSelect={(selectedItem) => {
          console.log(selectedItem,"selectedItemnt")
          const selectedClass = Class_data.find((item) => item.name === selectedItem);
          if (selectedClass) {
            handleClassChange(selectedClass.id);
          }
        }} 
        buttonTextAfterSelection={(selectedItem) => selectedItem}
        rowTextForSelection={(item) => item}
        defaultButtonText="Select a Class" 
        defaultValue={Class_data.length > 0 ? Class_data[0].name : ''}
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
        }
        
      </View>

      <View style={styles.container}>
        {Is_parent&&
        <FlatList
          data={Dashboard_data}
          renderItem={({ item }) => (
            <DashboardItem
              item={item}
              onPress={() => {
                handlePress(item,Student_data[0]?.id);
              }}
            />
          )}
        />
            }
             {Is_teacher&&
        <FlatList
          data={Dashboard_teacher_data}
          renderItem={({ item }) => (
            <DashboardItem
              item={item}
              onPress={() => {
                handleteacherPress(item,Class_data[0]?.id);
              }}
            />
          )}
        />
            }
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
