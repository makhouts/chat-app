import React, {useLayoutEffect, useState, useEffect} from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import CustomListItem from '../components/CustomListItem';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = (props) => {
    const [chats, setChats] = useState([]);

    const signOut = () => {
        auth.signOut().then(() => {
            props.navigation.replace('Login');
        })
    }

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            return setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
        return unsubscribe;
    }, [])

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: 'Chat-App',
            headerStyle: { backgroundColor: '#fff'},
            headerTitleStyle: { color: 'black' },
            headerTintColor: 'black',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                        <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </TouchableOpacity>
                </View>
            ),
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 80,
                    marginRight: 20
                }}>
                    <TouchableOpacity activeOpacity={0.3}>
                        <AntDesign name='camerao' size={24} color='black' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => props.navigation.navigate('AddChat')} activeOpacity={0.3}>
                        <SimpleLineIcons name='pencil' size={22} color='black' />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [props.navigation])

    const enterChat = (id, chatName) => {
        props.navigation.navigate('Chat', {
            id,
            chatName
        })
    }

    return (
        <SafeAreaView>
            <StatusBar style='light' />
            <ScrollView style={styles.container}>
                {chats.map(({id, data: { chatName }}) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        height: '100%',
    }
})
