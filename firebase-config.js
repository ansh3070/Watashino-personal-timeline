// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnOR54r64fxLusULJbG4OsMtdDa-mgJ7I",
    authDomain: "personal-b1800.firebaseapp.com",
    projectId: "personal-b1800",
    storageBucket: "personal-b1800.firebasestorage.app",
    messagingSenderId: "3842626107",
    appId: "1:3842626107:web:3f1a1571035639c305021e",
    measurementId: "G-4SMYL475HK"
};

// Initialize Firebase
try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Export for use in other files
    window.db = db;
    window.collection = collection;
    window.addDoc = addDoc;
    window.getDocs = getDocs;
    window.orderBy = orderBy;
    window.query = query;
    
    console.log("Firebase initialized successfully");
    
    // Try to load events from Firebase when ready
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (typeof loadEventsFromFirebase === 'function') {
                loadEventsFromFirebase().catch(console.error);
            }
        }, 4000); // Load after initial animation
    });
} catch (error) {
    console.error("Error initializing Firebase:", error);
}