logger._print('Original array = [' + D.join(', ') + ']');

function heapSort(array, size) {
    var i, j, temp;

    for (i = Math.ceil(size / 2) - 1; i >= 0; i--) {
        heapify(array, size, i);
    }

    for (j = size - 1; j >= 0; j--) {
        temp = array[0];
        array[0] = array[j];
        array[j] = temp;
        
        tracer._notify(0, array[0])._notify(j, array[j]);
        logger._print('Swapping elements : ' + array[0] + ' & ' + array[j])._wait();
        tracer._denotify(0)._denotify(j);
        tracer._select(j)._wait();

        heapify(array, j, 0);

        tracer._deselect(j);
    }
}

function heapify(array, size, root) {

    var largest = root;
    var left = 2 * root + 1;
    var right = 2 * root + 2;
    var temp;

    if (left < size && array[left] > array[largest]) {
        largest = left;
    }

    if (right < size && array[right] > array[largest]) {
        largest = right;
    }

    if (largest != root) {
        temp = array[root];
        array[root] = array[largest];
        array[largest] = temp;

        tracer._notify(root, array[root])._notify(largest, array[largest]);
        logger._print('Swapping elements : ' + array[root] + ' & ' + array[largest])._wait();
        tracer._denotify(root)._denotify(largest);

        heapify(array, size, largest);
    }
}

heapSort(D, D.length);

logger._print('Final array = [' + D.join(', ') + ']');
