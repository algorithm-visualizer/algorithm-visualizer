// import visualization libraries {
  const { Tracer, LogTracer, Array1DTracer, Layout, VerticalLayout } = require('algorithm-visualizer');
  // }
  
  // define tracer variables {
  const tracer = new Array1DTracer('Sequence');
  const D = [2, 6, 4, 8, 10, 9, 15];
  tracer.set(D);
  const logger = new LogTracer();
  Layout.setRoot(new VerticalLayout([tracer, logger]));
  Tracer.delay();
  // }
  
  function findUnsortedSubarray(nums) {
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      let flag = false;
      // visualize {
      let minIndex = -1;
      let maxIndex = -1;
      // }
  
      for (let i = 1; i < nums.length; i++) {
          // visualize {
          tracer.deselect(i - 2, i - 1);
          tracer.select(i - 1, i);
          Tracer.delay();
          // }
          
          if (nums[i] < nums[i - 1]) {
              flag = true;
          }
          if (flag) {
              min = Math.min(min, nums[i]);
              // visualize {
              if (min === nums[i]) {
                  tracer.depatch(minIndex);
                  minIndex = i;
                  tracer.patch(i);
              }
              Tracer.delay();
              // }
          }
      }
      
      // visualize {
      tracer.depatch(minIndex);
      tracer.deselect(nums.length - 2);
      tracer.deselect(nums.length - 1);
      // }
  
      // logger {
      logger.println(`min = ${min}`);
      Tracer.delay();
      // }
  
      flag = false;
      for (let i = nums.length - 2; i >= 0; i--) {
          // visualize {
          tracer.deselect(i + 1, i + 2);
          tracer.select(i, i + 1);
          Tracer.delay();
          // }
  
          if (nums[i] > nums[i + 1]) {
              flag = true;
          }
          if (flag) {
              max = Math.max(max, nums[i]);
              // visualize {
              if (max === nums[i]) {
                  tracer.depatch(maxIndex);
                  maxIndex = i;
                  tracer.patch(i);
              }
              Tracer.delay();
              // }
          }
      }
      
      // visualize {
      tracer.depatch(maxIndex);
      tracer.deselect(0);
      tracer.deselect(1);
      Tracer.delay();
      // }
  
      // logger {
      logger.println(`max = ${max}`);
      // }
  
      let l;
      let r;
      for (l = 0; l < nums.length; l++) {
          // visualize {
          tracer.deselect(l - 1);
          tracer.select(l);
          Tracer.delay();
          // }
          
          if (min < nums[l]) {
              // visualize {
              tracer.patch(l);
              Tracer.delay();
              // }
              break;
          }
      }
      
      for (r = nums.length - 1; r >= 0; r--) {
          // visualize {
          tracer.deselect(r + 1);
          tracer.select(r);
          Tracer.delay();
          // }
          
          if (max > nums[r]) {
              // visualize {
              tracer.patch(r);
              Tracer.delay();
              // }
              break;
          }
      }
      
      // visualize {
      tracer.depatch(l);
      tracer.depatch(r);
      tracer.select(l, r);
      Tracer.delay();
      // }
      
      const result = r - l < 0
          ? 0
          : r - l + 1;
          
      // logger {
      logger.println(`result = ${result}`);
      Tracer.delay();
      // }
  
      return result;
  }
  findUnsortedSubarray(D);