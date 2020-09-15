<script>
	
    import { FirebaseApp, User, Doc, Collection } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    const db = firebase.firestore();
    import moment from 'moment';
    import 'moment/locale/es';
    import { Router, Route, Link } from 'yrv';
    import sha512 from 'crypto-js/sha512';
 	export let router = {};
    let id = null;
    $: {
        id = router.params ? router.params.id : null;
    }

    
    let devolucion= [];

</script>
<div class="uk-container uk-margin-top">
<FirebaseApp firebase={firebase}>
<User let:user={user} let:auth={auth} >


<Collection path={`coments`} query={ref=>ref.where("para", "==", `${user.uid}` ).where("leido", "==", false) } let:data let:ref> <!-- .where("leido", "==", false ) -->
<div slot="loading"><div uk-spinner></div></div>
 <div slot="fallback">
    Unable to display ...
</div>
{#if data.length === 0}
    <div class="uk-container uk-margin-top">
        <div class="uk-alert-uk-alert-primary" uk-alert>
            <a class="uk-alert-close" uk-close></a>
            <p><span uk-icon="icon: info"></span> No tienes mensajes.</p>
        </div>
    </div>
{:else}

 {#each data as doc,i}	
 <article class="uk-comment uk-comment-primary uk-visible-toggle uk-margin-top" tabindex="-1">
        <header class="uk-comment-header uk-position-relative">
            <div class="uk-grid-medium uk-flex-middle" uk-grid>
                <div class="uk-width-auto">
                    <img class="uk-comment-avatar" src="{doc.urlphoto}" width="80" height="80" alt="">
                </div>
                  <div class="uk-width-expand">
                    <h4 class="uk-comment-title uk-margin-remove">{doc.de}</h4>
                    <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                        <li>{moment(doc.create_at).calendar()}</li>
                    <Doc path={`examenes/${doc.examenid}`} let:data={item} let:ref >
                    <div slot="loading"><div uk-spinner></div></div>
                        <li><span class="uk-text-muted">{item.titulo}</span></li>
                    </Doc>
                    </ul>
                    <p class="uk-comment-meta uk-margin-remove-top"></p>
                </div>
                </div>
        </header>
            <div class="uk-comment-body">
                <p>{doc.mensaje}</p>
            </div>
        <footer>
            <div class="uk-margin-top">
                <input class="uk-input uk-placeholder" type="text" value={doc.devolucion} bind:this={devolucion[i]} placeholder="Devolución">
                {#if doc.entregado}
                    <span class="uk-label uk-label-success"><span uk-icon="check"></span><span uk-icon="check"></span></span>
                {:else}
                    <span class="uk-label uk-label-danger"><span uk-icon="check"></span></span>
                {/if}
                

                <a class="uk-margin-small-left uk-float-right" href="javascript:void(0)" uk-icon="icon: trash" 
                on:click={async () => await doc.ref.update({ 
                    leido:true
                }) } > </a>

                <button class="uk-button uk-button-text uk-float-right" 
                            on:click={async ()=> await doc.ref.update({
                                create_at:doc.create_at,
                                examenid:doc.examenid,
                                mensaje: doc.mensaje,
                                deuserid:doc.deuserid, 
                                de: doc.de,
                                urlphoto: doc.urlphoto,
                                //cambios wtf
                                update_at: moment().valueOf(),
                                entregado:true,
                                devolucion:devolucion[i].value,
                            }).then(()=>{
                                console.log("Actualizado correctamente");
                            }).catch(e=>{
                                console.log(e)
                            })
                        }>Responder</button>

            </div>
        </footer>    
</article>
 {/each}
 {/if}
</Collection>
 <!-- doc.ref.delete() -->

</User>
</FirebaseApp>
</div>