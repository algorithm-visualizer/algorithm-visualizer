function FreivaldsAlgorithm() {
	var k = 5;
	var i, j, tmp, tmpB, tmpC, n = A.length;

	while (k--) {
		logger._print('Iterations remained: #' + k);

		// Generate random vector
		var r = [], P = [];
		for (i = 0; i < n; i++) {
			P.push(-1);
			r.push( (Math.random() < 0.5) << 0);
		}
		_r._setData(r)._wait();

		// Compute Br, Cr
		var Br = [], Cr = [];
		for (i = 0; i < n; i++) {
			tmpB = 0; 
			tmpC = 0;
			for (j = 0; j < n; j++) { 
				tmpB += r[j] * B[j][i];
				tmpC += r[j] * C[j][i];
			}
			Br.push(tmpB);
			Cr.push(tmpC);
		}

		// Compute A * Br - Cr
		P = [];
		for (i = 0; i < n; i++) {
			tmp = 0;
			for (j = 0; j < n; j++) { 
				tmp += (A[i][j] * Br[i]) - Cr[i];
			}
			P.push(tmp);
		}
		_p._setData(P)._wait();

		for (i = 0; i < n; i++) {
			if (P[i] !== 0) {
				logger._print('P[' + i + '] !== 0 (' + P[i] + '), exit');
				return false;
			}
		}

		logger._print('Result vector is identity, continue...');


	}

	return true;
}

FreivaldsAlgorithm();