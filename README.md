# Welcome to AnotherNet
## A website on a mission to make a new web

This project is rather simple, it just generates pages that you want to visit using AI, then stores them in a db

### Technical
**anothernet** uses prisma-next for db queries and hackclub ai(via openrouter sdk) for AI queries. The project runs on nextjs.

### Try it out
You can try anothernet out by clicking [here](https://anothernet.archiem.top) or going to https://anothernet.archiem.top

### Running it yourself
I don't know why you would want to but here's how to run it yourself (quick note, you will need hackclub ai to run this project:

Start by cloning the repo from github
```shell
git clone https://github.com/Volcar144/anothernet.git
cd anothernet
```

Then create a .env file and populate it like the following: 
```js
    HACKCLUB_AI_API_KEY='xxxx'
    DATABASE_URL='postgresql://xxxxxxxx'
    DATABASE_PASSWORD='xxxxxxxxxxxx' //Optional
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_xxxxxxxxx
    NEXT_PUBLIC_POSTHOG_HOST=
    MODERATION_ENABLED='true'
```

Once you have your database sorted, go ahead and run:
```shell
npm install
npx prisma-next contract emit
npx prisma-next db init
```

Then you can:
```shell
npm run dev
```