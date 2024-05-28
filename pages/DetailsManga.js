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
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

export default function DetailsManga() {
    const isFocused = useIsFocused();

    const route = useRoute();
    const { manga_id } = route.params;

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [data, setData] = useState();

    const [mangaTitre, setMangaTitre] = useState();
    const [mangaCategorie, setMangaCategorie] = useState();
    const [mangaResume, setMangaResume] = useState();
    const [mangaAuteur, setMangaAuteur] = useState();

    const [mangaNbSuivi, setMangaNbSuivi] = useState();

    const [mangaSuiviPerso, setMangaSuiviPerso] = useState(false);

    const [token, setToken] = useState();

    const nav = useNavigation();

    /*useEffect(() => {
        getToken();
        getOneManga(manga_id);
    }, []);*/


    // On récupère la valeur stockée à tel Nom
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        setToken(a);
        // console.log("Token: " + a);
    }

    const getSuiviPerso = async (manga_id) => {
        console.log("Lancement getSuivi");
        const a = await AsyncStorage.getItem('token');
        try {
            const res = await fetch(`http://192.168.1.59:3000/suivi/get/${manga_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': a
                }
            });
            const suiviPersoInfo = await res.json();

            console.log(suiviPersoInfo);
        } catch (error) {
            console.log('Erreur 1:', error);
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
            //console.log(mangaInfo);
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

    /*useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                await getOneManga(manga_id);
                await getToken();
                if (token !== undefined) {
                    await getSuiviPerso(manga_id);
                }
            };

            fetchData();
        }, [isFocused])
    );*/

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
      }, [isFocused]);

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
