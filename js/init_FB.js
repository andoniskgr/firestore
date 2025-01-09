console.log('init');


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyASNmrXizk_zuVE6w0CnXRqexhQxSefHRg",
  authDomain: "firestoretest1-e1185.firebaseapp.com",
  projectId: "firestoretest1-e1185",
  storageBucket: "firestoretest1-e1185.firebasestorage.app",
  messagingSenderId: "121259043201",
  appId: "1:121259043201:web:f0d7cc5e1d2a4a31d4e080"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth= firebase.auth();
const db = firebase.firestore();

db.settings({ timestampInSnapshots: true });


const events_collection="events"
const aircrafts_collection="aircrafts"

