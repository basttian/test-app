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

/* Variables  */
let descripcion,finaliza,inicia,titulo,status,preguntas;

let newpreguntas = [];

    function add() {
		newpreguntas = newpreguntas.concat({ done: false, text: '' });
	}

	function clear() {
		newpreguntas = newpreguntas.filter(t => !t.done);
	}

    $: remaining = newpreguntas.filter(t => !t.done).length;

    /* Borrar elementos del arreglo preguntas */
    const DeleteArrayPreguntas = (value)=>{
        db.collection(`examenes`).doc(`${id}`).update({
            "preguntas": firebase.firestore.FieldValue.arrayRemove(`${value}`)
        })
    }

</script>
    <svelte:head>
        <title>Crear Examenes</title>
    </svelte:head>

    <!-- Body -->

<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2"></span></Link></li>
        </ul>
    </div>
</nav>

<div class="uk-container">


<FirebaseApp firebase={firebase}>
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner="ratio: 3"></div></div>

<fieldset class="uk-fieldset">
        <legend class="uk-legend">Modificar Examen</legend>
        <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1 uk-margin-top">
            <label><input class="uk-checkbox" type="checkbox" bind:this={status} checked={data.status} > Activo</label>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <input class="uk-input" type="text"  value={data.titulo} bind:this={titulo} placeholder="Título">
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <textarea class="uk-textarea" rows="3" placeholder="Descripción" bind:this={descripcion} >{data.descripcion}</textarea>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input" value={moment(data.inicia).format("YYYY-MM-DDTHH:mm:ss")} type="datetime-local" bind:this={inicia}>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input" value={moment(data.finaliza).format("YYYY-MM-DDTHH:mm:ss")} type="datetime-local" bind:this={finaliza}>
        </div>
        </div>

        <!-- preguntas -->
         <div class="uk-width-1-1 uk-margin-top">
          {#each { length:data.preguntas.length } as p,i}
           <p>{data.preguntas[i]}<button on:click={()=> DeleteArrayPreguntas(data.preguntas[i]) } > X</button></p>
          {/each}
        </div>

        <legend class="uk-legend uk-margin-top uk-margin-bottom">Preguntas del examen ({remaining}) </legend>
    {#each newpreguntas as pregunta}
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-1">
                <label><input class="uk-checkbox" type=checkbox bind:checked={pregunta.done} > Seleccionar para eliminar la pregunta.</label>
            </div>
            <div class="uk-width-1-1 uk-margin-top">
                <input class="uk-input" bind:value={pregunta.text} disabled={pregunta.done} placeholder="Qué vas a preguntar?">
            </div>
        </div>
    {/each}
    <button class="uk-button uk-button-default uk-margin-top" on:click={add}>Agregar nueva pregunta</button>
    <button class="uk-button uk-button-default uk-margin-top" on:click={clear}>Quitar seleccionados</button>

        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-top" disabled={!remaining>=1}>Actualizar examen</button>
</fieldset>
</Doc>
</FirebaseApp>
</div>