function init(rank) {
  var o = {};
  for (var k in rank) {
    o[k] = {
      key: k,
      stable: false,
      rank_keys: rank[k]
    };
  }
  return o;
}

function extractUnstable(Q) {
  for (var k in Q) {
    if (Q[k].stable === false) {
      return Q[k];
    }
  }
}

var A = init(ARank), B = init(BRank);
var a, b;

while ((a = extractUnstable(A)) != null) {

  logTracer._print('Selecting ' + a.key)._wait();

  var bKey = a.rank_keys.shift();
  var b = B[bKey];
  
  logTracer._print('--> Choicing ' + b.key)._wait();

  if (b.stable === false) {
  
    logTracer._print('--> ' + b.key + ' is not stable, stabilizing with ' + a.key)._wait();
 
    a.stable = b;
    b.stable = a;
 
    tracerA._select(_aKeys.indexOf(a.key))._wait();
    tracerB._select(_bKeys.indexOf(b.key))._wait();

  } else {

    var rank_a_in_b = b.rank_keys.indexOf(a.key);
    var rank_prev_a_in_b = b.rank_keys.indexOf(b.stable.key);
    if (rank_a_in_b < rank_prev_a_in_b) {
   
      logTracer._print('--> ' + bKey + ' is more stable with ' + a.key + ' rather than ' + b.stable.key + ' - stabilizing again')._wait();
 
      A[b.stable.key].stable = false;
      tracerA._deselect(_aKeys.indexOf(b.stable.key))._wait();
 
      a.stable = b;
      b.stable = a;

      tracerA._select(_aKeys.indexOf(a.key))._wait();
      tracerB._select(_bKeys.indexOf(b.key))._wait();
    }

  }
}