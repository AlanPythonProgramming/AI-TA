let userData = [
  {
    name: 'Jack',
    age: 20,
    height: 187,
  },
  {
    name: 'Jill',
    age: 19,
    height: 168,
  },
  {
    name: 'Jason',
    age: 23,
    height: 194,
  },
];

/////////////////////////////////// PART 1 ///////////////////////////////////
//////////////////// TODO: Fix the style of the code below ////////////////////

// Is there someone taller than 190cm? What about 195cm?
let flag=1;
for (let i in userData){
  if (userData[i].height >190) {
      console.log(true);
      flag = 0;
  }
}
if (flag) {
    console.log(false);
}

// What is Jason's age?
let jason;
for (let z of userData) {
    if (z.name==='Jason') {
      jason = z;
    }
}
console.log(`Jasons age is: ${jason.age}`);

// What's the average height of all users?
let x=0;
for (let i = 0; i<userData.length; i++) {
    x +=userData[i].height;
}
let y = x / userData.length
console.log(y);

/////////////////////////////////// PART 2 ///////////////////////////////////
////////////// TODO: Rewrite the code above using array methods ///////////////
//////////// TODO: Complete the problems below using array methods ////////////

// how do we add a user called Jarrod, aged 19 and with a height of 162?

// how do we remove Jason from the array? (hint: we found jason above)

// make a copy of the array?

