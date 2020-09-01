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
<h3>Mis Examenes </h3>


<FirebaseApp firebase={firebase}>
    <!-- default slot -->

	<Collection 
    path={'examenes'} 
    log
    let:data
    let:ref
	>
    <div slot="loading">Loading...</div>

<div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
    {#each data as item}

    <div>
        <Link class="uk-link-reset" href="/{sha512('update')}/{item.id}">
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body">
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