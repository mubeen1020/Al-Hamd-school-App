import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import FeehistoryService from '../services/feehistory_services';
import moment from 'moment-timezone';

const FeeHistory = (route) => {
    const [loading, setLoading] = useState(true);
    const [studentFee, setStudentFee] = useState([]);
    const { selectedStudentId } = route.route.params;

    const getStudentFee = async () => {
        const api = new FeehistoryService();
        try {
            const res = await api.FetchFeehistory(selectedStudentId);
            console.log(res.data.data, "res");
            setStudentFee(res.data.data);
        } catch (error) {
            console.error('Error fetching notice data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudentFee();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    const filteredStudentFee = studentFee.filter(
        (item) => item.state === 'paid' || item.state === 'pending' || item.state === 'confirm' || item.state === 'cancel'
    );

    if (filteredStudentFee.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noRecordsText}>No records found.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'paid':
                    return 'green';
                case 'pending':
                    return '#fcc203';
                case 'confirm':
                    return 'red';
                case 'cancel':
                    return 'gray';
                default:
                    return 'black';
            }
        };

        return (
            <View style={[styles.feeItem, { borderColor: getStatusColor(item.state) }]}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailsContainer}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Final Amount:</Text>
                        <Text style={styles.amountValue}>${item.final_amount}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Paid Amount:</Text>
                        <Text style={styles.amountValue}>${item.paid_amount}</Text>
                    </View>
                    <Text style={styles.number}>Number: {item.number}</Text>
                </View>
                <View style={[styles.stateContainer, { backgroundColor: getStatusColor(item.state) }]}>
                    <Text style={styles.state}>{item.state.toUpperCase()}</Text>
                </View>
                <Text style={styles.time}>{formatDateTime(item.date)}</Text>
            </View>
        );
    };

    const formatDateTime = (dateTimeString) => {
        const dateTime = moment(dateTimeString).tz('Asia/Karachi');
        return dateTime.format('ddd, MMM D YYYY');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            <FlatList
                data={filteredStudentFee}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
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
        textAlign: 'center'
    },
    feeItem: {
        marginHorizontal: 20,
        marginTop: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 8,
        borderWidth: 2,
    },
    detailsContainer: {
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    amountLabel: {
        fontSize: 16,
        color: 'black',
        marginRight: 5,
    },
    amountValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        width: '100%',
    },
    number: {
        fontSize: 16,
        color: 'black',
    },
    stateContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
        alignSelf: 'flex-end',
        marginTop: 5,
        width: '100%',
    },
    state: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    time: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center'
    },
    noRecordsText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'black',
    },
});

export default FeeHistory;
