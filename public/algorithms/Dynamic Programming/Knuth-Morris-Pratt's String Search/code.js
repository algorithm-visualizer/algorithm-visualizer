// import visualization libraries {
const { Tracer, Array1DTracer, Array2DTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
// }
const string = "AAAABAABAAAABAAABAAAA";
const pattern = "AAAABAAA";

let _next = Array(...Array(pattern.length)).map(Number.prototype.valueOf, 0);
// define tracer variables {
const pattern_tracer = new Array2DTracer('Pattern');
const string_tracer = new Array1DTracer('String');
Layout.setRoot(new VerticalLayout([pattern_tracer, string_tracer]));
pattern_tracer.set([_next, pattern, pattern]);
string_tracer.set(string); Tracer.delay();
// }

function get_next(pattern)
{
    let q = 1; // postfix pointer
    let k = 0; // prefix pointer
    // visualize {
    pattern_tracer.select(2, k);
    // }
    for (; q < pattern.length; ++q)
    {
        // visualize {
        pattern_tracer.select(1, q); Tracer.delay();
        // }
        while ((k > 0) && (pattern[q] !== pattern[k]))
        {
            // visualize {
            pattern_tracer.select(0, k - 1); Tracer.delay();
            pattern_tracer.deselect(2, k);
            pattern_tracer.select(2, _next[k - 1]); Tracer.delay();
            pattern_tracer.deselect(0, k - 1);
            // }
            k = _next[k - 1];
        }
        if (pattern[q] === pattern[k])
        {
            // visualize {
            pattern_tracer.deselect(2, k);
            pattern_tracer.select(2, k + 1); Tracer.delay();
            // }
            ++k;
        }
        // visualize {
        pattern_tracer.patch(0, q, k); Tracer.delay();
        pattern_tracer.depatch(0, q); Tracer.delay();
        pattern_tracer.deselect(1, q);
        // }
        _next[q] = k;
    }
    // visualize {
    pattern_tracer.deselect(2, k);
    pattern_tracer.set([_next, pattern]); Tracer.delay();
    // }
}

function KMP(string, pattern)
{
    const match_positions = [];
    let match_start_position;

    let i = 0; // string pointer
    let k = 0; // pattern pointer
    get_next(pattern);
    for (; i < string.length; i++)
    {
        // visualize {
        string_tracer.select(i);
        pattern_tracer.select(1, k); Tracer.delay();
        // }
        while ((k > 0) && (string[i] != pattern[k]))
        {
            // visualize {
            pattern_tracer.select(0, k - 1); Tracer.delay();
            pattern_tracer.deselect(1, k);
            pattern_tracer.select(1, _next[k - 1]); Tracer.delay();
            pattern_tracer.deselect(0, k - 1);
            // }
            k = _next[k - 1];
        }
        if (string[i] === pattern[k])
        {
            ++k;
            if (k === pattern.length)
            {
                match_start_position = i - pattern.length + 1;
                match_positions.push(match_start_position);
                // visualize {
                string_tracer.select(match_start_position, match_start_position + pattern.length - 1); Tracer.delay();
                string_tracer.deselect(match_start_position, match_start_position + pattern.length - 1); Tracer.delay();
                pattern_tracer.select(0, k - 1); Tracer.delay();
                pattern_tracer.deselect(1, k - 1);
                pattern_tracer.select(1, _next[k - 1]); Tracer.delay();
                pattern_tracer.deselect(0, k - 1);
                // }
                k = _next[k - 1];
            }
            else
            {
                // visualize {
                pattern_tracer.deselect(1, k - 1);
                pattern_tracer.select(1, k); Tracer.delay();
                // }
            }
        }
        else
        {
            // visualize {
            pattern_tracer.select(0, k); Tracer.delay();
            // }
        }
        // visualize {
        pattern_tracer.deselect(0, k);
        pattern_tracer.deselect(1, k);
        string_tracer.deselect(i);
        // }
    }
    // visualize {
    for (let j = 0; j < match_positions.length; j++)
    {
        string_tracer.select(match_positions[j], match_positions[j] + pattern.length - 1); Tracer.delay();
        string_tracer.deselect(match_positions[j], match_positions[j] + pattern.length - 1);
    }
    // }
}

KMP(string, pattern);
