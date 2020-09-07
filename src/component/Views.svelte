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


const copyTextToClipboard = (v) => {
  
    try{
        var unique = document.querySelectorAll('.unique');
        var msg = `${v}` ;

        unique.forEach(function (unique) {
            msg+=unique.value;
        });

        var temp =document.createElement("textarea");
        var tempMsg = document.createTextNode(msg);
        temp.appendChild(tempMsg);

        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Copiado!",
            status: 'primary',
            pos: 'top-center',
            timeout: 1000
        });
        }
    catch(err) {
        console.log("error");
    }
    
}


</script>
    <svelte:head>
        <title>Mis Examenes</title>
    </svelte:head>
 
    <!-- Body -->
<div class="uk-container uk-margin-top">

<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >
	<Collection 
    path={'examenes'} 
    query={ (ref) => ref.where("uid","==", user.uid) } 
    log
    let:data
    let:ref
	>
    <div slot="loading"><div uk-spinner></div></div>

{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> Aun no has creado examenes.</p>
        </div>
    </div>
{:else}
<div class="uk-child-width-1-3@m uk-grid-small uk-grid-match" uk-grid>
    {#each data as item}
    <div>
        <div class="uk-card uk-card-primary uk-card-hover uk-card-body">
            <ul uk-accordion="multiple: true">
                <li>
                    <a class="uk-accordion-title" href="#"><span uk-icon="icon: grid"></span></a>
                    <div class="uk-accordion-content">
                    <Link class="uk-link-reset uk-icon-link uk-margin-small-right" href="/{sha512('update')}/{item.id}" uk-tooltip="Editar." ><span uk-icon="file-edit"></span></Link>
                    <Link href="/{sha512('respuestas')}/{item.id}" class="uk-icon-link" uk-icon="icon: folder" uk-tooltip="Corregir examenes."> </Link>
                    <Link href="/{sha512('ingresos')}/{item.id}" class="uk-icon-link" uk-icon="icon: database" uk-tooltip="Administrar ingresos."> </Link>
                    <a href="javascript:void(0)" class="uk-icon-link" uk-tooltip="Eliminar." uk-icon="trash" on:click={()=> delExamen(item.id) } > </a>
                    </div>
                </li>
            </ul>
            <h3 class="uk-card-title">{item.titulo}</h3>
            <p>{item.descripcion}</p>
            <div class="uk-margin uk-align-center">
                <div class="uk-inline">
                    <a class="uk-form-icon uk-form-icon-flip" href="javascript:void(0)" uk-icon="icon: copy"
                    on:click={()=> copyTextToClipboard(item.id) } uk-tooltip="Copiar código"> </a>
                    <input class="uk-input uk-form-blank uk-form-width-large" type="text" 
                    value={item.id}
                    disabled={true} >
                </div>
            </div>
        </div>
    </div>
    {/each}
</div>
{/if}

<!-- Si hay un error -->
<div slot="fallback">
    Unable to display data...
</div>

</Collection>
</User>
</FirebaseApp>
</div>