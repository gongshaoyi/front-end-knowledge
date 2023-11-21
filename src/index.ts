import { sayHello } from "./algorithm/1-array-linked-list/index";

sayHello("阿米");

// lru 算法测试
// import { LRUCache } from "./algorithm/3-data-structure-design/1-LRU-algorithm/LRU-algorithm";
// const lruCache = new LRUCache(2);
// lruCache.put(1, 1);
// lruCache.put(2, 2);
// lruCache.put(3, 3);
// console.log(
// 	"====>>>removeLeastRecently预期为2",
// 	lruCache.removeLeastRecently()
// ); // 预期为2
// lruCache.put(4, 4);
// lruCache.get(3);
// lruCache.put(5, 5);
// console.log(
// 	"====>>>removeLeastRecently预期为3",
// 	lruCache.removeLeastRecently()
// ); // 预期为3
// //////////////////

// // lfu 算法测试
// import { LFUCache } from "./algorithm/3-data-structure-design/2-LFU/index";
// const lfuCache = new LFUCache(2);
// console.log("====>>>lfuCache.cap预期为2", lfuCache.cap); // 预期为2
// lfuCache.put(1, 1);
// lfuCache.put(2, 2);
// lfuCache.put(3, 3);
// console.log("====>>>lfuCache.get(1)", lfuCache.get(1)); // 预期为-1
// console.log("====>>>lfuCache.get(2)", lfuCache.get(2)); // 预期为2 // freq 为1
// console.log("====>>>lfuCache.get(2)", lfuCache.get(2)); // 预期为2 // freq 为2
// console.log("====>>>lfuCache.get(3)", lfuCache.get(3)); // 预期为3 // freq 为1
// /////////////////

// O1ToDelete
import {
	RadomizedSet,
	Solution,
} from "./algorithm/3-data-structure-design/3-O1ToDelete";

// const radomizedSet = new RadomizedSet();
// console.log("radomizedSet.insert", radomizedSet.insert(0)); // true
// console.log("radomizedSet.insert", radomizedSet.insert(1)); // true
// console.log("radomizedSet.insert", radomizedSet.insert(1)); // false
// console.log("radomizedSet.insert", radomizedSet.insert(2)); // true

// console.log("radomizedSet.remove", radomizedSet.remove(0)); // true
// console.log("radomizedSet.remove", radomizedSet.remove(0)); // false

// console.log("radomizedSet.getRandom", radomizedSet.getRandom()); //

// const solution = new Solution(5, [4, 1]);
// console.log("solution.pick", solution.pick());
// console.log("solution.pick", solution.pick());
// console.log("solution.pick", solution.pick());
// console.log("solution.pick", solution.pick());
// console.log("solution.pick", solution.pick());
// console.log("solution.pick", solution.pick());

/////////////

// // median-data
// import { MedianFinder } from "./algorithm/3-data-structure-design/4-median-data";
// const medianFinder = new MedianFinder();
// medianFinder.addNum(1);
// medianFinder.addNum(2);
// console.log("findMedian1.5", medianFinder.findMedian()); // 1.5
// medianFinder.addNum(3);
// console.log("findMedian2", medianFinder.findMedian()); // 2
//////////////

// caculate
import { calculate } from "./algorithm/3-data-structure-design/5-calculator";
console.log("====>>>2+1*3", calculate("2+1*3")); //5
console.log("====>>>2 + 1 * 3", calculate("2 + 1 * 3")); //5
console.log("====>>>(2+1)*3", calculate("(2+1)*3")); //9
console.log("====>>>8 - ( 2 + 1 ) *3", calculate("8 - ( 2 + 1 ) *3")); //-1
///////////
