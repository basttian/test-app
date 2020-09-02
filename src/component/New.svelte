<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
const db = firebase.firestore();
import firebase from "firebase/app";
import moment from 'moment';
import 'moment/locale/es';
import { Router, Route, Link } from 'yrv';

let preguntas = [];
let cod = '[Esperando codigo de examen..]';

  const AddData = async () => {
        let arr = [];
            preguntas.forEach(element => {
                arr.push(element.text);
            });
        await db.collection(`examenes`).add({
          descripcion: descripcion,
          duracion: _f - _i,
          finaliza:moment(finaliza).valueOf(),
          inicia:moment(inicia).valueOf(),
          preguntas: arr,
          status:status,
          tiempo: _t,
          titulo:titulo,
        }).then(function(i) {
            cod = i.id;
            UIkit.notification({message: "<span uk-icon='icon: calendar'></span> Examen creado con éxito.", 
            pos: 'top-center', 
            status: 'primary',
            timeout: 1000 
            });
        }).catch(error=>{
            console.log(error);
        })
    }

    function add() {
        preguntas = preguntas.concat({ done: false, text: '' });
	}

	function clear() {
		preguntas = preguntas.filter(t => !t.done);
	}

    $: remaining = preguntas.filter(t => !t.done).length;

/* Variables  */
let finaliza = moment().format("YYYY-MM-DDTHH:mm");
let inicia = moment().format("YYYY-MM-DDTHH:mm");
let titulo = '';
let descripcion ='';
let status = false;


/* Contar caracteres */
$: l = (v) => {return v.length};
/* Duracion del examen */
$: d = (i,f) => { return  moment.duration(moment.utc(moment(f).diff(moment(i)))).asMinutes(); };

/* Noo see */
let _i,_f,_t;
$: _t = moment.duration(moment.utc(moment(_f).diff(moment(_i)))).asHours();

</script>
    <svelte:head>
        <title>Crear Examenes</title>
    </svelte:head>
    <!-- Body -->
<div class="uk-container">
<FirebaseApp firebase={firebase}>
        <div class="uk-clearfix">
            <div class="uk-float-right">
                <div class="uk-card uk-card-default uk-card-body">El examen tendra una duración de {d(inicia,finaliza)<0?0:d(_i,_f)} minutos.</div>
            </div>
            <div class="uk-float-left">
               <div class="uk-card uk-card-default uk-card-body"><span class="uk-text-emphasis">{cod}</span></div>
            </div>
        </div>
    <fieldset class="uk-fieldset uk-margin-top">
        <legend class="uk-legend">Crear nuevo Examen</legend>
        <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1 uk-margin-top">
            <label><input class="uk-checkbox" type="checkbox"  bind:checked={status} > Activo</label>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <input class="uk-input {l(titulo)>8?'uk-form-success':'uk-form-danger'}" type="text" bind:value={titulo} placeholder="Título (+8)">
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <textarea class="uk-textarea {l(descripcion)>8?'uk-form-success':'uk-form-danger'}" rows="3" bind:value={descripcion} placeholder="Descripción (+8)"></textarea>
        </div>
        <!-- Fechas -->
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="datetime-local" min={moment().format("YYYY-MM-DDTHH:mm")} bind:value={inicia} 
            on:change={({target: {value}})=> _i = moment(value).valueOf() }
            >
        </div>

        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input {inicia>=finaliza?'uk-form-danger':'uk-form-success'}" 
            type="datetime-local" min={moment().format("YYYY-MM-DDTHH:mm")} bind:value={finaliza} 
            on:change={({target: {value}})=> _f = moment(value).valueOf() }
            >
        </div>

        </div>
        <!-- Preguntas para el array -->
        <legend class="uk-legend uk-margin-top uk-margin-bottom"> 
        Tiempo del examen: {d(inicia,finaliza)<0?0:d(inicia,finaliza)} minutos.
        - 
        Preguntas del examen ({remaining}) </legend>
        <button class="uk-button uk-button-default uk-margin-top" on:click={add}>Agregar nueva pregunta</button>
        <button class="uk-button uk-button-default uk-margin-top" on:click={clear}>Quitar seleccionados</button>
        
    {#each preguntas as pregunta}
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-1">
                <label><input class="uk-checkbox" type=checkbox bind:checked={pregunta.done} > Seleccionar para eliminar la pregunta.</label>
            </div>
            <div class="uk-width-1-1 uk-margin-top">
                <input class="uk-input" bind:value={pregunta.text} 
                disabled={pregunta.done} 
                placeholder="Qué vas a preguntar?"
                >
            </div>
        </div>
    {/each}

        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-top" 
        disabled={!remaining>=1 || !d(inicia,finaliza)>=1 || titulo.length<8 || descripcion.length<8 }
        on:click={()=> AddData() }
        >Crear nuevo examen
        </button>
    </fieldset>
    <!-- info -->
    <p><span uk-icon="info"></span> El código del examen lo obtendra una vez generado el mismo.</p>
</FirebaseApp>
</div>
