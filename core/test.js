// console.log('script start');

// setTimeout(function() {
//   console.log('setTimeout');
// }, 2000);

// Promise.resolve().then(function() {
//   console.log('promise1');
// }).then(function() {
//   console.log('promise2');
// });
// setTimeout(function() {
//   console.log('setTimeout22');
// 	Promise.resolve().then(function() {
// 		console.log('promise333');
// 	}).then(function() {
// 		console.log('promise444');
// 	});
// }, 100);

// Promise.resolve().then(function() {
//   console.log('promise111');
// }).then(function() {
//   console.log('promise222');
// });

// console.log('script end');

console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')