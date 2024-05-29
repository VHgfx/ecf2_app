import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Navbar(){

    const nav = useNavigation();

    const eraseToken = async() => {
        await AsyncStorage.removeItem('token');
        nav.navigate('Accueil');
    }

    return(
        <>
        <LinearGradient
            start={{ x: 0, y: 0.75 }} end={{ x: 1, y: 0.25 }}
            colors={['black', 'black']}
            //</>style={{ borderTopLeftRadius: 40, borderTopRightRadius: 30 }}
        >
                <View style={styles.nav}>
                    <TouchableOpacity style={styles.touchable} onPress={() => nav.navigate('Accueil')}>
                        <AntDesign name="home" size={24} color='white'/>
                        <Text style={styles.btn}>Accueil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}>
                        <FontAwesome5 name="user" size={24} color='white' onPress={() => nav.navigate('Profil')}/>
                        <Text style={styles.btn}>Mon profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}  onPress={() => nav.navigate('Logout')}>
                        <AntDesign name="logout" size={24} color='white'/>
                        <Text style={styles.btn}>Déconnexion</Text>
                    </TouchableOpacity>
                    
                </View>
      </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    nav:{
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'flex-end',
        height:50,
    },
    btn:{
        color:'white',
        fontSize:11
    }, 
    touchable:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      }
  });
  