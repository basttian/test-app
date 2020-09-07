<script>
	import { FirebaseApp, User, Doc, Collection } from "sveltefire";
	import firebase from "firebase/app";
	import "firebase/firestore";
	const db = firebase.firestore();
    import { _userid, _displayName } from "./store/store.js"
	//I love moment
	import moment from 'moment';
	let _date = moment().format('dddd Do [de] MMMM [del] YYYY');
	import 'moment/locale/es';
	import { onMount } from 'svelte';
	let time = new Date();

	$: hours = time.getHours();
	$: minutes = time.getMinutes();
	$: seconds = time.getSeconds();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	//Routes
	import { Link } from 'yrv';
	import sha512 from 'crypto-js/sha512';
	import Cookies from 'js-cookie';

	let codigo = '';
	let promise;
	

	let documento;

	const addControlTest = async () => {
	/* Verifico si el codigo del examen es correcto */
	let eRef = await db.doc(`examenes/${codigo}`);
	promise = eRef.get().then(async function(docSnapshot) {
			if (!docSnapshot.exists) {
					eRef.onSnapshot((doc) => {
						UIkit.notification({
							message:"<span uk-icon='icon: warning'></span> Código de examen incorrecto.",
							pos: "top-center",
							status: "danger",
							timeout: 2000
						});
					});
				} else {
					/* Chequeo si el usuario ya ingreso a esa evaluacion */
					let iRef = await db.collection(`ingresos`).where('uid','==',$_userid).where('codigodeExamen','==',codigo);
					promise = iRef.get().then(async collections => {
					collections.forEach(doc => {
						UIkit.notification({
							message:`<span uk-icon='icon: warning'></span> Error! No puedes ingresar nuevamente al examen. Ingresaste el ${moment(doc.data().ingreso).format("LLL")}` ,
							status: "danger",
							timeout: 5000
							});
						return;
					});
					/* Almaceno el ingreso */
					if(collections.empty){
				 		db.collection(`ingresos`).add({
							ingreso:moment().valueOf(),
							uid: $_userid,
							codigodeExamen: codigo,
							nombre: $_displayName,
							}).then(function(){
								window.location.href = `/${sha512('test')}/${codigo}/${$_userid}`
								}) 
							}
						})
				}
		}).catch(function(error) {
        	console.log("Error getting documents: ", error);
    	});
}

</script>

<svelte:head>
<title>Home</title>
</svelte:head>


<!-- Body -->
<div class="uk-container">

	<h1 class="uk-text-center uk-text-capitalize uk-margin-top">{_date} {hours}:{minutes<=9?"0"+minutes:minutes}:{seconds<=9?"0"+seconds:seconds}</h1>
	
	<!-- 
		<Link href="/{sha512('create')}"><button class="uk-button uk-button-default" > Examenes</button></Link>
		<Link on:click={() => location.href = `/${sha512('test')}/${codigo}/${$_userid}` } ></Link>
	 -->


<FirebaseApp firebase={firebase} >
<User let:user={user} let:auth={auth} on:user>

	<p>Hola!! {user.displayName}, coloca el código de examen que te dio tu profesor.</p>
	<div class="uk-alert-primary" uk-alert>
		<a class="uk-alert-close" uk-close></a>
		<p><span uk-icon="info"></span> Información !! Al ingresar el tiempo <span uk-icon="icon: future"></span> comenzará a correr.</p>
		<span class="uk-text-meta">Solo tendrás una oportunidad, aprovéchala. Suerte!!</span>
	</div>

	 <div class="uk-margin">
        <input class="uk-input" type="text" bind:value={codigo} placeholder="Codigo del examen">
     </div>

	 <div class="uk-margin">
			<button class="uk-button uk-button-default" disabled={!codigo}
			on:click={()=> addControlTest() }
			> Comenzar con mi examen</button>
	</div>


	{#await promise}
        <div class="uk-position-cover uk-overlay 
                    uk-overlay-default uk-flex uk-flex-center uk-flex-middle">
            <div uk-spinner="ratio: 3"></div>
        </div> 
    {/await}

</User>
</FirebaseApp>

</div>