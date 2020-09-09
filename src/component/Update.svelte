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
    let _inicio, _fin;

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

/* Carbon Icons */
import FolderDetails32 from "carbon-icons-svelte/lib/FolderDetails32";

</script>
    <svelte:head>
        <title>Crear Examenes</title>
    </svelte:head>

    <!-- Body -->

<nav class="uk-navbar-transparent" uk-navbar>
    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav">
            <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2"></span></Link></li>
        </ul>
    </div>
    <div class="uk-navbar-right">
        <span class="uk-margin-right"><FolderDetails32 /></span>
    </div>
</nav>

<div class="uk-container uk-margin-top">

<FirebaseApp firebase={firebase}>
    <User let:user={user} let:auth={auth} >
<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>


<div class="uk-child-width-1-2@s uk-child-width-1-2@m uk-margin-small-top" uk-grid>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-child-width-1-2@s">
            <span class="uk-text-emphasis">{id}</span>
        </div>
    </div>
    <div>
        <div class="uk-card uk-card-default uk-card-body uk-child-width-1-2@s">
            <span>Tiempo del examen: {moment.duration(_fin - _inicio).asMinutes()} minutos.</span>
        </div>
    </div>
</div>


<fieldset class="uk-fieldset uk-margin-top">
         <legend class="uk-legend">Modificar Examen </legend>
        <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-1 uk-margin-top">
            <input class="uk-checkbox" type="checkbox" bind:this={status} checked={data.status} > 
            <span class="uk-text-meta"> Disponible para todo los usuarios. (Pagina principal)</span>
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <input class="uk-input" type="text"  value={data.titulo} bind:this={titulo} placeholder="Título">
        </div>
        <div class="uk-width-1-2@s uk-margin-top">
            <textarea class="uk-textarea" rows="3" placeholder="Descripción" bind:this={descripcion} >{data.descripcion}</textarea>
        </div>

        {#if data.porfecha}
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

        {:else}
        <!--Relojes -->
        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Inicio</label>
            <input class="uk-input {_inicio>=_fin?'uk-form-danger':'uk-form-success'}" 
            value={moment(data.inicia).format("HH:mm")} type="time" bind:this={inicia} 
            on:change={({target: {value}})=> _inicio = moment(value,"HH:mm") }
            >
        </div>

        <div class="uk-width-1-2@s uk-margin-top">
            <label for="">Fin</label>
            <input class="uk-input {_fin<=_inicio?'uk-form-danger':'uk-form-success'}" bind:this={finaliza}
            value={moment(data.finaliza).format("HH:mm")} type="time"  
            on:change={({target: {value}})=> _fin = moment(value,"HH:mm") }
            >
        </div>
        {/if}

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
            inicia: moment(_inicio).valueOf(), 
            finaliza: moment(_fin).valueOf(),
            duracion: _fin - _inicio,
            uid: user.uid
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
</User>
</FirebaseApp>
</div>