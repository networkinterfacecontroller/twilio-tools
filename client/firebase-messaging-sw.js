importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDHp6vMyaO-Jyu1k_7dzlsMcLVvlgkoTOI",
    authDomain: "notify-browser-demo.firebaseapp.com",
    databaseURL: "https://notify-browser-demo.firebaseio.com",
    projectId: "notify-browser-demo",
    storageBucket: "notify-browser-demo.appspot.com",
    messagingSenderId: "687446778658",
    appId: "1:687446778658:web:f13ad289cf0f76ef"
});

const messaging = firebase.messaging();