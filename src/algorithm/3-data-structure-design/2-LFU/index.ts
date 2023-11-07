/** 手撸 LFU 算法 */

// 从实现难度上来说，LFU 算法的难度大于 LRU 算法，因为 LRU 算法相当于把数据按照时间排序；
// 这个需求借助链表很自然就能实现，你一直从链表尾部加入元素的话，越靠近尾部的元素就是新的数据
// 越靠近头部的元素就是旧的数据，我们进行缓存淘汰的时候只要简单地将头部的元素淘汰掉就行了。

// 而 LFU 算法相当于是淘汰访问频次最低的数据，如果访问频次最低的数据有多条，需要淘汰最旧的数据。把数据按照访问频次进行排序，而且频次还会不断变化，这可不容易实现。
// 这种著名的算法的套路都是固定的，关键是由于逻辑较复杂，不容易写出漂亮且没有 bug 的代码。

/** 一、算法描述 */

// 求你写一个类，接受一个capacity参数，实现get和put方法：

class LFUCache_1 {
	// 构造容量为 capacity 的缓存
	constructor(capacity: number) {}

	// 缓存中查询 key
	get(key: unknown) {}

	// 将 key 和 value 存入缓存
	put(key: unknown, value: unknown) {}
}

// get(key)方法会去缓存中查询键key，如果key存在，则返回key对应的 value，否则返回 -1。

// put(key, valueue) 方法插入或修改缓存。如果key已存在，则将它对应的值改为 value；如果 key 不存在，则插入键值对 (key, value)。

// 当缓存达到容量 capacity 时，则应该在插入新的键值对之前，删除使用频次（后文用freq表示）最低的键值对。如果 freq 最低的键值对有多个，则删除其中最旧的那个。

// 构造一个容量为2的LFU缓存
const cache = new LFUCache_1(2);

// 插入两队(key,value)，对应的 freq 为1
cache.put(1, 10);
cache.put(2, 20);

// 查询 key 为 1 的对应的 value
// 返回 10，同时 key 为 1 的对应的 freq 变为 2
cache.get(1);

// 容量已满，淘汰 freq 最小的键 2
// 插入键值对为（3，30），对应的 freq 为 1
cache.put(3, 30);

// 键 2 已经被删除，返回 -1
cache.get(2);

/**  二、思路分析  */

// 一定先从最简单的开始，根据 LFU 算法的逻辑，我们先列举出算法执行过程中的几个显而易见的事实：

// 1、调用get(key)方法时，要返回该key对应的val。

// 2、只要用get或者put方法访问一次某个key，该key的freq就要加一。

// 3、如果在容量满了的时候进行插入，则需要将freq最小的key删除，如果最小的freq对应多个key，则删除其中最旧的那一个。

// 好的，我们希望能够在 O(1) 的时间内解决这些需求，可以使用基本数据结构来逐个击破：

// 1、使用一个HashMap存储key到val的映射，就可以快速计算get(key)。
const keyToValue = new Map<unknown, unknown>();

// 2、使用一个HashMap存储key到freq的映射，就可以快速操作key对应的freq。
const keyToFreq = new Map<unknown, number>();

// 3、这个需求应该是 LFU 算法的核心，所以我们分开说。

//// 3.1、首先，肯定是需要freq到key的映射，用来找到freq最小的key。

//// 3.2、将freq最小的key删除，那你就得快速得到当前所有key最小的freq是多少。想要时间复杂度 O(1) 的话，肯定不能遍历一遍去找，那就用一个变量minFreq来记录当前最小的freq吧。

//// 3.3、可能有多个key拥有相同的freq，所以 freq 对key是一对多的关系，即一个freq对应一个key的列表。

//// 3.4、希望freq对应的key的列表是存在时序的，便于快速查找并删除最旧的key。

//// 3.5、希望能够快速删除key列表中的任何一个key，因为如果频次为freq的某个key被访问，那么它的频次就会变成freq+1，就应该从freq对应的key列表中删除，加到freq+1对应的key的列表中。
const freqToKeys = new Map<number, unknown>();
let minFreq = 0;

// 介绍一下这个LinkedHashSet，它满足我们 3.3，3.4，3.5 这几个要求。
// 你会发现普通的链表LinkedList能够满足 3.3，3.4 这两个要求，但是由于普通链表不能快速访问链表中的某一个节点，所以无法满足 3.5 的要求。

// LinkedHashSet顾名思义，是链表和哈希集合的结合体。链表不能快速访问链表节点，但是插入元素具有时序；哈希集合中的元素无序，但是可以对元素进行快速的访问和删除。

// 那么，它俩结合起来就兼具了哈希集合和链表的特性，既可以在 O(1) 时间内访问或删除其中的元素，又可以保持插入的时序，高效实现 3.5 这个需求。

