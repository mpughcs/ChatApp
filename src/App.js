import logo from './logo.svg';
import './App.css';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import react from 'react';
import { useState } from 'react'; 
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

firebase.initializeApp({
  apiKey: "AIzaSyB9Y5KCU4xyTJok9DULpdubmj7RnT0TPM4",
  authDomain: "firstfirebase-22831.firebaseapp.com",
  projectId: "firstfirebase-22831",
  storageBucket: "firstfirebase-22831.appspot.com",
  messagingSenderId: "270399788548",
  appId: "1:270399788548:web:be78352e74a99591700751",
  measurementId: "G-5ELC73RPVP"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <h1>Chat App</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
     

    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button className= "bg-blue-500 rounded-2xl p-2" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idField:'id'});
  const [formValue,setFormValue] = useState('');  
  const dummy = react.useRef();
  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }
  return(
    <>
    <div className='text-green-700'>
      {messages && messages.map(msg => <ChatMessage key={msg.uid} message={msg}/>)}
      <div ref={dummy}></div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange = {(e) => setFormValue(e.target.value)}/>
        <button type='submit'>Send</button>

      </form>
    </div>
    </>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

function ChatMessage(props){
  const {text,uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
    <div className={`message ${messageClass}`}>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

      <p >{text}</p>
      
    </div>
  )
}
export default App;
