import React, {useLayoutEffect, useState} from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as firebase from "firebase";
import { db, auth } from '../firebase';

const ChatScreen = (props) => {

    const [input, setInput] = useState();
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Chat',
            headerTitleAlign: 'left',
            headerBackTitle: false,
            headerTitle: () => (
                <View style={styles.titleView}>
                    <Avatar rounded source={{ uri: messages[0]?.data.photoURL || 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/8_avatar-512.png' }} />
                    <Text style={styles.text}>{props.route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={props.navigation.goBack}>
                    <AntDesign name='arrowleft' size={24} color='white' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={styles.icons}>
                    <TouchableOpacity>
                        <FontAwesome name='video-camera' size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name='call' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [props.navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(props.route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput('');
    };

    useLayoutEffect(() => {
        const unsubscribe = 
            db.collection('chats')
            .doc(props.route.params.id).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))));

            return unsubscribe;
    }, [props.route])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <StatusBar style='light' />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={90}
            >

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
                <>
                    <ScrollView contentContainerStyle={{paddingTop: 15}}>
                       {messages.map(({id, data}) => (
                           data.email === auth.currentUser.email ? (
                                <View key={id} style={styles.receiver}>
                                    <Avatar
                                        position='absolute'
                                        bottom={-15}
                                        right={-5}
                                        rounded
                                        size={30}
                                        source={{
                                            uri: data.photoURL
                                        }} />
                                    <Text style={styles.receiverText}>{data.message}</Text>
                                </View>
                           ): (
                                <View key={id} style={styles.sender}>
                                    <Avatar
                                        position='absolute'
                                        bottom={-15}
                                        right={-5}
                                        rounded
                                        size={30}
                                        source={{
                                            uri: data.photoURL
                                        }} />
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>
                           )
                       ))} 
                    </ScrollView>
                    
                    <View style={styles.footer}>
                        <TextInput 
                            value={input} 
                            onSubmitEditing={sendMessage}
                            onChangeText={text => setInput(text)} 
                            placeholder='Signal Message' 
                            style={styles.textInput} 
                        />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                            <Ionicons name='send' size={24} color='#2B68E6' />
                        </TouchableOpacity>
                    </View>
                </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
};

export default ChatScreen

const styles = StyleSheet.create({
    titleView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        marginLeft: 10,
        fontWeight: '700'
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
        marginRight: 20
    },
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'grey',
        borderRadius: 30,
    },
    receiver: {
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    receiverText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,
    },
    sender: {
        padding: 15,
        backgroundColor: '#2B68E6',
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginRight: 15,
        marginLeft: 10,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15
    }
})
