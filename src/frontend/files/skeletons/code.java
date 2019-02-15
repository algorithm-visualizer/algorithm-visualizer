// import visualization libraries {
import org.algorithm_visualizer.*;
// }

class Main {
    // define tracer variables {
    Array2DTracer array2dTracer = new Array2DTracer("Grid");
    LogTracer logTracer = new LogTracer("Console");
    // }

    // define input variables
    String[] messages = {
            "Visualize",
            "your",
            "own",
            "code",
            "here!",
    };

    // highlight each line of messages recursively
    void highlight(int line) {
        if (line >= messages.length) return;
        String message = messages[line];
        // visualize {
        logTracer.println(message);
        array2dTracer.selectRow(line, 0, message.length() - 1);
        Tracer.delay();
        array2dTracer.deselectRow(line, 0, message.length() - 1);
        // }
        highlight(line + 1);
    }

    Main() {
        // visualize {
        Layout.setRoot(new VerticalLayout(new Commander[]{array2dTracer, logTracer}));
        array2dTracer.set(messages);
        Tracer.delay();
        // }
        highlight(0);
    }

    public static void main(String[] args) {
        new Main();
    }
}
