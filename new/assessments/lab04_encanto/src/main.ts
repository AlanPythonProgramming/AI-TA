import {
  Madrigal,
  Song,
  addMadrigal,
  addSong,
  getNamesMixed,
  getNamesPure,
  checkIsSinger,
  getSortedMadrigals,
  getSongsWithMadrigals,
  getMostSpecialMadrigal,
} from './madrigal';

// ========================================================================= //

/**
 * This is NOT a standard way of writing code. The purpose of
 * this function is to stop tsc/ts-node from compiling your code
 * if your type annotation is not consistent with the specification
 * by using comments that starts with "ts-expect-error".
 *
 * DO NOT COPY THIS IN YOUR MAJOR PROJECT OR ANY OTHER LABS.
 *
 * TLDR:
 * - It should compile if your type annotations are correct.
 * - Don't call directly, and don't copy!
 */
function _unusedTypecheck() {
  // @ts-expect-error invalid name type
  addMadrigal(false, 15, 'valid');
  // @ts-expect-error invalid age type
  addMadrigal('Mirabel', false, 'valid');
  // @ts-expect-error invalid gift type
  addMadrigal('Mirabel', 15, false);
  // @ts-expect-error extra argument
  addMadrigal('Mirabel', 15, 'valid', 'extra argument');
  // @ts-expect-error missing argument
  addMadrigal('Mirabel');

  // @ts-expect-error due to invalid name type
  addSong(false, 'Isabella');
  // @ts-expect-error due to invalid singers type
  addSong("We Don't Talk About Bruno", false);
  // @ts-expect-error missing argument
  addSong('Waiting on a Miracle');
  // @ts-expect-error extra argument
  addSong('Waiting on a Miracle', 'Mirabel', 'extra argument');

  // ========================================================================= //

  const luisa = addMadrigal('Luisa', 15, 'Super Strength');
  const surfacePressure = addSong('Surface Pressure', luisa.name);

  // @ts-expect-error invalid list
  getNamesMixed([1, 2, 3]);
  // @ts-expect-error extra arguments
  getNamesMixed([luisa], 'extra Argument');
  // @ts-expect-error missing arguments
  getNamesMixed();

  /**
   * NOTE: If you get an error here, it means that your code is not
   * type-annotated correctly. Please double check the specification!
   */
  // @ts-expect-error invalid list
  getNamesPure([1, 2, 3]);
  // @ts-expect-error extra argument
  getNamesPure([luisa], 'extra Argument');
  // @ts-expect-error missing arguments
  getNamesPure();
  // @ts-expect-error mixed of songs and madrigrals
  getNamesPure([luisa, surfacePressure]);

  // @ts-expect-error invalid madrigal
  checkIsSinger('invalid', surfacePressure);
  // @ts-expect-error invalid song
  checkIsSinger(luisa, 'invalid');
  // @ts-expect-error extra argument
  checkIsSinger(luisa, surfacePressure, 'extra argument');
  // @ts-expect-error missing arguments
  checkIsSinger(luisa);

  // @ts-expect-error invalid madrigal list
  getSortedMadrigals([1, 2, 3]);
  // @ts-expect-error extra argument
  getSortedMadrigals([luisa], 'extra argument');
  // @ts-expect-error missing arguments
  getSortedMadrigals();

  // @ts-expect-error invalid madrigal list
  getSongsWithMadrigals([1, 2, 3], [surfacePressure]);
  // @ts-expect-error invalid song list
  getSongsWithMadrigals([luisa], [1, 2, 3]);
  // @ts-expect-error extra argument
  getSongsWithMadrigals([luisa], [surfacePressure], 'extra argument');
  // @ts-expect-error missing arguments
  getSongsWithMadrigals([luisa]);

  // @ts-expect-error invalid madrigal list
  getMostSpecialMadrigal([1, 2, 3], [surfacePressure]);
  // @ts-expect-error invalid song list
  getMostSpecialMadrigal([luisa], [1, 2, 3]);
  // @ts-expect-error extra argument
  getMostSpecialMadrigal([luisa], [surfacePressure], 'extra argument');
  // @ts-expect-error missing arguments
  getMostSpecialMadrigal([luisa]);
}

// Typescript is smart enough to infer type, so including ": Madrigal" is optional
const mirabel: Madrigal = addMadrigal('Mirabel', 15);
const isabella = addMadrigal('Isabella', 22, 'Flower Creation');

const waitingOnAMiracle: Song = addSong('Waiting on a Miracle', mirabel.name);
const whatElseCanIDo = addSong('What Else Can I Do?', [isabella.name, mirabel.name]);

/*
Sample Output (with different white-space) when using the command:

    $ npm run ts-node src/main.ts

from the root lab directory:
```
{ name: 'Mirabel', age: 15 }
{ name: 'Isabella', age: 22, gift: 'Flower Creation' }
[ 'Mirabel', 'Isabella' ]
[ 'Waiting on a Miracle', 'What Else Can I Do?' ]
[ 'Mirabel', 'Waiting on a Miracle', 'Isabella', 'What Else Can I Do?' ]
true
false
[ { name: 'Mirabel', age: 15 }, { name: 'Isabella', age: 22, gift: 'Flower Creation' } ]
[ { name: 'What Else Can I Do?', singers: [ 'Isabella', 'Mirabel' ] } ]
{ name: 'Mirabel', age: 15 }
```

Use `npm test` for a more comprehensive test suite (in madrigal.test.ts).
*/
console.log(mirabel);
console.log(isabella);
console.log(getNamesPure([mirabel, isabella]));
console.log(getNamesPure([waitingOnAMiracle, whatElseCanIDo]));
console.log(getNamesMixed([mirabel, waitingOnAMiracle, isabella, whatElseCanIDo]));
console.log(checkIsSinger(isabella, whatElseCanIDo));
console.log(checkIsSinger(isabella, waitingOnAMiracle));
console.log(getSortedMadrigals([isabella, mirabel]));
console.log(getSongsWithMadrigals([isabella], [waitingOnAMiracle, whatElseCanIDo]));
console.log(getMostSpecialMadrigal([isabella, mirabel], [waitingOnAMiracle, whatElseCanIDo]));
