<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";

import { Router, Route, Link } from 'yrv';
import sha512 from 'crypto-js/sha512';

</script>
    <svelte:head>
        <title>Mis Examenes</title>
    </svelte:head>

    <!-- Body -->
<div class="uk-container">

<FirebaseApp firebase={firebase}>
    <!-- default slot -->

	<Collection 
    path={'examenes'} 
    log
    let:data
    let:ref
	>
    <div slot="loading"><div uk-spinner></div><span class="uk-text-muted uk-text-italic">&nbsp;cargando...</span></div>

<div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
    {#each data as item}

    <div>
        <Link class="uk-link-reset" href="/{sha512('update')}/{item.id}">
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body">
             <a class="uk-position-absolute uk-transform-center" style="left: 95%; top: 20%" href="#" uk-close on:click={()=>alert("Click")}></a>
            <h3 class="uk-card-title">{item.titulo}</h3>
            <p>{item.descripcion}</p>
        </div>
        </Link>
    </div>

    {/each}
</div>

    <div slot="fallback">
        Unable to display data...
    </div>

</Collection>
</FirebaseApp>
</div>