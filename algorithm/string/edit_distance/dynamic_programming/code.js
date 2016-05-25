logger._print('Initialized DP Table');
logger._print('Y-Axis (Top to Bottom): ' + str1);
logger._print('X-Axis (Left to Right): ' + str2);

var dist = (function editDistance(str1, str2, table) {
    //display grid with words
    logger._print('*** ' + str2.split('').join(' '));
    table.forEach(function (item, index) {
        var character = (index === 0) ? '*' : str1 [index - 1];
        logger._print(character + '\t' + item);
    });

    //begin ED execution
    for (var i = 1; i < str1.length + 1; i++) {
        for (var j = 1; j < str2.length + 1; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                tracer._select(i - 1, j - 1)._wait();
                table[i][j] = table[i - 1][j - 1];
                tracer._notify(i, j, table[i][j])._wait();
                tracer._denotify(i, j);
                tracer._deselect(i - 1, j - 1);
            }
            else {
                tracer._select(i - 1, j);
                tracer._select(i, j - 1);
                tracer._select(i - 1, j - 1)._wait();
                table[i][j] = Math.min(table [i - 1] [j], table [i] [j - 1], table [i - 1] [j - 1]) + 1;
                tracer._notify(i, j, table[i][j])._wait();
                tracer._denotify(i, j);
                tracer._deselect(i - 1, j);
                tracer._deselect(i, j - 1);
                tracer._deselect(i - 1, j - 1);
            }
        }
    }

    tracer._select(str1.length, str2.length);
    return table [str1.length] [str2.length];
})(str1, str2, table);

logger._print('Minimum Edit Distance: ' + dist);