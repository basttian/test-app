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

    import {_userid} from "./store/store.js";
	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var tel = user.phoneNumber;
      _userid.set(user.uid);
    } else {
      console.log("No user in line");
    }
  });

    import { relog } from './store/store.js';
    const formatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit'
	});

	//almost lov
	import { Router, Route, Link } from 'yrv';
	import home from "./Home.svelte";
	import views from "./component/Views.svelte";
	import update from "./component/Update.svelte";
    import newx from "./component/New.svelte";
    import test from "./student/Examen.svelte";
    
	import sha512 from 'crypto-js/sha512';
	var provider = new firebase.auth.GoogleAuthProvider();

	const Salir = (user) =>{
	    //console.log(user)
	    UIkit.modal.confirm('Esta seguro que desea salir de la aplicación...').then(function() {
	    //console.log('Confirmed.')
	    user.signOut().then(resp => {
	    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Desconexión satisfactoria.', status: 'primary'});    
	    });
	    }, function () {
	        //console.log('Rejected.')
	    });
	}

</script>

<FirebaseApp {firebase}>
	<User let:user={user} let:auth={auth} >



<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
     <div class="uk-navbar-item uk-logo"><img class="uk-border-circle" width="35" height="35" src={user.photoURL} alt=""></div>
        <div class="uk-navbar-nav uk-width-auto uk-margin-top">
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove">{user.displayName}</h4>
                <p class="uk-comment-meta uk-margin-remove-top">{user.email}</p>
            </div>
        </div>
    </div>
    <div class="uk-navbar-right uk-margin-right">
         
<div class="uk-inline">
    <span uk-icon="grid"></span>
    <div uk-dropdown="pos: top-right">
    <ul class="uk-nav uk-dropdown-nav">
        <li><Link  class="uk-active uk-nav-header" href="/">pagina principal</Link></li>
        <li><Link href="/{sha512('view')}">Mis examenes</Link></li>
        <li><Link href="/{sha512('new')}">Nuevo examen</Link></li>
        <li class="uk-nav-divider"></li>
        <li><a href="#">Item</a></li>
    </ul>
    </div>
    <button uk-tooltip="title: Salir; pos: bottom" on:click={()=>{Salir(auth)}} uk-icon="sign-out"></button>
</div>

    </div>
</nav>
 </div>


  <Router>
      <Route path="/" exact component={home}/>
	  <Route exact path="/{sha512('view')}" component={views}/><!-- wtf - Porque? Para Que?  -->
	  <Route path="/{sha512('update')}/:id" exact component={update} />
	  <Route path="/{sha512('test')}/:id" exact component={test} />
      <Route path="/{sha512('new')}" exact component={newx} />
  </Router> 






<!-- Btn Ingreso Google  -->
<div slot="signed-out">
<div class="uk-child-width-1-3@m" uk-grid uk-scrollspy="cls: uk-animation-fade; target: .uk-card; delay: 500; repeat: true">
<div class="uk-position-small uk-position-center uk-overlay uk-overlay-default">
<div class="uk-card uk-card-default uk-width-1-1@m ">
    <div class="uk-card-header"></div>
    <div class="uk-card-body uk-card-hover">
   <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
               <span uk-icon="icon: google; ratio: 3.5"></span>
            </div>
            <div class="uk-width-expand">
                <h3 class="uk-card-title uk-margin-remove-bottom"><button class="uk-button uk-button-text" uk-tooltip="title: Ingresar..; pos: bottom"  on:click={() => auth.signInWithPopup(provider)} > Google account.</button></h3>
                {formatter.format($relog)}
            </div>
        </div>
    </div>
    <div class="uk-card-footer"></div>
</div>
</div>
</div>
</div> 

 </User>
</FirebaseApp>