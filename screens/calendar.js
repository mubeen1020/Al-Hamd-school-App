import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AttendanceService from '../services/attendance_services';
import moment from 'moment-timezone';

const AttendanceCalendar = (route) => {
    const [loading, setLoading] = useState(true);
    const { selectedStudentId } = route.route.params;
    const [Student_Attendance, setStudent_Attendance] = useState([]);

    const getStudentAttendance = async () => {
        const api = new AttendanceService();
        try {
            const res = await api.FetchAttendance(selectedStudentId);
            console.log(res.data.data, "res");
            setStudent_Attendance(res.data.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentAttendance();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    const markedDates = {};

    Student_Attendance.forEach((attendance) => {
        const dateString = moment(attendance.create_date).format('YYYY-MM-DD');
        markedDates[dateString] = {
            customStyles: {
                container: {
                    backgroundColor: attendance.is_present ? 'green' : 'red',
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            },
        };
    });

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            <Calendar
                markedDates={markedDates}
                dayComponent={({ date, state }) => {
                    let customContainerStyle = {};

                    if (state === 'disabled') {
                        customContainerStyle = {
                            backgroundColor: 'white',
                        };
                    } else if (markedDates[date.dateString]) {
                        customContainerStyle = markedDates[date.dateString].customStyles.container;
                    }

                    return (
                        <View
                            style={[
                                styles.dayContainer,
                                state === 'disabled' ? styles.disabledDay : null,
                                customContainerStyle,
                            ]}
                        >
                            <Text style={[styles.dayText, markedDates[date.dateString]?.customStyles.text]}>
                                {date.day}
                            </Text>
                        </View>
                    );
                }}
            />
            <View style={styles.legendContainer}>
                <View style={[styles.legendItem, { flex: 1 }]}>
                    <View style={[styles.legendCircle, { backgroundColor: 'red' }]}>
                    </View>
                    <Text style={[styles.legendText]}>Absent</Text>
                </View>
                <View style={[styles.legendItem, { flex: 1 }]}>
                    <View style={[styles.legendCircle, { backgroundColor: 'green' }]}>
                    </View>
                    <Text style={[styles.legendText]}>Present</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    dayText: {
        color: 'black',
        fontWeight: 'normal',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendText: {
        marginLeft: 5,
        fontWeight: 'bold',
        width: 50
    },
    disabledDay: {
        opacity: 0.5,
    },
    header: {
        backgroundColor: 'green',
        height: 20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AttendanceCalendar;
