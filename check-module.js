import basketModule from "./basket.module.js";


let fff = basketModule.getName();
console.log('test', fff)
fff.name = 123;
console.log('test', fff);
console.log('case', basketModule.getName())