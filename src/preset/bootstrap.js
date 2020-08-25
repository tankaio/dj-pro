import './Globle'
import ls from 'local-storage'
import $ss from './sessionStorage'
import $clip from './clipboard'
import Ua from './UA'

window.ls = ls
window.$ss = $ss
window.$clip = $clip
window.Ua = Ua

if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            let to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (let nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}


(() => {
    let setRem = function () {
        let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        if (htmlWidth > 768) {
            htmlWidth = 768
        }
        let htmlDom = document.getElementsByTagName('html')[0];
        let fontSize = htmlWidth / 750 * 200;
        htmlDom.style.fontSize = fontSize + 'px'
        window.fontSize = fontSize
    }
    setRem()
    window.addEventListener('resize', () => setRem())
})()