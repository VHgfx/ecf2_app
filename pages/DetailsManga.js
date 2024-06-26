import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useRoute } from '@react-navigation/native';

import { AntDesign } from "@expo/vector-icons";

// Gère le rafraichissement
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

// Composants
import Btn from '../component/button/bouton';
import BtnFollow from '../component/button/follow';
import BtnNoFollow from '../component/button/nofollow';
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

// Pour adresse API
import config from '../config';

export default function DetailsManga() {
    const isFocused = useIsFocused();

    const route = useRoute();
    const { manga_id } = route.params;

    const [data, setData] = useState();

    const [mangaTitre, setMangaTitre] = useState();
    const [mangaCategorie, setMangaCategorie] = useState();
    const [mangaResume, setMangaResume] = useState();
    const [mangaAuteur, setMangaAuteur] = useState();

    const [mangaNbSuivi, setMangaNbSuivi] = useState();

    const [mangaSuiviPerso, setMangaSuiviPerso] = useState(false);

    // Pour trigger le refresh
    const [refresh, setRefresh] = useState(false); 

    const [token, setToken] = useState();

    const nav = useNavigation();

    // On récupère la valeur stockée à tel Nom
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        setToken(a);
        // console.log("Token: " + a);
    }

    // Récupération : Si manga suivi par user connecté
    const getSuiviPerso = async (manga_id) => {
        console.log("Lancement getSuivi");
        const a = await AsyncStorage.getItem('token');
        try {
            const res = await fetch(`${config.apiUrl}/suivi/get/${manga_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': a
                }
            });
            const suiviPersoInfo = await res.json();

            console.log("isSuivi ? : " + suiviPersoInfo.valid);
            setMangaSuiviPerso(suiviPersoInfo.valid);
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    }

    // Ajout : Suivi pour user connecté
    const addFollow = async () => {
        console.log("Lancement addFollow");
        console.log("addFollow > Manga_id : " + manga_id);
        const a = await AsyncStorage.getItem('token');
        try {
            //Constante res qui attend un fetch
            const res = await fetch(`${config.apiUrl}/suivi/add/${manga_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': a
                },
                // stringify correspond à un json.decode en php
                // body: JSON.stringify({ titre, auteur, resume, id_categories }),
            });

            const data = await res.json();

            setData(data);
            if (data.erreur !== undefined) {
                console.log(data.erreur);
            } else {
                console.log("Manga suivi");
                setRefresh(!refresh); // Trigger re-render
            }
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    };

    // Delete : Suivi pour user connecté
    const deleteFollow = async () => {
        console.log("Lancement deleteFollow");
        const a = await AsyncStorage.getItem('token');
        try {
            //Constante res qui attend un fetch
            const res = await fetch(`${config.apiUrl}/suivi/remove/${manga_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': a
                },
                // stringify correspond à un json.decode en php
                // body: JSON.stringify({ titre, auteur, resume, id_categories }),
            });

            const data = await res.json();

            setData(data);
            if (data.erreur !== undefined) {
                console.log(data.erreur);
            } else {
                console.log("Arrêt suivi de manga");
                setRefresh(!refresh); // Trigger re-render
                // nav.navigate('Accueil', {msg: "Le manga a été followed !"});
            }
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    };

    // Supprimer l'item
    // /?/ : On peut mettre un paramètre rappelable si on veut supprimer plusieurs items différents
    const eraseToken = async () => {
        await AsyncStorage.removeItem('token')
    }

    // Récupération : Infos 1 manga à partir manga_id
    const getOneManga = async (manga_id) => {
        try {
            const res = await fetch(`${config.apiUrl}/manga/${manga_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const mangaInfo = await res.json();

            setMangaTitre(mangaInfo.data.titre);
            setMangaResume(mangaInfo.data.resume);
            setMangaAuteur(mangaInfo.data.auteur);
            setMangaCategorie(mangaInfo.data.nom_categorie);
            setMangaNbSuivi(mangaInfo.data.suivi_count);

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


    useEffect(() => {
        const fetchData = async () => {
          try {
            await getOneManga(manga_id);
            const tokenValue = await getToken(); // Assuming getToken returns the token value
            await getSuiviPerso(manga_id);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, [isFocused, refresh]);

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
                        <Text style={styles.textTitle_welcome}>{mangaTitre}</Text>
                        <Text style={{ color: 'black' }}>{data && data.error !== undefined ? data.error : ""}</Text>                 
                        {token && (
                            <Text style={styles.textSuivi}>
                                {mangaSuiviPerso ? <BtnFollow onPress={() => deleteFollow()}/> : <BtnNoFollow  onPress={() => addFollow()}/>}
                            </Text>
                        )}
                        <Text style={styles.textSuivi}>
                            {mangaNbSuivi} {mangaNbSuivi > 1 ? 'personnes suivent' : 'personne suit'} ce manga
                        </Text>
                    </View>
                    <ScrollView style={[{ width: '80%' }]}>
                        <Text style={styles.text}>Auteur : {mangaAuteur}</Text>
                        <Text style={styles.text}>Catégorie : {mangaCategorie}</Text>
                        <Text style={styles.text}>Résumé : {mangaResume}</Text>
                    </ScrollView>
                    {token && (
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => nav.navigate('DeleteManga', { manga_id })} textButton={'SUPPRIMER LE MANGA'} backgroundColor="#ff3131" />
                        </View>
                    )}
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
        fontSize: 30,
        fontFamily: "GothamBook",
        paddingLeft: "5%",
        paddingRight: "5%",
        textAlign: "center",
    },
    text: {
        fontFamily: "GothamBook",
    },
    textSuivi: {
        fontFamily: "GothamBook",
        marginBottom: 10,
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
