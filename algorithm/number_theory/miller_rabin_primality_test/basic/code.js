// Utility function to do modular exponentiation.
// It returns (x^y) % p
function power(x, y, p)
{
	var res = 1;
	x = x % p;
	while (y > 0) {
    	// If y is odd, multiply x with result
      if (y & 1) res = (res*x) % p;
      // y must be even now
      y = y>>1; // y = y/2
      x = (x*x) % p;
   }
   return res;
}


/**
 * Determine if N is prime using Miller-Rabin probabilistic algorithm
 * @param  {Number} n The number
 * @param  {Number} k An integer that determine the accuracy of the solution
 * @return {Boolean}
 */
function testProbablyPrime(n, k) {
	logger._print("==> Testing number " + n);

	if (n === 1 || n === 3) {
		logger._print("==> Simple case, N is 1 or 3");
		return true;
	}
	if (n % 2 === 0) {
		logger._print("==> Simple case, " + n + " mod 2 = 0");
		return false;
	}

	// Write (n - 1) as 2^s * d
	var d = n-1;
	while (d % 2 === 0) {
		d /= 2;
	}
	logger._print("d = " + d);

	// Do 5 iterations if none supplied
	k = k || 5;
	var P = 100 * (1 - (1/Math.pow(4, k)));

	WitnessLoop: do {
		logger._print("Remaining iterations: #" + k);

		var a = 2 + Math.floor(Math.random() * (n - 4));
		logger._print("--> first test with random = " + a);

		// Compute a^d % n
		var x = power(a, d, n);

		if (x === 1 || x === n - 1) {
			logger._print("--> continue WitnessLoop, x = 1 or x = n-1");
			continue;
		}

		logger._print("--> second test");
		
		// Keep squaring x while one of the following doesn't
    	// happen
    	// (i)   d does not reach n-1
    	// (ii)  (x^2) % n is not 1
    	// (iii) (x^2) % n is not n-1
    	var i = d;
    	while (i != n-1) {
    		x = (x * x) % n;
    		i *= 2;

    		if (x == 1) {
    			logger._print("--> exiting, " + n + " is composite");
    			return false;
    		}

    		if (x == n-1) {
    			logger._print("--> continue WitnessLoop");
				continue WitnessLoop;
			}
    	}

		logger._print("--> exiting, " + n + " is composite 'cause (n-1) is reached");
		return false;

	} while (--k);
 	
	logger._print("End of tests, " + n + " is probably prime with probabilty of " + P + "%");
	return true;
}