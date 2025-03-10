import { drawShape } from './shapes';

console.log('Solid Square of Size 5');
console.log(drawShape(4, 5, true));
console.log();

console.log('Solid Triangle of Size 5');
console.log(drawShape(3, 5, true));
console.log();

console.log('Hollow Square of Size 5');
console.log(drawShape(4, 5, false));
console.log();

console.log('Hollow Triangle of Size 5');
console.log(drawShape(3, 5, false));
