import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView , TextInput, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Button, ButtonGroup, withTheme, Input } from 'react-native-elements';
import { auth } from '../firebase';
import {useNavigation} from '@react-navigation/core'
import { db, firebase, store} from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import cuid from 'cuid';
const HomeScreen = ({route}) =>  {

  const navigation = useNavigation();
  //have to pass in original email because Firestore makes emails lowercase 
  const {Theemail, Thepassword} = route.params;
  // Important Info for users
  const [firstName, setFirstName] = useState('') 
  const [lastName, setLastName] = useState('')
  let clinician, pharmacist;
  let Personemail; 
  let x;
  const [pickedImagePath, setPickedImagePath] = useState('');

  //For user profile pic
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.
      launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
      });
    // Explore the result
    // console.log(result);

    if (!result.cancelled) {
     //  const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      setPickedImagePath(result.uri);
  
    // const uploadUri = (pickedImagePath != '') ? pickedImagePath : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
    // fbUriToFirebaseStorage(setPickedImagePath, "Folder", name )
     // const response = await fetch(uploadUri);
      // const blob = await response.blob();
     // const filename = pickedImagePath.substring(pickedImagePath.lastIndexOf('/') + 1);

      // console.log(filename);
      // // console.log("base64 : " + base64)
      //     const theuser = firebase.auth().currentUser;
      //  //  updating to cloud storage
      //    firebase.storage()
      //   .ref(filename).child(filename+'jpg')
      //   .put(blob)
      //   .then((snapshot) => {
      //     //You can check the image is now uploaded in the storage bucket
      //     console.log(`${filename} has been successfully uploaded.`);
      //     firebase.storage().ref(filename).child(filename+'jpg').getDownloadURL().then((url) => {
      //       theuser.updateProfile({
      //         displayName: firstName + lastName,
      //         photoURL: url,
      //       })
      //       console.log(" url" + url)
      //     })
      //     .catch((e) => console.log('getting downloadURL of image error => ', e));
      //   })
      //   .catch((e) => console.log('uploading image error => ', e));
    }
  }
  // const fbUriToFirebaseStorage = async (
  //   imagePickerResult,
  //   storageFolderName,
  //   name,
  //   progressCallback = null,
  //   downloadUrlCallback = null,
  // ) => {
  //   try {
  //     const filename = name;
  //     // From: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
  //     const blob = await new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.onload = function () {
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = function (e) {
  //         console.log(e);
  //         reject(new TypeError('Network request failed'));
  //       };
  //       xhr.responseType = 'blob';
  //       xhr.open('GET', imagePickerResult, true);
  //       xhr.send(null);
  //     });
  
  //     const uploadTask = fbUploadToFirebaseStorage(
  //       blob,
  //       filename,
  //       storageFolderName,
  //     );
  
  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         progressCallback &&
  //           progressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
  //       },
  //       (error) => {
  //         console.error('ERROR uploading image:', error.message);
  //         throw error;
  //       },
  //       () => {
  //         uploadTask.snapshot.ref
  //           .getDownloadURL()
  //           .then((downloadUrl) => {
  //             downloadUrlCallback && downloadUrlCallback(downloadUrl);
  //           })
  //           .catch((error) => {
  //             console.error(`ERROR updating user profile pic: ${error.message}`);
  //           })
  //           .finally(() => {
  //             blob.close(); // release the blob!
  //           });
  //       },
  //     );
  //   } catch (ex) {
  //     console.error('Exception from fbUriToFirebaseStorage(): ', ex.message);
  //   }
  // };
  
//   /**
//    *
//    * @param {Blob} blob - the data of the file being uploaded
//    * @param {string} filename - name to use for file storage
//    * @param {string} storageFolderName - name of folder in Firebase Storage; if null, default's to user's "misc" folder
//    *
//    * @returns an `UploadTask` from Firebase Storage API
//    * @see https://firebase.google.com/docs/reference/js/firebase.storage.Reference#put
//    */
// const fbUploadToFirebaseStorage = (
//     blob,
//     filename,
//     storageFolderName,
//   ) => {
//    // const user = firebase.auth().currentUser;
// //     const storageRef = firebase.storage().ref(myStorage);
//     const user = firebase.auth().currentUser;
//     const storageRef = firebase.storage().ref();
//     if (!storageFolderName) {
//       storageFolderName = `${MiscConstants.STORAGE_FOLDER_USER}/${user.uid}/${MiscConstants.STORAGE_FOLDER_MISC}`;
//     }
//     return storageRef.child(`${storageFolderName}/${filename}`).put(blob);
//   };
//   const filename = pickedImagePath.substring(pickedImagePath.lastIndexOf('/') + 1);

  //     const uploadUri = (pickedImagePath != '') ? pickedImagePath : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
// const fbUriToFirebaseStorage = async (
//     imagePickerResult,
//     storageFolderName,
//     progressCallback = null,
//     downloadUrlCallback = null,
//   ) => {
//     try {
//       const filename =
//         cuid() + '.' + tick8sGetFileExtension(imagePickerResult.uri);
  
//       // From: https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
//       const blob = await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//           resolve(xhr.response);
//         };
//         xhr.onerror = function (e) {
//           console.log(e);
//           reject(new TypeError('Network request failed'));
//         };
//         xhr.responseType = 'blob';
//         xhr.open('GET', imagePickerResult.uri, true);
//         xhr.send(null);
//       });
  
//       const uploadTask = fbUploadToFirebaseStorage(
//         blob,
//         filename,
//         storageFolderName,
//       );
  
//       uploadTask.on(
//         'state_changed',
//         (snapshot) => {
//           progressCallback &&
//             progressCallback(snapshot.bytesTransferred / snapshot.totalBytes);
//         },
//         (error) => {
//           console.error('ERROR uploading image:', error.message);
//           throw error;
//         },
//         () => {
//           uploadTask.snapshot.ref
//             .getDownloadURL()
//             .then((downloadUrl) => {
//               downloadUrlCallback && downloadUrlCallback(downloadUrl);
//             })
//             .catch((error) => {
//               console.error(`ERROR updating user profile pic: ${error.message}`);
//             })
//             .finally(() => {
//               blob.close(); // release the blob!
//             });
//         },
//       );
//     } catch (ex) {
//       console.error('Exception from fbUriToFirebaseStorage(): ', ex.message);
//     }
//   };

//   const fbUploadToFirebaseStorage = (
//     blob,
//     filename,
//     storageFolderName,
//   ) => {
//     const user = firebase.auth().currentUser;
//     const storageRef = firebase.storage().ref(myStorage);
//     if (!storageFolderName) {
//       storageFolderName = `${MiscConstants.STORAGE_FOLDER_USER}/${user.uid}/${MiscConstants.STORAGE_FOLDER_MISC}`;
//     }
//     let childRef = child(storageRef, `${storageFolderName}/${filename}`);
//     return put(childRef, blob);
//   };

  // const uploadAsFile = async (uri, progressCallback) => {

  //   console.log("uploadAsFile : " + uri)
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  
  //   var metadata = {
  //     contentType: 'image/jpeg',
  //   };
  
  //   let name = new Date().getTime() + "-media.jpg"
  //   const ref = firebase
  //     .storage()
  //     .ref()
  //     .child('assets/' + name)
  
  //   const task = ref.put(blob, metadata);
  
  //   return new Promise((resolve, reject) => {
  //     task.on(
  //       'state_changed',
  //       (snapshot) => {
  //         progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)
  
  //         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log('Upload is ' + progress + '% done');
  //       },
  //       (error) => reject(error), /* this is where you would put an error callback! */
  //       () => {
  //         var downloadURL = task.snapshot.downloadURL;
  //         console.log("_uploadAsByteArray ", task.snapshot.downloadURL)
  
  //         // save a reference to the image for listing purposes
  //         var ref = firebase.database().ref('assets');
  //         ref.push({
  //           'URL': downloadURL,
  //           //'thumb': _imageData['thumb'],
  //           'name': name,
  //           //'coords': _imageData['coords'],
  //           'owner': firebase.auth().currentUser && firebase.auth().currentUser.uid,
  //           'when': new Date().getTime()
  //         }).then(r => resolve(r), e => reject(e))
  //       }
  //     );
  //   });
  // }



 // const uploadImage = () => {
//     const filename = pickedImagePath.substring(pickedImagePath.lastIndexOf('/') + 1);
//     const uploadUri = (pickedImagePath != '') ? pickedImagePath : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
//     // console.log("base64 : " + base64)
//     const theuser = firebase.auth().currentUser;
//     // console.log(theuser.email)
//     // fbUriToFirebaseStorage(uploadUri, "Images");
//   //updating to cloud storage
//   //  firebase.storage()
//   // .ref(filename)
//   // .put(uploadUri)
//   // .then((snapshot) => {
//   //   //You can check the image is now uploaded in the storage bucket
//   //   console.log(`${filename} has been successfully uploaded.`);
//   //   firebase.storage().ref(filename).getDownloadURL().then((url) => {
//   //     theuser.updateProfile({
//   //       displayName: firstName + lastName,
//   //       photoURL: url,
//   //     })
//   //     console.log(" url" + url)
//   //   })
//   //   .catch((e) => console.log('getting downloadURL of image error => ', e));
//   // })
//   // .catch((e) => console.log('uploading image error => ', e));
  
// //   const blob: Blob = await new Promise((resolve: Function, reject: Function): void => {
// //     const xhr: XMLHttpRequest = new XMLHttpRequest();
// //     xhr.onload = (): void => {
// //         resolve(xhr.response);
// //     };
// //     xhr.onerror = (): void => {
// //         reject(new TypeError('Network request failed'));
// //     };
// //     xhr.responseType = 'blob';
// //     xhr.open('GET', uri, true);
// //     xhr.send(null);
// // });
// // let base64: string;
// // const reader: FileReader = new FileReader();
// // reader.readAsDataURL(blob);
// // reader.onloadend = (): void => {
// //     const toString: string = reader.result.toString();
// //     base64 = toString.substring(toString.indexOf(',') + 1);
// //     this.sendAttachment(base64, name, size); // api call
// // };

//     //updating user profile with photo url from cloud 
    
  
//     // const task = firebase.storage()
//     //   .ref(filename)
//     //   .putFile(uploadUri);
//     // // set progress state
//     // task.on('state_changed', snapshot => {
//     //   setTransferred(
//     //     Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
//     //   );
//     // });
//     // try {
//     //   await task;
//     // } catch (e) {
//     //   console.error(e);
//     // }
//     Alert.alert(
//       'Photo uploaded!',
//     );
//     setPickedImagePath(null);
 // };



  // Handle Login of Pharmacists 
  const HandlePharmacistLogin = async () => {
    // if(firstName.length || lastName.length === 0){
    //   Alert.alert('First or Last Name not fully entered')
    // }  
    await( auth
    .createUserWithEmailAndPassword(Theemail,Thepassword)
    .then(userCredentials => { 
      const user = userCredentials.user;
    })
    .catch(error => alert(error.message)))
       // await uploadImage();
       pharmacist = true
       clinician = false
       console.log(Theemail)
       console.log(firstName + " " + lastName)
       // Setting user specific id to email for further usage
       //Updating firestore doc with pharmacist info
       x = await (db.collection('users').doc(Theemail).set({
        FirstName: firstName,
        LastName: lastName, 
        Clinician: clinician,
        Pharmacist: pharmacist,
        ProfilePhoto: pickedImagePath,
}))
       
      Alert.alert("Account Created!")
      navigation.navigate("LoginScreen")
  }

  //Handling Clinician Login
  const HandleClinicianLogin = async () => {
    await (auth
    .createUserWithEmailAndPassword(Theemail,Thepassword)
    .then(userCredentials => { 
      const user = userCredentials.user;
    })
    .catch(error => alert(error.message)))
    //  if(firstName.length || lastName.length === 0){
    //    Alert.alert('First or Last Name not fully entered')
    //  }
    // await uploadImage();
    //Updating firestore doc with clinician info
      clinician = true
      pharmacist = false
      console.log(Theemail)
      console.log(firstName + " " + lastName)
      x = await (db.collection('users').doc(Theemail).set({
      FirstName: firstName,
      LastName: lastName, 
      Clinician: clinician,
      Pharmacist: pharmacist,
      ProfilePhoto: pickedImagePath,
    }))
      Alert.alert("Account Created!")
      navigation.navigate("LoginScreen")
  }
  

  //photoURL: uploadUrl ? uploadUrl : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',


    return (
      
        <View style = {styles.container} behavior = "padding">
          <View style = {styles.choose}> 
          <Image source = {require('../assets/profilepic.png')}
           style={{ width: 40, height: 40, justifyContent: 'center'}}/>
          <Button
          title="Upload Profile Picture"
          style={styles.buttonText}
          onPress={showImagePicker}
          />
          <View style={styles.imageContainer}>
        {
          pickedImagePath !== '' && <Image
            source={{ uri: pickedImagePath }}
            style={styles.image}
          />
        }
      </View>
          <Text style = {{fontSize: 15 , fontWeight: '300', marginTop: 30, marginBottom: 20}}>Enter your first and last name</Text>
          <View style = {styles.inputContainer}>
            <Input 
            placeholder="First Name"
            value = {firstName}
            onChangeText={text => setFirstName(text)}
            style = {styles.input}
            />
            <Input 
            style = {styles.input}
            placeholder="Last Name"
            value = {lastName}
            onChangeText={text => setLastName(text)}
            />
        </View>
            <Text style = {{fontSize: 15 , fontWeight: '300', paddingTop: 50}}>Are you a pharmacist or clinician?</Text>
            <Button 
                title="Pharmacist"
                onPress = {HandlePharmacistLogin}
                buttonStyle={{
                  backgroundColor: '#4A4342',
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={{
                  width: 200,
                  marginHorizontal: 50,
                  marginVertical: 40,
                }}
                titleStyle={{ fontWeight: 'bold' }}
              />
        <Button 
                title="Clinician"
                onPress = {HandleClinicianLogin}
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
                titleStyle={{ fontWeight: 'bold' }}
              />
          </View>
        </View>
        
    );
  }

  const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        paddingHorizontal:15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
  
    },
    inputContainer: {
      width: '110%',
      height: '20%'
  },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    choose: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center', 
      marginTop: 40
    },
    imageContainer: {
      padding: 30
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'cover'
    }
})
  export default HomeScreen;