

// var removeDuplicates = function(nums) {
// 	const arr = JSON.parse(JSON.stringify(nums));
// 	let aa = 0;
// 	const bb = []
// nums.forEach((item,index,data)=>{
// 	if(item !== data[index+1]){
// 		bb.push(item)
// 	}
// })
// nums = bb
// 	return nums.length
// };
var removeDuplicates = function(nums) {
	const n = nums.length;
	if (n === 0) {
			return 0;
	}
	let fast = 1, slow = 1;
	while (fast < n) {
			if (nums[fast] !== nums[fast - 1]) {
					nums[slow] = nums[fast];
					++slow;
			}
			++fast;
	}
	return slow;
};

const aa = removeDuplicates([1,1,1,2,3,3,4]);
console.log(aa,112)