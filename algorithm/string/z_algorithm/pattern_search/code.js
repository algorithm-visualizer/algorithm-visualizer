function createZarr(concat) {
  var i,left,right,k,N;
  N=concat.length;
  left=0;
  right=0;
  for(i=1;i<N;i++) {
    tracer._select(i)._wait();
    if(i>right) {
      left=right=i;
      while(right<N && concat[right]==concat[right-left]) {

        concat_tracer._notify(right)._wait();
        concat_tracer._select(right-left)._wait();
        logger._print(concat[right]+" ( at position "+right+" ) is equal to "+concat[right-left]+" (at position "+(right-left)+")");
        concat_tracer._denotify(right)._wait();
        concat_tracer._deselect(right-left)._wait();
        right++;
      }
      concat_tracer._notify(right)._wait();
      concat_tracer._select(right-left)._wait();
      logger._print(concat[right]+" ( at position "+right+" ) is NOT equal to "+concat[right-left]+" (at position "+(right-left)+")");
      concat_tracer._denotify(right)._wait();
      concat_tracer._deselect(right-left)._wait();
      z[i]=(right-left);
      logger._print("--------------------------------");
      logger._print("Value of z["+i+"] = the length of the substring starting from "+i+" which is also the prefix of the concatinated string(="+(right-left)+")");
      logger._print("--------------------------------");
      right--;
    } else {
      if(z[i-left]<(right-i+1)) {
        logger._print("The substring from index "+(i-left)+" will not cross the right end.");
        concat_tracer._select(i-left)._wait();
        concat_tracer._notify(right-i+1)._wait();
        z[i]=z[i-left];
        concat_tracer._deselect(i-left)._wait();
        concat_tracer._denotify(right-i+1)._wait();
      } else {
        logger._print("The substring from index "+(i-left)+" will cross the right end.");
        left=i;
        while (right<N && concat[right]==concat[right-left]) {
          concat_tracer._notify(right)._wait();
          concat_tracer._select(right-left)._wait();
          logger._print(concat[right]+" ( at position "+right+" ) is equal to "+concat[right-left]+" (at position "+(right-left)+")");
          concat_tracer._denotify(right)._wait();
          concat_tracer._deselect(right-left)._wait();
          right++;
        }
        concat_tracer._notify(right)._wait();
        concat_tracer._select(right-left)._wait();
        logger._print(concat[right]+" ( at position "+right+" ) is NOT equal to "+concat[right-left]+" (at position "+(right-left)+")");
        concat_tracer._denotify(right)._wait();
        concat_tracer._deselect(right-left)._wait();
        z[i]=(right-left);
        right--;
        logger._print("--------------------------------");
        logger._print("Value of z["+i+"] = the length of the substring starting from "+i+" which is also the prefix of the concatinated string(="+(right-left)+")");
        logger._print("--------------------------------");
      }
    }
    tracer._deselect(i)._wait();
    tracer._setData(z);
  }
}

var concat = pattern + "$" + text;
concat_tracer._setData(concat);
var patLen = pattern.length;
createZarr(concat);
tracer._setData(z);
var i;
logger._print("The Values in Z array equal to the length of the pattern indicates the index at which the pattern is present");
logger._print("===================================");
for(i=0;i<len;i++) {
  if(z[i]==patLen) {
    var pos = i - (patLen+1);
    logger._print("Pattern Found at index "+pos);
  }
}
logger._print("===================================");
