<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    export let router = {};
    let id = null;
    $: {
        id = router.params ? router.params.id : null;
    }

    import Timer32 from "carbon-icons-svelte/lib/Timer32";
    import { onMount } from 'svelte';
    let _inicio, _fin,_duracion;
   onMount(async () => {
      await db.doc(`examenes/${id}`).get().then(function(doc) {
            if (doc.exists) {
                _inicio = doc.data().inicia;
                _fin = doc.data().finaliza;
                //_duracion = moment.utc(moment(_fin).diff(moment(_inicio))).format('HH:mm');
                _duracion = moment.duration(_fin - _inicio).asMinutes();;
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

   })

    let count = 0;
	$: if (count >= _duracion) {
		
	}

    /* I Lov */
	import { quill } from 'svelte-quill'
	let options = { placeholder: "Responde aquí.", }
	let content = { html: '', text: ''};

    /* Data */
    let estudiante = '';
    let dni = '';
</script>
    <svelte:head>
        <title>Examen</title>
        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    </svelte:head>

    <!-- Body -->

<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2"></span></Link></li>
        </ul>
    </div>
    <div class="uk-navbar-right">
        <span class="uk-margin-right">{_duracion === void 0 ?'':`Tiempo del examen: ${_duracion} minutos` }<Timer32/></span>
    </div>
</nav>

<div class="uk-container uk-margin-top">
<FirebaseApp firebase={firebase}>
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div><span class="uk-text-muted uk-text-italic"></span></div>
<!-- Aviso -->
<div class="uk-alert-primary" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <p>Bienvenido!! Debes colocar tu nombre completo y tu DNI antes de comenzar con el examen. El tiempo esta corriendo.</p>
</div>
<!-- Formulario  -->
<div class="uk-background-muted uk-margin">
    <div  class="uk-grid-small" uk-grid>
    <div class="uk-width-1-2@s">
        <input class="uk-input" bind:value={estudiante} type="text" placeholder="Nombre y apellido">
    </div>
    <div class="uk-width-1-2@s">
        <input class="uk-input" bind:value={dni} type="text" placeholder="DNI">
    </div>
    </div>
</div>
<!-- Panel de preguntas -->
<article class="uk-article uk-margin-bottom">
<h1 class="uk-article-title">{data.titulo}</h1>
<p class="uk-article-meta">{moment().format('dddd')} {moment().format('Do [de] MMMM [del] YYYY, h:mm:ss a')}</p>
{#each { length:data.preguntas.length } as item,i}
     <p class="uk-text-bold">{`${i+1})`} {data.preguntas[i]}</p>
{/each}

</article>
<!-- Panel de respuestas -->
<div class="editor" use:quill={options} on:text-change={e => content = e.detail}/>
<!-- {@html content.html} -->
<button class="uk-button uk-button-primary uk-margin" disabled={Number(content.text.length)<=3}
on:click={() => console.log(content.text)}
>Enviar respuesta</button>
<!-- Si no se encuentra -->
<div slot="fallback">
    <div class="uk-alert-danger" uk-alert>
    <a class="uk-alert-close" uk-close></a>
        <p>El examen no existe.</p>
    </div>
</div>
</Doc>
</FirebaseApp>
</div>