import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Pressable, Alert, Modal, ScrollView, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Overlay } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import {db, firebase} from '../firebase';
import Prescriptiontouchable from './Prescriptiontouchable';
import { LogBox } from 'react-native';
import _ from 'lodash';

const ClinicianHome = ({route}) => 
{
    
  const navigation = useNavigation()
  const {item} = route.params; 
  //Navigate to Prescription Management Screen, passing in fullname and email of user
  const HandlePrescription = () => 
  {
    navigation.navigate("ManagePrescriptionsScreen",{item1: fullname, email: item})
  }
  const [fullname, setfullname] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [temp, settemp] = useState(["Temporary"]); //temporary array to run .map() in return statement
  const [Profilepic,setProfilepic] = useState('');
  useEffect( async() => 
  {
    const fname =  await (await db.collection('users').doc(item).get().then(doc => doc.get('FirstName'
    )))
    const lname = await (await db.collection('users').doc(item).get().then(doc => doc.get('LastName'
    )))
    const  pic = await (await db.collection('users').doc(item).get().then(doc => doc.get('ProfilePhoto'
    )))
    console.log("name: " + fname + " " +  lname)
    setfullname(fname + " " + lname)
    setfirstname(fname);
    setlastname(lname);
    setProfilepic(pic);
  }, []
  )
  //Logout
  const handlelogout = () => {
    auth.signOut().then(() => {
      navigation.replace("LoginScreen")
    })
    .catch(error => alert(error.message))
  }

  //Navigate to Chat
 const HandleChat = () => {navigation.navigate("FindUserFriendsClinician", {fname: firstname, lname: lastname, email: item});}

  return (
    <View style = {styles.container} behavior = "padding">
      {console.log()}
      {(fullname.length > 0 && Profilepic !== '') ?
      temp.map((object) => {
      return (
      <View key = "view1" style = {{flex: 1, alignItems: 'center'}}> 
        <Image key = "image"
        source={{ uri: Profilepic }}
        style={{ width: 130, height: 130, top: 150}}/> 
        <View key = "View2" style = {styles.view2}>
        <Text key = "Text1" style = {styles.text1}>Welcome {fullname}</Text>
        </View>
        <Button key = "Button1"
              title="Manage Prescriptions"
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
              title="Chat with Pharmacist"
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
    // return (
    //     <KeyboardAvoidingView style = {styles.container} behavior = "padding">
    //      {(fullname.length > 0 && profilepic !== '') ? 
    //       temp.map((object) => {
    //       return (
    //       <View key = "View">
    //       <Text key = "Text1"> Welcome Clinician {fullname}</Text>
    //      <Image key = "image"
    //         source={{ uri: profilepic }}
    //         style={styles.image}
    //       />
    //       <Button  key = "Button2"
    //             title="Manage Prescriptions for Pharmacists"
    //             onPress={HandlePrescription}
    //             buttonStyle={{
    //               backgroundColor: 'black',
    //               borderWidth: 2,
    //               borderColor: 'white',
    //               borderRadius: 30,
    //             }}
    //             containerStyle={{
    //               width: 200,
    //               marginHorizontal: 50,
    //               marginVertical: 10,
    //             }}
    //             titleStyle={{ fontWeight: 'bold' }}
    //       />
    //        <Button key = "Button3"
    //             title="Chat with Pharmacist"
    //            //  onPress={HandlePrescription}
    //             buttonStyle={{
    //               backgroundColor: 'black',
    //               borderWidth: 2,
    //               borderColor: 'white',
    //               borderRadius: 30,
    //             }}
    //             containerStyle={{
    //               width: 200,
    //               marginHorizontal: 50,
    //               marginVertical: 10,
    //             }}
    //             titleStyle={{ fontWeight: 'bold' }}
    //       />
    //       <Button key = "Button4"
    //             title="Log out"
    //             // onPress={HandlePrescription}
    //             buttonStyle={{
    //               backgroundColor: 'black',
    //               borderWidth: 2,
    //               borderColor: 'white',
    //               borderRadius: 30,
    //             }}
    //             containerStyle={{
    //               width: 200,
    //               marginHorizontal: 50,
    //               marginVertical: 10,
    //             }}
    //             titleStyle={{ fontWeight: 'bold' }}
    //       />
    //       </View>
    //       )}) : null } 

    //     </KeyboardAvoidingView>
    //     </ScrollView>
    // );
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    
})
  export default ClinicianHome;