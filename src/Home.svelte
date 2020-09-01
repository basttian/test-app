<script>

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

</script>

<svelte:head>
<title>Home</title>
</svelte:head>


<!-- Body -->
<div class="uk-container">

	<h1 class="uk-text-center uk-text-capitalize uk-margin-top">{_date} {hours}:{minutes<=9?"0"+minutes:minutes}:{seconds<=9?"0"+seconds:seconds}</h1>

	<p>Hola si eres profesor, debes crear tu examen.</p>
	<Link href="/{sha512('create')}"><button class="uk-button uk-button-default" > Crear nuevo examen</button></Link>



	<p>Hola alumno, coloca el codigo de examen que te dio tu profesor.</p>
	 <div class="uk-margin">
        <input class="uk-input" type="text" placeholder="Codigo del examen">
     </div>
	 <div class="uk-margin">
		<button class="uk-button uk-button-default" >Tomar mi examen</button>
	</div>
	
</div>