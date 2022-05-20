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

const FindUserFriendsPharmacist = ({route}) => 
{
  //Finds available contacts for pharmacist, by finding which clinicians assigned them prescriptions.
    const navigation = useNavigation()
    const {fname,lname,email} = route.params;
    const [arrayofnames,setarrayofnames] = useState([])
    const [clinicianName, setclinicianName] = useState([])
    const [arrayofemail, setarrayofemail] = useState([]);

    console.log(arrayofnames)
    useEffect(() => 
  {
      //Looking for clinicians in prescriptions  
     var temp = [];
     console.log(temp)
     db.collection('users').doc(email).collection('Prescription').get().then(
      function(querySnapshot) 
      {
        querySnapshot.forEach(function(doc) 
        {
          if(!(temp.includes(doc.data().TheClinicianEmail)))
          {
            const x = doc.data()
            // console.log(x)
            // doc.data() is never undefined for query doc snapshots
            // console.log("getting documents data")
            arrayofnames.push(x)
            // console.log(doc.data().ThePharmacistName)
            //Pushing pharmacist into array of names
            // const x = doc.data().TheClinicianName
            temp.push(doc.data().TheClinicianEmail);
            //   setarrayofnames(oldArray => [...oldArray, x]);
              // const [first, last] = x.split(' ');
              // setarrayofemail(oldArray => [...oldArray, doc.data.TheClinicianEmail])
          }  
        } );
        setarrayofnames([...arrayofnames])
    } 
        )  
}, [])

const FirebaseConnect = (cemail, pemail, name) => {
  const docname = cemail + pemail;
  var variable = true;
  db.collection("chats").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc1) 
    {
      if(doc1.id == docname)
      {
        variable = false;
      }
    }
    );
    if(variable){
  db.collection("chats").doc(docname).set({docid: docname, clinicianemail: cemail, pharmacistemail: pemail})
  db.collection("chats").doc(docname).collection(docname).add({}) }
  } );
  navigation.navigate("ChatScreen", {fname: fname,lname: lname,collectionname: docname, othername: name})
}

return(
    <ScrollView contentContainerStyle = {styles.container} behavior = "padding">
      <Text style = {{fontSize: 18, fontWeight: '300', paddingBottom: 20} }>Clinicians You Can Talk To:</Text>
  {/* {console.log("prescriptions: " + prescriptions)}
  {console.log("boolean:" + prescriptions.length)} */}
  {/* calling in specific index of prescriptions object to link overlay to pressable clicked to fix error of only the first prescription data showing */}
  {(arrayofnames.length > 0) ? arrayofnames.map((object) => 
  {
        // console.log("object")
       //  console.log(object)
        // console.log("Patient Name: " + object.ThePatientName)
        return(
                <View style = {{paddingBottom: 8}} key={object.docId+"view"} flexDirection = {'row'}>
                   {/* Creating Check Mark */}
                  <Pressable
                    key={object.docId+"pressable"}
                      style={({pressed}) => [
                  {
                      backgroundColor: pressed ? '#fbfca7' : '#fbfca7',
                    },
                      styles.button,
                    ]}
                    onPress={() => {FirebaseConnect(object.TheClinicianEmail, object.ThePharmacistEmail, object.TheClinicianName)}}
                    > 
                    <Image key = {object.ClinicianEmail+ "quick"} style = {{height: 50,
                          width: 50, right: 40}} source = {{uri : `https://ui-avatars.com/api/?name=${object.TheClinicianName.split(' ').slice(0, -1).join(' ')}+${object.TheClinicianName.split(' ').slice(-1).join(' ')}`}}/>
                    <Text key = {object.ClinicianEmail + "text2"} style = {{fontWeight: "300", fontSize: 18, right: 14}}>{object.TheClinicianName}</Text>
                    <Text key = {object.ClinicianEmail+ "text3"} style = {{fontSize: 13, fontWeight: "bold", right: 5}}>{object.TheClinicianEmail}</Text> 
                  </Pressable>
                </View>
             );
  } ) : null }
 
  
    </ScrollView>
)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  button: {
    borderRadius: 8,
    padding: 6,
    height: 50,
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row'
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

export default FindUserFriendsPharmacist;