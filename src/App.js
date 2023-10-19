import logo from './logo.svg';
import './App.css';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";


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
      <header className="App-header text-green-300">
       <section className='w-screen h-screen'>
        {user ? <ChatRoom /> : <SignIn />}

        <SignOut className=""/>
        </section>
      </header>
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
  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
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
  return(
    <div>
      <p className='text-green-600'>{text}</p>
      {console.log("text")}
    </div>
  )
}
export default App;
