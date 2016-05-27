var tracer = new Array2DTracer('Distance Table');
var logger = new LogTracer();
var str1 = 'stack', str2 = 'racket', table = new Array(str1.length + 1);

table[0] = Array.apply(null, {length: str2.length + 1}).map(Number.call, Number);
for (var i = 1; i < str1.length + 1; i++) {
    table[i] = Array.apply(null, Array(str2.length + 1)).map(Number.prototype.valueOf, -1);
    table[i] [0] = i
}

tracer._setData(table);
