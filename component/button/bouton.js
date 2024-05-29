import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { useFonts } from 'expo-font';

export default function Btn({ style, onPress, textButton, disabled, backgroundColor }) {

    const [loaded] = useFonts({
        "GothamRegular": require('../../assets/fonts/GothamMedium.ttf'),
        "GothamBold": require('../../assets/fonts/GothamBold.ttf'),
    });
    if (!loaded) {
        return <Text>Chargement de la font</Text>;
    }

    return (
        <TouchableOpacity 
            style={[styles.button, style, { backgroundColor }]}
            onPress={onPress}>
            <Text style={[styles.text]}>{textButton}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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