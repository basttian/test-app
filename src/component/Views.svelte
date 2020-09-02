<script>
import { FirebaseApp, User, Doc, Collection } from "sveltefire";
import firebase from "firebase/app";
const db = firebase.firestore();
import { Router, Route, Link } from 'yrv';
import sha512 from 'crypto-js/sha512';


const delExamen = async(id) =>{
     await UIkit.modal.confirm('Esta seguro que desea eliminar el examen!').then(function() {
        db.collection("examenes").doc(`${id}`).delete().then(function() {
            UIkit.notification({
                message: '<span uk-icon="icon: trash"></span> Examen eliminado correctamente.',
                status: 'primary',
                pos: 'top-right',
                timeout: 1500
            });
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        console.log('Confirmed.')
    }, function () {
            UIkit.notification({
                message: '<span uk-icon="icon: check"></span> Cancelado.',
                status: 'primary',
                pos: 'top-right',
                timeout: 1500
            });
        console.log('Rejected.')
    })
}



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
        
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body">
            <ul uk-accordion="multiple: true">
                <li>
                    <a class="uk-accordion-title" href="#"><span uk-icon="icon: grid"></span></a>
                    <div class="uk-accordion-content">
                    <Link class="uk-link-reset uk-icon-link uk-margin-small-right" href="/{sha512('update')}/{item.id}"><span uk-icon="file-edit"></span></Link>
                    <a href="javascript:void(0)" class="uk-icon-link" uk-icon="trash" on:click={()=> delExamen(item.id) } > </a>
                    </div>
                </li>
            </ul>
            <h3 class="uk-card-title">{item.titulo}</h3>
            <p>{item.descripcion}</p>
            <input class="uk-input uk-form-blank uk-form-width-large" type="text" value={item.id} disabled={true}>
        </div>
        
    </div>

    {/each}
</div>

    <div slot="fallback">
        Unable to display data...
    </div>

</Collection>
</FirebaseApp>
</div>