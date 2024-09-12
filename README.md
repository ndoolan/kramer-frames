To test locally, run the following commands:

• `npm install`
• `npm run dev`

Note: This app is deployed at https://farcast-frame.vercel.app/ and for ease of integration, relies upon the KV Vercel database. To solve this issue, please run `npm run deploy` after ensuring your logged into your Vercel account via the CLI.

For access to the vercel env variables run the following command after you've cloned this repo, `vercel env pull`. Since this application is built with Vite, you'll need to preference all .env development variables with `VITE_` .

If you run into issues during deployment, Vercel allows access to its logs via the CLI. Please run the command `vercel logs [deployment-url]`

Head to http://localhost:5173/api/dev during development

Final Thoughts:

1. I wanted to make the code more modular and decouple, but every attempt to separate the logic produced errors. Would need to understand frames more fully first.
2. The commit history was longer, but I haven't used Vite before and didn't realized it exposes .env variables to the client side. For security, I built an entirely new repo and created two env files (prod + dev) configured for respective environmnets.
3. While I didn't have experience with Vercel, thought the inital learng would be worth easier deployment + integration with Warpcast - this ended up paying off. Crazy straightforward CI/CD
4. Most of my designs revolved around the primary goal, meet functional requirements and deploy.
