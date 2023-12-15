import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import NoticeboardService from '../services/noticeboard_services';
import moment from 'moment-timezone';

const NoticeBoard = (route) => {
    const [loading, setLoading] = useState(true);
    const [StudentNotice, setStudentNotice] = useState([]);

    const { selectedStudentId } = route.route.params;

    const getStudentNotice = async () => {
        const api = new NoticeboardService();
        try {
            const res = await api.FetchNotice(selectedStudentId);
            console.log(res.data.data, "res");
            setStudentNotice(res.data.data);
        } catch (error) {
            console.error('Error fetching notice data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentNotice();
    }, []);

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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            <FlatList
                data={StudentNotice}
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
});

export default NoticeBoard;
