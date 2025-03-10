# Lab09 Deploy <!-- omit in toc -->

[TOC]

# Due Date <!-- omit in toc -->

Week 10 Monday 8:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney).

# 1. Background

## 1.1. Rationale

Deploy deploy deploy 🚀! While having our forum application working locally is fun and all, there's no point if you can't show it off to everyone else 😎!

In this lab, you will expose your backend server application to the outside world via serverless functions and using databases. You can use it to chat with your friends, host secret parties or plot a coup d'etat against COMP1531 staff - the possibilities are endless!

## 1.2. What we'll be doing!

1. We'll be using a very basic express server to demonstrate deployment! It has a basic implementation of the following routes:

- root (`/`),
- echo (`/echo/echo`),
- add name (`/add/name`),
- view names (`/view/names`), and
- clear (`/clear`)

2. Although it is not a requirement that you deploy to Vercel in this lab, we recommend doing so as you will receive the most support from our staff this way.

3. There are several steps, please patiently go through each of them. **Please read the lab instructions regarding the [submission process](#26-testing-and-submitting-your-deployed_url) carefully** when you've finished.

A quick visual guide on how deployment will change things for us.

![4.1](assets/4.1.background-info-diagram.png)

Normally, we run our server (`server.ts`) locally on one terminal. This allows us to use another terminal to run tests to send requests to that server. Vercel however will host the server for us! All we need to do after that is to configure our tests, such that it sends HTTP requests to Vercel.

## 1.3. Getting Started

- Copy the SSH clone link from GitLab and clone this repository on either VLAB or your local machine.
- In your terminal, change your directory (using the `cd` command) into the newly cloned lab.

## 1.4. Package Installation

1. Open [package.json](package.json) and look at existing packages in `"dependencies"` and `"devDependencies"`. Install them with:

```bash
npm install
```

2. That's it!. You'll notice we have a very basic express server, similar to what you would have for your project.

# 2. Task

Reminder: if you encounter any bugs, please read the [debugging section](#27-common-issues). Make sure to carefully read the instructions as you progress through the lab. **The vast majority of issues occur when steps are accidentally skipped.**

## 2.1. Setup your Vercel account

You may choose to follow the video guide or the written steps. The steps may also include some pictures. To view them click on the toggle icon.

### 2.1.1. Video guide

Click [here](https://youtu.be/4qZ_yRh6KOY) for a demo of this part of the lab!

### 2.1.2. Steps

1. Create an account! We recommend signing up with email or an existing GitHub account.

   - To signup with email go to [https://vercel.com/signup](https://vercel.com/signup).
   - Follow the prompts and click 'Continue with Email' or continue with another provider if you wish.

<img src="assets/1.signup-email.png" width="700px" />

2. Login by typing the command below. Follow the prompts to login.

```bash
npx -y vercel login
```

<img src="assets/npxvercel.png" height="200px" />

3. Once you're logged in, run the command below. You'll then be asked a series of questions which will help deploy your current directory to Vercel.

```bash
npx -y vercel
```

Potential output you may see:

```
Set up and deploy “~/current_directory/lab-09-deploy? (Y/n) → Y
Which scope do you want to deploy to? → Press enter
Link to existing project? (y/N) → N
What’s your project’s name? (lab-09-deploy) → Press enter
In which directory is your code located? ./ → Press enter
Want to modify these settings? (y/N) → N
```

Example of how this may look for you!

<img src="assets/npxvercelcreate.png" height="150px" />

4. Afterwards we should receive two links!

- One link allows you to inspect the deployment on Vercel.
- The other navigates to the deployed URL. **If it's showing 404 that's completely normal for now.**

Example of what you may see:

<img src="assets/npxvercellinks.png" height="150px" />

## 2.2. Deploy Server using Vercel

### 2.2.1. Telling Vercel where to find our Server

**In the root directory**, create a file called `vercel.json` and copy the following content into the file. This essentially configures our Vercel deployment to redirect all routes to the `server.ts` file.

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

### 2.2.2. Deployment Methods

There are two ways you can deploy your code from your directory to Vercel!

### 2.2.3. Method 1: Using CI/CD to automatic deploy when you `git push`.

1. Log onto your vercel account and click your profile in the top right, then `Account Settings`.

<img src="assets/vercelAccountSettings.png" height="450px" />

2. Click on `Settings`, then `Tokens`, then fill in the `Create Token` form.

<img src="assets/vercelCreateToken.png" height="450px" />

> NOTE: It is generally a good idea to set an expiration date for your token. This is a security measure to ensure that your token is not used maliciously if it is ever leaked. 90 days is a good starting point and should invalidate itself after the end of this course.

3. Copy the token. Make sure you have copied it before closing the window. If you did not copy it and have lost it, you will need to delete it and repeat **Step 2**.
4. Uncomment the comments in [`.gitlab-ci.yml`](./.gitlab-ci.yml) and replace `CHANGE_THIS_HERE` with the token you copied.

> FYI: It is not recommended or good security practice to store your token in your repository as a committed file.
>
> You should treat an API/Token key as a password and keep it as secure as possible.
>
> Generally, best practice would involve injecting the token as an runtime environment variable in your CI/CD pipeline. If you were to do this for a personal project, you can see how to do it [here](https://docs.gitlab.com/ee/ci/variables/#for-a-project).
>
> However, due to limitations of permissioning student repositories within GitLab, we cannot give you access to modify the repository settings directly.

```yml
# TODO: Open .gitlab-ci.yml and uncomment the deployment stage
deployment:
  stage: deployment
  needs: [pipeline]
  resource_group: vercel-deploy
  variables:
    VERCEL_TOKEN: 'CHANGE_THIS_HERE' # change this to your vercel token
  script:
    - npm install --global vercel@canary
    - vercel pull --yes --environment=production --token=${VERCEL_TOKEN}
    - vercel deploy --prod --token=${VERCEL_TOKEN}
  only:
    - master # change this if you want to deploy from other branches
```

> NOTE: For iteration 3, if you're deploying from another branch, remember to modify `.gitlab-ci.yml`. Replace `master` with the branch you're deploying from instead.

5. Commit the changes and push to `master`. This will trigger the pipeline to deploy your server to Vercel after the `pipeline` job gets completed.

> FYI: `resource_group: vercel-deploy` in the .gitlab-ci.yml file ensures that only one deployment job runs at a time. This is to prevent multiple deployments from running concurrently and potentially causing issues.

### 2.2.4. Method 2: Using the CLI to manually deploy

You can do either:

1. Create a preview by running the following commands in your terminal

```bash
npx -yes vercel pull
npx -yes vercel
```

2. Promote the most recent preview to production

- Click on lab09-deploy at the top. Then click on Deployments to see a list.
- Find your latest deployment. At the very right click on the three horizontal dots and click Promote To Production.

<img src="assets/vercelPromoteToProd.png" height="450px" />

2. Or alternatively, deploy directly to production.

```bash
npx -yes vercel pull --yes --environment=production
npx -yes vercel --prod
```

## 2.3. Update your URL in your code!

1. Make your deployed url contain your zID. Go to `Project Settings` > `Domains` > `Edit`, and modify your domain name to include your zID, e.g. `z9999999-forum-deploy.vercel.app`.

Navigate to: `Project Settings > Domain > Edit`:

<img src="assets/2.8.edit-domain-name.png" height="450px" />

2. Congratulations! You've now deployed your server onto the web...somewhat. If you (or a friend) visits the root (`/`) or echo (`/echo/echo?message=hello`) routes on your deployed url, your deployed server should respond with the resulting response from your backend - awesome!

However, as soon as you try to access other routes that manipulate your data store, you'll start running into server errors.

For example: Failed DELETE '/clear' request using API Client:

![image](assets/2.9.persistance-deployment-error.png)

Why is this the case? Well, Vercel is a [serverless](https://vercel.com/docs/functions/serverless-functions) deployment option that will only respond when a request is made. Any state variables, including local files e.g. `database.json`, will not be preserved. This means that if we'd implemented persistence - we'd lose it! What's a more robust solution? Instead of reading and writing to a file in our folder, let's read and write our data from an online database.

## 2.4. Setup Deployed Database

### 2.4.1. Context

For the project we've been persisting data by writing to a json file, e.g. `database.json`. This however will not work anymore as we can't write to files on Vercel! What we will do instead is **store everything as a key-value pair** in Vercel's online database. So in the case of lab09, our database might look like this.

```typescript
{ "names": ["Tam", "Yuchao"] }
```

### 2.4.2. Steps

1. On your deployment page, navigate to the `Storage` tab by: `Top Bar > Storage`

<img src="assets/3.1.storage-tab.png" height="450px" />

2. Select `Create Database` and sel;select `Upstash` as the 'Storage Provider' and `Upstash KV` as the database type. Then click "Continue".

<img src="assets/vercelDatabaseBrowse.png" height="450px" />

3. For `Primary Region` select `N. California, USA (us-west-1)` and select the `Free` plan.
   Avoid selecting `Sydney, Australia (ap-southeast-2)` as this will lead to longer round trip times for network requests between your deployment and your database.

<img src="assets/3.3.database-form.png" height="450px" />

4. Hit 'Continue' then provide a Database Name of `BackendDatabase` and click 'Create'. Once you get to the `Environments` prompt, ensure all environments (Development, Preview, Production) are all selected, then click 'Connect'. This should redirect you to a screen that looks like:

<img src="assets/vercelUpstashScreen.png" height="450px" />

5. Click on `Copy Snippet` and paste the contents into a file called [`.env`](./.env). The contents of the file should look like:

```.env
KV_URL="..."
KV_REST_API_READ_ONLY_TOKEN="..."
KV_REST_API_TOKEN="..."
KV_REST_API_URL="..."
```

These are runtime environment variables that will be used to as credentials to connect to your database. **These are considered passwords, do not share these with anyone or post it publicly!**

6. Now, go back to your terminal and install [`@upstash/redis`](https://www.npmjs.com/package/@upstash/redis) by running:

```bash
npm install @upstash/redis
```

7. Copy the following code snippet into [src/server.ts](src/server.ts) to open a connection to our database so we can read and write to it.

```typescript
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Read in environment variables from `.env` if it exists
config({ path: '.env' });

// Initialize Redis
export const redis = Redis.fromEnv();
```

## 2.5. Use Deployed Database

### 2.5.1. Context

Vercel is serverless! Among other benefits, this allows us to quickly deploy our projects without too much headache. The downside of this is that it only has a local scope. In other words, **it has no persistence and its scope is lost at the end of its execution**. In the case of Vercel for example, this means variables inside your local scope will only persist for around 10 seconds.

How will we persist our data then? What we can do is replace every `setData` and `getData` call with a HTTP request to Vercel's online database. This will require us to:

1. Add two new routes in [src/server.ts](src/server.ts)
2. Modify `setData` and `getData` in [src/names.ts](src/names.ts)

### 2.5.2. Steps

> To read and write to redis, we have to use asynchronous JavaScript functions. This is because the database is hosted online and we have to wait for the response to come back. This is why we use `async` and `await` in the following steps. You are not expected to understand the intricacies of asynchronous JavaScript in COMP1531, hence the code is given to you.
>
> If you would like to learn more, you can read about [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

1. Copy the two routes below and put them inside [src/server.ts](src/server.ts). These routes will serve as a way to get and put data into our database.

```typescript
app.get('/data', async (req: Request, res: Response) => {
  const data = (await redis.get('data')) ?? {};
  return res.status(200).json(data);
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await redis.set('data', JSON.stringify(data));
  return res.status(200).json({});
});
```

- `await redis.get('data')` will return the value for the key `data` in our database. Here the method will automatically convert it to an object if it exists. By default, it will return `null` if the key does not exist.
- `(await redis.get('data')) ?? {}` is a nullish coalescing operator. It will return the LHS if it exists, otherwise it will return the RHS `{}` empty object.
- `await redis.set('data', JSON.stringify(data));` will set the key `data` in our database to the stringified version of the object `data`.

Try testing this route by sending a PUT request via an API client. For example:

![image](assets/3.5.successful-data-change.png)

Likewise, if you send a GET request you should be able to retrieve the data you just set.

From here, when you need to `setData()` or `getData()` you should use these two routes instead.

2. Modify the implementation of `setData` and `getData` to use the new `GET /data` and `PUT /data` respectively in [src/names.ts](src/names.ts).

An example implementation can be found below:

```typescript
import request, { HttpVerb } from 'sync-request';
// Ensure that your DEPLOYED_URL has been updated correctly
import { DEPLOYED_URL } from './submission';
```

```typescript
const requestHelper = (method: HttpVerb, path: string, payload: Record<string, unknown>) => {
  const res = request(method, DEPLOYED_URL + path, {
    qs: ['GET', 'DELETE'].includes(method) ? { ...payload } : undefined,
    json: ['GET', 'DELETE'].includes(method) ? undefined : { ...payload },
    timeout: 20000
  });
  if (res.statusCode !== 200) {
    throw new Error('Failed to properly request data');
  }
  return JSON.parse(res.body.toString());
};

const getData = (): Data => {
  try {
    const res = requestHelper('GET', '/data', {});
    return { ...dataStore, ...res };
  } catch (err) {
    console.error('Failed to properly request data, likely corrupted');
    console.error(err);
    return dataStore;
  }
};

export const setData = (newData: Data): void => {
  requestHelper('PUT', '/data', { data: newData });
};
```

This is just one example of a possible implementation. You may have different keys or methods to save persistent data.

## 2.6. Testing and Submitting your `DEPLOYED_URL`

1. Open [src/submission.ts](src/submission.ts) and modify the `DEPLOYED_URL` to your newly deployed site, e.g. https://z9999999-forum-deploy.vercel.app/.

**A reminder that the `DEPLOYED_URL` must contain your zID exactly once.** You may need to go to Settings > Domains > and edit your deployed url to include your zID.

2. Again, don't forget to `git add`, `git commit`, and then `git push`. If you miss this step, we won't be able to run our tests against your `DEPLOYED_URL`. We won't allow reruns for forgetting to push your code.

3. Ensure all tests pass by running `npm t`, it should take around 20 seconds (NOTE: don't forget to remove the `test.todo` and uncomment the actual test suite!). If there are issues, head to the debugging section below.

## 2.7. Common Issues

<details close>
  <summary> 1. Incorrect format for deployed URL </summary>

- Ensure the URL begins with `http` or `https`. Also check that it **doesn't** end with `/`.
</details>

<details close>
  <summary> 2. You're getting a 404 error </summary>

- You've probably forgotten to push `vercel.json`!
</details>

<details close>
  <summary> 3. You're getting a 500 error </summary>

- First, check to see if your pipeline is passing! If it's failing, click on it to view its details.
- Then go to Vercel and check the server log. The server log should contain an error message, providing details on which line the error occurred as well.
- 500 errors represent server side issues, meaning the issue likely lies within `server.ts` or its associated functions.
</details>

<details close>
  <summary> 4. I'm getting the error "Cannot find module 'easy-libcurl' from 'node_modules/sync-request-curl/dist/cjs/request.js'" </summary>

- Remember to replace `sync-request-curl` with `sync-request`.
</details>

<details close>
  <summary> 5. I have vulnerabilities when I install Vercel? </summary>

- You can ignore those warnings for this lab.
</details>

## 2.8. Debugging tips

<details close>
  <summary> 1. Use an API client </summary>

- API clients such as Postman are extremely helpful for this lab.
- Send GET and PUT requests to to `/data` to see whether things are being stored and retrieved as expected.
- Replicate tests you've made, by sending requests to the routes for `clear`, `addName` and `viewNames`.
- For example, the issue below was caused by forgetting to add, commit and push changes made to `submission.ts`.
![image](assets/5.1.debug.api.client.png)
</details>

<details close>

  <summary> 2. Check the logs </summary>

- Go to your project's list of deployments and click on the latest deployment. At the top there should be a tab called 'Logs'.
- Instead of having `server.ts` output to a terminal, it gets output here.
- Any `console.log` statements in your server or function implementations, will also show here.
  ![image](assets/5.2.debug-log.png)
  ![image](assets/5.3.debug-log-console.png)

</details>

<details close>
  <summary> 3. General tips & Additional resources </summary>

- Use `test.only` in your tests to focus on one test at a time if you are failing them.
- Keep in mind that Vercel only allows 100 deployments a day, so don't redeploy too often.
- If deployment is failing during setup, read the error message by going to Your project > Deployment > Click on the latest deployment > Read the deployment details.
- [Vercel Error Codes](https://vercel.com/docs/errors)
</details>

# 3. Submission

- Use `git` to `add`, `commit`, and `push` your changes on your master branch. Your GitLab pipeline should pass.
- Check that your zID inside `DEPLOYED_URL` is correct. Typos won't be accepted as grounds for a re-run.

**If you have pushed your latest changes to master on Gitlab no further action is required! At the due date and time, we automatically collect your work from what's on your master branch on Gitlab.**

Afterwards, assuming you are working on a CSE machine (e.g. via VLAB), we strongly recommend that you remove your `node_modules` directory with the command:

```bash
rm -rf node_modules
```

This is because CSE machines only allow each user to have a maximum of 2GB, so you will eventually run out of storage space. It is always possible to `npm install` your packages again!
