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

    import { _userid, _displayName} from "./store/store.js";
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
      _displayName.set(user.displayName);
        if (typeof(Storage) !== 'undefined') {
            localStorage.setItem('user', user.email);
            sessionStorage.setItem('user', user.email)
        } else {
            consolle.log("Storage no es compatible");
        }
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
    import { Router, Route, Link, router } from 'yrv';
    import Cookies from 'js-cookie';
    router.subscribe(e => {
    //if (!e.initial) console.log(e);
    //Cookies.remove('CO-ROUTE', { path: `${e}` });
    Cookies.set('CO-ROUTE', `${e.path}`,{ expires: 360, path: `${e}`});
    });
    
	import home from "./Home.svelte";
	import views from "./component/Views.svelte";
	import update from "./component/Update.svelte";
    import newx from "./component/New.svelte";
    import test from "./student/Examen.svelte";
    import evaluaciones from "./student/Evaluaciones.svelte";
    import respuestas from "./component/Respuestas.svelte";
    import ingresos from "./component/Ingresos.svelte";


	import sha512 from 'crypto-js/sha512';
	var provider = new firebase.auth.GoogleAuthProvider();

	const Salir = (user) =>{
	    //console.log(user)
	    UIkit.modal.confirm('Esta seguro que desea salir de la aplicación...').then(function() {
	    //console.log('Confirmed.')
	    user.signOut().then(resp => {
	    UIkit.notification({
        message: '<span uk-icon=\'icon: check\'></span> Desconexión satisfactoria.', 
        status: 'primary',
        pos: 'bottom-center',
        timeout: 1000
        });    
	    });
	    }, function () {
	        //console.log('Rejected.')
	    });
	}

/* No refresh */
document.onkeydown = function(){
  switch (event.keyCode){
        case 116 : //F5 button
            event.returnValue = false;
            event.keyCode = 0;
            return false;
        case 82 : //R button
            if (event.ctrlKey){ 
                event.returnValue = false;
                event.keyCode = 0;
                return false;
            }
    }
}

// Carbon icons
import Education24 from "carbon-icons-svelte/lib/Education24";
import ToolBox24 from "carbon-icons-svelte/lib/ToolBox24";
import WatsonHealthNominate24 from "carbon-icons-svelte/lib/WatsonHealthNominate24";

</script>

<svelte:head>
<title>Iniciar sesión</title>
<style>
    body{
        background-color:rgb(255, 255, 255);
        overscroll-behavior: none;
        }
</style>
</svelte:head>

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
    <span uk-icon="icon: grid"></span>
    <div uk-dropdown="animation: uk-animation-slide-top-small; duration: 500" id="drop">
    <ul class="uk-nav uk-dropdown-nav uk-nav-primary uk-margin-auto-vertical">
        <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/"><WatsonHealthNominate24 /> Inicio</Link></li>
        <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/{sha512('view')}"><ToolBox24 /> Mis examenes</Link></li>
        <li><Link on:click={()=> UIkit.dropdown("#drop").hide()} href="/{sha512('evaluaciones')}"><Education24 /> Mis evaluaciones</Link></li>
        <li class="uk-nav-divider"></li>
        <li><a href="javascript:void(0);" on:click={()=>{Salir(auth)}} ><span uk-icon="icon: sign-out"></span> Salir</a></li>
    </ul>
    </div>
    </div>
</nav>
 </div>

<main uk-height-viewport="expand: true">
  <Router>
      <Route path="/" exact component={home}/>
	  <Route exact path="/{sha512('view')}" component={views}/><!-- wtf - Porque? Para Que?  -->
	  <Route path="/{sha512('update')}/:id" exact component={update} />
	  <Route path="/{sha512('test')}/:id/:user" exact component={test} />
      <Route path="/{sha512('new')}" exact component={newx} />
      <Route path="/{sha512('respuestas')}/:id" exact component={respuestas} />
      <Route path="/{sha512('ingresos')}/:id" exact component={ingresos} />
       <Route path="/{sha512('evaluaciones')}" exact component={evaluaciones} />
  </Router> 
</main>
  <footer>
    <div class="uk-background-default uk-padding uk-panel">
  </footer>

<!-- Btn Ingreso Google  -->
<div  slot="signed-out">
<span class="uk-text-meta uk-margin uk-padding-small">Debes iniciar sesión antes de comenzar.</span>
<main uk-height-viewport="expand: true">
<div class="uk-child-width-1-3@m" uk-grid uk-scrollspy="cls: uk-animation-fade; target: .uk-card; delay: 500; repeat: true">
<div class="uk-position-small uk-position-center uk-overlay uk-overlay-default">
<div class="uk-card uk-card-default uk-width-1-1@m ">
    <div class="uk-card-header uk-text-center"></div>
    <div class="uk-card-body uk-card-hover">
   <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
               <span uk-icon="icon: google; ratio: 3.5"></span>
            </div>
            <div class="uk-width-expand">
                <h3 class="uk-card-title uk-margin-remove-bottom">
                <button class="uk-button uk-button-text" uk-tooltip="title: Ingresar..; pos: bottom"  on:click={() => auth.signInWithPopup(provider)} > Google</button></h3>
                {formatter.format($relog)}
            </div>
        </div>
    </div>
    <div class="uk-card-footer"></div>
</div>
</div>
</div>
</main>
  <footer>
    <div class="uk-background-muted uk-padding uk-panel">
        <span class="uk-float-right uk-text-meta">Cybernetically enhanced web apps | <a href="https://svelte.dev/" target="_blank"><span class="uk-text-warning"> svelte</span></a></span>
    </div>
  </footer>
</div>
 </User>
</FirebaseApp>


