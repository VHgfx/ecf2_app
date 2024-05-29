import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from "@expo/vector-icons";

import { useFonts } from 'expo-font';

export default function FollowCount({ style, onPress, textButton, disabled, backgroundColor }) {

    const [loaded] = useFonts({
        "GothamRegular": require('../../assets/fonts/GothamMedium.ttf'),
        "GothamBold": require('../../assets/fonts/GothamBold.ttf'),
    });
    if (!loaded) {
        return <Text>Chargement de la font</Text>;
    }

    return (
        <View style={styles.container}>
            <AntDesign name="hearto" size={16} color='red'/>
            <Text style={styles.btn}>{textButton}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,

        height:'80%'
    },
    button: {
        //backgroundColor: "#f93100",
        padding: 16,
        borderRadius: 0,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'GothamBold',
    },
});