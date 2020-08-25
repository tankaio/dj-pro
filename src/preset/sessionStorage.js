const $ss = (key, val) => {

    if (val && !G.isEmpty(val)) {

        try {

            if (G.isObj(val) || G.isArr(val)) {
                val = JSON.stringify(val)
            }
            sessionStorage.setItem(key, val)

        } catch (error) {
            console.error(`[key]:${key} [val]:${val} [error]:${error}`);
        }

    } else {

        return sessionStorage.getItem(key)

    }
}

$ss.prototype.clear = sessionStorage.clear()
$ss.prototype.remove = key => sessionStorage.removeItem(key)

export default $ss