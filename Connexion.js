import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
//import Btn from './component/button/bouton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Btn from './component/button/bouton';

import { useState, useEffect } from 'react';

import { useFonts } from 'expo-font';


import Navbar from './component/navbar/navbar';
import TitleTextColor from './component/title/title';

export default function Connexion() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [data, setData] = useState();

    const [token, setToken] = useState();

    const nav = useNavigation();

    useEffect(() => {
        getToken();
    });

    // Fonction qui fonctionne avec l'import AsyncStorage
    // Permet de stocker des données sur le tel et les réutiliser
    const storeToken = async (value) => {
        // On attend 2 paramètres : Nom et valeur
        await AsyncStorage.setItem('token', value)
        setToken(value)
    }

    // On récupère la valeur stockée à tel Nom
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        if (a !== null) {
            setToken(a);
            nav.navigate('Profil');
        }
    }

    // Supprimer l'item
    // /?/ : On peut mettre un paramètre rappelable si on veut supprimer plusieurs items différents
    const eraseToken = async () => {
        await AsyncStorage.removeItem('token')
    }


    const login = async () => {
        try {
            //Constante res qui attend un fetch
            const res = await fetch('http://192.168.1.59:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // stringify correspond à un json.decode en php
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            setData(data);
            if (data.erreur !== undefined) {
                console.log(data.erreur);
            } else {
                eraseToken();
                storeToken(data.token);
                console.log(data.valid);
            }
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    };

    return (
        <ImageBackground
            style={{ flex: 1 }}
            resizeMode='cover'
            source={require('./assets/bg.jpg')}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('./assets/logo.png')} />

                    <TitleTextColor style={styles.textTitle}>MANGA MANIA</TitleTextColor>
                    <Text style={styles.textTitle_welcome}>BIENVENUE</Text>
                    <Text style={{ color: 'black' }}>{data && data.error !== undefined ? data.error : ""}</Text>

                    <View style={{ width: '80%' }}>
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            /* Désactive la 1ere maj automatique */
                            autoCapitalize='none'
                            onChangeText={setEmail}
                            value={email}
                        />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            /* Désactive la 1ere maj automatique */
                            autoCapitalize='none'
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry={true}
                        />
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => login()} textButton={'SE CONNECTER'} backgroundColor="black" />
                        </View>

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
        marginLeft: 10,
        marginRight: 10,
        marginTop: 50,
        height: "80%"
    },
    logo: {
        resizeMode: 'stretch',
        width: 110,
        height: 120,
    },
    textTitle: {
        color: 'black',
        fontSize: 30,
    },
    textTitle_welcome: {
        color: 'black',
        fontSize: 35,
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
        width: '100%',
    },

});
