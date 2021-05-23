import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db } from '../firebase';

const CustomListItem = (props) => {
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(props.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => (
            setChatMessages(snapshot.docs.map(doc => doc.data()))
            ));
        return unsubscribe;
    });
    return (
        <ListItem key={props.id} onPress={() => props.enterChat(props.id, props.chatName)} key={props.id} bottomDivider>
            <Avatar
                rounded
                source={{
                    uri: chatMessages?.[0]?.photoURL || 'https://www.pngarts.com/files/3/Avatar-PNG-Download-Image.png'
                }}
            />
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: '800' }}>
                  {props.chatName}
              </ListItem.Title>
              <ListItem.Subtitle numberOfLines={1}>
                {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
              </ListItem.Subtitle>
            </ListItem.Content> 

        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
