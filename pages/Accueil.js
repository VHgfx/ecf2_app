import { StatusBar } from 'expo-status-bar';
import { Platform, TouchableOpacity, ScrollView, Pressable, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useState, useEffect } from 'react';

import { useFonts } from 'expo-font';

// Gère le rafraichissement
import { useIsFocused } from '@react-navigation/native';


import Navbar from '../component/navbar/navbar';
import TitleTextColor from '../component/title/title';
import Btn from '../component/button/bouton';

import { useRoute } from '@react-navigation/native';


export default function Accueil() {
    const isFocused = useIsFocused();
    const route = useRoute();
    const { msg } = route.params;
    const nav = useNavigation();

    const [listManga, setListManga] = useState([]);

    const getAllManga = async () => {
        const res = await fetch('http://192.168.1.59:3000/manga/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // stringify correspond à un json.decode en php
            //body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        setListManga(data.data);
        console.log(data.data);
    }

    const sortedListManga = [...listManga].sort((a, b) => a.titre.localeCompare(b.titre));


    useEffect(() => {
        if (isFocused) {
          getAllManga();
        }
      }, [isFocused]);


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

                  
                <TitleTextColor>MANGA MANIA</TitleTextColor>
                <ScrollView>
                    {sortedListManga.map((manga, index) => (
                        <Pressable onPress={() => nav.navigate('DetailsManga', { manga_id: manga.id })}>
                            <View key={index} style={{ paddingBottom: 10, backgroundColor: 'white', borderRadius: 5}}>
                            <Text style={styles.listTitle}>{manga.titre}</Text>
                            <Text style={styles.listText}>{manga.auteur}</Text>
                            </View>
                        </Pressable>
                        
                    ))}
                </ScrollView>
                <View style={styles.viewBtn}>
                    <Btn onPress={() => nav.navigate('AddManga')} textButton={'AJOUTER UN MANGA'} backgroundColor="#ff3131"/>
                </View>
             
            </View>
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
        marginTop: 80,

        height:'80%'
    },
    listTitle: {
        fontFamily: "GothamBold",
        fontSize: 16
    }, 
    listText: {
        fontFamily: "GothamLight",
    }
});
