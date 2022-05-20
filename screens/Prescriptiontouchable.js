import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Alert, Pressable} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import { db } from '../firebase';

//IGNORE

const Prescriptiontouchable = (props) => {
  presc = props.prescribed;
  nameofpresc = presc.ThePatientName;
  return (
    <View style={styles.container}>
      {console.log(presc)}
      {console.log(nameofpresc)}
      <Pressable
        style={({pressed}) => [
          { 
            backgroundColor: pressed ? 'red' : 'blue',
          },
          styles.button,
        ]}
        onPress={() => Alert.alert('Button Pressed!')}>
        <Text style={styles.buttonText}>{nameofpresc}</Text>
      </Pressable>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    padding: 6,
    height: 50,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
export default Prescriptiontouchable;