import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Pressable, Alert, Modal, ScrollView, RefreshControl} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Overlay } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import {db} from '../firebase';
import Prescriptiontouchable from './Prescriptiontouchable';
import { LogBox } from 'react-native';
import _ from 'lodash';

//Manage Prescription Screen for Clinician

LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);

console.warn = message => {
if (message.indexOf('Setting a timer') <= -1) {
   _console.warn(message);
   }
};
const ManagePrescriptionsScreen = ({route}) =>  
{
  const quickobject = ["Run"]; //Just made to be use .map() in return statement
  const [checkModal, setcheckModal] = useState(false);
  const [noexistingprescriptionModal, setnoexistingprescriptionModal] = useState(false);
  const [clockModal, setclockModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation()
  const {item1, email} = route.params;
  const AddPrescription = () => {
    navigation.navigate("AddPrescriptionsScreen", {name: item1, Theemail: email})
  }
  //ignore
  const changeScreen = () => {
    navigation.navigate("PharmacistHome")
  }
  const [index,setindex] = useState(0);
  const [prescriptions,setPrescriptions] = useState([]) //contains data of all the prescriptions for a clinician in json format
  const [visible, setvisible] = useState(false)
//   prescriptions.push({"Hello": "John"})
  // const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setvisible(!visible)
  };
  const onRefreshing = () =>{
    setRefreshing(false);
    // navigation.navigate("ClinicianHome", {item: email})
  }
 
  //Puts all of clinician's prescriptions into prescription json array
  
  useEffect(async () => {
    console.log("use effect running again!")
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
          // console.log(x)
          // doc.data() is never undefined for query doc snapshots
          // console.log("getting documents data")
          prescriptions.push(x)
          // console.log(prescriptions)
          // setPrescriptions([...prescriptions])
      }
      );
      setPrescriptions([...prescriptions])
    } )
  }
  else{
   Alert.alert('Add a prescription for prescriptions to show on your page!')
  }
});}, [])

const AlertEvent = () => { Alert.alert("Prescription Stopped - Number of Refills has been set to 0!");
navigation.navigate("ClinicianHome", {item: email})};

const StopPrescriptions = async (id1, pemail) => {
  const query = db.collection('users').doc(email).collection('Prescription').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) 
    {
        if( doc.data().DocId == id1){
          db.collection('users').doc(email).collection('Prescription').doc(doc.id).update({TheNumberOfRefills: 0})
        const query = db.collection('users').doc(pemail).collection('Prescription').get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc1) 
          {
             if( doc1.data().DocId == id1){
              db.collection('users').doc(pemail).collection('Prescription').doc(doc1.id).update({TheNumberOfRefills: 0})
             }
          }
          );
        } )
      }
    }
    );
  } )
AlertEvent();
}

const DeletePrescriptions = async (id1, pemail) => {
  const query = db.collection('users').doc(email).collection('Prescription').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) 
    {
        if( doc.data().DocId == id1){
          db.collection('users').doc(email).collection('Prescription').doc(doc.id).delete()
      }
    }
    );
  } )
  Alert.alert("Prescription Deleted!");
  navigation.navigate("ClinicianHome", {item: email})
}


