<script>
	import { FirebaseApp, User, Doc, Collection } from "sveltefire";
	import firebase from "firebase/app";
	import "firebase/firestore";
	import "firebase/auth";
	const db = firebase.firestore();
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

	let codigo = '';

	const SearchTest = (c) => {
		console.log(c)
	}

</script>

<svelte:head>
<title>Home</title>
</svelte:head>


<!-- Body -->
<div class="uk-container">

	<h1 class="uk-text-center uk-text-capitalize uk-margin-top">{_date} {hours}:{minutes<=9?"0"+minutes:minutes}:{seconds<=9?"0"+seconds:seconds}</h1>
	
	<!-- <Link href="/{sha512('create')}"><button class="uk-button uk-button-default" > Examenes</button></Link> -->

	<p>Hola alumno, coloca el codigo de examen que te dio tu profesor.</p>
	 <div class="uk-margin">
        <input class="uk-input" type="text" bind:value={codigo} placeholder="Codigo del examen">
     </div>
	 <div class="uk-margin">
		<Link href="/{sha512('test')}/{codigo}"><button class="uk-button uk-button-default" disabled={!codigo}> Tomar mi examen</button></Link>
	</div>
	
</div>