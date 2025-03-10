# Tutorial 3

[TOC]

Below is the interface for a playlist system in which users can create playlists with songs in them.

| Name & Description | Parameters | Return | Errors |
| --- | --- | --- | --- |
| `addUser`<br>Registers a user with an email and password. | `email`, `password` | `{userId}` | `{error}` when any of: <ul><li>email is an invalid email<li>password is an empty string</ul>
| `addSong`<br>Adds a new song to the database. | `name`, `artist`, `duration` | `{songId}` | `{error}` when any of: <ul><li>name is an empty string<li>artist is an empty string<li>duration is less than 0 or greater than 10</ul>
| `addToPlaylist`<br>Adds a song to a users playlist. | `userId`, `songId` | `{}` | `{error}` when any of: <ul><li>userId is invalid<li>songId is invalid<li>song is already in users playlist</ul>
| `listPlaylist`<br>Lists all of the songs in a users playlist. | `userId` | `{songs}` |  `{error}` when any of: <ul><li>userId is invalid |
| `clear`<br>Returns the program to its original state. | N/A | `{}` | N/A|

| Variable | Type |
| --- | --- |
| **error** | `string`, with the value being a relevant error message of your choice |
| **email** | `string` |
| **password** | `string` |
| **name** | `string` |
| **duration** | `number`, specifically Integer|
| **artist** | `string` |
| contains suffix **Id** | `string` |
| **songs** | Array of objects, where each object has type `{songId, name, duration}` |

## A. Working with multiple files 
When working with a large codebase, it's good practice to break down and organize code into separate files. This helps prevent files from becoming too large and makes it easier to locate specific elements when needed. Additionally, functions that are used across multiple files for common tasks can be consolidated into a separate helper functions file.

Let's try moving the datastore object out of the [playlist.js](playlist/src/playlist.js) file and making helper functions for repetitive code in the program provided.

### Datastore

1. Move the datastore object from [playlist.js](playlist/src/playlist.js) into another file called [dataStore.js](playlist/src/dataStore.js).

2. How can we access and use the datastore now?

### Helper Functions
1. Identify and move repetitive code into a helper function. 

2. Move this helper function into a file called [helper.js](playlist/src/helper.js).

## B. Packages

1. What are packages and why do we use them?

2. What is npm?

3. Identify what we might need to use packages for in the addUser function. 

4. Look through npm and find functions appropriate to perform the tasks you identified. 

5. Use these packages to complete the addUser and addSong function.

## C. Testing
Writing tests is important! We want to make sure that when we make changes, it won't break existing code. We will be using `jest` to write tests. Install jest as a dev dependency with
```
npm i jest --save-dev
```
and then create a file of type `.test.js` to declare it as a test file. Now we can start writing **unit tests!**

### Writing tests
As a class write some tests for the `addUser` function in [playlist.test.js](playlist/src/playlist.test.js). What are some things you may need to test for?

### Black box testing
How can we validate that the `clear` function resets the program to its initial state?<br>
Note that tests have to be black boxed. We should not have any knowledge about how the program is implemented and subsequently we should not call functions that are not part of our interface (this includes `getData`).

### Debugging
Uncomment the rest of the provided tests and run them. Use the outcome of the tests to debug a function. Ensure it passes all tests.

Tips:
- Use test.only to run one test
- Use test.skip to skip specified tests

## D. Iteration 1
Iteration 1 should be available. Check merge requests for a merge request with iteration 1.

Your tutor may run through some tips for iteration 1.
