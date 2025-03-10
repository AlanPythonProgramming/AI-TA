# Tutorial 10

[TOC]

## A. MyExperience

It's time to fill out MyExperience!

Your tutor will give you 10 minutes to fill out the MyExperience survey which you can access on UNSW Moodle.

Please do so (even if it is just ticking the boxes) as the information is invaluable to us, and also because the cat below will be eternally unhappy otherwise!

![lulu](assets/lulu.jpg)


## B. Kahoot Activity

You will spend some time doing a Kahoot activity with your tutor. They will share a code with you!


## C. Complexity Analysis

Below are solutions to `lab01_leap`. In groups of 2-3, draw a control flow graph for the code shown on the screen  and calculate the resulting cyclomatic complexity.

1. `isLeap`:
    ```ts
    const isLeap = (year: number) => {
      let result: boolean;
      if (year % 4 !== 0) {
        result = false;
      } else if (year % 100 !== 0) {
        result = true;
      } else if (year % 400 !== 0) {
        result = false;
      } else {
        result = true;
      }
      return result;
    };
    ```

1. `getNextLeap`:
    ```ts
    const getNextLeap = (year: number) => {
      let nextLeap = year + 1;
      while (!isLeap(nextLeap)) {
        nextLeap++;
      }
      return nextLeap;
    };
    ```

1. `countLeaps`:
    ```ts
    const countLeaps = (yearArray: number[]) => {
      let count = 0;
      for (const year of yearArray) {
        if (isLeap(year)) {
          count++;
        }
      }
      return count;
    };
    ```