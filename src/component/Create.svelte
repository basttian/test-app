<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";

import { Router, Route, Link } from 'yrv';
import createx from "./Create.svelte";
import newx from "./New.svelte";
import viewx from "./Views.svelte";

const menueitem = [
    { component: newx},
    { component: viewx},
  ]

  let menuselected = menueitem[0];

</script>
    <svelte:head>
        <title>Home</title>
    </svelte:head>

    <!-- Body -->
<div class="uk-section">

	<ul uk-tab>
		<li></li>
		<li><a class="uk-active" href="javascript:void(0);" on:click={()=>menuselected = menueitem[0]} >Nuevo examen </a></li>
		<li><a href="javascript:void(0);" on:click={()=>menuselected = menueitem[1]} >Mis examenes  </a></li>
		<li><Link href="/">Home</Link></li>
	</ul>

    <div class="uk-container">
		<svelte:component this={menuselected.component}/>
	</div>
</div>

