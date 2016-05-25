logger._print('original array = [' + D.join(', ') + ']');

function quicksort(low, high) {
    if (low < high) {
        var p = partition(low, high);
        quicksort(low, p - 1);
        quicksort(p + 1, high);
    }
}

function partition(low, high) {
    var pivot = D[high];
    tracer._select(low, high);
    var i = low;
    var temp;

    for (var j = low; j < high; j++) {
        if (D[j] <= pivot) {
            temp = D[i];
            D[i] = D[j];
            D[j] = temp;
            tracer._notify(i, D[i])._notify(j, D[j])._wait();
            tracer._denotify(i)._denotify(j);
            i++;
        }
    }
    temp = D[i];
    D[i] = D[high];
    D[high] = temp;
    tracer._notify(i, D[i])._notify(high, D[high])._wait();
    tracer._denotify(i)._denotify(high);
    tracer._deselect(low, high);
    return i;
}

quicksort(0, D.length - 1);
logger._print('sorted array = [' + D.join(', ') + ']');
