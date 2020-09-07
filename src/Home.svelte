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
	import { Router, Route, Link } from 'yrv';
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

	import sha512 from 'crypto-js/sha512';
	import Cookies from 'js-cookie';
	let codigo = '';
	let promise;
	let showBtnIra = false;
	let documento;
	
	const addControlTest = async (cod) => {
	/* Verifico si el codigo del examen es correcto */
	if(cod === ""){
		UIkit.notification({
			message:"<span uk-icon='icon: warning'></span> Error!! Solicita al profesor un código.",
			pos: "top-center",
			status: "danger",
			timeout: 2000
		});
	}else{
	let eRef = await db.doc(`examenes/${cod}`);
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
								 showBtnIra = true;
								}).catch(function(e){
									showBtnIra =false;
								})
							}
						})
				}
		}).catch(function(error) {
        	console.log("Error getting documents: ", error);
    	});
	}
}
</script>

<svelte:head>
<title>Home</title>
</svelte:head>
<!-- Body -->
<div class="uk-container">
<h1 class="uk-text-center uk-text-capitalize uk-margin-top">{_date} {hours}:{minutes<=9?"0"+minutes:minutes}:{seconds<=9?"0"+seconds:seconds}</h1>
<FirebaseApp firebase={firebase} >
<User let:user={user} let:auth={auth} on:user>

	<p>Hola!! {user.displayName}, coloca el código de examen que te dio tu profesor.</p>
	<div class="uk-alert-primary" uk-alert>
		<a class="uk-alert-close" uk-close></a>
		<p><span uk-icon="info"></span> Información !! Al ingresar el tiempo <span uk-icon="icon: future"></span> comenzará a correr.</p>
		<span class="uk-text-meta">Solo tendrás una oportunidad, aprovéchala. Suerte!!</span>
	</div>

	<div uk-grid>
    <div>
	<form on:submit|preventDefault={()=>{addControlTest(codigo)}}>
		<div class="uk-margin">
			<div class="uk-inline">
				<a class="uk-form-icon" uk-icon="icon: unlock" on:click={()=> addControlTest(codigo) } ></a>
				<input class="uk-input uk-form-width-large" type="text" bind:value={codigo} placeholder="Codigo del examen">
			</div>
		</div>
	</form>
	<div class="uk-margin">
		<!-- <button class="uk-button uk-button-primary uk-width-1-1" disabled={!codigo || showBtnIra}
		on:click={()=> addControlTest() }
		> Comenzar con mi examen</button> -->
		{#if showBtnIra}
			<Link href="/{sha512('test')}/{codigo}/{$_userid}" ><button class="uk-button uk-button-primary uk-width-1-1">Ir a mi examen...</button></Link>
		{/if}
	</div>
	</div>
    <div></div>
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
