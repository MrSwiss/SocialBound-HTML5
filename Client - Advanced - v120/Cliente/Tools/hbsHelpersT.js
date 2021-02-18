const hbsHelpers = {
    commatize: function(a){ return a.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") },
        toHex: function(word){ return new Buffer(word).toString('base64')},
};

module.exports = hbsHelpers;