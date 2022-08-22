function actualizarCacheDinamico ( cachedinamico, req, res) {

    if( res.ok ) {
        caches.open( cachedinamico ).then ( cache => {

            cache.put( req, res.clone());

            return res.clone();
        });
    } else {
        
        return req;

    }
    
}