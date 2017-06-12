function SCCVertex(u, disc, low,  st, stackMember, carry) 
{
	graphTracer._visit(u)._wait();

    disc[u] = ++carry.time;
    discTracer._notify(u, carry.time)._wait();

    low[u] = carry.time;
    lowTracer._notify(u, carry.time)._wait();

    st.push(u);
    stTracer._setData(st)._wait();

    stackMember[u] = true;
    stackMemberTracer._notify(u, true)._wait();

    // Go through all vertices adjacent to this
    for (var v = 0; v < G[u].length; v++) {
    	if (G[u][v]) {

            // If v is not visited yet, then recur for it
            if (disc[v] == -1) {
            	SCCVertex(v, disc, low, st, stackMember, carry);

                // Check if the subtree rooted with 'v' has a
                // connection to one of the ancestors of 'u'
                low[u]  = Math.min(low[u], low[v]);
                lowTracer._notify(u, low[u]);
            }

            // Update low value of 'u' only of 'v' is still in stack
            // (i.e. it's a back edge, not cross edge).
            else if (stackMember[v] == true) {
            	low[u]  = Math.min(low[u], disc[v]);
            	lowTracer._notify(u, low[u])._wait();
            }

        }
    }

    // head node found, pop the stack and print an SCC
    var w = 0;  // To store stack extracted vertices
    if (low[u] == disc[u]) {
    	
    	while (st[st.length-1] != u) {
    		w = st.pop();
    		stTracer._setData(st)._wait();
    	
    		logger._print(w)._wait();

    		stackMember[w] = false;
    		stackMemberTracer._notify(w, false)._wait();
    	}

    	w = st.pop();
    	stTracer._setData(st)._wait();

    	logger._print(w)._wait();
    	logger._print('------');

    	stackMember[w] = false;
    	stackMemberTracer._notify(w, false)._wait();
    }
}

function SCC()
{
	var disc = new Array(G.length);
	var low = new Array(G.length);
	var stackMember = new Array(G.length);
	var st = [];
	var carry = { time: 0 };

    for (var i = 0; i < G.length; i++) {
    	disc[i] = -1;
    	low[i] = -1;
    	stackMember[i] = false;
    }

    discTracer._setData(disc);
    lowTracer._setData(low);
    stackMemberTracer._setData(stackMember);
    stTracer._setData(st);

    for (var i = 0; i < G.length; i++) {
    	if (disc[i] == -1) {
    		SCCVertex(i, disc, low, st, stackMember, carry);
    	}
    }
}