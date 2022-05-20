import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PharmacistHome from './screens/PharmacistHome';
import ClinicianHome from './screens/ClinicianHome';
import DatabaseTester from './screens/DatabaseTester';
import ManagePrescriptionsScreen from './screens/ManagePrescriptionsScreen';
import AddPrescriptionsScreen from './screens/AddPrescriptionsScreen';
import PharmacistManagePrescriptions from './screens/PharmacistManagePrescriptions'
import ChatScreen from './screens/ChatScreen'
import FindUserFriendsClinician from './screens/FindUserFriendsClinician'
import FindUserFriendsPharmacist from './screens/FindUserFriendsPharmacist'
const Stack = createNativeStackNavigator();



export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator> 
        <Stack.Screen options = {{headerShown: false}} name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="ChatScreen" component={ChatScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="DatabaseTester" component={DatabaseTester}/>
        <Stack.Screen options = {{headerShown: false}} name="PharmacistHome" component={PharmacistHome}/>
        <Stack.Screen options = {{headerShown: false}} name="ManagePrescriptionsScreen" component={ManagePrescriptionsScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="ClinicianHome" component={ClinicianHome}/>
        <Stack.Screen options = {{headerShown: false}} name="FindUserFriendsClinician" component={FindUserFriendsClinician}/>
        <Stack.Screen options = {{headerShown: false}} name="FindUserFriendsPharmacist" component={FindUserFriendsPharmacist}/>
        <Stack.Screen options = {{headerShown: false}} name="AddPrescriptionsScreen" component={AddPrescriptionsScreen}/>
        <Stack.Screen options = {{headerShown: false}} name="PharmacistManagePrescriptions" component={PharmacistManagePrescriptions}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
