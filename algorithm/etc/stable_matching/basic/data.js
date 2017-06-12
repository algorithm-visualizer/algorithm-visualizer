var ARank = {
'Flavio'  : [ 'Valentine', 'July', 'Summer', 'Violet' ],
'Stephen': [ 'Summer', 'July', 'Valentine', 'Violet' ],
'Albert' : [ 'July', 'Violet', 'Valentine', 'Summer' ],
'Jack' : [ 'July', 'Violet', 'Valentine', 'Summer' ]
};

var BRank = {
'July': [ 'Jack', 'Stephen', 'Albert', 'Flavio' ],
'Valentine': [ 'Flavio', 'Jack', 'Stephen', 'Albert' ],
'Violet': [ 'Jack', 'Stephen', 'Flavio', 'Albert' ],
'Summer': [ 'Stephen', 'Flavio', 'Albert', 'Jack' ],
};

var tracerA = new Array1DTracer('A');
var tracerB = new Array1DTracer('B');

var _aKeys = Object.keys(ARank);
var _bKeys = Object.keys(BRank);
tracerA._setData(_aKeys);
tracerB._setData(_bKeys);

var logTracer = new LogTracer ( 'Console' );