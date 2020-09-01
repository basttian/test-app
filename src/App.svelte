<script>
	import { FirebaseApp, User, Doc, Collection } from "sveltefire";
	import firebase from "firebase/app";
	import "firebase/firestore";
	import "firebase/auth";
	  // Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyAuom8AD1lt1W5AGnnJj8yedgwb7UV_C2c",
		authDomain: "test-app-5025d.firebaseapp.com",
		databaseURL: "https://test-app-5025d.firebaseio.com",
		projectId: "test-app-5025d",
		storageBucket: "test-app-5025d.appspot.com",
		messagingSenderId: "831965365779",
		appId: "1:831965365779:web:5016e345b71133566e61e6",
		measurementId: "G-PZ1B8M9X5N"
	};
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	//almost lov
	import { Router, Route, Link } from 'yrv';
	import home from "./Home.svelte";
	import create from "./component/Create.svelte";
	import update from "./component/Update.svelte";
	import sha512 from 'crypto-js/sha512';

</script>


  <Router>
      <Route path="/" exact component={home}/>
	  <Route exact path="/{sha512('create')}" component={create}/><!-- wtf - Porque? Para Que?  -->
	  <Route path="/{sha512('update')}/:id" exact component={update} />
  </Router> 

