/* 一道求中位数的算法题把我整不会了 */

// 读完本文，你可以去力扣拿下第 295 题「数据流的中位数」，难度 Hard。

// 如果输入一个数组，让你求中位数，这个好办，排个序，如果数组长度是奇数，最中间的一个元素就是中位数，如果数组长度是偶数，最中间两个元素的平均数作为中位数。

// 如果数据规模非常巨大，排序不太现实，那么也可以使用概率算法，随机抽取一部分数据，排序，求中位数，近似作为所有数据的中位数。

// 本文说的中位数算法比较困难，也比较精妙，是力扣第 295 题，要求你在数据流中计算中位数：image/image1

// 就是让你设计这样一个类：

class MedianFinder_1 {
	// 添加一个数字
	addNum(num: number) {}

	// 计算当前添加的所有数字的中位数
	findMedian() {}
}

// 其实，所有关于「流」的算法都比较难，比如我们旧文 水塘抽样算法详解 写过如何从数据流中等概率随机抽取一个元素，如果说你没有接触过这个问题的话，还是很难想到解法的。

// 这道题要求在数据流中计算平均数，我们先想一想常规思路。

// 尝试分析

// 一个直接的解法可以用一个数组记录所有addNum添加进来的数字，通过插入排序的逻辑保证数组中的元素有序，当调用findMedian方法时，可以通过数组索引直接计算中位数。

// 但是用数组作为底层容器的问题也很明显，addNum搜索插入位置的时候可以用二分搜索算法，但是插入操作需要搬移数据，所以最坏时间复杂度为 O(N)。

// 那换链表？链表插入元素很快，但是查找插入位置的时候只能线性遍历，最坏时间复杂度还是 O(N)，而且findMedian方法也需要遍历寻找中间索引，最坏时间复杂度也是 O(N)。

// 那么就用平衡二叉树呗，增删查改复杂度都是 O(logN)，这样总行了吧？

// 比如用 Java 提供的TreeSet容器，底层是红黑树，addNum直接插入，findMedian可以通过当前元素的个数推出计算中位数的元素的排名。

// 很遗憾，依然不行，这里有两个问题。

// 第一，TreeSet是一种Set，其中不存在重复元素的元素，但是我们的数据流可能输入重复数据的，而且计算中位数也是需要算上重复元素的。

// 第二，TreeSet并没有实现一个通过排名快速计算元素的 API。假设我想找到TreeSet中第 5 大的元素，并没有一个现成可用的方法实现这个需求。

// PS：如果让你实现一个在二叉搜索树中通过排名计算对应元素的方法rank(int index)，你会怎么设计？你可以思考一下。

// 除了平衡二叉树，还有没有什么常用的数据结构是动态有序的？优先级队列（二叉堆）行不行？

// 好像也不太行，因为优先级队列是一种受限的数据结构，只能从堆顶添加/删除元素，我们的addNum方法可以从堆顶插入元素，但是findMedian函数需要从数据中间取，这个功能优先级队列是没办法提供的。

// 可以看到，求个中位数还是挺难的，我们使尽浑身解数都没有一个高效地思路，下面直接来看解法吧，比较巧妙。

/* 解法思路 */

// 我们必然需要有序数据结构，本题的核心思路是使用两个优先级队列。

// 中位数是有序数组最中间的元素算出来的对吧，我们可以把「有序数组」抽象成一个倒三角形，宽度可以视为元素的大小，那么这个倒三角的中部就是计算中位数的元素对吧：image/image2

// 然后我把这个大的倒三角形从正中间切成两半，变成一个小倒三角和一个梯形，这个小倒三角形相当于一个从小到大的有序数组，这个梯形相当于一个从大到小的有序数组。

// 中位数就可以通过小倒三角和梯形顶部的元素算出来对吧？嗯，你联想到什么了没有？它们能不能用优先级队列表示？
// 小倒三角不就是个大顶堆嘛，梯形不就是个小顶堆嘛，中位数可以通过它们的堆顶元素算出来。image/image3

