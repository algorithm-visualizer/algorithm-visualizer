var logger = new LogTracer();

var a = Math.floor(Math.random()*300); if (a % 2 === 0) a += 1;
testProbablyPrime(a);
logger._print("----------");

var a = Math.floor(Math.random()*300); if (a % 2 === 0) a += 1;
testProbablyPrime(a);
logger._print("----------");

var a = Math.floor(Math.random()*300); if (a % 2 === 0) a += 1;
testProbablyPrime(a);
logger._print("----------");

testProbablyPrime(151);
logger._print("----------");

testProbablyPrime(199, 10);