//finding index of pressable object in the prescriptions array
const findObjectinPrescription = (object) => {
  for (var i = 0; i < prescriptions.length; i++) { if(prescriptions[i].DocId == object){setindex(i)} }
}
// // const [prescriptions1, setPrescriptions1] = useState([{"ThePatientName" : "Josh"
// //   }, {"ThePatientName" : "Kyle"}])

   return(
        <ScrollView contentContainerStyle = {styles.container} behavior = "padding" refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefreshing}/>}>
          <Text style = {{fontSize: 18, fontWeight: '300', paddingBottom: 20} }> Prescriptions Issued By {item1}</Text>
      {/* {console.log("prescriptions: " + prescriptions)}
      {console.log("boolean:" + prescriptions.length)} */}
      {console.log(prescriptions)}
      {console.log("clockModal : " + clockModal)}
      {/* calling in specific index of prescriptions object to link overlay to pressable clicked to fix error of only the first prescription data showing */}
      {checkModal && <Overlay key = {prescriptions[index].DocId+"checkmodal"} onBackdropPress={() => {setcheckModal(!checkModal)}}>
      <Image key = {"overimage1"} style = {{height: 50,
                          width: 50}} source = {require('../assets/check.png')}/>
                    <Text style={styles.t}>A check appears near a prescription that has been marked as "filled". A prescription would be marked as "filled" by the pharmacist assigned the prescription.</Text>
                  </Overlay> }
      {clockModal && <Overlay key = {prescriptions[index].DocId+"checkmodal"} onBackdropPress={() => {setclockModal(!clockModal)}}>
      <Image key = {"clockoverlay2"} style = {{height: 50,
                          width: 50}} source = {require('../assets/clock.jpg')}/>
                    <Text style={styles.t}>A clock appears near a prescription which has been shared with the assigned pharmacist but is not yet filled.</Text>
                  </Overlay> }
      {noexistingprescriptionModal && <Overlay key = {prescriptions[index].DocId+"prescriptionmodal"} onBackdropPress={() =>  { setnoexistingprescriptionModal(!noexistingprescriptionModal)}}>
      <Image key = {"warning2"} style = {{height: 50,
                          width: 50}} source = {require('../assets/warning.jpg')}/>
                    <Text style={styles.t}> A warning image shows near a prescription that has an unregistered pharmacist email. This means that the pharmacist email you inputted in the prescription data does not exist in our database. As such, this prescription will be only be viewed by yourself.</Text>
                  </Overlay> }
      {visible && <Overlay key = {prescriptions[index].DocId+"overlay"} onBackdropPress={toggleOverlay}>
                  {console.log("overlay" + prescriptions[index].ThePatientName)}
                  <Button
                    title= 'Stop Prescription'
                    onPress={() => StopPrescriptions(prescriptions[index].DocId, prescriptions[index].ThePharmacistEmail)}
                    titleStyle={{ fontWeight: '300', color: 'black'}}
                    buttonStyle={{
                      backgroundColor: '#fbfca7',
                      borderColor: 'transparent',
                      borderWidth: 0,
                    }}
                    containerStyle={{
                      width: 200,
                      height: 45,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                  />
                  <Button
                    title= 'Delete Prescription'
                    onPress={() => DeletePrescriptions(prescriptions[index].DocId, prescriptions[index].ThePharmacistEmail)}
                    titleStyle={{ fontWeight: '300', color: 'black'}}
                    buttonStyle={{
                      backgroundColor: '#fbfca7',
                      borderColor: 'transparent',
                      borderWidth: 0,
                    }}
                    containerStyle={{
                      width: 200,
                      height: 45,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                  />
                  <Text style={styles.steelblue}>{prescriptions[index].Filled}</Text>
                    <Text style={styles.t} >Date of Issue: {prescriptions[index].TheDateOfIssue}</Text>
                    <Text style={styles.t}>Patient Name: {prescriptions[index].ThePatientName}</Text>
                    <Text style={styles.t}>Patient Address: {prescriptions[index].ThePatientAddress}</Text>
                    <Text style={styles.t}>Patient DOB: {prescriptions[index].ThePatientDOB}</Text>
                    <Text style={styles.t}>Pharmacist Name: {prescriptions[index].ThePharmacistName}</Text>
                    <Text style={styles.t}>Drug: {prescriptions[index].TheDrugName}</Text>
                    <Text style={styles.t}>Quantity Prescribed: {prescriptions[index].TheQuantityPrescribed}</Text>
                    <Text style={styles.t}>Number Of Refills: {prescriptions[index].TheNumberOfRefills}</Text>
                    <Text style={styles.t}>Days Between Refills: {prescriptions[index].TimeBetween}</Text>
                  </Overlay> }
      {(prescriptions.length > 0) ? prescriptions.map((object) => {
        // console.log("object")
       //  console.log(object)
        // console.log("Patient Name: " + object.ThePatientName)
        return(
                <View style = {{paddingBottom: 8}} key={object.DocId+"view"} flexDirection = {'row'}>
                   {/* Creating Check Mark based on whether prescription is filled or not*/}
                   {(object.Filled != "Not Filled") ? quickobject.map((temp) => {
                        return (
                      <TouchableOpacity key = {object.DocId + "touch"} onPress = {() => { setcheckModal(!checkModal)} }style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                          <Image key = {object.DocId + "quick"} style = {{height: 30,
                          width: 30, right: 30}} source = {require('../assets/check.png')}/>
                      </TouchableOpacity>
                        )
                    }) : null}
   {/* Creating warning image based on whether prescription's pharmacist exists in application or not*/}
                  {(object.ThePharmacistExists == false) ? quickobject.map((temp) => {
                        return (
                      <TouchableOpacity key = {object.DocId + "touch2"} onPress = {() => { setnoexistingprescriptionModal(!noexistingprescriptionModal)} }style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                          <Image key = {object.DocId + "quick2"} style = {{height: 30,
                          width: 30, right: 30}} source = {require('../assets/warning.jpg')}/>
                      </TouchableOpacity>
                        )
                    }) : null}

{/* Creating clock image based on whether prescription's pharmacist exists and prescription is filled*/}
{(object.Filled == "Not Filled" && object.ThePharmacistExists == true) ? quickobject.map((temp) => {
                        return (
                      <TouchableOpacity key = {object.DocId + "clock"} onPress = {() => {setclockModal(!clockModal)} }style={{flexDirection:"row",alignItems:'center',justifyContent:'center'}}>
                          <Image key = {object.DocId + "clock2"} style = {{height: 30,
                          width: 30, right: 30}} source = {require('../assets/clock.jpg')}/>
                      </TouchableOpacity>
                        )
                    }) : null}


                  <Pressable
                    key={object.DocId+"pressable"}
                      style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#fbfca7' : '#fbfca7',
                    },
                      styles.button,
                    ]}
                    onPress={() => {findObjectinPrescription(object.DocId); toggleOverlay()}}
                    >
                    <Text key={object.DocId} style = {{fontWeight: "500"}}>Prescription for {object.ThePatientName}</Text> 
                    <Text key = {object.DocId + "text2"} style = {{fontWeight: "bold"}}>Issued {object.TheDateOfIssue}</Text>
                  </Pressable>
                </View>
                
                    ) 
        }) : null }
        <Button 
                title="Add a prescription"
                onPress = {AddPrescription}
                buttonStyle={{
                  backgroundColor: '#4A4342',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 65,
                  marginVertical: 10,
                }}
                titleStyle={{ fontWeight: 'bold' }}
        /> 
        </ScrollView>
   )}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      borderRadius: 8,
      padding: 6,
      height: 50,
      width: '60%',
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
        left: 105,
    },
    t: {
      fontSize: 13,
      fontWeight: '300', paddingBottom: 10
    }
  });
  
  export default ManagePrescriptionsScreen;

