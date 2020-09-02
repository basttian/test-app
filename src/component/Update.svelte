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
let descripcion,finaliza,inicia,titulo,preguntas;
let status = false;

    $: remaining = 0;
    let text;

    /* Borrar elementos del arreglo preguntas */
    const DeleteArrayPreguntas = async(value)=>{
        await db.collection(`examenes`).doc(`${id}`).update({
            "preguntas": firebase.firestore.FieldValue.arrayRemove(`${value}`)
        })
    }

    /* Agregar elementos al arreglo preguntas */
    const AgregarArrayPregunta = async(value)=>{
        await db.collection(`examenes`).doc(`${id}`).update({
            "preguntas": firebase.firestore.FieldValue.arrayUnion(`${value}`)
        }).then(()=>{
            text="";
        })
    }

    /* montamos las variables para los calculos del tiempo que tendra el examen */
    import { onMount } from 'svelte';
    let _inicio, _fin, _tiempo;
    $: _tiempo = moment.duration(moment.utc(moment(_fin).diff(moment(_inicio)))).asHours();

    onMount(async () => {

       await db.doc(`examenes/${id}`).get().then(function(doc) {
            if (doc.exists) {
                _inicio = doc.data().inicia;
                _fin = doc.data().finaliza;
                //var x = moment(_inicio);
                //var y  = moment(_fin);
                //var duration =  moment.utc(moment(y).diff(moment(x))).format('HH:mm');
                //console.log(duration)
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

    })


  import View32 from "carbon-icons-svelte/lib/View32";


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
    <div class="uk-navbar-right">
        <span class="uk-margin-right"><View32 /></span>
    </div>
</nav>

<div class="uk-container uk-margin-top">

<FirebaseApp firebase={firebase}>
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div><span class="uk-text-muted uk-text-italic">&nbsp;cargando...</span></div>

        <div class="uk-clearfix">
            <div class="uk-float-right">
                <div class="uk-card uk-card-default uk-card-body">Tiempo estipulado: {(_tiempo).toFixed(0)}hs, que es el equivalente a {moment.duration(_fin - _inicio).asMinutes()} minutos.</div>
            </div>
            <div class="uk-float-left">
               <div class="uk-card uk-card-default uk-card-body"><span class="uk-text-emphasis">{id}</span></div>
            </div>
        </div>

<fieldset class="uk-fieldset uk-margin-top">
         <legend class="uk-legend">Modificar Examen </legend>
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
        <!-- Fechas -->

 
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input {_inicio>=_fin?'uk-form-danger':'uk-form-success'}" 
            value={moment(data.inicia).format("YYYY-MM-DDTHH:mm:ss")} type="datetime-local" bind:this={inicia} 
            on:change={({target: {value}})=> _inicio = moment(value).valueOf() }
            >
        </div>

        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input {_fin<=_inicio?'uk-form-danger':'uk-form-success'}" value={moment(data.finaliza).format("YYYY-MM-DDTHH:mm:ss")} type="datetime-local" bind:this={finaliza} 
            on:change={({target: {value}})=> _fin = moment(value).valueOf() }
            >
        </div>
        </div>

        <legend class="uk-legend uk-margin-top uk-margin-bottom">Preguntas del examen ({remaining + Number(data.preguntas.length)}) </legend>

        <!-- preguntas -->
         <div class="uk-width-1-1 uk-margin-top">
            <div class="uk-placeholder">
              {#each { length:data.preguntas.length } as p,i}
               <span class="uk-label uk-label-danger">
               <a href="javascript:void(0)" uk-icon="icon: close" on:click={()=> DeleteArrayPreguntas(data.preguntas[i]) } ></a>
               </span>
               <span class="uk-text-middle uk-margin-right">{data.preguntas[i]}</span>
              {/each}
            </div>          
        </div>
    
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-1 uk-margin-top">
                <input class="uk-input" bind:value={text} 
                on:change={({ target: { value } }) => AgregarArrayPregunta(value) }
                placeholder="Nueva pregunta.">
            </div>
        </div>
  
        <button class="uk-button uk-button-default uk-width-1-1 uk-margin-top" 
        disabled={!Number(data.preguntas.length)>=1 || Number(_fin) <= Number(_inicio) }
        on:click={()=> {
        ref.update({ 
            status:status.checked, 
            titulo:titulo.value, 
            descripcion:descripcion.value, 
            inicia:moment(inicia.value).valueOf(), 
            finaliza:moment(finaliza.value).valueOf(),
            tiempo: _tiempo,
            duracion: _fin - _inicio
        }).then(()=>{
            UIkit.notification({message: "<span uk-icon='icon: calendar'></span> Examen actualizado con éxito.", 
            pos: 'top-center', 
            status: 'primary',
            timeout: 1000 
            })
        })}}
        >Actualizar examen</button>
</fieldset>
    <div slot="fallback">
        Unable to display data...
    </div>
</Doc>
</FirebaseApp>
</div>