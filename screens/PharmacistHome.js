import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Pressable, Alert, Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Overlay } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import {db} from '../firebase';
import Prescriptiontouchable from './Prescriptiontouchable';
import { LogBox } from 'react-native';
import {firebase} from '../firebase';
import _ from 'lodash';

const PharmacistHome = ({route}) => 
{
  //Simple home screen for pharmacist
  const [temp, settemp] = useState(["Temporary"])
  const navigation = useNavigation()
  const [firstname, setfname ] = useState();
  const [lastname, setlname] = useState();
  const [fullname, setfullname] = useState("");
  const {item} = route.params;
  const [profilepic,setprofilepic] = useState("");
//Navigates to PharmacistManagePrescriptions
  const HandlePrescription = () => 
  {
    navigation.navigate("PharmacistManagePrescriptions",{info: fullname, email: item})
  }

  useEffect(async() => 
  {
    const theuser =  firebase.auth().currentUser;
    // console.log(theuser.email)
    console.log(theuser.photoURL)
    setprofilepic(theuser.photoURL)
    const fname =  await (await db.collection('users').doc(item).get().then(doc => doc.get('FirstName'
    )))
    const lname = await (await db.collection('users').doc(item).get().then(doc => doc.get('LastName'
    )))
    console.log("lastname: " + lname)
    setfullname(fname + " " + lname)
    setfname(fname);
    setlname(lname);
  }, []
  )
   
  const handlelogout = () => {
    auth.signOut().then(() => {
      navigation.replace("LoginScreen")
    })
    .catch(error => alert(error.message))
  }

  const HandleChat = () => { navigation.navigate("FindUserFriendsPharmacist", {fname: firstname, lname: lastname, email: item});}
    return (
        <View style = {styles.container} behavior = "padding">
          {(fullname.length > 0 && profilepic !== '') ?
          temp.map((object) => {
          return (
          <View key = "View1" style = {{flex: 1, alignItems: 'center'}}> 
            <Image key = "image"
            source={{ uri: profilepic }}
            style={{ width: 130, height: 130, top: 150}}/> 
            <View key = "View2" style = {styles.view2}>
            <Text key = "Text1" style = {styles.text1}>Welcome {fullname}</Text>
            </View>
            <Button key = "Button1"
                  title="Manage Assigned Prescriptions"
                  onPress={HandlePrescription}
                  buttonStyle={{
                    backgroundColor: '#4A4342',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    top: 200,
                    width: 300,
                    marginHorizontal: 65,
                    marginVertical: 10,
                  }}
                  titleStyle={{ fontWeight: '400' }}
            />
            <Button key = "Button2"
                  title="Chat with Clinician"
                  onPress={HandleChat}
                  buttonStyle={{
                    backgroundColor: '#4A4342',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    top: 200,
                    width: 300,
                    marginHorizontal: 65,
                    marginVertical: 30,
                  }}
                  titleStyle={{ fontWeight: '400' }}
            />
            <Button key = "Button3"
                  title="Log out"
                  onPress={handlelogout}
                  buttonStyle={{
                    backgroundColor: '#4A4342',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    top: 200,
                    width: 200,
                    marginHorizontal: 65,
                    marginVertical: 10,
                  }}
                  titleStyle={{ fontWeight: 'bold' }}
            />
          </View>
          )}) : null } 

        </View>
    );
  }

  const styles = StyleSheet.create({
    profile:{
      position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    text1:{
        fontSize: 30,
        fontWeight: '300'
    },
    view2:{
      top: 200,
      alignItems: 'center',
      paddingBottom: 30
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
})
  export default PharmacistHome;