tracer._print('original array = [' + D[0].join(', ') + ']');
tracer._sleep(1000);
tracer._pace(300);
function pow(base, expo){
	var ans = 1;
	for(var i = 0; i < expo;i++){
		ans *= base;
	}
	return ans;
}
for(var exp = 0; exp < 8;exp ++){
	tracer._print("Bit "+exp);
	for(var i = 0; i < D[0].length; i++){
		tracer._select(0, i);
		D[2][ parseInt( D[0][i] / pow(2, exp)  % 2) ] += 1;
		tracer._notify(2, parseInt( D[0][i] / pow(2, exp)  % 2) );
		tracer._deselect(0, i);
	}
	D[2][1] += D[2][0];
	tracer._notify(2, 1);
	for(var i = D[0].length - 1; i >= 0; i--){
		tracer._select(0, i);
		D[2][parseInt( D[0][i] / pow(2, exp)  % 2) ] -= 1;
		tracer._notify(2, parseInt( D[0][i] / pow(2, exp)  % 2) );
		D[1][ D[2][ parseInt( D[0][i] / pow(2, exp)  % 2) ] ] = D[0][i];
		tracer._notify(1, D[2][ parseInt( D[0][i] / pow(2, exp)  % 2) ] );
		tracer._deselect(0, i);
	}
	for(var i = 0; i < D[0].length; i++){
		tracer._select(1, i);
		D[0][i] = D[1][i];
		tracer._notify(0, i);
		tracer._deselect(1, i);
	}
	D[2][0] = 0;
	D[2][1] = 0;
	tracer._notify(2, 0);
	tracer._notify(2, 1);	
}
tracer._print('sorted array = [' + D[0].join(', ') + ']');
