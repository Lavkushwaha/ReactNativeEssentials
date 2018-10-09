import React, {Component} from 'react';


import * as firebase from 'firebase';
import { AsyncStorage } from "react-native";
import { AccessToken, LoginManager } from 'react-native-fbsdk';


var config= {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();



export const signupUser = (email,password) => {

    firebase.auth().createUserWithEmailAndPassword(email,password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
  }
  
export const logOut =() =>{  
      //GoogleSignin.revokeAccess();
      //GoogleSignin.signOut();
       firebase.auth().signOut();
    }

export const resetPassword =(email) =>{
    if(email.length==0){
      alert("Please Enter Email")
    }
    else{

      firebase.auth().sendPasswordResetEmail(email)
    .then(alert('Reset Link has been Sent'))
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });
    }
    

}

export const getUser=()=>{
  getAddress();
  return firebase.auth().currentUser;
  
}


export const verifyEmail=() =>{
  firebase.auth().currentUser.sendEmailVerification().then(alert('Please Verify Your Email'));
}


export const changeName = (res) =>{
  firebase.auth().currentUser.updateProfile({
    displayName: res,
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  });
}

export const changeEmail = (res) =>{
  firebase.auth().currentUser.updateProfile({
    email: res,   
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(verifyEmail());
}

export const setAddress=(address) => {
  var userId = firebase.auth().currentUser.uid;
  firebase.database().ref('userData/'+ userId).set({
    address: address,
    
  });
}

export const getAddress =() =>{
  var userId = firebase.auth().currentUser.uid;
  //  firebase.database().ref('/userData/' + userId).on('value', function(snapshot) {
  //    if(snapshot.val().address){
  //     AsyncStorage.setItem("address", snapshot.val().address);
  //    }
  //    else{
  //     AsyncStorage.setItem("address", 'No Address');
  //    }  
 // })
 return;
 
}


export const fbLogin = () => {
  LoginManager.logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
      if (result.isCancelled) {
        return Promise.reject(new Error('The user cancelled the request'));
      }
      // Retrieve the access token
      return AccessToken.getCurrentAccessToken();
    })
    .then((data) => {
      // Create a new Firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      // Login with the credential
      return firebase.auth().signInAndRetrieveDataWithCredential(credential);
    })
    .then((user) => {
      // If you need to do anything with the user, do it here
      // The user will be logged in automatically by the
      // `onAuthStateChanged` listener we set up in App.js earlier
    })
    .catch((error) => {
      const { code, message } = error;
      // For details of error codes, see the docs
      // The message contains the default Firebase string
      // representation of the error
      console.warn(message);
    });
}


