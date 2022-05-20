import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Pressable, Alert, Modal, ScrollView, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Overlay } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import {db} from '../firebase';
import {firebase} from '../firebase';
import Prescriptiontouchable from './Prescriptiontouchable';
import { LogBox } from 'react-native';
import _ from 'lodash';


LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);

console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};

const PharmacistManagePrescriptions = ({route}) =>  

{
  const [refreshing, setRefreshing] = useState(false);
  const [index,setindex] = useState(0);
  const {info, email} = route.params;
  console.log("incoming item: " + info)
  const navigation = useNavigation()
 var quickobject = ["filler"];
  
  const [prescriptions,setPrescriptions] = useState([])
  console.log(prescriptions)
//   prescriptions.push({"Hello": "John"})
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  // useEffect(() => {
  //   db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(snap => {
  //   size = snap.size;
  //   if(size > 0){
  //     const query = db.collection('users').doc('register@gmail.com').collection('Prescription').get().then(function(querySnapshot) {
  //       querySnapshot.forEach(function(doc) {
  //         prescriptions.push(7)
  //         console.log("prescriptions: " + prescriptions)
  //         setPrescriptions([...prescriptions])
  //       }
  //       );
  //     } )
  //   }
  //   else{
  //    console.log('Doesnt Work')
  //   }
  // });}, [])
  
  useEffect(async () => {
    const fname =  await (await db.collection('users').doc(email).get().then(doc => doc.get('FirstName'
    )))
    const lname = await (await db.collection('users').doc(email).get().then(doc => doc.get('LastName'
    )))
    console.log("lastname: " + lname)
    const p = "Prescriptions issued by " + fname + " " + lname
  db.collection('users').doc(email).collection('Prescription').get().then(snap => {
  let size = snap.size;
  if(size > 0){
    const query = db.collection('users').doc(email).collection('Prescription').get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) 
      {
          const x = doc.data()
          console.log(x)
          // doc.data() is never undefined for query doc snapshots
          console.log("getting documents data")
          prescriptions.push(x)
          console.log(prescriptions)
      }
      
      ); setPrescriptions([...prescriptions])
    } )
  }
  else{
   Alert.alert('Add a prescription for prescriptions to show on your page!')
  }
});}, [])

const onRefresh = () =>{
  setRefreshing(false);
  // navigation.navigate("PharmacistHome", {item: email})
}

const IssuePrescription = async (id, cemail) => {
  const query = db.collection('users').doc(email).collection('Prescription').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) 
    {
        if( doc.data().DocId == id){
          db.collection('users').doc(email).collection('Prescription').doc(doc.id).update({Filled: "Filled"})
        const query = db.collection('users').doc(cemail).collection('Prescription').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc1) 
          {
             if( doc1.data().DocId == id)
             {
              db.collection('users').doc(cemail).collection('Prescription').doc(doc1.id).update({Filled: "Filled"})
             }
          }
          );
        } )
      }
    }
    );
  } )
  Alert.alert("Prescription Filled!")
  navigation.navigate("PharmacistHome", {item: email})
}
const findObjectinPrescription = (object) => {
  for (var i = 0; i < prescriptions.length; i++) { if(prescriptions[i].DocId == object){setindex(i)} }
}

// Need functionality to remove prescriptions that were not really issued by a clinician


// // const [prescriptions1, setPrescriptions1] = useState([{"ThePatientName" : "Josh"
// //   }, {"ThePatientName" : "Kyle"}])

   return(
        <ScrollView contentContainerStyle = {styles.container} refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh}/>}>
          <Text style = {styles.text}>Prescriptions assigned to {info}</Text>
          { visible &&  <Overlay key = {prescriptions[index].DocId+"overlay"} isVisible={visible} onBackdropPress={toggleOverlay}>
                  <Button
                    title="Mark Prescription as Filled"
                    onPress = {() => IssuePrescription(prescriptions[index].DocId, prescriptions[index].TheClinicianEmail)}
                    titleStyle={{ fontWeight: '500' }}
                    buttonStyle={{
                      backgroundColor: 'rgba(199, 43, 98, 1)',
                      borderColor: 'transparent',
                      borderWidth: 0,
                    }}
                    containerStyle={{
                      width: 250,
                      height: 45,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                  />
                
                    <Text style={styles.steelblue}>{prescriptions[index].Filled}</Text>
                    <Text style={styles.t}>Date of Issue: {prescriptions[index].TheDateOfIssue}</Text>
                    <Text style={styles.t}>Patient Name: {prescriptions[index].ThePatientName}</Text>
                    <Text style={styles.t}>Patient Address: {prescriptions[index].ThePatientAddress}</Text>
                    <Text style={styles.t}>Patient DOB: {prescriptions[index].ThePatientDOB}</Text>
                    <Text style={styles.t}>Pharmacist Name: {prescriptions[index].ThePharmacistName}</Text>
                    <Text style={styles.t}>Clinician Name: {prescriptions[index].TheClinicianName}</Text>
                    <Text style={styles.t}>Clinician Email: {prescriptions[index].TheClinicianEmail}</Text>
                    <Text style={styles.t}>Drug: {prescriptions[index].TheDrugName}</Text>
                    <Text style={styles.t}>Quantity Prescribed: {prescriptions[index].TheQuantityPrescribed}</Text>
                    <Text style={styles.t}>Number Of Refills: {prescriptions[index].TheNumberOfRefills}</Text>
                    <Text style={styles.t}>Days Between Refills: {prescriptions[index].TimeBetween}</Text>
                  </Overlay> }
      {console.log("prescriptions: " + prescriptions)}
      {console.log("boolean:" + prescriptions.length)}
      {(prescriptions.length > 0) ? prescriptions.map((object) => {
        console.log("Object: " + object)
        console.log("Patient Name: " + object.ThePatientName)
        return(

                <View style = {{paddingBottom: 8}} key={object.DocId+"view"} flexDirection = {'row'} >
                  {/* Creating Check Mark */}
                   {(object.Filled != "Not Filled") ? quickobject.map((temp) => {
                        return (<Image key = {object.DocId + "quick"} style = {{height: 25,
                          width: 25}} source = {require('../assets/check.png')}/>)
                    }) : null}
                  <Pressable
                    key={object.DocId+"pressable"}
                      style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#fbfca7' : '#fbfca7',
                      paddingBottom: 10,
                    },
                      styles.button,
                    ]}
                    onPress={() => {findObjectinPrescription(object.DocId); 
                    toggleOverlay()}}>
                    <Text key={object.DocId} style = {{fontWeight: "500"}}> Prescription for {object.ThePatientName}</Text> 
                    <Text key = {object.DocId + "text2"} style = {{fontWeight: "bold"}}>Issued {object.TheDateOfIssue}</Text>
                  </Pressable>
                </View>
                
                    ) 
        }) : 
        <View style = {styles.empty}>
        <Text style = {styles.text1}>No prescriptions have been assigned to you yet!</Text>
        </View> 
        }
        </ScrollView>
   )}
  
  const styles = StyleSheet.create({
    text:{
      fontWeight: '300',
      fontSize: 20,
      paddingBottom: 20,
    },
    text1:{
      fontWeight: 'bold',
      fontSize: 15,
      color: 'black',
    },
    empty: {
      paddingTop: 50
    },
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
      color: "steelblue",
      fontSize: 18, 
      paddingBottom: 10,
      left: 150,
      },
    t: {
        fontSize: 13,
        fontWeight: '300', paddingBottom: 10
      }
  
  });
  
  export default PharmacistManagePrescriptions; 