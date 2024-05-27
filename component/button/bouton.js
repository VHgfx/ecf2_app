import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';


export default function Btn({ style, onPress, textButton, disabled, backgroundColor }) {

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
        fontWeight: 'bold',
    },
});