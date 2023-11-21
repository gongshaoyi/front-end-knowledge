/* 如何实现一个计算器 */

// 我记得很多大学数据结构的教材上，在讲栈这种数据结构的时候，应该都会用计算器举例，但是有一说一，讲的真的垃圾，我只感受到被数据结构支配的恐惧，丝毫没有支配数据结构的快感。

// 不知道多少未来的计算机科学家就被这种简单的数据结构劝退了。

// 那么，我们最终要实现的计算器功能如下：

// 1、输入一个字符串，可以包含+ - * / ()、数字、空格，你的算法返回运算结果。

// 2、要符合运算法则，括号的优先级最高，先乘除后加减。

// 3、除号是整数除法，无论正负都向 0 取整（5/2=2，-5/2=-2）。

// 4、可以假定输入的算式一定合法，且计算过程不会出现整型溢出，不会出现除数为 0 的意外情况。

// 比如输入如下字符串，算法会返回 9：

// 3 * (2-6 /(3 -7))

// 可以看到，这就已经非常接近我们实际生活中使用的计算器了，虽然我们以前肯定都用过计算器，但是如果简单思考一下其算法实现，就会大惊失色：

// 1、按照常理处理括号，要先计算最内层的括号，然后向外慢慢化简。这个过程我们手算都容易出错，何况写成算法呢！

// 2、要做到先乘除，后加减，这一点教会小朋友还不算难，但教给计算机恐怕有点困难。

// 3、要处理空格。我们为了美观，习惯性在数字和运算符之间打个空格，但是计算之中得想办法忽略这些空格。

// 那么本文就来聊聊怎么实现上述一个功能完备的计算器功能，关键在于层层拆解问题，化整为零，逐个击破，相信这种思维方式能帮大家解决各种复杂问题。

// 下面就来拆解，从最简单的一个问题开始。

// 一、字符串转整数

// 是的，就是这么一个简单的问题，首先告诉我，怎么把一个字符串形式的正整数，转化成 int 型？

{
	let s = "456";
	let n = 0;
	for (let i = 0; i < s.length; i++) {
		const char = s[i];
		n = n * 10 + Number(char);
	}
}

// 这个还是很简单的吧，老套路了。

/* 二、处理加减法 */

// 现在进一步，如果输入的这个算式只包含加减法，而且不存在空格，你怎么计算结果？我们拿字符串算式1-12+3为例，来说一个很简单的思路：

// 1、先给第一个数字加一个默认符号+，变成+1-12+3。

// 2、把一个运算符和数字组合成一对儿，也就是三对儿+1，-12，+3，把它们转化成数字，然后放到一个栈中。

// 3、将栈中所有的数字求和，就是原算式的结果。

// 我们直接看代码，结合一张图就看明白了：

const calculate_1 = (s: string) => {
	const stk: number[] = [];
	// 记录算式中的数字
	let num = 0;
	// 记录 num 前的符号，初始为+
	let sign = "+";
	for (let i = 0; i < s.length; i++) {
		const char = s[i];
		// 如果是数字就联系读取到num
		const n = Number(char);
		const isNumber = !isNaN(n);
		if (isNumber) {
			num = num * 10 + n;
		}

		// 如果不是数字说明遇到了下一个符号，那么之前的符号和数字存入栈中
		if (!isNumber || i === s.length - 1) {
			switch (sign) {
				case "+":
					stk.push(num);
					break;
				case "-":
					stk.push(-num);
					break;
			}

			// 更新符号，且数字清零
			sign = char;
			num = 0;
		}

		// 将栈中的所有数字求和得到答案
		const res = stk.reduce((pre, next) => {
			return pre + next;
		}, 0);

		return res;
	}
};

// 我估计就是中间带switch语句的部分有点不好理解吧，i就是从左到右扫描，sign和num跟在它身后。当s[i]遇到一个运算符时，情况是这样的：image/image1

// 所以说，此时要根据sign的 case 不同选择nums的正负号，存入栈中，然后更新sign并清零nums记录下一对儿符合和数字的组合。image/image2

// 另外注意，不只是遇到新的符号会触发入栈，当i走到了算式的尽头（i == s.size() - 1），也应该将前面的数字入栈，方便后续计算最终结果。image/image3

// 至此，仅处理紧凑加减法字符串的算法就完成了，请确保理解以上内容，后续的内容就基于这个框架修修改改就完事儿了。

/* 三、处理乘除法 */

// 其实思路跟仅处理加减法没啥区别，拿字符串2-3*4+5举例，核心思路依然是把字符串分解成符号和数字的组合。

// 比如上述例子就可以分解为+2，-3，*4，+5几对儿，我们刚才不是没有处理乘除号吗，很简单，其他部分都不用变，在switch部分加上对应的 case 就行了：

