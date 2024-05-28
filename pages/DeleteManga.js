import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
//import Btn from './component/button/bouton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Btn from '../component/button/bouton';

import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';


import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

export default function DeleteManga() {
    const route = useRoute();
    const { manga_id } = route.params;

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [data, setData] = useState();

    const [mangaTitre, setMangaTitre] = useState();
    const [mangaCategorie, setMangaCategorie] = useState();
    const [mangaResume, setMangaResume] = useState();
    const [mangaAuteur, setMangaAuteur] = useState();



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
        }
    }

    // Supprimer l'item
    // /?/ : On peut mettre un paramètre rappelable si on veut supprimer plusieurs items différents
    const eraseToken = async () => {
        await AsyncStorage.removeItem('token')
    }

    const deleteManga = async (manga_id) => {
        try {
            const res = await fetch(`http://192.168.1.59:3000/manga/delete/${manga_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const mangaInfo = await res.json();

            //setListManga(data);
            console.log(mangaInfo);
            nav.navigate('Accueil', {msg: "Manga supprimé :("});

        } catch (error) {
            console.log('Erreur 1:', error);
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
                        <Text style={styles.textTitle_welcome}>Suppression en cours</Text>
                        <Text style={{ color: 'black' }}>{data && data.error !== undefined ? data.error : ""}</Text>
                        <Text style={styles.textStd}>Êtes-vous sûr(e) de vouloir supprimer ce manga ? :(</Text>
                    </View>
                    <View style={styles.viewBtn}>
                        <Btn onPress={() => nav.navigate('Accueil')} textButton={"Non, ramenez-moi à l'accueil..."} backgroundColor="black"/>
                        <Btn onPress={() => deleteManga(manga_id)} textButton={'OUI ! POUBELLE !'} backgroundColor="#ff3131"/>
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
    textStd:{
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
