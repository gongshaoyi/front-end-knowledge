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

/* 避开黑名单的随机数 */

// 有了上面一道题的铺垫，我们来看一道更难一些的题目，力扣第 710 题，我来描述一下题目：

// 给你输入一个正整数N，代表左闭右开区间[0,N)，再给你输入一个数组blacklist，其中包含一些「黑名单数字」，且blacklist中的数字都是区间[0,N)中的数字。

// 现在要求你设计如下数据结构：

class Solution_1 {
	constructor(N: number, blackList: number[]) {}

	// 在区间0到N等概率随机选择并返回一个元素
	// 这个元素不能时blackList中的元素
	pick() {}
}

// pick函数会被多次调用，每次调用都要在区间[0,N)中「等概率随机」返回一个「不在blacklist中」的整数。

// 这应该不难理解吧，比如给你输入N = 5, blacklist = [1,3]，那么多次调用pick函数，会等概率随机返回 0, 2, 4 中的某一个数字。

// 而且题目要求，在pick函数中应该尽可能少调用随机数生成函数rand()。

// 这句话什么意思呢，比如说我们可能想出如下拍脑袋的解法：

class Solution_2 {
	N: number;
	blackList: number[];
	constructor(N: number, blackList: number[]) {
		this.N = N;
		this.blackList = blackList;
	}

	// 在区间0到N等概率随机选择并返回一个元素
	// 这个元素不能时blackList中的元素
	pick() {
		let res = Math.floor(Math.random() * this.N);
		while (this.blackList.includes(res)) {
			res = Math.floor(Math.random() * this.N);
		}

		return res;
	}
}

// 这个函数会多次调用rand()函数，执行效率竟然和随机数相关，不是一个漂亮的解法。

// 聪明的解法类似上一道题，我们可以将区间[0,N)看做一个数组，然后将blacklist中的元素移到数组的最末尾，同时用一个哈希表进行映射：

// 根据这个思路，我们可以写出第一版代码（还存在几处错误）：

class Solution_3 {
	sz: number;
	mapping: number[];
	constructor(N: number, blackList: number[]) {
		// 最终数组中的元素个数
		this.sz = N - blackList.length;
		// 最后一个元素的索引
		let last = N - 1;
		// this.mapping=Array.from(new Array(N).keys())
		this.mapping = Array.from({ length: this.sz }, (v, k) => k);
		// 将黑名单元素换到最后去
		blackList.forEach((v) => {
			this.mapping[v] = last;
			last--;
		});
	}

	// 在区间0到N等概率随机选择并返回一个元素
	// 这个元素不能时blackList中的元素
	pick() {}
}
// 如上图:image/image2，相当于把黑名单中的数字都交换到了区间[sz, N)中，同时把[0, sz)中的黑名单数字映射到了正常数字。

// 根据这个逻辑，我们可以写出pick函数：
class Solution_4 {
	sz: number;
	mapping: number[];
	constructor(N: number, blackList: number[]) {
		// 最终数组中的元素个数
		this.sz = N - blackList.length;
		// 最后一个元素的索引
		let last = N - 1;
		// this.mapping=Array.from(new Array(N).keys())
		this.mapping = Array.from({ length: this.sz }, (v, k) => k);
		// 将黑名单元素换到最后去
		blackList.forEach((v) => {
			this.mapping[v] = last;
			last--;
		});
	}

	// 在区间0到N等概率随机选择并返回一个元素
	// 这个元素不能时blackList中的元素
	pick() {
		// 随机选取一个索引
		const index = Math.floor(Math.random() * this.sz);
		return this.mapping[index];
	}
}

// 这个pick函数已经没有问题了，但是构造函数还有两个问题。

// 第一个问题，如下这段代码：

class Solution_5 {
	sz: number;
	mapping: number[];
	constructor(N: number, blackList: number[]) {
		// 最终数组中的元素个数
		this.sz = N - blackList.length;
		// 最后一个元素的索引
		let last = N - 1;
		// this.mapping=Array.from(new Array(N).keys())
		this.mapping = Array.from({ length: 100 }, (v, k) => k);
		// 将黑名单元素换到最后去
		blackList.forEach((v) => {
			this.mapping[v] = last;
			last--;
		});
	}
}

// 我们将黑名单中的b映射到last，但是我们能确定last不在blacklist中吗？

// 比如下图这种情况，我们的预期应该是 1 映射到 3，但是错误地映射到 4：image/image3

// 在对mapping[b]赋值时，要保证last一定不在blacklist中，可以如下操作：

class Solution_6 {
	sz: number;
	mapping: number[];
	constructor(N: number, blackList: number[]) {
		// 最终数组中的元素个数
		this.sz = N - blackList.length;
		// this.mapping=Array.from(new Array(N).keys())
		this.mapping = Array.from({ length: this.sz }, (v, k) => k);
		// 将mapping中的所有黑名单元素改成特殊值
		blackList.forEach((v) => {
			this.mapping[v] = 666;
		});

		// 最后一个元素的索引
		let last = N - 1;
		blackList.forEach((v) => {
			// 跳过所有黑名单中的数字
			while (blackList.includes(last)) {
				last--;
			}
			// 将黑名单的索引映射为合法值
			this.mapping[v] = last;
			last--;
		});
	}
}

// 第二个问题，如果blacklist中的黑名单数字本身就存在区间[sz, N)中，那么就没必要在mapping中建立映射，比如这种情况：

export class Solution {
	sz: number;
	mapping: number[];

	constructor(N: number, blackList: number[]) {
		// 最终数组中的元素个数
		this.sz = N - blackList.length;
		// this.mapping=Array.from(new Array(N).keys())
		this.mapping = Array.from({ length: this.sz }, (v, k) => k);
		// 将mapping中的所有黑名单元素改成特殊值
		blackList.forEach((v) => {
			this.mapping[v] = 666;
		});

		// 最后一个元素的索引
		let last = N - 1;
		blackList.forEach((v) => {
			// 如果v已经在区间[sz,N)，可直接忽略
			if (v >= this.sz) {
				return;
			}

			// 跳过所有黑名单中的数字
			while (blackList.includes(last)) {
				last--;
			}
			// 将黑名单的索引映射为合法值
			this.mapping[v] = last;
			last--;
		});
	}

	// 在区间0到N等概率随机选择并返回一个元素
	// 这个元素不能时blackList中的元素
	pick() {
		// 随机选取一个索引
		const index = Math.floor(Math.random() * this.sz);
		return this.mapping[index];
	}
}