const calculate_2 = (s: string) => {
	const stk: number[] = [];
	let num = 0;
	let sign = "+";

	for (let i = 0; i < s.length; i++) {
		const char = s[i];
		const n = Number(char);
		const isNumber = !isNaN(n);

		if (isNumber) {
			num = num * 10 + n;
		}

		if (!isNumber || i === s.length - 1) {
			switch (sign) {
				case "+":
					stk.push(num);
					break;
				case "-":
					stk.push(-num);
					break;
				case "*":
					let pre1 = stk.pop();
					stk.push(pre1 * num);
					break;
				case "/":
					let pre2 = stk.pop();
					stk.push(pre2 / num);
					break;
			}

			// 更新符号数字清零
			sign = char;
			num = 0;
		}

		// 将栈中的所有数字求和得到答案
		const res = stk.reduce((pre, next) => pre + next, 0);

		return res;
	}
};

// 乘除法优先于加减法体现在，乘除法可以和栈顶的数结合，而加减法只能把自己放入栈。image/image4

// 现在我们思考一下如何处理字符串中可能出现的空格字符。其实也非常简单，想想空格字符的出现，会影响我们现有代码的哪一部分?

{
	// 如果非数字
	// if (!isNumber || i === s.length - 1) {
	// 	switch (sign) {
	// 		case "+":
	// 			stk.push(num);
	// 			break;
	// 		case "-":
	// 			stk.push(-num);
	// 			break;
	// 		case "*":
	// 			let pre1 = stk.pop();
	// 			stk.push(pre1 * num);
	// 			break;
	// 		case "/":
	// 			let pre2 = stk.pop();
	// 			stk.push(pre2 / num);
	// 			break;
	// 	}
	// 	// 更新符号数字清零
	// 	sign = char;
	// 	num = 0;
	// }
}

// 显然空格会进入这个 if 语句，但是我们并不想让空格的情况进入这个 if，因为这里会更新sign并清零nums，空格根本就不是运算符，应该被忽略。

// 那么只要多加一个条件即可：

{
	// 如果非数字
	// if ((!isNumber && char !== ' ') || i === s.length - 1) {
	// 	switch (sign) {
	// 		case "+":
	// 			stk.push(num);
	// 			break;
	// 		case "-":
	// 			stk.push(-num);
	// 			break;
	// 		case "*":
	// 			let pre1 = stk.pop();
	// 			stk.push(pre1 * num);
	// 			break;
	// 		case "/":
	// 			let pre2 = stk.pop();
	// 			stk.push(pre2 / num);
	// 			break;
	// 	}
	// 	// 更新符号数字清零
	// 	sign = char;
	// 	num = 0;
	// }
}

/* 四、处理括号 */

// 处理算式中的括号看起来应该是最难的，但真没有看起来那么难。

// 那么，为什么说处理括号没有看起来那么难呢，因为括号具有递归性质。我们拿字符串3*(4-5/2)-6举例：image/image5

// 可以脑补一下，无论多少层括号嵌套，通过 calculate 函数递归调用自己，都可以将括号中的算式化简成一个数字。换句话说，括号包含的算式，我们直接视为一个数字就行了。

// 现在的问题是，递归的开始条件和结束条件是什么？遇到 "(" 开始递归，遇到 ")" 结束递归：

export const calculate = (s: string) => {
	const arr = s.split(" ").join("").split("");
	const calculate_sub = (arr: string[]) => {
		const stack: number[] = [];
		let sign = "+";
		let num = 0;
		while (arr.length > 0) {
			const char = arr.shift();
			const n = Number(char);
			const isNumber = !isNaN(n);

			if (isNumber) {
				num = num * 10 + n;
			}

			if (char === "(") {
				num = calculate_sub(arr);
			}

			if (!isNumber || arr.length === 0) {
				switch (sign) {
					case "+":
						stack.push(num);
						break;
					case "-":
						stack.push(-num);
						break;
					case "*":
						stack.push(stack.pop() * num);
						break;
					case "/":
						stack.push(stack.pop() / num);
						break;
				}

				sign = char;
				num = 0;
			}

			if (char === ")") {
				break;
			}
		}

		const res = stack.reduce((pre, next) => pre + next, 0);
		return res;
	};

	let result = calculate_sub(arr);

	return result;
};

// image/image6/image7/image8

// 你看，加了两三行代码，就可以处理括号了，这就是递归的魅力。至此，计算器的全部功能就实现了，通过对问题的层层拆解化整为零，再回头看，这个问题似乎也没那么复杂嘛。

/* 五、最后总结 */

// 本文借实现计算器的问题，主要想表达的是一种处理复杂问题的思路。

// 我们首先从字符串转数字这个简单问题开始，进而处理只包含加减法的算式，进而处理包含加减乘除四则运算的算式，进而处理空格字符，进而处理包含括号的算式。

// 可见，对于一些比较困难的问题，其解法并不是一蹴而就的，而是步步推进，螺旋上升的。如果一开始给你原题，你不会做，甚至看不懂答案，都很正常，关键在于我们自己如何简化问题，如何以退为进。

// 退而求其次是一种很聪明策略。你想想啊，假设这是一道考试题，你不会实现这个计算器，但是你写了字符串转整数的算法并指出了容易溢出的陷阱，那起码可以得 20 分吧；
// 如果你能够处理加减法，那可以得 40 分吧；如果你能处理加减乘除四则运算，那起码够 70 分了；再加上处理空格字符，80 有了吧。我就是不会处理括号，那就算了，80 已经很 OK 了好不好。

// 我们要支配算法，而不是被算法支配。
