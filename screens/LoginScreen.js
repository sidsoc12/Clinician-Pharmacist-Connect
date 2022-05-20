import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Input} from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import { db } from '../firebase';
const LoginScreen = ({route}) =>  {
  const navigation = useNavigation()
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('') 
  // useEffect(() => {
  //   Navigateto()
  // }, [])
  // const Navigateto = () => {
  //   const {currentUser} = firebase.auth()
  //   setTimeout(() => {
  //     if(currentUser != null){
  //       navigation.navigate("PharmacistHome")
  //     }
  //   }, 1000)
  // }

//   useEffect(() => {
//   const unsuscribe = auth.onAuthStateChanged(user => {
//  if(user){
//    HandleScreen()
//   }
//    })
//   return unsuscribe
//   }, [])
  const HandleScreen = async () =>
  {
    console.log(email)
         const user = await (await db.collection('users').doc(email).get().then(doc => doc.get('Clinician'
    )))
    console.log(user)
    
    if(user == false)
    {
      console.log("Navigating to Pharmacist")
      navigation.navigate("PharmacistHome", {item: email})
    }
    else if( user == undefined){
      Alert.alert("Please reenter credentials correctly")
      navigation.navigate("LoginScreen")
    }
    else{
      console.log("Navigating to Clinician")
      navigation.navigate("ClinicianHome", {item: email})
    }
  }
  const handleSignUp = () => {
    if(password.length < 6){
      Alert.alert("Password has to be more than 6 characters!")
      return; 
    }
    // auth
    //   .createUserWithEmailAndPassword(email,password)
    //   .then(userCredentials => { 
    //     const user = userCredentials.user; })
        navigation.navigate("HomeScreen", {Theemail: email, Thepassword: password})
      // .catch(error => alert(error.message))
  }
  const HandleLogin = () => 
  {
    auth
      .signInWithEmailAndPassword(email,password)
      .then(userCredentials => { 
        const user = userCredentials.user;
        HandleScreen()
      })
      .catch(error => alert(error.message))
  }
  // const HandlePrescription = () => 
  // {
  //   navigation.navigate("ManagePrescriptionsScreen",{input: "filler"})
  // }
    return ( 
      <KeyboardAvoidingView style = {styles.container} behavior = "padding">
        <Image source = {require('../assets/THALogo.png')}/>
        <Text style = {{fontSize: 18, fontWeight: '300', paddingBottom: 20}}>Please Login or Register</Text> 
        <View style = {styles.inputContainer}>
            <Input 
            placeholder="Email"
            value = {email}
            onChangeText={(text) => { let emailwithoutspaces = text.trim(); setEmail(emailwithoutspaces) }}
            style = {styles.input}
            autoCapitalize='none'
            />
            <Input 
            style = {styles.input}
            placeholder="Password"
            value = {password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            autoCapitalize='none'
            />
        </View>
        <View styles = {styles.buttonContainer}>
        <Button 
                title="LOG IN"
                onPress = {HandleLogin}
                buttonStyle={{
                  backgroundColor: '#4A4342',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 20,
                }}
                titleStyle={{ fontWeight: '500' }}
              />
        <Button 
                title="Register"
                onPress={handleSignUp}
                buttonStyle={{
                  backgroundColor: '#4A4342',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
                titleStyle={{ fontWeight: '500' }}
              />
              {
              /* <Button 
                title="TestPresc"
                onPress={HandlePrescription}
                buttonStyle={{
                  backgroundColor: 'black',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 10,
                }}
                titleStyle={{ fontWeight: 'bold' }}
              /> */}

        </View>
      </KeyboardAvoidingView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
    backgroundColor: 'white',
    paddingHorizontal:15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
},
buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 40
},
image: {
  height: 140
},

})
  export default LoginScreen;