import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    //B3 set message 1
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    //after setName, setRoom 2
    // const ENDPOINT = 'localhost:5000';

    //step finish
    const ENDPOINT = 'https://react-chat-byduyquangg.herokuapp.com/';

    useEffect(() => {
        // const data = queryString.parse(location.search);

        // console.log(location.search);
        // console.log('===> data',data);

        const { name, room } = queryString.parse(location.search);

        //after setName, setRoom 1
        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        //after setName, setRoom 3
        // console.log(socket);

        // socket.emit('join', { name, room }, () => {

        // });

        // return () => {
        //     socket.emit('disconnect');

        //     socket.off();
        // }
        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]) // [] => render everytime


    //B3 2
    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    //function for sending messages
    //B3 3
    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    // console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    );
}

export default Chat;