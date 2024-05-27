import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';

import Accueil from './Accueil';
import Connexion from './Connexion';
import Profil from './Profil';
import AddManga from './AddManga';
import DetailsManga from './DetailsManga';
import DeleteManga from './DeleteManga';




import {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';


export default function App() {


  const [manga_id, setMangaId] = useState();

  const Stack = createStackNavigator();

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Toto'>
        {/* Le nom est différent du composant, on utilise le nom dans le code pour rappeler le composant ailleurs 
        options={{headerShown: false/true(default), headerTitle:"Forcer le titre", */}
        <Stack.Screen options={{headerShown: false, headerTitle:"Accueil"}} name='Accueil' component={Accueil}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"Connexion"}} name='Connexion' component={Connexion}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"Profil"}} name='Profil' component={Profil}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"AddManga"}} name='AddManga' component={AddManga}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"DeleteManga"}} name='DeleteManga' component={DeleteManga} initialParams={{manga_id}}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"DetailsManga"}} name='DetailsManga' component={DetailsManga} initialParams={{manga_id}}/>




      </Stack.Navigator> 
    </NavigationContainer>
    
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
  },
  logoLgx: {
    resizeMode:'stretch',
    width: 110,
    height: 120,
  },
  textInspi: {
    color: 'white',
    fontSize: 50,
  },
  textLgx: {
    color: 'white',
    fontSize: 80,
  },
});
