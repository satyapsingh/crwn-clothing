import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDyDt6wIPyoMo8tMSeE8dJHdN_hgJw4FcE",
    authDomain: "online-db-be494.firebaseapp.com",
    databaseURL: "https://online-db-be494.firebaseio.com",
    projectId: "online-db-be494",
    storageBucket: "online-db-be494.appspot.com",
    messagingSenderId: "696377661706",
    appId: "1:696377661706:web:6d7ea57fe860cac714c2f3",
    measurementId: "G-QZV8VPK4T6"
  };

  firebase.initializeApp(config);

  export const createUserProfileDocument = async(userAuth, additionalData) => {
    if (!userAuth) return;
    //const userDocRef = firestore.doc('users/12eeree33ddfd');
    const userDocRef = firestore.doc(`users/${userAuth.uid}`);
    const snapShot = await userDocRef.get();
    //console.log(snapShot);
    if (!snapShot.exists) {
      const {displayName, email} = userAuth;
      const createdAt = new Date();

      try {
         await userDocRef.set({
           displayName,
           email,
           createdAt,
           ...additionalData
         })
      } catch(error) {
        console.log('error creating user', error.message);
      }
    }

    return userDocRef;
  };
  
  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  
  provider.setCustomParameters({promt: 'select_account'});

  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;