import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';

// Composants
import Btn from '../component/button/bouton';
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

// Pour adresse API
import config from '../config';

export default function Logout() {
    const [token, setToken] = useState();

    const nav = useNavigation();

    useEffect(() => {
        getToken();
    }, []);

    // On récupère la valeur stockée à tel Nom
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        if (a !== null) {
            setToken(a);
        }
    }

    const returnHome = async () => {
        const tokenErased = await eraseToken();
        if (tokenErased) {
            nav.navigate('Accueil');
        }
    };
    // Supprimer l'item
    // /?/ : On peut mettre un paramètre rappelable si on veut supprimer plusieurs items différents
    const eraseToken = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log('Token erased');
            return true;
        } catch (error) {
            console.log('Error erasing token:', error);
            return false;
        }
    }

    const [loaded] = useFonts({
        "GothamLight": require('../assets/fonts/GothamLight.ttf'),
        "GothamBook": require('../assets/fonts/GothamBook.ttf'),
        "GothamBold": require('../assets/fonts/GothamBold.ttf'),
    });
    if (!loaded) {
        return <Text>Chargement de la font</Text>;
    }


    return (
        <ImageBackground
            style={{ flex: 1 }}
            resizeMode='cover'
            source={require('../assets/bg.jpg')}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('../assets/logo.png')} />
                    <View style={styles.container}>
                        <TitleTextColor style={styles.textTitle}>MANGA MANIA</TitleTextColor>
                        <Text style={styles.textTitle_welcome}>Déconnexion</Text>
                        <Text style={styles.textStd}>Voulez-vous vous déconnecter ?</Text>
                    </View>
                    <View style={styles.viewBtn}>
                        <Btn onPress={() => returnHome()} textButton={'Oui'} backgroundColor="#ff3131" />
                        <Btn onPress={() => nav.navigate('Accueil')} textButton={"Non"} backgroundColor="black" />
                    </View>
                </View>
            </SafeAreaView>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Navbar />
            </View>
        </ImageBackground>


    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
    },
    userInfo: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: 110,
        height: 120,
    },
    textTitle: {
        color: 'black',
        fontSize: 30,
    },
    textTitle_welcome: {
        color: 'black',
        fontFamily: "GothamBook",
        fontSize: 20,
    },
    textStd: {
        color: 'black',
        fontFamily: "GothamBook",
    },
    input: {
        width: 'auto', // Adjust as needed
        padding: 10,
        borderWidth: 1, // Consistent border size
        borderColor: 'black', // Black border color
        borderRadius: 4, // Optional: rounded corners
    },
    viewBtn: {
        alignItems: 'center',
        width: '80%',
    },

});
