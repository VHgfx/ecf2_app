import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Pressable, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
//import Btn from './component/button/bouton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from 'expo-font';

// Composants
import Btn from '../component/button/bouton';
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

// Pour adresse API
import config from '../config';

export default function Profil() {
    const [data, setData] = useState();

    const [userFirstname, setUserFirstname] = useState();
    const [userLastname, setUserLastname] = useState();
    const [userEmail, setUserEmail] = useState();

    const [statUser, setStatUser] = useState([]);
    const [statNb, setStatNb] = useState();


    const [token, setToken] = useState();

    const nav = useNavigation();

    useEffect(() => {
        getToken();
        getTokenInfo();

        if (getToken()) {
            getProfil();
            getStatSuivi();
            getStatNb();
        }
        console.log(token);
    }, [token]);

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
        }
    }

    // Supprimer l'item
    // /?/ : On peut mettre un paramètre rappelable si on veut supprimer plusieurs items différents
    const eraseToken = async () => {
        await AsyncStorage.removeItem('token')
    }

     // Récupération : Exp de token
     const getTokenInfo = async () => {
        const storedToken = await AsyncStorage.getItem('token');
        if(storedToken){
            try {
                const response = await fetch(`${config.apiUrl}/getTokenExp`, {
                    method: 'GET',
                    headers: {
                        'Authorization': storedToken,
                        'Content-Type': 'application/json'
                    }
                });
        
                const data = await response.json();

                console.log(data);
                return data.exp;
            } catch (error) {
                console.log('Token expiré');
                nav.navigate('Expired');
            }
        }  
    };

    // Récupère le profil
    const getProfil = async () => {
        try {
            const res = await fetch(`${config.apiUrl}/profil`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const userInfo = await res.json();

            //setListManga(data);
            console.log(userInfo);
            setUserFirstname(userInfo.data[0].firstname);
            setUserLastname(userInfo.data[0].lastname);
            setUserEmail(userInfo.data[0].email);
        } catch (error) {
            console.log('getProfil:', error);
        }
    }

    // Récupère la liste des mangas suivi
    const getStatSuivi = async () => {
        console.log("Start : getStatSuivi");
        try {
            const res = await fetch(`${config.apiUrl}/suivi/liste`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const statInfo = await res.json();

            console.log(statInfo.valid);
            setStatUser(statInfo.valid);

        } catch (error) {
            console.log('Erreur getStatSuivi:', error);
        }
    }

    // Arrange la liste des suivis alphabétiquement

    // Récupère le nombre de manga suivi
    const getStatNb = async () => {
        console.log("Start : getStatNb");
        try {
            const res = await fetch(`${config.apiUrl}/suivi/statUser`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const statInfo = await res.json();

            console.log(statInfo.valid);
            
            setStatNb(statInfo.valid);
            
            

        } catch (error) {
            console.log('Erreur getStatNb:', error);
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

    const sortedListSuivi = [...statUser].sort((a, b) => a.titre.localeCompare(b.titre));

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
                        <Text style={styles.textTitle_welcome}>Mon profil</Text>
                        <Text style={{ color: 'red' }}>{data && data.error !== undefined ? data.error : ""}</Text>
                    </View>
                    <View style={[styles.userInfo, { width: '80%' }]}>
                        <Text style={styles.text}>Prénom : {userFirstname}</Text>
                        <Text style={styles.text}>Nom : {userLastname}</Text>
                        <Text style={styles.text}>Email : {userEmail}</Text>
                        <Text style={styles.text}>Vous suivez actuellement : </Text>
                        <Text style={styles.nb}>{statNb} {statNb > 1 ? 'mangas' : 'manga'}</Text>
                    </View>
                    <ScrollView>
                        <ScrollView>
                            {sortedListSuivi.length > 0 ? (
                                sortedListSuivi.map((manga, index) => (
                                    <Pressable key={`${index}-${manga.id}-Pressable`} onPress={() => nav.navigate('DetailsManga', { manga_id: manga.id })}>
                                        <View key={`${index}-${manga.id}-View`} style={{ paddingBottom: 10, paddingLeft:20, paddingRight:20, backgroundColor: 'white', borderRadius: 5 }}>
                                            <Text style={styles.listTitle}>{manga.titre}</Text>
                                            <Text style={styles.listText}>{manga.auteur}</Text>
                                        </View>
                                    </Pressable>
                                ))
                            ) : (
                                <View style={styles.container}>
                                    <Text style={styles.noResultsText}>Vous ne suivez aucun manga</Text>
                                    <AntDesign name="hearto" size={24} color='red'/>
                                    <Text>Pensez à les suivre sur leur page</Text>
                                </View>
                            )}
                        </ScrollView>

                    </ScrollView>
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
        paddingTop: 50,
    },
    userInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:20,
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
        fontFamily: "GothamBook",
    },
    text: {
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
        width: '100%',
    },
    nb: {
        fontFamily: "GothamBold",
        fontSize: 16
    },
    listTitle: {
        fontFamily: "GothamBook",
        fontSize: 16
    },
    listText: {
        fontFamily: "GothamLight",
    }

});
