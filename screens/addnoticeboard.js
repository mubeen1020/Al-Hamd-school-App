import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform ,TextInput} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TeacherService from '../services/teacher_services';
import Toast from 'react-native-toast-message'; 
import ClassService from '../services/class_services';
import NoticeboardService from '../services/noticeboard_services';

const AddNoticeScreen = (route) => {
    const [notice, setNotice] = useState({
        class: '',
        date: new Date(),
        student: '',
        title: '',
        description: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [Class_data, setClass_data] = useState([]);
    const [Student_data, setStudent_data] = useState([]);
    const [Is_parent,setIs_parent] = useState()
    const [Is_teacher,setIs_teacher] = useState()
    const { selectedClassId } = route.route.params;
   
    const showAlert = (message) => {
        Toast.show({
          text1: 'Thank you !',
          text2: message,
          type: 'success',
          position: 'top',
         
        });
      };

      const showAlertvalidate = (message) => {
        Toast.show({
          text1: 'Validation',
          text2: message,
          type: 'error',
          position: 'top',
         
        });
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


      const postmessage = async () => {
       
        let formData = {
            class_id: 1,
            stu_id: false,
            date: notice.date,
            name: notice.title,
            description: notice.description
        };
        const jsonBody = JSON.stringify(formData);

        const apidata = new NoticeboardService();

        try {
            if(notice.date != '' && notice.title != '' && notice.description != ''){
                const res = await apidata.SentNotice(jsonBody);
                showAlert('Your notice has been sent successfully.');
                setNotice({
                    class: '',
                    date: new Date(),
                    student: '',
                    title: '',
                    description: ''
                });
            }else{
                showAlertvalidate('Fill all fields.')
            }
           
        } catch (error) {
            showAlertvalidate('Fill all fields.')
            console.log(error);
        } 
    }
    
      useEffect(() => {
        usertype()
    
        const fetchData =  () => {
          try {
             getteacher_data();
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [Is_parent,Is_teacher]);
    const handleInputChange = (name, value) => {
        setNotice({ ...notice, [name]: value });
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || notice.date;
        setShowDatePicker(Platform.OS === 'ios');
        handleInputChange('date', currentDate);
    };

    return (
        <>
        <View style={styles.header}>
        {/* <Text style={styles.headerText}></Text> */}
    </View>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
           
            <View style={styles.inputContainer1}>
                <Picker
                    selectedValue={notice.class}
                    onValueChange={(itemValue, itemIndex) => handleInputChange('class', itemValue)}>
                    <Picker.Item label="Select Class" value="" />
                    {Class_data.map((classItem, index) => (
                        <Picker.Item key={index} label={classItem.name} value={classItem.id} />
                    ))}
                </Picker>
            </View>
{/* 
            <View style={styles.inputContainer1}>
                <Picker
                    selectedValue={notice.student}
                    onValueChange={(itemValue, itemIndex) => handleInputChange('student', itemValue)}>
                    <Picker.Item label="Select Student" value="" />
                    {Student_data.map((student, index) => (
                        <Picker.Item key={index} label={student.name} value={student.id} />
                    ))}
                </Picker>
            </View> */}

            <View >
                <TextInput
                    style={styles.inputContainer}
                    placeholder="Title"
                    onChangeText={(text) => handleInputChange('title', text)}
                    value={notice.title}
                />
            </View>

            <View >
                <TextInput
                    style={styles.inputContainer}
                    placeholder="Description"
                    onChangeText={(text) => handleInputChange('description', text)}
                    value={notice.description}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>

                <TouchableOpacity
                   style={styles.inputContainerdate}
                    onPress={() => setShowDatePicker(true)}>
                    <Text>{notice.date.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={notice.date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date()} 
                    />
                )}

<View style={styles.inputContainerbutton}>
                <TouchableOpacity style={styles.loginButton} onPress={postmessage}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <Toast  />
        </ScrollView>
        
        </>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 30,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 15,
        flexDirection: 'row', 
        alignItems: 'center',
        margin:20
    },
    inputContainerbutton: {
       marginLeft:20,
       marginRight:20
       
    },
    inputContainerdate: {
        borderColor: 'gray',
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 15,
        flexDirection: 'row', 
        alignItems: 'center',
        margin:20
    },
    inputContainer1: {
        borderColor: 'gray',
        margin: 20,
        paddingLeft: 5,
        paddingRight: 5,
        borderWidth: 1,
        borderRadius: 30,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
       
    },
    header: {
        backgroundColor: 'green',
        height: 20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

export default AddNoticeScreen;
