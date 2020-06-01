import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

const MemeContainer = ({template, onClick}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={onClick}>
        <Image
          style={styles.tinyLogo}
          key={template.id}
          source={{uri: template.url}}
          alt={template.name}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  tinyLogo: {
    width: 300,
    height: 300,
    borderWidth: 1,
    borderColor: '#003300',
    // resizeMethod: 'resize',
    // resizeMode: 'contain',
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default MemeContainer;
