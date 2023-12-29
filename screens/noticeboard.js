import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import NoticeboardService from '../services/noticeboard_services';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoticeBoard = (route) => {
    const [loading, setLoading] = useState(true);
    const [studentNotice, setStudentNotice] = useState([]);
    const [Is_parent,setIs_parent] = useState()
    const [Is_teacher,setIs_teacher] = useState()

    const { selectedStudentId } = route.route.params;
    const { selectedClassId } = route.route.params;
    console.log(selectedClassId,"jjjjjjjjjjjjjjjjjjjjjj")

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

    const getStudentNotice = async () => {
        const api = new NoticeboardService();
        if(Is_parent){
        try {
            const res = await api.FetchNotice(selectedStudentId);
            console.log(res.data.data, "res");
            setStudentNotice(res.data.data);
        } catch (error) {
            console.error('Error fetching notice data:', error);
        } finally {
            setLoading(false);
        }
    }
    };

    const getTeacherNotice = async () => {
        const api = new NoticeboardService();
        if(Is_teacher){
        try {
            const res = await api.FetcheacherNotice(selectedClassId);
            console.log(res.data.data, "res");
            setStudentNotice(res.data.data);
        } catch (error) {
            console.error('Error fetching notice data:', error);
        } finally {
            setLoading(false);
        }
    }
    };

    useEffect(() => {
        usertype()
        getStudentNotice();
        getTeacherNotice();
    }, [Is_parent,Is_teacher]);

    const formatDateTime = (dateTimeString) => {
        const dateTime = moment(dateTimeString).tz('Asia/Karachi'); // Set the time zone to Pakistan Standard Time
        return dateTime.format('ddd, MMM D YYYY, h:mm A');
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    // Check if there are no records
    if (studentNotice.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noRecordsText}>No records found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            <FlatList
                data={studentNotice}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.noticeContainer}>
                        <Text style={styles.noticeTitle}>{item.name}</Text>
                        <Text style={styles.noticeDescription}>{item.description}</Text>
                        <Text style={styles.noticeDateTime}>{formatDateTime(item.create_date)}</Text>
                        <Text style={styles.noticeCreateUi}>{item.create_uid[1]}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: 'green',
        height: 20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        width: '100%',
        textAlign: 'center',
    },
    noticeContainer: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 8,
        marginBottom: 10,
    },
    noticeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    noticeDescription: {
        fontSize: 16,
        color: 'gray',
    },
    noticeDateTime: {
        fontSize: 14,
        color: 'blue',
    },
    noticeCreateUi: {
        fontSize: 14,
        color: 'green',
    },
    noRecordsText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'black',
    },
});

export default NoticeBoard;
