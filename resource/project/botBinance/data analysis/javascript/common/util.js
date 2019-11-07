class Util{

    static floor(number, precision){
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Math/round
        var factor = Math.pow(10, precision);
        return Math.floor(number * factor) / factor;
    }

    static pctEvol(first, last){
        return ((last - first) / first)*100;
    }
}

module.exports = Util