// 梯形虽然是小顶堆，但其中的元素是较大的，我们称其为large，倒三角虽然是大顶堆，但是其中元素较小，我们称其为small。

// 当然，这两个堆需要算法逻辑正确维护，才能保证堆顶元素是可以算出正确的中位数，我们很容易看出来，两个堆中的元素之差不能超过 1。

// 因为我们要求中位数嘛，假设元素总数是n，如果n是偶数，我们希望两个堆的元素个数是一样的，这样把两个堆的堆顶元素拿出来求个平均数就是中位数；
// 如果n是奇数，那么我们希望两个堆的元素个数分别是n/2 + 1和n/2，这样元素多的那个堆的堆顶元素就是中位数。

// 根据这个逻辑，我们可以直接写出findMedian函数的代码：

// 优先队列实现
type Comparator = (a: number, b: number) => number;
class PriorityQueue {
	array: number[];
	comparator: Comparator;
	//  comparator 默认按照从小到大的顺序
	constructor(comparator: Comparator) {
		this.array = [];
		this.comparator = (i1, i2) =>
			comparator(this.array[i1], this.array[i2]);
	}

	get size() {
		return this.array.length;
	}

	swap(a: number, b: number) {
		[this.array[a], this.array[b]] = [this.array[b], this.array[a]];
	}

	// 插入新的节点
	add(value: number) {
		this.array.push(value);
		this.bubbleUp();
	}

	// 如果新的节点不符合优先级的顺序，则移动它，直到符合为止
	bubbleUp() {
		let curr = this.size - 1;
		const parent = (i: number) => Math.ceil(i / 2 - 1);
		// 比较父节点和当前节点（新节点）的优先级，
		// 低的排在上面，因此如果父节点比子节点优先级高，则交换两个节点，直到当前节点的优先级有序为止
		while (parent(curr) >= 0 && this.comparator(parent(curr), curr) > 0) {
			this.swap(parent(curr), curr);
			curr = parent(curr);
		}
	}

	// 删除节点
	remove(index = 0) {
		// 将要移除的节点和最后一个子节点交换
		this.swap(this.size - 1, index);
		// 移除节点并保存值
		const value = this.array.pop();
		// 使子节点按照优先级排序
		this.bubbleDown();
		return value;
	}

	bubbleDown(index = 0) {
		let curr = index;
		const left = (i: number) => 2 * i + 1;
		const right = (i: number) => 2 * i + 2;
		// 比较两个子节点的优先级，选出优先级最低的
		const getTopChild = (i: number) =>
			right(i) < this.size && this.comparator(left(i), right(i)) > 0
				? right(i)
				: left(i);

		// 比较父节点和选出的低优先级子节点，
		// 如果当前节点的优先级高，则交换两个节点，直到每个节点都优先级都有序为止
		while (
			left(curr) < this.size &&
			this.comparator(curr, getTopChild(curr)) > 0
		) {
			const next = getTopChild(curr);
			this.swap(curr, next);
			curr = next;
		}
	}

	peek(): number {
		return this.array[0];
	}
}

class MedianFinder_2 {
	large: PriorityQueue;
	small: PriorityQueue;
	constructor() {
		this.large = new PriorityQueue((a, b) => a - b);
		this.small = new PriorityQueue((a, b) => b - a);
	}
	// 添加一个数字
	addNum(num: number) {}

	// 计算当前添加的所有数字的中位数
	findMedian() {
		// 如果两个元素不一样多，多的那个堆是中位数
		if (this.large.size < this.small.size) {
			return this.small.peek();
		} else if (this.large.size > this.small.size) {
			return this.large.peek();
		}

		return (this.large.peek() + this.small.peek()) / 2;
	}
}

// 现在的问题是，如何实现addNum方法，维护「两个堆中的元素之差不能超过 1」这个条件呢？

// 这样行不行？每次调用addNum函数的时候，我们比较一下large和small的元素个数，谁的元素少我们就加到谁那里，如果它们的元素一样多，我们默认加到large里面：

