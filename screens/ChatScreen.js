import React, { useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, DocumentReference } from 'firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import {useNavigation} from '@react-navigation/core'


//Create collection chat - run through list, see if users are registered - add them to friends list - display list as touchable button - 
//When pharmacist clicks on button - create clinicianname+pharmacistname doc - check if doc does not already exist - create collection with same name - put collection into gifted chat

//USING GIFTED CHAT AS A WORKING CHAT APP (ONE TO ONE INSTEAD OF GLOBAL CHAT APP)
const ChatScreen = ({route}) => {
    const navigation = useNavigation()
    const [messages, setMessages] = useState([]);
    const {fname,lname, collectionname, othername} = route.params;
    //othername is the name of either the other clinician or pharmacist - so the chat shows the name of the person the user is talking to
    const signOutNow = () => {
        auth.signOut().then(() => {
            // Sign-out successful.
            navigation.replace('LoginScreen');
        }).catch((error) => {
            // An error happened.
        });
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Text>Hello</Text>
                    <Avatar
                        rounded
                        source={{
                            uri : 'https://placeimg.com/140/140/any'
                            // uri: 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x'
                            // uri: `https://ui-avatars.com/api/?name=${fname}+${lname}`,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                    onPress={signOutNow}
                >
                    <Text>logout</Text>
                </TouchableOpacity>
            )
        })

        const q = query(collection(db, `chats/${collectionname}/${collectionname}`), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));
        return () => {
          unsubscribe();
        };

    }, [navigation]);

    const onSend = useCallback((messages = []) => {
        const { _id, createdAt, text, user,} = messages[0]
        addDoc(collection(db, `chats/${collectionname}/${collectionname}`), { _id, createdAt,  text, user });
    }, []);

    return (
        <View style={styles.mainbox}>
          <View style = {{alignItems: 'center'}}>
          <Text style = {{fontSize: 19, fontWeight: '300', top: 80}}>Chat with {othername}</Text>
          </View>
          <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: `https://ui-avatars.com/api/?name=${fname}+${lname}`,
            }}
            showUserAvatar 
        />
      </View> 
        
       
    );
}
const styles = StyleSheet.create({
    mainbox:{
      textAlign:'center',
      margin: 0,
      flex: 5,
      justifyContent: 'space-between',
    }
  });

export default ChatScreen;
