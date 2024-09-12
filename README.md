To test locally, run the following commands:

`npm install`

`npm run dev`

Note: This app is deployed at https://farcast-frame.vercel.app/ and for ease of integration, relies upon the KV Vercel database. To solve this issue, please run `npm run deploy` after ensuring your logged into your Vercel account via the CLI.

For access to the vercel env variables run the following command after you've cloned this repo, `vercel env pull`. Since this application is built with Vite, you'll need to preference all .env development variables with `VITE_` .

If you run into issues during deployment, Vercel allows access to its logs via the CLI. Please run the command `vercel logs [deployment-url]`

Head to http://localhost:5173/api
