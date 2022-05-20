import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import { db } from '../firebase';

const AddPrescriptionsScreen = ({route}) =>  
{   

  //Screen for adding data about prescriptions
  
   
    const navigation = useNavigation()
    const {name, Theemail} = route.params;
    const [PharmacistEmail, setPharmacistEmail] = useState("")
    const [DateOfIssue, setDateOfIssue] = useState("")
    const [PatientName, setPatientName] = useState("")
    const [PatientAddress, setPatientAddress] = useState("")
    const [PatientDOB, setPatientDOB] = useState("")
    const [ExpirationDateOf, setExpirationDateOf] = useState("")
    const [PharmacistName, setPharmacistName] = useState("")
    const [DrugName, setDrugName] = useState("")
    const [QuantityPrescribed, setQuantityPrescribed] = useState("")
    const [NumberOfRefills, setNumberOfRefills] = useState("")
    const [time, settime] = useState("")
    
    //Add amount of time between prescription refills
    let containPrescriptionInfo = 
    {
        ThePharmacistEmail: PharmacistEmail,
        TheDateOfIssue: DateOfIssue,
        ThePatientName: PatientName,
        ThePatientAddress: PatientAddress,
        ThePatientDOB: PatientDOB,
        TheExpirationDateOf: ExpirationDateOf,
        ThePharmacistName: PharmacistName, 
        TheDrugName: DrugName,
        TheQuantityPrescribed: QuantityPrescribed,
        TheNumberOfRefills: NumberOfRefills,
    }



    //Adding PrescriptionInfo to firebase subcollection
    //Adding random doc id as a field so multiple views in manageprescriptionscreen can be generated with the random id as their key
    //No view will have the same id and no doc will have the same id - easy to distinguish between prescriptions for the same patient
    
    const makeid = (length) =>  {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    //Adding Prescription Information to Firestore

    const AddPrescriptionInfo = async () => {
      const temp = makeid(17);
      console.log("Adding")
      await db.collection('users').doc(Theemail).collection('Prescription').add({
            TheClinicianName: name,
            TheClinicianEmail: Theemail,
            ThePharmacistEmail: PharmacistEmail,
            TheDateOfIssue: DateOfIssue,
            ThePatientName: PatientName,
            ThePatientAddress: PatientAddress,
            ThePatientDOB: PatientDOB,
            TheExpirationDateOf: ExpirationDateOf,
            ThePharmacistName: PharmacistName, 
            TheDrugName: DrugName,
            TheQuantityPrescribed: QuantityPrescribed,
            TheNumberOfRefills: NumberOfRefills,
            TimeBetween: time,
            Filled: "Not Filled",
            DocId: temp, 
            ThePharmacistExists: false,
            Type: "Clinician",
            // TheArrayofNames: [],
        })
      console.log("Finished setting long id")

      //Updating List of Pharmacist field for every Clinician
      // const arrayofClinicians = db.collection('users').doc(Theemail).data().ListOfPharmacists.push(PharmacistEmail);
      // db.collection('users').doc(Theemail).update({ListofPharmacists: arrayofClinicians})

    //Check whether pharmacist email exists -- then add prescription to pharmacist's prescription collection

    //Need to Check whether pharmacist email lowercase or uppercase

    //Create alert or if pharmacist does not exist in database
    
     db.collection("users").get().then(function(querySnapshot) 
     {
          
            querySnapshot.forEach(function(doc) 
            {
               
                if(doc.id == PharmacistEmail && (doc.data().Pharmacist == true))
                {
                  //Updating List of Clinicians field for every Pharmacist
                  // const arrayofClinicians = db.collection('users').doc(PharmacistEmail).data().ListOfClinicians.push(Theemail);
                  // db.collection('users').doc(Theemail).update({ListofClinicians: arrayofClinicians})

                  //Changing field of whether pharmacist exists to true;
                  db.collection('users').doc(Theemail).update({})
                  const query = db.collection('users').doc(Theemail).collection('Prescription').get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) 
                    {
                        if( doc.data().DocId == temp){
                          db.collection('users').doc(Theemail).collection('Prescription').doc(doc.id).update({ThePharmacistExists: true})
                        }
                      }) } ) 
                  Alert.alert("Pharmacist Exists in our database!")
                  db.collection('users').doc(PharmacistEmail).collection('Prescription').add({
                        TheClinicianName: name,
                        TheClinicianEmail: Theemail,
                        ThePharmacistEmail: PharmacistEmail,
                        TheDateOfIssue: DateOfIssue,
                        ThePatientName: PatientName,
                        ThePatientAddress: PatientAddress,
                        ThePatientDOB: PatientDOB,
                        TheExpirationDateOf: ExpirationDateOf,
                        ThePharmacistName: PharmacistName, 
                        TheDrugName: DrugName,
                        TheQuantityPrescribed: QuantityPrescribed,
                        TheNumberOfRefills: NumberOfRefills,
                        TimeBetween: time,
                        Filled: "Not Filled",
                        DocId: temp,
                        ThePharmacistExists: true,
                        Type: "Pharmacist"
                        })
                } 
            }
            );
     }
        ); 
      }



    const navigateToPrescriptionScreen = () => {
        //Checking to see if user inputted all necessary info
           if (!PharmacistEmail.trim()) {
            alert('Please Enter Pharmacist Name');
            return;
          }
          if (!name.trim()) {
            alert('Please Enter Clinician Name');
            return;
          }
          if (!DateOfIssue.trim()) {
            alert('Please Enter Date of Issue');
            return;
          }
          if (!PatientName.trim()) {
            alert('Please Enter Patient Name');
            return;
          }
          if (!PatientAddress.trim()) {
            alert('Please Enter Patient Address');
            return;
          }if (!PatientDOB.trim()) {
            alert('Please Enter Patient Date of Birth');
            return;
          }
          if (!ExpirationDateOf.trim()) {
            alert('Please Enter Prescription Expiration Date');
            return;
          }
          if (!PharmacistName.trim()) {
            alert('Please Enter Pharmacist Name');
            return;
          }
          if (!DrugName.trim()) {
            alert('Please Enter Drug Name');
            return;
          }
          if (!QuantityPrescribed.trim()) {
            alert('Please Enter Quantity Prescribed');
            return;
          }
          if (!NumberOfRefills.trim()) {
            alert('Please Enter Number of Refills');
            return;
          }
          if (!time.trim()) {
            alert('Please Enter Amount of Days Between Refills');
            return;
          }
            AddPrescriptionInfo()
            console.log(containPrescriptionInfo)
            navigation.navigate("ClinicianHome", {item: Theemail})
            
    }




    return (
      <KeyboardAwareScrollView style = {{backgroundColor: 'white'} }>
      <View style={styles.inner}>
        <View style={styles.btnContainer}>
            <TextInput 
            placeholder="Enter Pharmacist Email"
            // value = {email}
            onChangeText={(text) => {let p = text.trim(); setPharmacistEmail(p)}}
            style = {styles.input1}
            autoCapitalize='none'
            />
        
            <TextInput 
            placeholder="Enter Patient Name"
            //value = {email}
            onChangeText={text => setPatientName(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
             <TextInput 
            placeholder="Enter Date of Issue"
            //value = {email}
            onChangeText={text => setDateOfIssue(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
     
            <TextInput 
            placeholder="Enter Patient Address"
            //value = {email}
            onChangeText={text => setPatientAddress(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
   
      
            <TextInput 
            placeholder="Enter Patient Date of Birth (ex: 2/13/21)"
            //value = {email}
            onChangeText={text => setPatientDOB(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
        
            <TextInput 
            placeholder="Enter Expiration Date of Prescription"
            //value = {email}
            onChangeText={text => setExpirationDateOf(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
       
            <TextInput 
            placeholder="Enter Pharmacist Name"
            //value = {email}
            onChangeText={text => setPharmacistName(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
       
            <TextInput 
            placeholder="Enter Drug Name"
            //value = {email}
            onChangeText={text => setDrugName(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
      
            <TextInput 
            placeholder="Enter Quantity Prescribed"
            //value = {email}
            onChangeText={text => setQuantityPrescribed(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
       
            <TextInput 
            placeholder="Enter Number of Refills"
            //value = {email}
            onChangeText={text => setNumberOfRefills(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
       
            <TextInput 
            placeholder="Enter Amount of Days Between Refills"
            //value = {email}
            onChangeText={text => settime(text)}
            style = {styles.input}
            autoCapitalize='none'
            />
          <Button 
                title="Save"
                onPress = {navigateToPrescriptionScreen}
                buttonStyle={{
                    backgroundColor: '#4A4342',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={{
                    left: 5,
                    width: 200,
                    marginHorizontal: 65,
                    marginVertical: 0,
                  }}
                titleStyle={{ fontWeight: 'bold' }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
//     <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: 'gray'}} behavior="padding" enabled  keyboardVerticalOffset={20} enableOnAndroid>
//     <View style = {{top: 150,left: 40}}>
   
       
//           </View>
// </KeyboardAwareScrollView>

        // <KeyboardAvoidingView style = {styles.container} behavior = "padding">
        // <ScrollView contentContainerStyle={styles.scrollView}>
            
        //   </ScrollView>
        // </KeyboardAvoidingView>
        
    );
  }



  const styles = StyleSheet.create({
//       scrollView: {
//     backgroundColor: 'gray',
//     marginHorizontal: 20,
//   },
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
input1: {
  marginTop: 30,
  height: 40,
  borderColor: '#000000',
  borderBottomWidth: 1,
  marginBottom: 25,
},
    inputContainer: {
        width: '80%',
    },
//     input: {
//     backgroundColor: 'white',
//     paddingHorizontal:15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
// },
container: {
  flex: 1,
},
inner: {
  padding: 24,
  flex: 1,
  justifyContent: 'space-around',
},
header: {
  fontSize: 36,
  marginBottom: 48,
  alignItems: 'center',
},
input: {
  height: 40,
  borderColor: '#000000',
  borderBottomWidth: 1,
  marginBottom: 25,
},
btnContainer: {
  backgroundColor: 'white',
  marginTop: 12,
},
   
})
  export default AddPrescriptionsScreen;