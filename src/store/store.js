import { derived,  readable, writable } from 'svelte/store'

/* fecha portada */
export const relog = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
    }, 1000);
    return function stop() {
		clearInterval(interval);
	};
});

//I Love
export const _userid =  writable();
export const progress = writable(0);
