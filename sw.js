//Importación de utils
importScripts ('js/sw-utils.js');

const rootInit = window.location.href.includes('localhost') ? '/' : '';


const CACHE_STATIC      = "static-v2";
const CACHE_DYNAMIC     = "dynamic-v2";
const CACHE_INMUTABLE   = "inmutable-v1";

const STATIC_CONTENT = [

    rootInit ,
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/sw-utils.js',
    'js/app.js'

];

const INMUTABLE_CONTENT = [

    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

self.addEventListener('install', e => {

    const staticInstall = caches.open( CACHE_STATIC )
        .then( cache => cache.addAll(STATIC_CONTENT));


    const inmutableInstall = caches.open( CACHE_INMUTABLE )
        .then( cache => cache.addAll(INMUTABLE_CONTENT));

    e.waitUntil ( Promise.all ([staticInstall,inmutableInstall]));

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys()
    
        .then( keys => {

            keys.forEach( key => {

                if( key !== CACHE_STATIC && key.includes('static')) {
                    return caches.delete(key);
                }

                if ( key !== CACHE_DYNAMIC && key.includes('dynamic')) {
                    return caches.delete(key);
                }

            }); 

    });


    e.waitUntil( respuesta );
});


self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request )
    .then( res => {

        if(res) {
            return res;
        } else {
            return fetch( e.request ).then ( newRes => {

                return actualizarCacheDinamico(CACHE_DYNAMIC, e.request, newRes);
            });
        }



    });


    e.respondWith( respuesta );
})