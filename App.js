import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, SafeAreaView, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';

import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Profil from './pages/Profil';
import AddManga from './pages/AddManga';
import DetailsManga from './pages/DetailsManga';
import DeleteManga from './pages/DeleteManga';
import Inscription from './pages/Inscription';




import {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';

import { useFonts } from 'expo-font';

export default function App() {


  const [manga_id, setMangaId] = useState();
  const [msg, setMsg] = useState();

  const Stack = createStackNavigator();

  
  const [loaded] = useFonts({
    "GothamLight": require('./assets/fonts/GothamLight.ttf'),
    "GothamBook": require('./assets/fonts/GothamBook.ttf'),
    "GothamBold": require('./assets/fonts/GothamBold.ttf'),
  });
  if (!loaded) {
      return <Text>Chargement de la font</Text>;
  }


  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Toto'>
        {/* Le nom est différent du composant, on utilise le nom dans le code pour rappeler le composant ailleurs 
        options={{headerShown: false/true(default), headerTitle:"Forcer le titre", */}
        <Stack.Screen options={{headerShown: false, headerTitle:"Accueil"}} name='Accueil' component={Accueil} initialParams={{msg}}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"Connexion"}} name='Connexion' component={Connexion} initialParams={{msg}}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"Profil"}} name='Profil' component={Profil}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"AddManga"}} name='AddManga' component={AddManga}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"DeleteManga"}} name='DeleteManga' component={DeleteManga} initialParams={{manga_id}}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"DetailsManga"}} name='DetailsManga' component={DetailsManga} initialParams={{manga_id}}/>
        <Stack.Screen options={{headerShown: false, headerTitle:"Inscription"}} name='Inscription' component={Inscription}/>



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
