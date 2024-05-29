import { StatusBar } from 'expo-status-bar';
import { Platform, TouchableOpacity, ScrollView, Pressable, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Gère le rafraichissement
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

// Composants
import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';
import Btn from '../component/button/bouton';
import FollowCount from '../component/icon/follow-count';

import { useRoute } from '@react-navigation/native';

// Pour check token
import jwtDecode from 'jwt-decode';

// Pour adresse API
import config from '../config';

export default function Accueil() {
    const isFocused = useIsFocused();
    const route = useRoute();
    const { msg } = route.params;
    const nav = useNavigation();

    const [token, setToken] = useState();

    const [listManga, setListManga] = useState([]);

    const checkToken = async () => {
        console.log("Start : checkToken");
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);

        /* Essai avec JWT : non fonctionnel
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token); // Correct usage
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTime) {
                    console.log("Token is expired");
                    await AsyncStorage.removeItem('token');
                    setToken(null);
                } else {
                    setToken(token);
                }
            } else {
                setToken(null);
            }
        } catch (error) {
            console.log('Error retrieving token:', error);
        }*/
    };


    // Récupération : Liste de tous les mangas
    const getAllManga = async () => {
        const res = await fetch(`${config.apiUrl}/manga/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log(data.data);

        setListManga(data.data);
    }

    // Arrange la liste par ordre alphabétique
    const sortedListManga = [...listManga].sort((a, b) => a.titre.localeCompare(b.titre));


    useFocusEffect(
        React.useCallback(() => {
            getAllManga();
            checkToken();
        }, [isFocused])
    );


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
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <TitleTextColor>MANGA MANIA</TitleTextColor>
                <Text style={{ color: 'black' }}>{msg !== undefined ? msg : ""}</Text>
                <ScrollView style={{paddingRight:30, paddingLeft:30}}>
                    {sortedListManga.map((manga, index) => (
                        <Pressable key={`${index}-Pressable`} onPress={() => nav.navigate('DetailsManga', { manga_id: manga.id })}>
                            <View key={`${index}-View`} style={{  flexDirection: 'row', alignItems: 'center', paddingBottom: 10, backgroundColor: 'white', borderRadius: 5 }}>
                                <View style={{ marginRight: 10 }}>
                                    <Text style={styles.listText} key={`${index}-${manga.id}-suivi`}><FollowCount textButton={manga.suivi_count} /></Text>
                                </View>
                                <View>
                                    <Text style={styles.listTitle} key={`${index}-${manga.id}-titre`}>{manga.titre}</Text>
                                    <Text style={styles.listText} key={`${index}-${manga.id}-auteur`}>{manga.auteur}</Text>
                                </View>
                            </View>
                        </Pressable>

                    ))}
                </ScrollView>
                {token && (
                    <View style={styles.viewBtn}>
                        <Btn onPress={() => nav.navigate('AddManga')} textButton={'AJOUTER UN MANGA'} backgroundColor="#ff3131" />
                    </View>
                )}

            </View>
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
        marginTop: 80,

        height: '80%'
    },
    listTitle: {
        fontFamily: "GothamBold",
        fontSize: 16
    },
    listText: {
        fontFamily: "GothamLight",
    },
    logo: {
        resizeMode: 'stretch',
        width: 55,
        height: 60,
    }
});
