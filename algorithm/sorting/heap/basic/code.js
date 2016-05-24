tracer._print('Original array = [' + D.join(', ') + ']');

function heapSort(array, size) {
    var i, j, temp;

    for (i = Math.ceil(size / 2) - 1; i >= 0; i--) {
        heapify(array, size, i);
    }

    for (j = size - 1; j >= 0; j--) {
        temp = array[0];
        array[0] = array[j];
        array[j] = temp;
        
        tracer._notify(0, j);
        tracer._select(j);

        heapify(array, j, 0);
        tracer._print('Swapping elements : ' + array[0] + ' & ' + array[j]);

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

        tracer._notify(largest, root);

        tracer._print('Swapping elements : ' + array[root] + ' & ' + array[largest]);

        heapify(array, size, largest);
    }
}

tracer._sleep(1000);
tracer._pace(800);

heapSort(D, D.length);

tracer._print('Final array = [' + D.join(', ') + ']');
