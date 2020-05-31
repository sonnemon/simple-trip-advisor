import firebase from 'firebase/app';

const firebaseConfig = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
	appId: ''
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