// 综上，我们可以写出 LFU 算法的基本数据结构：

class LFUCache_2 {
	// key 到value 的映射，我们后文称kv表
	keyToValue: Map<unknown, unknown>;
	// key 到频率 freq 的映射，我们后文称kf表
	keyToFreq: Map<unknown, number>;
	// freq 到 key 的映射，我们后文称fk表
	freqTokey: Map<number, unknown>;
	// 记录最小频率
	minFreq: number;
	// 记录LFU缓存的最大容量
	cap: number;

	constructor(capacity: number) {
		this.keyToValue = new Map<unknown, unknown>();
		this.keyToFreq = new Map<unknown, number>();
		this.freqTokey = new Map<number, unknown>();
		this.cap = capacity;
		this.minFreq = 0;
	}

	get(key: unknown) {}

	put(key: unknown, value: unknown) {}
}

/* 三、代码框架 */

// LFU 的逻辑不难理解，但是写代码实现并不容易，因为你看我们要维护KV表，KF表，FK表三个映射，特别容易出错。对于这种情况，教你三个技巧：

// 1、不要企图上来就实现算法的所有细节，而应该自顶向下，逐步求精，先写清楚主函数的逻辑框架，然后再一步步实现细节。

// 2、搞清楚映射关系，如果我们更新了某个key对应的freq，那么就要同步修改KF表和FK表，这样才不会出问题。

// 3、画图，画图，画图，重要的话说三遍，把逻辑比较复杂的部分用流程图画出来，然后根据图来写代码，可以极大减少出错的概率。

// 下面我们先来实现get(key)方法，逻辑很简单，返回key对应的val，然后增加key对应的freq：

class LFUCache_3 {
	// key 到value 的映射，我们后文称kv表
	keyToValue: Map<unknown, unknown>;
	// key 到频率 freq 的映射，我们后文称kf表
	keyToFreq: Map<unknown, number>;
	// freq 到 key 的映射，我们后文称fk表
	freqToKeys: Map<number, DoubleList>;
	// 记录最小频率
	minFreq: number;
	// 记录LFU缓存的最大容量
	cap: number;

	constructor(capacity: number) {
		this.keyToValue = new Map<unknown, unknown>();
		this.keyToFreq = new Map<unknown, number>();
		this.freqToKeys = new Map<number, DoubleList>();
		this.cap = capacity;
		this.minFreq = 0;
	}

	increaseFreq(key: unknown) {}

	get(key: unknown) {
		if (!keyToValue.has(key)) {
			return -1;
		}
		// 增加 key 对应的 freq
		this.increaseFreq(key);

		return keyToValue.get(key);
	}
}

// 增加key对应的freq是 LFU 算法的核心，所以我们干脆直接抽象成一个函数increaseFreq，这样get方法看起来就简洁清晰了对吧。

// 下面来实现put(key, val)方法，逻辑略微复杂，我们直接画个图来看：image/image1

// 这图就是随手画的，不是什么正规的程序流程图，但是算法逻辑一目了然，看图可以直接写出put方法的逻辑：

// 用于存储 key 与 DoubleList 中的 Item对应关系
const hashMap = new Map<unknown, Item>();
// 双链表的节点类
class Item {
	key: unknown;
	value: unknown;
	next: Item;
	prev: Item;
	constructor(key: unknown, value: unknown) {
		this.key = key;
		this.value = value;
		this.next = null;
		this.prev = null;
	}
}

// 依靠 Item 类型构建一个双链表：
class DoubleList {
	private head: Item;
	private tail: Item;
	private size: number;

	constructor() {
		this.head = new Item(0, 0);
		this.tail = new Item(0, 0);
		this.size = 0;
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}

	// 在链表尾部添加节点x, 时间 O(1);
	addLast(x: Item) {
		x.prev = this.tail.prev;
		x.next = this.tail;
		this.tail.prev.next = x;
		this.tail.prev = x;
		this.size = this.size + 1;
	}

	// 删除链表中的 x 节点（ x 节点一定存在）
	// 由于是双链表且给的是目标 item 节点，时间复杂度为 O(1)
	remove(x: Item) {
		x.prev.next = x.next;
		x.next.prev = x.prev;
		this.size = this.size - 1;
	}

	// 删除链表中的第一个节点，并返回该节点，时间复杂度为 O(1)
	removeFirst() {
		if (this.head.next === this.tail) {
			return null;
		}
		const first = this.head.next;
		this.remove(first);

		// 删除 hashMap 中的key对应的Item
		hashMap.delete(first.key);

		return first.key;
	}

