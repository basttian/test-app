<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    export let router = {};
    let id = null;
    $: {
        id = router.params ? router.params.id : null;
    }
    import { get } from 'svelte/store';
    import { _userid } from "../store/store.js"
    const _usuario = get(_userid);
    let itemId = '0';

    import { quill } from 'svelte-quill'
	let options = { placeholder: "Write something from outside...", }
	let content = { html: '', text: ''};


let corregido = false;
let nota;
import sha512 from 'crypto-js/sha512';
</script>

    <svelte:head>
        <title>Corregir examenes</title>
        <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    </svelte:head>
    <!-- Body -->
<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >
<nav class="uk-navbar-transparent" uk-navbar>
        <div class="uk-navbar-left">
            <ul class="uk-navbar-nav">
                <li class="uk-active"><Link go="back" ><span class="uk-margin-small-right" uk-icon="icon:  arrow-left; ratio: 2" uk-tooltip="title: Atras; pos: right"></span></Link></li>
            </ul>
        </div>
        <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
             <li class="uk-active"><Link href="/{sha512('ingresos')}/{id}" ><span class="uk-margin-small-right" uk-icon="icon: cog; ratio: 2" uk-tooltip="title: Administrar ingresos; pos: left"></span></Link></li>
            }
            </ul>
        </div>
</nav>

<Doc path={`examenes/${id}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-bottom">
<div class="uk-alert-primary" uk-alert>
    <a class="uk-alert-close" uk-close></a>
    <span class="uk-text-meta">{data.titulo} - {data.descripcion}</span>
    <p><span uk-icon="icon: calendar"></span> {moment(data.inicia).format("LLLL")} <span uk-icon="icon: calendar"></span> {moment(data.finaliza).format("LLLL")}. <span uk-icon="icon: clock"></span> 
    {moment.duration(data.finaliza - data.inicia).asMinutes() === 1 ? moment.duration(data.finaliza - data.inicia).asMinutes() +' minuto.' : moment.duration(data.finaliza - data.inicia).asMinutes() +' minutos.' }</p>
</div>
</div>
</Doc>

<div class="uk-container">
<Collection path={`respuestas`} query={ (ref) => ref.where("idexamen","==",`${id}`)} let:data let:ref log>
<div class="uk-container uk-margin-top" slot="loading"><div uk-spinner></div></div>
<div class="uk-container uk-margin-top" slot="fallback">
    Unable to display ...
</div>
<div class="uk-grid-divider uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
<div class="uk-width-auto@m">

<table class="uk-table uk-table-divider uk-table-small">
    <thead>
    <tr>
        <th>Nombre</th>
        <th>Ev</th>
        <th>Nota</th>
        <th>Ver</th>
    </tr>
    </thead>
    <tbody>
{#each data as item}
    <tr>
        <td>{item.nombre}</td>
        <td><span class="{item.corregido?'uk-label':'uk-label uk-label-danger'} ">{item.corregido?'Si':'No'}</span></td>
        <td>{item.nota}</td>
        <td><a uk-icon="icon: search" on:click={()=> itemId = item.id }></a></td>
    </tr>
{/each}
    </tbody>
</table>


</div>
<div class="uk-width-expand@m">
<Doc path={`respuestas/${itemId}`} let:data let:ref log >
<div slot="loading"><div uk-spinner></div></div>

<div slot="default">
<div class="uk-background-muted uk-padding-small uk-panel">
    <div class="uk-clearfix">
        <div class="uk-float-right">
           <label><input class="uk-checkbox" type="checkbox" bind:this={corregido} checked={data.corregido} 
           on:change={async ()=> await ref.update({respuestas:content.html ,corregido: corregido.checked}) }
            > Marcar como Evaluado</label> 
            <a href="javascript:void(0);" uk-icon="icon: trash" on:click={() => {
                    UIkit.modal.confirm(`Esta seguro que desea eliminar el examen de ${data.nombre}`).then(function() {
                    ref.delete().then(()=>{
                    UIkit.notification({message: `<span uk-icon='icon: trash'></span> Examen eliminado éxitosamente.`, pos: 'top-center', status: 'primary'})
                    })
                }, function () {
                    UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'top-center', status: 'danger'})
                })
            }}
            > </a>
        </div>
        <div class="uk-float-left">
            {data.nombre}
        </div>
    </div>
</div>
{#each { length:data.preguntas.length } as item,i}
<div class="uk-column-1-2@s">
{`${i+1})`} {data.preguntas[i]}
</div>
{/each}

<main>
<div class="uk-clearfix uk-background-muted uk-padding-small">
    <div class="uk-float-right">
        <input class="uk-input uk-form-width-small" min="1" type="number" value={data.nota} bind:this={nota} step="0.5" max="10" placeholder="Nota"
        on:change={()=> ref.update({nota: nota.value}) }
        ><span class="uk-float-right" uk-icon="icon: file-edit; ratio: 2"></span>
    </div>
    <div class="uk-float-left">
        <h3 class="uk-float-left">Respuestas</h3>
    </div>
</div>
  <div class="editor" use:quill={options} on:text-change={e => content = e.detail}>
  {@html data.respuestas}
  </div>
</main>
<p>El examen se realizo {data.expired?" fuera de tiempo":" en tiempo programado"} el dia {moment(data.fecha).format("LLLL")}</p>

</div>

<div slot="fallback">
    <div uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <h3>Información</h3>
        <p><span uk-icon="icon: search" ></span> Debe seleccionar un examen.</p>
    </div>
</div>
</Doc>
</div>
</div>
</Collection>
</div>
</User>
</FirebaseApp>