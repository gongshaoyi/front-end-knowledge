/* 给我常数时间，我可以删除/查找数组中的任意元素 */

// 本文讲两道比较有技巧性的数据结构设计题，都是和随机读取元素相关的，我们前文 随机算法之水塘抽样算法 也写过类似的问题。

// 这写问题的一个技巧点在于，如何结合哈希表和数组，使得数组的删除和查找操作的时间复杂度稳定在 O(1)？

// 下面来一道道看。

// 实现随机集合

// 这是力扣第 380 题，看下题目：image/image1

// 就是说就是让我们实现如下一个类：

class RadomizedSet_1 {
	// 如果val不存在集合中，则插入并返回true，或者直接返回false
	insert(val: unknown) {}

	// 如果val存在集合中，则删除并返回true，或者直接返回false

	remove(val: unknown) {}

	// 从集合中等概率的随机获得一个元素
	getRandom() {}
}

// 本题的难点在于两点：

// 1、插入，删除，获取随机元素这三个操作的时间复杂度必须都是 O(1)。

// 2、getRandom方法返回的元素必须等概率返回随机元素，也就是说，如果集合里面有n个元素，每个元素被返回的概率必须是1/n。

// 我们先来分析一下：对于插入，删除，查找这几个操作，哪种数据结构的时间复杂度是 O(1)？

// HashSet肯定算一个对吧。哈希集合的底层原理就是一个大数组，我们把元素通过哈希函数映射到一个索引上；如果用拉链法解决哈希冲突，那么这个索引可能连着一个链表或者红黑树。

// 那么请问对于这样一个标准的HashSet，你能否在 O(1) 的时间内实现getRandom函数？

// 其实是不能的，因为根据刚才说到的底层实现，元素是被哈希函数「分散」到整个数组里面的，更别说还有拉链法等等解决哈希冲突的机制，基本做不到 O(1) 时间等概率随机获取元素。

// 除了HashSet，还有一些类似的数据结构，比如哈希链表LinkedHashSet，我们前文 手把手实现LRU算法 和 手把手实现LFU算法 讲过这类数据结构的实现原理，本质上就是哈希表配合双链表，元素存储在双链表中。

// 但是，LinkedHashSet只是给HashSet增加了有序性，依然无法按要求实现我们的getRandom函数，因为底层用链表结构存储元素的话，是无法在 O(1) 的时间内访问某一个元素的。

// 根据上面的分析，对于getRandom方法，如果想「等概率」且「在 O(1) 的时间」取出元素，一定要满足：底层用数组实现，且数组必须是紧凑的。

// 这样我们就可以直接生成随机数作为索引，从数组中取出该随机索引对应的元素，作为随机元素。

// 但如果用数组存储元素的话，插入，删除的时间复杂度怎么可能是 O(1) 呢？

// 可以做到！对数组尾部进行插入和删除操作不会涉及数据搬移，时间复杂度是 O(1)。

// 所以，如果我们想在 O(1) 的时间删除数组中的某一个元素val，可以先把这个元素交换到数组的尾部，然后再pop掉。

// 交换两个元素必须通过索引进行交换对吧，那么我们需要一个哈希表valToIndex来记录每个元素值对应的索引。

// 有了思路铺垫，我们直接看代码：

export class RadomizedSet {
	// 存储元素的值
	nums: unknown[];
	// 记录每个元素对应在 nums 中的索引
	valToIndex: Map<unknown, number>;

	constructor() {
		this.nums = [];
		this.valToIndex = new Map();
	}

	insert(val: unknown) {
		// val已存在，不用再插入
		if (this.valToIndex.has(val)) {
			return false;
		}

		// val不存在，插入都尾部，并记录val对应的索引
		this.nums.push(val);
		this.valToIndex.set(val, this.nums.length - 1);
		return true;
	}

	remove(val: unknown) {
		// val 存在
		if (this.valToIndex.has(val)) {
			// 先获取到val的索引
			const index = this.valToIndex.get(val);
			// 将最后一个元素的索引改为index
			const lastIndex = this.nums.length - 1;
			const lastOne = this.nums[lastIndex];
			this.valToIndex.set(lastOne, index);
			// 数组中交换val和lastOne
			this.nums[index] = lastOne;
			this.nums[lastIndex] = val;

			// 删除map中val，删除数组中的最后一个元素
			this.valToIndex.delete(val);
			this.nums.pop();

			return true;
		}

		// val 不存在
		return false;
	}

	getRandom() {
		const randomIndex = Math.floor(Math.random() * this.nums.length);

		return this.nums[randomIndex];
	}
}

// 注意remove(val)函数，对nums进行插入、删除、交换时，都要记得修改哈希表valToIndex，否则会出现错误。

// 至此，这道题就解决了，每个操作的复杂度都是 O(1)，且随机抽取的元素概率是相等的。