	// 返回链表长度，时间复杂度为 O(1)
	ListSize() {
		return this.size;
	}
}
class LFUCache_4 {
	// key 到value 的映射，我们后文称kv表
	keyToValue: Map<unknown, unknown>;
	// key 到频率 freq 的映射，我们后文称kf表
	keyToFreq: Map<unknown, number>;
	// freq 到 key 的映射，我们后文称fk表
	freqToKeys: Map<number, DoubleList>;
	// 记录最小频率
	minFreq: number;
	// 记录LFU缓存的最大容量
	cap: number;

	constructor(capacity: number) {
		this.keyToValue = new Map<unknown, unknown>();
		this.keyToFreq = new Map<unknown, number>();
		this.freqToKeys = new Map<number, DoubleList>();
		this.cap = capacity;
		this.minFreq = 0;
	}

	increaseFreq(key: unknown) {}

	get(key: unknown) {
		if (!keyToValue.has(key)) {
			return -1;
		}
		// 增加 key 对应的 freq
		this.increaseFreq(key);

		return keyToValue.get(key);
	}

	removeMinFreqKey() {}

	put(key: unknown, value: unknown) {
		if (this.cap <= 0) {
			return;
		}
		// 若key已经存在修改对应的val就行
		if (this.keyToValue.has(key)) {
			this.keyToValue.set(key, value);
			// key对应的freq加一
			this.increaseFreq(key);
			return;
		}

		// key不存在需要插入
		// 容量已满的话需要淘汰一个freq最小的key
		if (this.cap <= keyToValue.size) {
			this.removeMinFreqKey();
		}
		// 插入key和val，对应的freq为1
		// 插入kv表
		this.keyToValue.set(key, value);
		// 插入kf表
		this.keyToFreq.set(key, 1);
		// 插入fk表
		this.freqToKeys.set(1, new DoubleList());
		const list = this.freqToKeys.get(1);
		list.addLast(new Item(key, value));
		// 插入key后最小的freq为1
		this.minFreq = 1;
	}
}

// increaseFreq和removeMinFreqKey方法是 LFU 算法的核心，我们下面来看看怎么借助KV表，KF表，FK表这三个映射巧妙完成这两个函数。

/* 四、LFU 核心逻辑 */

// 首先来实现removeMinFreqKey函数：

class LFUCache_5 {
	// key 到value 的映射，我们后文称kv表
	keyToValue: Map<unknown, unknown>;
	// key 到频率 freq 的映射，我们后文称kf表
	keyToFreq: Map<unknown, number>;
	// freq 到 key 的映射，我们后文称fk表
	freqToKeys: Map<number, DoubleList>;
	// 记录最小频率
	minFreq: number;
	// 记录LFU缓存的最大容量
	cap: number;

	constructor(capacity: number) {
		this.keyToValue = new Map<unknown, unknown>();
		this.keyToFreq = new Map<unknown, number>();
		this.freqToKeys = new Map<number, DoubleList>();
		this.cap = capacity;
		this.minFreq = 0;
	}

	increaseFreq(key: unknown) {}

	get(key: unknown) {
		if (!keyToValue.has(key)) {
			return -1;
		}
		// 增加 key 对应的 freq
		this.increaseFreq(key);

		return keyToValue.get(key);
	}

	removeMinFreqKey() {
		// freq最小的key列表
		const keyList = this.freqToKeys.get(this.minFreq);
		// 其中最先被插入的key就是应该被淘汰的key
		const deleteKey = keyList.removeFirst();
		// 更新fk列表
		if (keyList.ListSize() === 0) {
			this.freqToKeys.delete(this.minFreq);
		}
		// 更新kv表
		this.keyToValue.delete(deleteKey);
		// 更新kf表
		this.keyToFreq.delete(deleteKey);
	}

	put(key: unknown, value: unknown) {
		if (this.cap <= 0) {
			return;
		}
		// 若key已经存在修改对应的val就行
		if (this.keyToValue.has(key)) {
			this.keyToValue.set(key, value);
			// key对应的freq加一
			this.increaseFreq(key);
			return;
		}

		// key不存在需要插入
		// 容量已满的话需要淘汰一个freq最小的key
		if (this.cap <= keyToValue.size) {
			this.removeMinFreqKey();
		}
		// 插入key和val，对应的freq为1
		// 插入kv表
		this.keyToValue.set(key, value);
		// 插入kf表
		this.keyToFreq.set(key, 1);
		// 插入fk表
		this.freqToKeys.set(1, new DoubleList());
		const list = this.freqToKeys.get(1);
		list.addLast(new Item(key, value));
		// 插入key后最小的freq为1
		this.minFreq = 1;
	}
}

// 删除某个键key肯定是要同时修改三个映射表的，借助minFreq参数可以从FK表中找到freq最小的keyList，根据时序，其中第一个元素就是要被淘汰的deletedKey，操作三个映射表删除这个key即可。

