import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
//import Btn from './component/button/bouton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Btn from './component/button/bouton';

import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';


import Navbar from './component/navbar/navbar';
import TitleTextColor from './component/title/title';

export default function DetailsManga() {
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
        getOneManga(manga_id);
    }, []);

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

    const getOneManga = async (manga_id) => {
        try {
            const res = await fetch(`http://192.168.1.59:3000/manga/${manga_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const mangaInfo = await res.json();

            //setListManga(data);
            console.log(mangaInfo);
            setMangaTitre(mangaInfo.data.titre);
            setMangaResume(mangaInfo.data.resume);
            setMangaAuteur(mangaInfo.data.auteur);
            setMangaCategorie(mangaInfo.data.nom_categorie);


        } catch (error) {
            console.log('Erreur 1:', error);
        }
    }


    return (
        <ImageBackground
            style={{ flex: 1 }}
            resizeMode='cover'
            source={require('./assets/bg.jpg')}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <Image style={styles.logo} source={require('./assets/logo.png')} />
                    <View style={styles.container}>
                        <TitleTextColor style={styles.textTitle}>MANGA MANIA</TitleTextColor>
                        <Text style={styles.textTitle_welcome}>{mangaTitre}</Text>
                        <Text style={{ color: 'black' }}>{data && data.error !== undefined ? data.error : ""}</Text>
                    </View>
                    <ScrollView style={[{ width: '80%' }]}>
                        <Text style={styles.text}>Auteur : {mangaAuteur}</Text>
                        <Text style={styles.text}>Catégorie : {mangaCategorie}</Text>
                        <Text style={styles.text}>Résumé : {mangaResume}</Text>
                    </ScrollView>
                    <View style={styles.viewBtn}>
                        <Btn onPress={() => nav.navigate('DeleteManga', { manga_id })} textButton={'SUPPRIMER LE MANGA'} backgroundColor="#ff3131"/>
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
        paddingTop: 70,
    },
    userInfo: {
        alignItems: 'center',
        justifyContent: 'center',
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
