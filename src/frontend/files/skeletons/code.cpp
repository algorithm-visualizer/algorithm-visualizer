// import visualization libraries
#include "algorithm-visualizer/Array2DTracer.h"
#include "algorithm-visualizer/LogTracer.h"

#include <vector>
#include <string>

// define tracer variables
Array2DTracer array2dTracer = Array2DTracer("Grid");
LogTracer logTracer = LogTracer("Console");

// define input variables
std::vector<std::string> messages{
        "Visualize",
        "your",
        "own",
        "code",
        "here!",
};

// highlight each line of messages recursively
void highlight(int line) {
    if (line >= messages.size()) return;
    std::string message = messages[line];
    {
        logTracer.print(message);
        array2dTracer.selectRow(line, 0, message.size() - 1).delay();
        array2dTracer.deselectRow(line, 0, message.size() - 1);
    }
    highlight(line + 1);
}

int main() {
    {
        array2dTracer.set(messages).delay();
    }
    highlight(0);
    return 0;
}
