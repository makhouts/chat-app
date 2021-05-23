import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';

const LoginScreen = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if (authUser) {
                props.navigation.replace('Home');
            }
        })

        return unsubscribe;
    }, [])

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch(error => alert(error));
    }

    return (
        <KeyboardAvoidingView style={styles.container} >
            <StatusBar style='light' />
            <Image
             source={
                require('../assets/logo.png')
            }
            style={{ width: 150, height: 150, marginBottom: 50 }} />
        
        <View style={styles.inputContainer}>
            <Input 
                placeholder='email' 
                autoFocus type='email' 
                value={email} 
                onChangeText={(text) => setEmail(text) } 
            />
            <Input 
                placeholder='password' 
                secureTextEntry 
                type='password'
                value={password}
                onChangeText={text => setPassword(text)}
                onSubmitEditing={signIn}
            />
        </View>

        <Button containerStyle={styles.button} onPress={signIn} title='Login' />
        <Button onPress={() => props.navigation.navigate('Register')} containerStyle={styles.button} type='outline' title='Register' />        

        </KeyboardAvoidingView>
        
    )
}

export default LoginScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },

    inputContainer: {
        width: 300,

    },

    button: {
        width: 200,
        marginTop: 10
    },

    logo: {
        marginBottom: 500
    }
});
