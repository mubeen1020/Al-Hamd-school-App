import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import IntroductionService from '../services/introduction_services';

const Introduction = () => {
    const [loading, setLoading] = useState(true);
    const [Intro,setIntro] = useState([])
    const getIntroduction = async () => {
        const api = new IntroductionService();
        try {
            const res = await api.FetchIntroduction();
            console.log(res.data.data[0].description, "res");
            setIntro(res.data.data[0].description)
        } catch (error) {
            console.error('Error fetching notice data:', error);
        }  finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getIntroduction();
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
                {/* <Text style={styles.headerText}></Text> */}
            </View>
            <ScrollView style={styles.container}>
          
                <View style={styles.header1}>
                    <Image
                        source={require('../assets/images/logo22.png')}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Us</Text>
                    <Text style={styles.sectionText}>
                       {Intro}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <Text style={styles.sectionText}>
                        To inspire a passion for learning, promote personal development, and prepare students to
                        become responsible global citizens.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <Text style={styles.sectionText}>
                        Email: info@Al-Hamdschool.com{'\n'}
                        Phone: +123 456 7890{'\n'}
                        Address: 123 Main Street, City, Country
                    </Text>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingVertical: 20,
        paddingHorizontal: 15,

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
        width: '100%'
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
    },
    header1: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        width: '100%'
    },
    logo: {
        width: '100%',
        height: 150,
        resizeMode: 'contain',
    },
    section: {
        marginBottom: 30,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    sectionText: {
        fontSize: 16,
        color: '#555',
    },
});

export default Introduction;
