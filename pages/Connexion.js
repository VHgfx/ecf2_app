import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
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

export default function Connexion() {
    const route = useRoute();
    const { msg } = route.params;
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [data, setData] = useState();

    const [erreur, setErreur] = useState(null);
    const [errMsg, setErrMsg] = useState();

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

    const checkForm = () => {
        const newErrors = {};
        if (!email) {
          newErrors.email = 'Email is required';
        }
        if (!password) {
          newErrors.password = 'Password is required';
        }
        setErreur("Veuillez remplir tous les champs");
        return Object.keys(newErrors).length === 0;
    };


    const login = async () => {
        if(checkForm()){
            setErrMsg(null);
            try {
                //Constante res qui attend un fetch
                const res = await fetch(`${config.apiUrl}/login`, {
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
                    nav.navigate('Profil');
                }
            } catch (error) {
                console.log('Erreur 1:', error);
            }
        } else {
            console.log('Validation failed');
            setErrMsg("Veuillez remplir tous les champs");
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
                    <Text style={styles.textTitle_welcome}>Connexion</Text>
                    <Text style={{ color: 'black' }}>{msg !== undefined ? msg : ""}</Text>
                    <Text style={{ color: 'red' }}>{errMsg !== undefined ? errMsg : ""}</Text>

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
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => nav.navigate('Inscription')} textButton={'CRÉER UN COMPTE'} backgroundColor="#ff3131" />
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
    input: {
        width: 'auto', 
        padding: 10,
        borderWidth: 1, 
        borderColor: 'black', 
        borderRadius: 0,
        fontFamily: "GothamLight",
        alignItems: 'center',
        textAlign: 'center',
    },
    viewBtn: {
        alignItems: 'center',
        width: '100%',
    },

});
