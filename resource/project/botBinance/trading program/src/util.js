module.exports = function() {
    'use strict';

    const formatDateSec = function(date){
        return date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].slice(0,12);
    }

    const formatDateMin = function(date){
        return date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].slice(0,5);
    }

    const formatTime = function(date){
        return date.toISOString().split('T')[1].slice(0,8);
    }

    const round = function(number, precision){
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/round
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    const ceil = function(number, precision){
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/round
        var factor = Math.pow(10, precision);
        return Math.ceil(number * factor) / factor;
    }

    const floor = function(number, precision){
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/round
        var factor = Math.pow(10, precision);
        return Math.floor(number * factor) / factor;
    }

    const pctEvol = function(first, last){
        return ((last - first) / first)*100;
    }

    const wait = function(timeMS, callback){
        setTimeout(()=>{
            callback();
        }, timeMS);
    }

    ////////////////////////////
    return {
        formatDateSec : formatDateSec,
        formatDateMin : formatDateMin,
        formatTime : formatTime,
        round: round,
        floor: floor,
        ceil : ceil,
        pctEvol : pctEvol,
        wait : wait
    };

}();
