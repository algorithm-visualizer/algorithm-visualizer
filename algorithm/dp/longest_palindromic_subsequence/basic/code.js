function max(a,b) {
  if(a>b){
    return a;
  } else {
    return b;
  }
}
logger._print("LPS for any string with length = 1 is 1");
for(i=2;i<=N;i++) {
  logger._print("--------------------------------------------------");
  logger._print("Considering a sub-string of length "+i);
  logger._print("--------------------------------------------------");
  for(j=0;j<N-i+1;j++) {
    var k = j+i-1;
    tracer._select(j)._wait();
    tracer._notify(k)._wait();

    logger._print("Comparing "+seq[j] + " and "+seq[k]);

    if(seq[j]==seq[k] && i==2) {
      logger._print("They are equal and size of the string in the interval"+j+" to "+k+" is 2, so the Longest Palindromic Subsequence in the Given range is 2");

      matrix._notify(j,k)._wait();

      L[j][k]=2;
      matrix._setData(L);

      matrix._denotify(j,k)._wait();

    } else if(seq[j]==seq[k]) {
      logger._print("They are equal, so the Longest Palindromic Subsequence in the Given range is 2 + the Longest Increasing Subsequence between the indices "+(j+1)+" to "+(k-1));

      matrix._notify(j,k)._wait();
      matrix._select(j+1,k-1)._wait();

      L[j][k] = L[j+1][k-1] + 2;
      matrix._setData(L);

      matrix._denotify(j,k)._wait();
      matrix._deselect(j+1,k-1)._wait();

    } else {
      logger._print("They are NOT equal, so the Longest Palindromic Subsequence in the Given range is the maximum Longest Increasing Subsequence between the indices "+(j+1)+" to "+(k) + " and "+(j)+" to "+(k-1));
      matrix._notify(j,k)._wait();
      matrix._select(j+1,k)._wait();
      matrix._select(j,k-1)._wait();

      L[j][k] = max(L[j+1][k],L[j][k-1]);
      matrix._setData(L);

      matrix._denotify(j,k)._wait();
      matrix._deselect(j+1,k)._wait();
      matrix._deselect(j,k-1)._wait();
    }
    logger._print("--------------------------------------------------");
    tracer._deselect(j)._wait();
    tracer._denotify(k)._wait();
  }
}
logger._print("Longest Increasing Subsequence of the given string = L[0]["+(N-1)+"]="+L[0][N-1]);
