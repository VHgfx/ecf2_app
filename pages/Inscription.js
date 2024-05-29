import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { useState, useEffect } from 'react';

import { useFonts } from 'expo-font';

// Composants
import Btn from '../component/button/bouton';
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

// Pour adresse API
import config from '../config';

export default function Inscription() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();

    const [msg, setMsg] = useState();

    const [data, setData] = useState();

    const [token, setToken] = useState();

    const nav = useNavigation();

    useEffect(() => {
        getToken();
    },[]);

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


    const inscription = async () => {
        try {
            //Constante res qui attend un fetch
            const res = await fetch(`${config.apiUrl}/addUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // stringify correspond à un json.decode en php
                body: JSON.stringify({ email, password, firstname, lastname })
            });


            const userInfo = await res.json();
            setData(userInfo);
            
            if (userInfo.erreur !== undefined) {
                console.log(userInfo.erreur);
            } else {
                console.log(userInfo.valid);
                setMsg(userInfo.valid);
                nav.navigate("Connexion", { msg: userInfo.valid });
            }
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    };

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

                    <TitleTextColor style={styles.textTitle}>MANGA MANIA</TitleTextColor>
                    <Text style={styles.textTitle_welcome}>Inscription</Text>
                    <Text style={{ color: 'black' }}>{data && data.erreur !== undefined ? data.erreur : ""}</Text>
                    
                    <View style={{ width: '80%' }}>
                        <Text style={styles.text}>Avec un compte tu pourras : ajouter, supprimer, suivre un manga et voir la liste des suivis sur ton profil !</Text>
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
                        <TextInput
                            placeholder="Prénom"
                            style={styles.input}
                            onChangeText={setFirstname}
                            value={firstname}
                        />
                        <TextInput
                            placeholder="Nom"
                            style={styles.input}
                            onChangeText={setLastname}
                            value={lastname}
                        />
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => inscription()} textButton={'CRÉER MON COMPTE'} backgroundColor="#ff3131" />
                        </View>
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => nav.navigate('Connexion')} textButton={'DÉJÀ UN COMPTE ?'} backgroundColor="black" />
                        </View>
                    </View>
                </View>


            </SafeAreaView>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                {token ? <Navbar /> : <NavbarOffline />}
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
        width: 55,
        height: 60,
    },
    textTitle: {
        color: 'black',
        fontSize: 30,
    },
    textTitle_welcome: {
        color: 'black',
        fontSize: 35,
        fontFamily: "GothamBook",
    },
    text: {
        color: 'black',
        fontSize: 14,
        fontFamily: "GothamBook",
        marginBottom:10,
    },
    input: {
        width: 'auto', // Adjust as needed
        padding: 5,
        borderWidth: 1, // Consistent border size
        borderColor: 'black', // Black border color
        borderRadius: 0, // Optional: rounded corners
        fontFamily: "GothamLight",
        alignItems: 'center',
        textAlign: 'center',
    },
    viewBtn: {
        alignItems: 'center',
        width: '100%',
    },

});
