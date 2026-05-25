const firebaseConfig = {

  apiKey: "AIzaSyAx4b8q0C01MDZc5s4qRhlOa2CKspqhZ_Y",

  authDomain: "siteai-7cf76.firebaseapp.com",

  projectId: "siteai-7cf76",

  storageBucket: "siteai-7cf76.firebasestorage.app",

  messagingSenderId: "469917043262",

  appId: "1:469917043262:web:48c0f6adeaa24cf209df6f",

  measurementId: "G-8PMP3H4JYN"

}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

const db = firebase.firestore()
