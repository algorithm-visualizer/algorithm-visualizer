logger._print('original array = [' + D.join(', ') + ']');

function partition(D, low, high) {
    var i, j, s;
    while (high > low) {
        i = low;
        j = high;
        s = D[low];
        while (i < j) {
            tracer._select(high)._select(low)._wait();
            while (D[j] > s){ 
                tracer._select(j)._wait();
                tracer._deselect(j);
                j--;
            }
            D[i] = D[j];
            tracer._notify(i, D[j])._wait()._denotify(i);
            while (s >= D[i] && i < j){ 
                tracer._select(i)._wait();
                tracer._deselect(i);
                i++;
            }
            D[j] = D[i];
            tracer._notify(j, D[i])._wait()._denotify(j);
            tracer._deselect(high)._deselect(low);
        }
        D[i] = s;
        tracer._notify(i, s)._wait();
        tracer._denotify(i);
        partition(D, low, i-1);
        low = i+1;
    }
}

function quicksort(D) {
       partition(D, 0, D.length-1);
}

quicksort(D);
logger._print('sorted array = [' + D.join(', ') + ']');