// 但是有个细节问题，如果keyList中只有一个元素，那么删除之后minFreq对应的key列表就为空了，也就是minFreq变量需要被更新。如何计算当前的minFreq是多少呢？

// 实际上没办法快速计算minFreq，只能线性遍历FK表或者KF表来计算，这样肯定不能保证 O(1) 的时间复杂度。

// 但是，其实这里没必要更新minFreq变量，因为你想想removeMinFreqKey这个函数是在什么时候调用？在put方法中插入新key时可能调用。
// 而你回头看put的代码，插入新key时一定会把minFreq更新成 1，所以说即便这里minFreq变了，我们也不需要管它。

// 下面来实现increaseFreq函数：

export class LFUCache {
	// key 到value 的映射，我们后文称kv表
	keyToValue: Map<unknown, unknown>;
	// key 到频率 freq 的映射，我们后文称kf表
	keyToFreq: Map<unknown, number>;
	// freq 到 key 的映射，我们后文称fk表
	freqToKeys: Map<number, DoubleList>;
	// 记录最小频率
	minFreq: number;
	// 记录LFU缓存的最大容量
	cap: number;

	constructor(capacity: number) {
		this.keyToValue = new Map<unknown, unknown>();
		this.keyToFreq = new Map<unknown, number>();
		this.freqToKeys = new Map<number, DoubleList>();
		this.cap = capacity;
		this.minFreq = 0;
	}

	private increaseFreq(key: unknown, value: unknown) {
		// 获取 hashMap 中key对应的Item
		const item = hashMap.get(key);

		const freq = this.keyToFreq.get(key);
		console.log("====>>freq", freq);
		// 更新kf表
		this.keyToFreq.set(key, freq + 1);
		// 更新fk表
		// 将key从freq对应的列表中删除
		const list = this.freqToKeys.get(freq);
		list.remove(item);
		// 如果freq对应的列表中的移除这个freq
		if (list.ListSize() === 0) {
			this.freqToKeys.delete(freq);
			// 如果这个freq恰好是minFreq，更新minFreq
			if (freq === this.minFreq) {
				this.minFreq = this.minFreq++;
			}
		}

		// 将key加入freq + 1对应的列表中
		if (!this.freqToKeys.has(freq + 1)) {
			this.freqToKeys.set(freq + 1, new DoubleList());
		}
		// 新增item并存入hashMap
		const newItem = new Item(key, value);
		hashMap.set(key, newItem);
		this.freqToKeys.get(freq + 1).addLast(newItem);
	}

	get(key: unknown) {
		if (!this.keyToValue.has(key)) {
			return -1;
		}
		// 增加 key 对应的 freq
		const val = this.keyToValue.get(key);
		this.increaseFreq(key, val);

		return val;
	}

	private removeMinFreqKey() {
		// freq最小的key列表
		const keyList = this.freqToKeys.get(this.minFreq);
		// 其中最先被插入的key就是应该被淘汰的key
		const deleteKey = keyList.removeFirst();
		// 更新fk列表
		if (keyList.ListSize() === 0) {
			this.freqToKeys.delete(this.minFreq);
		}
		// 更新kv表
		this.keyToValue.delete(deleteKey);
		// 更新kf表
		this.keyToFreq.delete(deleteKey);
	}

	put(key: unknown, value: unknown) {
		if (this.cap <= 0) {
			return;
		}
		// 若key已经存在修改对应的val就行
		if (this.keyToValue.has(key)) {
			this.keyToValue.set(key, value);
			// key对应的freq加一
			this.increaseFreq(key, value);
			return;
		}

		// key不存在需要插入
		// 容量已满的话需要淘汰一个freq最小的key
		if (this.cap <= this.keyToValue.size) {
			this.removeMinFreqKey();
		}
		// 插入key和val，对应的freq为1
		// 插入kv表
		this.keyToValue.set(key, value);
		// 插入kf表
		this.keyToFreq.set(key, 1);
		// 插入fk表
		if (!this.freqToKeys.has(1)) {
			this.freqToKeys.set(1, new DoubleList());
		}
		const list = this.freqToKeys.get(1);
		const newItem = new Item(key, value);
		// hashMap 中添加 key 与 Item的对应关系
		hashMap.set(key, newItem);
		list.addLast(newItem);
		// 插入key后最小的freq为1
		this.minFreq = 1;
	}
}

// 更新某个key的freq肯定会涉及FK表和KF表，所以我们分别更新这两个表就行了。

// 和之前类似，当FK表中freq对应的列表被删空后，需要删除FK表中freq这个映射。如果这个freq恰好是minFreq，说明minFreq变量需要更新。

// 能不能快速找到当前的minFreq呢？这里是可以的，因为我们刚才把key的freq加了 1 嘛，所以minFreq也加 1 就行了。

// 至此，经过层层拆解，LFU 算法就完成了。
