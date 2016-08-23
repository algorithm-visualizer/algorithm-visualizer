logger._print('original array = [' + D.join(', ') + ']');
var N = D.length;
function flip (start) {
  tracer._select(start, N)._wait();
  var idx = 0;
  for (var i=start;i<(start+N)/2;i++) {
    tracer._select(i)._wait();
    var temp = D[i];
    D[i] = D[N-idx-1];
    D[N-idx-1] = temp;
    idx++;
    tracer._notify(i, D[i])._notify(N-idx, D[N-idx])._wait();
    tracer._denotify(i)._denotify(N-idx);
    tracer._deselect(i);
  }
  tracer._deselect(start, N);
}
for (var i=0;i<N-1;i++) {
  logger._print('round ' + (i+1));
  var currArr = D.slice(i, N);
  var currMax = currArr.reduce((prev, curr, idx) => {
    return (curr > prev.val) ? { idx: idx, val: curr} : prev;
  }, {idx: 0, val: currArr[0]});
  if (currMax.idx !== 0) { // if currMax.idx === 0 that means max element already at the bottom, no flip required
    logger._print('flip at ' + (currMax.idx+i) + ' (step 1)');
    flip(currMax.idx+i, N);
    logger._print('flip at ' + (i) + ' (step 2)');
    flip(i, N);
  }
}
logger._print('sorted array = [' + D.join(', ') + ']');
