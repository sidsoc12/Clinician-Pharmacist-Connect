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
import _ from 'lodash';

//Ignore this - just used to test certain code.

LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);

console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};

const DatabaseTester = () =>  
{
  const navigation = useNavigation()

   const Try = async () => {
    const fname =  await (await db.collection('users').doc('jackryan@gmail.com').get().then(doc => doc.get('FirstName'
    )))
        navigation.navigate("PharmacistManagePrescriptions", {info: fname})
   }

   const StopPrescriptions = (id) => {
    
     console.log("calling function")
     db.collection('users').doc('Potus@gmail.com').collection('Prescription').get().then(function(querySnapshot) {
       console.log("Next part")
      querySnapshot.forEach(function(doc) 
      {
          console.log("second part")
          console.log(doc.data().DocId + " id: " + id)
          if( doc.data().DocId == id)
          {

            console.log("updating prescription")
            db.collection('users').doc('Potus@gmail.com').collection('Prescription').doc(doc.id).update({TheNumberOfRefills: 0})
          .then(function(){Alert.alert("Prescription Stopped - Number of Refills has been set to 0!")})
           }
        
      }
      );
    } )
  }
  
//   const navigation = useNavigation()
  
//   const changeScreen = () => {
//     navigation.navigate("PharmacistHome")
//   }
  
//   const [prescriptions,setPrescriptions] = useState([])
//   console.log(prescriptions)
// //   prescriptions.push({"Hello": "John"})
//   const email = auth.currentUser?.email;
//   console.log(email)
//   const fname =  (db.collection('users').doc(email).get().then(doc => doc.get('FirstName'
//   )))
//   const lname = (db.collection('users').doc(email).get().then(doc => doc.get('LastName'
//   )))
//   console.log("lastname: " + lname)
//   const p = "Prescriptions issued by " + fname + " " + lname
//   const [visible, setVisible] = useState(false);

//   const toggleOverlay = () => {
//     setVisible(!visible);
//   };
//   // useEffect(() => {
//   //   db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(snap => {
//   //   size = snap.size;
//   //   if(size > 0){
//   //     const query = db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(function(querySnapshot) {
//   //       querySnapshot.forEach(function(doc) {
//   //         prescriptions.push(7)
//   //         console.log("prescriptions: " + prescriptions)
//   //         setPrescriptions([...prescriptions])
//   //       } 
//   //       );
//   //     } )
//   //   }
//   //   else{
//   //    console.log('Doesnt Work')
//   //   }
//   // });}, [])
  
//   useEffect(() => {
//   db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(snap => {
//   size = snap.size;
//   if(size > 0){
//     const query = db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//           const x = doc.data()
//           console.log(x)
//           // doc.data() is never undefined for query doc snapshots
//           console.log("getting documents data")
//           prescriptions.push(x)
//           console.log(prescriptions)
//           setPrescriptions([...prescriptions])
//       }
//       );
//     } )
//   }
//   else{
//    console.log('Doesnt Work')
//   }
// });}, [])

// // const [prescriptions1, setPrescriptions1] = useState([{"ThePatientName" : "Josh"
// //   }, {"ThePatientName" : "Kyle"}])

  
  //       <View style = {styles.container} behavior = "padding">
  //         <Text>{p}</Text>
  //         <Button 
  //               title="Screen"
  //               onPress = {changeScreen}
  //               buttonStyle={{
  //                 backgroundColor: 'black',
  //                 borderWidth: 2,
  //                 borderColor: 'white',
  //                 borderRadius: 30,
  //               }}
  //               containerStyle={{
  //                 width: 200,
  //                 marginHorizontal: 50,
  //                 marginVertical: 20,
  //               }}
  //               titleStyle={{ fontWeight: 'bold' }}
  //             />
  //     {console.log("prescriptions: " + prescriptions)}
  //     {console.log("boolean:" + prescriptions.length)}
  //     {(prescriptions.length > 0) ? prescriptions.map((object) => {
  //       console.log("Object: " + object)
  //       console.log("Patient Name: " + object.ThePatientName)
  //       return(
  //               <View key={object.DocId+"view"}>
  //                 <Pressable
  //                   key={object.DocId+"pressable"}
  //                     style={({pressed}) => [
  //                 {
  //                     backgroundColor: pressed ? 'grey' : 'grey',
  //                   },
  //                     styles.button,
  //                   ]}
  //                   onPress={toggleOverlay}>
  //                   <Text key={object.DocId}>Prescription for {object.ThePatientName}</Text> 
  //                 </Pressable>
  //                 <Overlay key = {object.DocId+"overlay"} isVisible={visible} onBackdropPress={toggleOverlay}>
  //                   <Text style={styles.steelblue}>{object.Filled}</Text>
  //                   <Text>Date of Issue: {object.TheDateOfIssue}</Text>
  //                   <Text>Patient Name: {object.ThePatientName}</Text>
  //                   <Text>Patient Address: {object.ThePatientAddress}</Text>
  //                   <Text>Patient DOB: {object.ThePatientDOB}</Text>
  //                   <Text>Pharmacist Name: {object.ThePharmacistName}</Text>
  //                   <Text>Drug :  {object.TheDrugName}</Text>
  //                   <Text>Quantity Prescribed : {object.TheQuantityPrescribed}</Text>
  //                   <Text>Number Of Refills: {object.TheNumberOfRefills}</Text>
  //                 </Overlay>
  //               </View>
                
  //                   ) 
  //       }) : null } 
    

          

  // {/* <Prescriptiontouchable prescribed = {object}></Prescriptiontouchable>
  //  <View style={styles.container}>
  //    <Pressable
  //     style={({pressed}) => [
  // {
  //     backgroundColor: pressed ? 'red' : 'blue',
  //   },
  //      styles.button,
  //   ]}
  //   onPress={() => Alert.alert('Button Pressed!')}>
  //    <Text style={styles.buttonText}>{object.ThePatientName}</Text>
  //   </Pressable>
  // </View> */}
  
   


        
  //        {/* <Prescriptiontouchable prescribed = {{"ThePatientName": "John"}}></Prescriptiontouchable> */}
  //       {/* {prescriptions.map((object) => {
  //       return (
  //        <Prescriptiontouchable prescribed = {object}></Prescriptiontouchable>
  //       )
  //        })} */}

  //          {/* <Button 
  //               title="PRESS"
  //               onPress = {HandleLogin}
  //               buttonStyle={{
  //                 backgroundColor: 'black',
  //                 borderWidth: 2,
  //                 borderColor: 'white',
  //                 borderRadius: 30,
  //               }}
  //               containerStyle={{
  //                 width: 200,
  //                 marginHorizontal: 50,
  //                 marginVertical: 20,
  //               }}
  //               titleStyle={{ fontWeight: 'bold' }}
  //             /> */}
  //       </View>
  return ( 
    <View style={styles.container}>
      <Image key = "image"
        source={'https://firebasestorage.googleapis.com/v0/b/clinician-pharmacist-connect.appspot.com/o/A553E98E-51EE-4BCA-BD90-E61B3430866E.jpg?alt=media&token=6907a178-59ad-47fd-a5c9-290f241b1f3e'} style={{ width: 130, height: 130, top: 150}}/>
  </View>
  )
}
  
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
      steelblue: {
        color: "darkgreen",
      },
  
  });


  
  export default DatabaseTester;