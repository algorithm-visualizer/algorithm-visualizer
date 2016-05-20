tracer._print('original array = [' + D.join(', ') + ']');
tracer._sleep(1000);
tracer._pace(500);
function quicksort(low, high) {
    if (low < high) {
        var p = partition(low, high);
        quicksort(low, p - 1);
        quicksort(p + 1, high);
    }
}
function partition(low, high) {
    var pivot = D[high];
    tracer._selectSet([low, high]);
    var i = low;
    for (var j = low; j < high; j++) {
        if (D[j] <= pivot) {
            var temp = D[i];
            D[i] = D[j];
            D[j] = temp;
            tracer._notify(i, j);
            i++;
        }
    }
    var temp = D[i];
    D[i] = D[high];
    D[high] = temp;
    tracer._notify(i, high);
    tracer._deselectSet([low, high]);
    return i;
}
quicksort(0, D.length - 1);
tracer._print('sorted array = [' + D.join(', ') + ']');