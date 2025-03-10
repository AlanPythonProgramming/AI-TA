# Tutorial 2

[TOC]

## A. Style

### 1. Basic style
While we haven't given you a style guide yet, it's still important to maintain good style! Most styling rules taught in 1511 still apply.

Take a look at [style.js](style.js). It contains many style issues. You will have 5 minutes to review the code in your groups and identify as many style issues as you can!

### 2. Javascript style / Array Methods

JavaScript is a high-level language with many built-in features that simplify common tasks. This built-in functionality makes it easier to read, write and debug code.

Today, we’ll focus on array methods. These are like functions specifically designed for performing common operations on arrays, such as adding elements, finding items, sorting, and more.

Let's try to rewrite the code in a more "javascripty" way by using array methods. Search online for some array methods you could use to perform the following tasks:

- Finding if there exists a user taller than 190
- Finding the age of a user given their name
- Finding the average height of all the users
- Add a user to the array
- Remove a user from the array
- Make a copy of the array

## B. Git for Teamwork

### Branching
To ensure our repository always contains a stable, bug-free version of our code, we need a way to manage incomplete or experimental code. Enter branches! Branches allow multiple people to collaborate on the same repository at the same time without affecting the master branch or interfering with each other's work.

Let's see all the branches we have in our repo by running
```
$ git branch (lists all branches in your local repo)
$ git branch -r (lists all branches in your remote repo)
$ git branch -a (lists all branches in your local and remote repo)
```
You should see the `master` branch listed and in green or highlighted. This tells us that we have 1 branch in our repo and we're currently on it. We want to keep the `master` branch stable, so let's create another branch to work on.
```
$ git branch tom-branch
```
now let's check our branches
```
$ git branch
```
You'll see `tom-branch` added to the list of branches, but the master branch will still be green. To switch to the branch we just created, we need to use
```
$ git checkout tom-branch
```
Now we can start modifying code. Make some changes to a file, add, commit and then push. 
When pushing for the first time, you may be prompted with
```
$ git push --set-upstream origin tom-branch
```
This command specifies where we push our code to. Once executed, it will create a new branch on the remote repo with the same name and "link" the two branches together. Subsequent pushes from our local branch will be sent to this newly created branch on the remote repository.

Note: a new branch can also be made by running
```
$ git checkout -b <branch name> 
```
This command is a combination of `git branch` and `git checkout` as it makes a new branch and switches to it.

### Making a merge request
After pushing, we notice that the changes we made aren't reflected in the master branch. To integrate the changes from our branch into the master branch, we can use merge requests. 

You may see something like this after pushing. Clicking the link will take you to gitlab where you can create a merge request to master.
```
remote: To create a merge request for tom-branch, visit:
remote: <link here>
```
Alternatively, you can head to gitlab and navigate to the Code then Merge requests tab in the sidebar and create a merge request from there.

**!! Note that for your project, you will need someone else to review your code and approve it before you can merge it into master !!**

Why is it important to create merge requests instead of pushing directly into master when you're done?

### Handling merge conflicts
While Git is great at merging code changes automatically, it can struggle sometimes, especially when two people modify the same part of code simultaneously. In such cases, Git can’t determine how to merge the changes, resulting in a merge conflict. Learning how to resolve merge conflicts properly is important!

Firstly, let's create a merge conflict. 
1. On `tom-branch`, edit an existing file and add some code to line 1. Save the changes, then add, commit, and push them.
2. From the master branch, create a new branch called `bob-branch` and checkout to it.
3. On `bob-branch`, edit the same file and add some lines of code to line 1
4. Save the changes, then add, commit, and push them.
5. Create merge requests from both `tom-branch` and `bob-branch` into the master branch.
6. Accept the merge request from `tom-branch`.
7. Check `bob-branch`. The merge request from `bob-branch` should now show a merge conflict.

How do we resolve this merge conflict?

## C. Iteration 0

Iteration 0 should be available. Check merge requests for a merge request with iteration 0.

Your tutor may run through some tips for iteration 0.