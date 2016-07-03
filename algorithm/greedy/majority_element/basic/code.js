function isMajorityElement ( element ) {
	var count = 0;
	logger._print ('Verify majority element ' + element );
	for (var i = N - 1; i >= 0; i--) {
		tracer._notify (i,A[i])._wait ();
		if (A[i] == element) {
			count++;
		} else {
			tracer._denotify (i);
		}
	}
	logger._print ('Count of our assumed majority element ' + count);
	if(count>Math.floor (N/2)) {
		logger._print ('Our assumption was correct!');
		return true;
	}
	logger._print ('Our assumption was incorrect!');
	return false;
}

function findProbableElement () {
	var index = 0, count = 1;
	tracer._select (index)._wait();
	logger._print ('Beginning with assumed majority element : ' + A[index] + ' count : ' +count);
	logger._print ('--------------------------------------------------------');
	for( var i = 1; i < N; i++ ) {
		tracer._notify (i,A[i])._wait ();
		if(A[index]==A[i]) {
			count++;
			logger._print ('Same as assumed majority element! Count : ' + count);
		} else {
			count--;
			logger._print ('Not same as assumed majority element! Count : ' + count);
		}

		if(count===0) {
			logger._print ('Wrong assumption in majority element');
			tracer._deselect (index);
			tracer._denotify (i);
			index = i;
			count = 1;
			tracer._select (i)._wait ();
			logger._print ('New assumed majority element!'+ A[i]  +' Count : '+count);
			logger._print ('--------------------------------------------------------');
		} else {
			tracer._denotify (i);		
		}
	}
	logger._print ('Finally assumed majority element ' + A[index]);
	logger._print ('--------------------------------------------------------');
	return A[index];
}

function findMajorityElement () {
	var element = findProbableElement ();
	if(isMajorityElement (element) === true) {
		logger._print ('Majority element is ' + element);
	} else {
		logger._print ('No majority element');
	}
}

findMajorityElement ();