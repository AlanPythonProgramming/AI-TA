# Tutorial 7

[TOC]

## A. Movies

Below is the MVP interface for a movie data system:

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
      <code>/movie/add</code>
      <br/><br/>
      Adds a movie to the data store.
    </td>
    <td>
       POST
    </td>
    <td>
      <b>Body Parameters</b>:
      <br/>
      <code>{title, director}</code>
      <br/><br/>
      <b>Return Object</b>:
      <br/>
      <code>{movieId}</code>
    </td>
    <td>
      <code>{error}</code> when any of:
      <ul>
        <li>title is an empty string, ""</li>
        <li>director is an empty string, ""</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/movie/:movieid</code>
      <br/><br/>
      Edits a movie in the data store.
    </td>
    <td>
      PUT
    </td>
    <td>
      <b>Body Parameters</b>:
      <br/>
      <code>{movieId, title, director}</code>
      <br/><br/>
      <b>Return Object</b>:
      <br/>
      <code>{}</code>
    </td>
    <td>
      <code>{error}</code> when any of:
      <ul>
        <li>movieId does not refer to an existing movie</li>
        <li>title is an empty string, ""</li>
        <li>director is an empty string, ""</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/movies/list</code>
      <br/><br/>
      Lists all movies in the data store.
    </td>
    <td>
        GET
    </td>
    <td>
      <b>Query Parameters</b>:
      <br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b>:
      <br/>
      <code>{movies}</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
        <code>/clear</code><br /><br />
        Delete all movie data and return an empty object.
    </td>
    <td>
        DELETE
    </td>
    <td>
      <b>Query Parameters</b>:
      <br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b>:
      <br/>
      <code>{}</code>
    </td>
    <td>
        N/A
    </td>
  </tr>
</table>

### Part 1 - Exceptions

1. In [a.movies/src/movie.ts](a.movies/src/movie.ts)
  - remove the `ErrorObject` from the union return type of the `movieAdd` and `movieEdit` functions
  - modify the functions to throw an exception (instead of returning an object for errors)

2. In [a.movies/src/server.ts](a.movies/src/server.ts), use try-catch blocks to handle the exceptions

3. Run the tests to ensure they are still passing.

### Part 2 - Saving

Currently, once the program runtime ends, all the movies in the data system will be lost. 

1. Write a function `save()` in [dataStore.ts](./a.movies/src/dataStore.ts) that when called will save all existing movies in the dataStore to a json file called 'movieDatabase'

2. How can we access the movies stored in the database when we next restart the program?

3. As a class, discuss when and where you could use these functions to ensure that the movie database is still saved if the server was closed or crashed.

## B. DRY & KISS

The code in [b.drykiss](b.drykiss/drykiss.ts) is unnecessarily complicated, and there is a lot of repetition. Take some time to refactor this code focusing on DRY and KISS principles to create a concise and easily-understood code.

Your tutor will split you up into groups. In 10 minutes, refactor the code into the least number of lines as possible using DRY and KISS principles (the group with the lowest number of lines, while still maintaining easy to read code, will win!)

<details close>

<summary>click to view</summary>

```ts
import promptSync from 'prompt-sync';

/**
 * Given an array of n integers, caclulate the minimum, maximum, and the
 * product of the first n-1 numbers and last n-1 numbers.
 */
function drykiss(myList: number[]) {
  let myMin = Infinity;
  for (let i = 0; i < myList.length; i++) {
    if (myList[i] < myMin) {
      myMin = myList[i];
    }
  }

  let myMax = -Infinity;
  for (let i = 0; i < myList.length; i++) {
    if (myList[i] > myMax) {
      myMax = myList[i];
    }
  }

  let prod = 1;
  for (let i = 0; i < 4; i++) {
    prod = prod * myList[i];
  }
  const prodHead = prod;

  prod = 1;
  for (let i = 1; i < 5; i++) {
    prod = prod * myList[i];
  }

  const result = [myMin, myMax, prodHead, prod];
  return result;
}

const prompt = promptSync();
const a = parseInt(prompt('Enter a: '));
const b = parseInt(prompt('Enter b: '));
const c = parseInt(prompt('Enter c: '));
const d = parseInt(prompt('Enter d: '));
const e = parseInt(prompt('Enter e: '));
const myList = [a, b, c, d, e];
const result = drykiss(myList);
console.log('Minimum:');
console.log(`${result[0]}`);
console.log('Maximum:');
console.log(`${result[1]}`);
console.log('Product of first 4 numbers:');
console.log(`${result[2]}`);
console.log('Product of last 4 numbers');
console.log(`${result[3]}`);
```

</details>


## C. Debugging activity

Below is the interface that was used for the week 5 server tutorial:

<details close>
<summary>click to view</summary>

