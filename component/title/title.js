import React from 'react';
import { Text, StyleSheet } from 'react-native';

const TitleTextColor = ({ children }) => {
  const words = children.split(' ');

  const styledWords = words.map((word, index) => (
    <Text key={index} style={styles.text}>
      <Text style={styles.red}>{word.charAt(0)}</Text>
      {word.substring(1)}{' '}
    </Text>
  ));

  return <Text>{styledWords}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: 'black', 
    fontSize: 25,
  },
  red: {
    color: 'red',
  },
});

export default TitleTextColor;
