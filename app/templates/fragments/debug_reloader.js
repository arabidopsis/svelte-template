(function() {
    if (!window._DEBUG_) return;
    const { url, path, mtime, reloader } = window._DEBUG_
    const id = setInterval(async function() {
        const a = await fetch(url, {
            method:"POST",
            body: JSON.stringify(
                {path,mtime}
            ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        const r = await a.json()
        // console.log(r)
        if(r.status === 'OK' && r.needsupdate) {
            console.log('reloading page... ')
            window.location.reload()
        }
    }, reloader || 1000);
})();
