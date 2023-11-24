import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { toBeChecked } from '@testing-library/jest-dom';

firebase.initializeApp({
  apiKey: "AIzaSyDa8ya2Xklv9WyNmFNFtoxiu7DCJNdN-zQ",
  authDomain: "superchat-410e2.firebaseapp.com",
  projectId: "superchat-410e2",
  storageBucket: "superchat-410e2.appspot.com",
  messagingSenderId: "91878376538",
  appId: "1:91878376538:web:fa624f219b89eab846c463",
  measurementId: "G-Q51RFGXD0N"
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {
  const [user] = useAuthState(auth);

  return (
    <div className='App'>
      <header>
        {<h1>hi</h1>}
        <h1>superChat️ : baat chit </h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
  <>
      <button
        className='sign-in'
        onClick={signInWithGoogle}
      >
        <img src="C:\Users\Admin\Desktop\callagraphy art\react-firebase-chat-master\public\search.png" alt = "Sign in krne k liye mujhe click kre"/> 
        </button>
      <p>
        Community guidelines ki haad me rahe
        <br /> varna zindagi bhar ke liye ban ho jaoge!" 👮‍♀️🚫🔒
      </p>
   </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button
        className='sign-out'
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        <div className='screenContainer'>
          <div className='messagesContainer'>
            {messages &&
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                />
              ))}

            <span ref={dummy}></span>
          </div>
          {
            <div className='announcement'>
              <p>made for fun, powered by react</p>
            </div>
          }
        </div>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder='say something nice'
        />

        <button
          type='submit'
          disabled={!formValue}
        >
          
        </button>
      </form>
    </>
  );
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;
