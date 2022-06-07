// import visualization libraries {
const { Array2DTracer, Layout, LogTracer, GraphTracer, Tracer, VerticalLayout } = require('algorithm-visualizer');
// }


// define tracer variables {
function ListNode(val) {
    this.val = val
    this.next = null
}

const node0 = new ListNode(0)
const node1 = new ListNode(1)
const node2 = new ListNode(2)
const node3 = new ListNode(3)
const node4 = new ListNode(4)
const node5 = new ListNode(5)
const node6 = new ListNode(6)

const list = node0
list.next = node1
list.next.next = node2
list.next.next.next = node3
list.next.next.next.next = node4
list.next.next.next.next.next = node5
list.next.next.next.next.next.next = node6
list.next.next.next.next.next.next.next = node2

const graphTracer = new GraphTracer("Linked List").directed()
const logTracer = new LogTracer("Console")
Layout.setRoot(new VerticalLayout([graphTracer, logTracer]))

graphTracer.addNode(node0.val)
graphTracer.addNode(node1.val)
graphTracer.addNode(node2.val)
graphTracer.addNode(node3.val)
graphTracer.addNode(node4.val)
graphTracer.addNode(node5.val)
graphTracer.addNode(node6.val)
graphTracer.addEdge(node0.val, node1.val)
graphTracer.addEdge(node1.val, node2.val)
graphTracer.addEdge(node2.val, node3.val)
graphTracer.addEdge(node3.val, node4.val)
graphTracer.addEdge(node4.val, node5.val)
graphTracer.addEdge(node5.val, node6.val)
graphTracer.addEdge(node6.val, node2.val)
Tracer.delay()
// }

var listHasCycle = function(head) {
    // visualize {
    graphTracer.select(head.val)
    graphTracer.visit(head.val)
    Tracer.delay()
    graphTracer.deselect(head.val)
    graphTracer.leave(head.val)
    // }
    
    // 1. is there a cycle?
    let slow = head.next
    let fast = head.next.next
    // visualize {
    graphTracer.select(slow.val)
    graphTracer.visit(fast.val)
    Tracer.delay()
    graphTracer.deselect(slow.val)
    graphTracer.leave(fast.val)
    // }
    while (slow !== fast) {
        slow = slow.next
        fast = fast.next.next
        // visualize {
        graphTracer.select(slow.val)
        graphTracer.visit(fast.val)
        Tracer.delay()
        graphTracer.deselect(slow.val)
        graphTracer.leave(fast.val)
        // }
    }

    // 2. where does the cycle start?
    let cycleStartPosition = 0
    slow = head
    // visualize {
    graphTracer.select(slow.val)
    graphTracer.visit(fast.val)
    Tracer.delay()
    graphTracer.deselect(slow.val)
    graphTracer.leave(fast.val)
    // }
    while (slow !== fast) {
        slow = slow.next
        fast = fast.next
        cycleStartPosition += 1
        // visualize {
        graphTracer.select(slow.val)
        graphTracer.visit(fast.val)
        Tracer.delay()
        graphTracer.deselect(slow.val)
        graphTracer.leave(fast.val)
        // }
    }

    // 3. what is the length of the cycle?
    let cycleLength = 1
    fast = slow.next
    // visualize {
    graphTracer.select(slow.val)
    graphTracer.visit(fast.val)
    Tracer.delay()
    graphTracer.deselect(slow.val)
    graphTracer.leave(fast.val)
    // }
    while (slow !== fast) {
        fast = fast.next
        cycleLength += 1
        // visualize {
        graphTracer.select(slow.val)
        graphTracer.visit(fast.val)
        Tracer.delay()
        graphTracer.deselect(slow.val)
        graphTracer.leave(fast.val)
        // }
    }

    return {
      cycleLength,
      cycleStartPosition,
    }
}
// log {
const res = listHasCycle(list)
logTracer.print(`cycle start position: ${res.cycleStartPosition}`)
logTracer.print("\n")
logTracer.print(`cycle length: ${res.cycleLength}`)
// }