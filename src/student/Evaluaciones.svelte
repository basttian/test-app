<script>

    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
 
    import { quill } from 'svelte-quill'
	let options = { placeholder: "..." }
    let content = { html: '', text: ''};

    import sha512 from 'crypto-js/sha512';
    let idExamen=[{idex:'',idDoc:''}];

</script>

    <svelte:head>
        <title>Mis evaluaciones</title>
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
             
            </ul>
        </div>
</nav>
<div class="uk-container">
<Collection path={`respuestas`} query={ (ref) => ref.where("uid","==",`${user.uid}`)} let:data let:ref log>
<div slot="loading"><div uk-spinner></div></div>
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Aun no has realizado ninguna evaluación.</p>
        </div>
    </div>
{:else}

<div class="uk-grid-divider uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
<div class="uk-width-auto@m">
<span class="uk-text-uppercase">Evaluaciones realizadas </span>
 <ul class="uk-list uk-list-striped">
{#each data as item} 
    <li>
    <span class="{item.corregido?'uk-label':'uk-label uk-label-danger'} ">{item.corregido?'Si':'No'}</span>
    {moment(item.fecha).format("LLLL")}  <a uk-icon="icon: search" on:click={() =>  idExamen={idex:`${item.idexamen}`,idDoc:`${item.id}`}  }></a></li>
{/each}
</ul>

</div>
    <div class="uk-width-expand@m">
    <Doc path={`examenes/${idExamen.idex}`} let:data let:ref log>
    <div slot="loading"><div uk-spinner></div></div>
    <div class="uk-alert-primary" uk-alert>
        <a class="uk-alert-close" uk-close></a>
        <h3>{data.titulo}</h3>
        <p>{data.descripcion}</p>
    </div>
    <div slot="fallback">
        <div uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <h3>Información</h3>
            <p>Datos no disponibles.</p>
        </div>
    </div>
   
    <Doc path={`respuestas/${idExamen.idDoc}`} let:data let:ref log>
    <div slot="loading"><div uk-spinner></div></div>
        <div class="uk-background-muted uk-padding-small uk-panel uk-margin-bottom">
            <p class="uk-h4">{data.nota===0?'Aun no tiene nota.': `Calificación: ${data.nota}`}</p>
        </div>
    
    {#each { length:data.preguntas.length } as item,i}
     <p class="uk-text-bold">{`${i+1})`} {data.preguntas[i]}</p>
    {/each}


    <div uk-grid>
        <div>
            <main>
                <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
                    {@html data.respuestas}
                </div>
            </main>
        </div>
        <div>
            {#if data.correcciones === void 0}
                 El examen no presenta correcciones.
            {:else}
            <main>
                <div class="editor" use:quill={options} on:text-change={e => content = e.detail} >
                    {@html data.correcciones}
                </div>
            </main>
            {/if}
        </div>
    </div>
    </Doc> </Doc>
    </div>
</div>
{/if}
<div slot="fallback">
    Unable to display ...
</div>
</Collection>
</div>
</User>
</FirebaseApp>