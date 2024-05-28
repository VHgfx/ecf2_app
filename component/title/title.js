import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { useFonts } from 'expo-font';

const TitleTextColor = ({ children }) => {
  const words = children.split(' ');

  const styledWords = words.map((word, index) => (
    <Text key={index} style={styles.text}>
      <Text style={styles.red}>{word.charAt(0)}</Text>
      {word.substring(1)}{' '}
    </Text>
  ));

  const [loaded] = useFonts({
    "GothamBold": require('../../assets/fonts/GothamBold.ttf'),
  });
  if (!loaded) {
    return <Text>Chargement de la font</Text>;
  }

  return <Text>{styledWords}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: 'black', 
    fontSize: 25,
    fontFamily: "GothamBold"
  },
  red: {
    color: 'red',
  },
});

export default TitleTextColor;
