import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View, TextInput } from 'react-native';
//import Btn from './component/button/bouton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Btn from '../component/button/bouton';
import { Picker } from '@react-native-picker/picker';

import { useState, useEffect } from 'react';

import { useFonts } from 'expo-font';


import Navbar from '../component/navbar/navbar';
import NavbarOffline from '../component/navbar/navbar-offline';
import TitleTextColor from '../component/title/title';

export default function AddManga() {
    const [titre, setTitre] = useState();
    const [auteur, setAuteur] = useState();
    const [resume, setResume] = useState();
    const [id_categories, setCategorie] = useState();

    const [categories, setCategories] = useState([]); // state to hold categories
    const [selectedCategory, setSelectedCategory] = useState('');

    const [data, setData] = useState();

    const [listManga, setListManga] = useState();

    const [token, setToken] = useState();

    const nav = useNavigation();

    useEffect(() => {
        getToken();
    });

    // On récupère la valeur stockée à tel Nom
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        if (a !== null) {
            setToken(a);
        }
    }

    // Fonction qui fonctionne avec l'import AsyncStorage
    // Permet de stocker des données sur le tel et les réutiliser
    const storeToken = async (value) => {
        // On attend 2 paramètres : Nom et valeur
        await AsyncStorage.setItem('token', value)
        setToken(value)
    }

    const getAllCategories = async () => {
        try {
            const res = await fetch('http://192.168.1.59:3000/manga/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setCategories(data.data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getAllCategories(); // fetch categories when component mounts
    }, []);


    const addManga = async () => {
        try {
            //Constante res qui attend un fetch
            const res = await fetch('http://192.168.1.59:3000/manga/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // stringify correspond à un json.decode en php
                body: JSON.stringify({ titre, auteur, resume, id_categories }),
            });

            const data = await res.json();

            setData(data);
            if (data.erreur !== undefined) {
                console.log(data.erreur);
            } else {
                console.log(data.valid);
                nav.navigate('Accueil', {msg: "Le manga a bien été ajouté !"});
            }
        } catch (error) {
            console.log('Erreur 1:', error);
        }
    };

    return (
        <ImageBackground
            style={{ flex: 1 }}
            resizeMode='cover'
            source={require('../assets/bg.jpg')}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <TitleTextColor style={styles.textTitle}>MANGA MANIA</TitleTextColor>
                        <Text style={styles.textTitle_welcome}>Ajouter un manga</Text>
                        <Text style={{ color: 'black' }}>{data && data.erreur !== undefined ? data.erreur : ""}</Text>
                    </View>
                    <View style={{ width: '90%' }}>
                        <Picker
                            selectedValue={id_categories}
                            onValueChange={(itemValue) => setCategorie(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Sélectionner une catégorie" value="" />
                            {categories.map((category, index) => (
                                <Picker.Item key={index} label={category.nom_categorie} value={category.id} />
                            ))}
                        </Picker>
                        <TextInput
                            placeholder="Titre"
                            style={styles.input}
                            onChangeText={setTitre}
                            value={titre}
                        />
                        <TextInput
                            placeholder="Auteur"
                            style={styles.input}
                            onChangeText={setAuteur}
                            value={auteur}
                        />
                        <TextInput
                            placeholder="Résumé"
                            style={styles.input}
                            onChangeText={setResume}
                            value={resume}
                        />
                        <View style={styles.viewBtn}>
                            <Btn onPress={() => addManga()} textButton={'Ajouter'} backgroundColor="black" />
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
        marginTop: 70,
        marginLeft: 10,
        marginRight: 10,
    },
    logo: {
        resizeMode: 'stretch',
        width: 110,
        height: 120,
    },
    textTitle: {
        color: 'black',
        fontSize: 25,
    },
    textTitle_welcome: {
        color: 'black',
        fontSize: 25,
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