class MedianFinder_3 {
	large: PriorityQueue;
	small: PriorityQueue;
	constructor() {
		this.large = new PriorityQueue((a, b) => a - b);
		this.small = new PriorityQueue((a, b) => b - a);
	}
	// 有缺陷的实现
	addNum(num: number) {
		if (this.small.size >= this.large.size) {
			this.large.add(num);
		} else {
			this.small.add(num);
		}
	}

	// 计算当前添加的所有数字的中位数
	findMedian() {
		// 如果两个元素不一样多，多的那个堆是中位数
		if (this.large.size < this.small.size) {
			return this.small.peek();
		} else if (this.large.size > this.small.size) {
			return this.large.peek();
		}

		return (this.large.peek() + this.small.peek()) / 2;
	}
}

// 看起来好像没问题，但是跑一下就发现问题了，比如说我们这样调用：

// addNum(1)，现在两个堆元素数量相同，都是 0，所以默认把 1 添加进large堆。

// addNum(2)，现在large的元素比small的元素多，所以把 2 添加进small堆中。

// addNum(3)，现在两个堆都有一个元素，所以默认把 3 添加进large中。

// 调用findMedian，预期的结果应该是 2，但是实际得到的结果是 1。

// 问题很容易发现，看下当前两个堆中的数据：image/image4

// 抽象点说，我们的梯形和小倒三角都是由原始的大倒三角从中间切开得到的，那么梯形中的最小宽度要大于等于小倒三角的最大宽度，这样它俩才能拼成一个大的倒三角对吧？

// 也就是说，不仅要维护large和small的元素个数之差不超过 1，还要维护large堆的堆顶元素要大于等于small堆的堆顶元素。

// 维护large堆的元素大小整体大于small堆的元素是本题的难点，不是一两个 if 语句能够正确维护的，而是需要如下技巧：

export class MedianFinder {
	large: PriorityQueue;
	small: PriorityQueue;
	constructor() {
		this.large = new PriorityQueue((a, b) => a - b);
		this.small = new PriorityQueue((a, b) => b - a);
	}

	addNum(num: number) {
		if (this.small.size >= this.large.size) {
			this.small.add(num);
			this.large.add(this.small.remove());
		} else {
			this.large.add(num);
			this.small.add(this.large.remove());
		}
	}

	// 计算当前添加的所有数字的中位数
	findMedian() {
		// 如果两个元素不一样多，多的那个堆是中位数
		if (this.large.size < this.small.size) {
			return this.small.peek();
		} else if (this.large.size > this.small.size) {
			return this.large.peek();
		}

		return (this.large.peek() + this.small.peek()) / 2;
	}
}

// 简单说，想要往large里添加元素，不能直接添加，而是要先往small里添加，然后再把small的堆顶元素加到large中；向small中添加元素同理。

// 为什么呢，稍加思考可以想明白，假设我们准备向large中插入元素：

// 如果插入的num小于small的堆顶元素，那么num就会留在small堆里，为了保证两个堆的元素数量之差不大于 1，作为交换，把small堆顶部的元素再插到large堆里。

// 如果插入的num大于small的堆顶元素，那么num就会成为samll的堆顶元素，最后还是会被插入large堆中。

// 反之，向small中插入元素是一个道理，这样就巧妙地保证了large堆整体大于small堆，且两个堆的元素之差不超过 1，那么中位数就可以通过两个堆的堆顶元素快速计算了。

// 至此，整个算法就结束了，addNum方法时间复杂度 O(logN)，findMedian方法时间复杂度 O(1)。

// const RULER_PKG_DOWNLOAD_CONFIG = {
// 	gitRepoSshUrl: "ssh://git@git.sankuai.com/mtweb/mtpt-wxmp.git",
// 	branchName: "feature/PTAP-82562667/add-merchant-entry",
// 	commitId: "0ebbb0ee03fe39b19bf9b25f500b7e1e38b37414",
// 	RULER_PLUGIN_ID: 1045,
// };
