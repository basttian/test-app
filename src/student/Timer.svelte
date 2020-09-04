<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/auth";
  import { tweened } from 'svelte/motion';
  export let minut;
  let original = minut * 60; 
  let timer = tweened(original)
  setInterval(() => {
    if ($timer > 0) $timer--;
  }, 1000);
  $: minutes = Math.floor($timer / 60);
  $: seconds = Math.floor($timer - minutes * 60)
</script>

    {#if timer < 1}
      <h1>Starting soon....</h1>
    {:else}
      <h4>Tiempo restante <span class="mins">{minutes}:{seconds}</span>s!</h4>
      <progress  class="uk-progress" value={$timer/original}></progress>
    {/if}
 
  