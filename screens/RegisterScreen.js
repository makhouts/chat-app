import React, { useState } from 'react';
import {  } from 'react-native';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../firebase';

const RegisterScreen = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState();

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: image || 'https://www.seekpng.com/png/full/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png',
            })
        })
        .catch(error => alert(error.message));
    };  

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style='light' />
            <Text h3>Create an account</Text>

            <View style={styles.inputContainer}>
                <Input 
                    autoFocus
                    placeholder='Full Name'
                    type='text'
                    value={name}
                    onChangeText={text => setName(text)} 
                />
                <Input 
                    placeholder='Email'
                    type='email'
                    value={email}
                    onChangeText={text => setEmail(text)} 
                />
                <Input 
                    placeholder='Password'
                    secureTextEntry
                    type='password'
                    value={password}
                    onChangeText={text => setPassword(text)} 
                />
                <Input 
                    placeholder='Profile Picture URL (optional)'
                    type='text'
                    value={image}
                    onChangeText={text => setImage(text)} 
                    onSubmitEditing={register}
                />
            </View>

            <Button
                containerStyle={styles.button}
                onPress={register}
                title='Register'
                raised
             />


        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#fff'
    },

    inputContainer: {
        width: 300
    },

    button: {
        width: 200,
        marginTop: 10
    },
});
