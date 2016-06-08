// sort according to decreasing order of profit 
// Bubble sort implemented ... Implement a better algorithm for better performance
for (var i = 0; i < N - 1; i++) {
    for (var j = 0; j < N - i - 1; j++) {
        if (profit[j] < profit[j + 1]) {
            var temp = profit[j];
            profit[j] = profit[j + 1];
            profit[j + 1] = temp;
            temp = deadline[j];
            deadline[j] = deadline[j + 1];
            deadline[j + 1] = temp;
            var t = jobId[j];
            jobId[j] = jobId[j + 1];
            jobId[j + 1] = t;
        }
    }
}

var slot = new Array(N);
var result = new Array(N);
for (var i = N - 1; i >= 0; i--) {
    result[i] = '-';
}
tracer._setData(jobId);
tracer1._setData(deadline);
tracer2._setData(profit);
tracer3._setData(result);

// Initialise all slots to free 
for (var i = 0; i < N; i++) {
    slot[i] = 0;
}

// Iterate through all the given jobs
for (var i = 0; i < N; i++) {
    /*
     Start from the last possible slot.
     Find a slot for the job
     */
    tracer._select(i)._wait();
    tracer1._select(i)._wait();
    for (var j = Math.min(N, deadline[i]) - 1; j >= 0; j--) {
        if (slot[j] === 0) {
            tracer3._notify(j, jobId[i])._wait();
            result[j] = jobId[i];
            slot[j] = 1;
            tracer3._denotify(j);
            break;
        }
    }
    tracer._deselect(i);
    tracer1._deselect(i);
}

