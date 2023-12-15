import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ContactusService from '../services/contactus_services';

const ContactUs = () => {
    const [loading, setLoading] = useState(true);
    const [Description,setDescription] = useState([])
    const [Title,setTitle] = useState([])
    const getContactus = async () => {
        const api = new ContactusService();
        try {
            const res = await api.FetchContactus();
            console.log(res.data.data[0].description, "res");
            setDescription(res.data.data[0].description)
            setTitle(res.data.data[0].title)
        } catch (error) {
            console.error('Error fetching notice data:', error);
        }  finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getContactus();
    }, []);
    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }
    return (
        <>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}>Contact Us</Text> */}
            </View>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.header2}>{Title}</Text>
                    <Text style={styles.text}>{Description}</Text>
                    
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.header2}>Developed by</Text>
                    <Text style={styles.text}>Copyright DSM 2023 dsmpk.com. All Rights Reserved</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#F8F8F8',
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
    },
    section: {
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header2: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    text: {
        fontSize: 16,
        color: '#555',
        width:'100%'
    },
    divider: {
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
});

export default ContactUs;
