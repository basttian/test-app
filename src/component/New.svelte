<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";

import { Router, Route, Link } from 'yrv';


let preguntas = [];

    function add() {
		preguntas = preguntas.concat({ done: false, text: '' });
	}

	function clear() {
		preguntas = preguntas.filter(t => !t.done);
	}

    $: remaining = preguntas.filter(t => !t.done).length;


</script>
    <svelte:head>
        <title>Crear Examenes</title>
    </svelte:head>

    <!-- Body -->
<div class="uk-container">
<FirebaseApp firebase={firebase}>

    <fieldset class="uk-fieldset">
        <legend class="uk-legend">Crear nuevo Examen</legend>
        <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1 uk-margin-top">
            <label><input class="uk-checkbox" type="checkbox" checked> Activo</label>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <input class="uk-input" type="text" placeholder="Título">
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <textarea class="uk-textarea" rows="3" placeholder="Descripción"></textarea>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input" type="datetime-local" >
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input" type="datetime-local" >
        </div>
        </div>

        <legend class="uk-legend uk-margin-top uk-margin-bottom">Preguntas del examen ({remaining}) </legend>
    {#each preguntas as pregunta}
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

        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-top" disabled={!remaining>=1}>Crear nuevo examen</button>
    </fieldset>


</FirebaseApp>
</div>