<table>
  <tr>
    <th>Name & Description</th>
    <th>HTTP Method</th>
    <th>Data Types</th>
    <th>Errors</th>
  </tr>
  <tr>
    <td>
      <code>/clear</code><br/><br/>
      Remove all entries from the data store.
    </td>
    <td>
      DELETE
    </td>
    <td>
      <b>Parameters</b><br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{}</code>
    </td>
    <td>
      N/A
    </td>
  </tr>
  <tr>
    <td>
      <code>/people/add</code><br/><br/>
      Given a name and an age, add the entry into the data store if it is valid.
    </td>
    <td>
        POST
    </td>
    <td>
      <b>Body Parameters</b><br/>
      <code>{name: string, age: number}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{}</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          The given name is an empty string, <code>""</code>.
        </li>
        <li>
          The given age is not strictly positive.
        </li>
        <li>
          The given name already exists in the data store.
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/people/list</code><br/><br/>
      Return all people that are equal to or older than the given <code>minAge</code>.
      <br/><br/>
      Names should be returned in descending age order (e.g. eldest at index 0),
      or in lexicographical case-insensitive order if the ages are equal.
    </td>
    <td>
        GET
    </td>
    <td>
      <b>Query Parameters</b><br/>
      <code>{minAge: number}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{ people: Person[] }</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          minAge is strictly negative.
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/person/:personid</code><br/><br/>
      Return the name and age of a person that corresponds with the given personid
    </td>
    <td>
      GET
    </td>
    <td>
      <b>Parameters</b><br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{ person: Person }</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          personid does not refer to an existing person
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/person/:personid</code><br/><br/>
      Edit the age for the given name entry.
    </td>
    <td>
      PUT
    </td>
    <td>
      <b>Body Parameters</b><br/>
      <code>{name: string, age: number}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{}</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          personid does not refer to an existing person
        </li>
        <li>
          The given personid does not refer to an existing person.
        </li>
        <li>
          The new age is not strictly positive.
        </li>
        <li>
          The new name is an empty string, ""
        </li>
        <li>
          The given name already exists in the data store (no error if updating name to the same thing!).
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/person/:personid</code><br/><br/>
      Remove the given person entry.
    </td>
    <td>
      DELETE
    </td>
    <td>
      <b>Parameters</b><br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{}</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          The given personid does not exist in the data store.
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <code>/people/stats</code><br/><br/>
      Return an object containing stats about the age of all people
    </td>
    <td>
      GET
    </td>
    <td>
      <b>Parameters</b><br/>
      <code>{}</code>
      <br/><br/>
      <b>Return Object</b><br/>
      <code>{stats: AgeStats}</code>
    </td>
    <td>
      Return <code>{ error }</code> with status code 400 when:
      <ul>
        <li>
          There are no entries in the data store.
        </li>
      </ul>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>Interface</th>
    <th>Structure</th>
  </tr>
  <tr>
    <td>
      Person
    </td>
    <td>
      <pre>{
  name: string,
  age: number
}</pre>
    </td>
  </tr>
  <tr>
    <td>
      AgeStats
    </td>
    <td>
      <pre>{
  minAge: number,
  maxAge: number,
  averageAge: number
}</pre>
    </td>
  </tr>
</table>

</details>

The completed tests, server and functions have been provided in [c.express/src](./c.express/src), however some of the tests are failing!   

Individualy or in small groups, spend 15 minutes trying debug the code so that all tests pass.

### Setup
To practice debugging the code yourself:
1. Create a fork of the `tutorials` repo
2. In the forked repo, press the blue `Code` button and copy the link to clone with SSH
3. Run `git clone your-copied-SSH-link` in your terminal
4. Nagivate to `tut07/c.express/src`

### Task
1. Run `npm install`
2. Open the files `people.ts`, `server.ts` and `people.test.ts`. The failing tests may be caused by a bug in any of these three files
3. Start the server from your terminal
4. In a separate terminal, run the tests
5. Attempt to debug each test that fails (`test.only` or `describe.only` will be really useful here!) 

**A general approach to debugging is:**
1. Isolate **one** failing test case by changing it to test.only
2. Clear all of your terminals and restart your server
3. Run only the chosen failing test
4. Look carefully at **both** the server terminal and jest terminal outputs. Some things to check might be:
    - What did you receive that you weren't expecting?
    - Did a route give the incorrect status code?
    - Did a route get called that shouldn't have?
    - Are the URL and method correct for the route?
5. If you are still stuck, start adding console.log calls. These can be used to narrow down where the error is occuring, and often why the error is occuring as well 
    - Add console.log to your functions, server and test files
    - Print out any data that could be useful for understanding what's going on
6. Clear your terminals and restart your server. Re-run the tests and see if any of your logs show unexpected data. If so, find out why
7. Keep rerunning your test case and adding more console.log calls until you identify the issue   

View the COMP1531 [debugging guide](https://nw-syd-gitlab.cseunsw.tech/COMP1531/24T2/debugging) for more tips.
    
Please utilise this time well to improve your debugging skills!   

Many of the bugs in this activity are similar to common bugs students experience in iteration 2 and 3. By coming across it now, and practising the process of debugging, you may be able to save a lot of time (and frustration) debugging in the future!  

If you get stuck, or have any questions, please ask your tutor during this time! Your tutor has a lot of practice at debugging - this is a great time to learn from some of their expertise

If time permits, your tutor may demonstrate how they would approach debugging this problem
