logger._print("Finding the greatest common divisor of " + a[0] + " and " + a[1]);

logger._print("Checking if first number is at most the second number");

if(a[0] > a[1]) {
    var tmp = a[0];
    a[0] = a[1];
    a[1] = tmp;
    logger._print("The first number is bigger than the second number. Switching the numbers.");
    tracer._setData(a)._wait();
}

while(a[0] > 0) {
    logger._print(a[1] + " % " + a[0] + " = " + a[1]%a[0]);
    logger._print("Switching a[1] with a[1]%a[0]");
    a[1] %= a[0];
    tracer._notify(1, a[1])._wait();
    logger._print("Now switching the two values to keep a[0] < a[1]");
    var tmp = a[0];
    a[0] = a[1];
    a[1] = tmp;
    tracer._notify(0, a[0]);
    tracer._notify(1, a[1])._wait();
    tracer._denotify(0);
    tracer._denotify(1);
}

logger._print("The greatest common divisor is " + a[1]);