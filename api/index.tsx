import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel';
import { createClient } from '@vercel/kv';
import { config } from '../config.js';

// connect to vercel kv database
// const kv = createClient({
//   url: import.meta.env.VITE_KV_REST_API_URL,
//   token: import.meta.env.VITE_KV_REST_API_TOKEN,
// });
// console.log('config works?', config.RestApiUrl);

const kv = createClient({
  url: config.RestApiUrl,
  token: config.token,
});

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// };

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // frame path - Image url issue?
  browserLocation: '/:path',
  title: 'Kramer Frame',
  initialState: {
    voted: false,
  },
});

// functions
async function handleVote(vote) {
  try {
    let value = await kv.get(`${vote}`);
    value += 1;
    await kv.set(`${vote}`, value);
  } catch (error) {
    console.error('KV connection failed posting vote:', error);
  }
}

async function getVotes() {
  try {
    const noVotes = await kv.get('no');
    const yesVotes = await kv.get('yes');
    const results = {
      yes: yesVotes,
      no: noVotes,
    };
    return results;
  } catch (error) {
    console.error('KV connection failed getting votes:', error);
  }
}

async function hasVoted(id) {
  try {
    let user = await kv.get(`user${id}`);
    // if no user exists in database
    if (user === null) {
      // set a key to unique str + fid
      kv.set(`user${id}`, true);
      return false;
    } else {
      // we found a user, they can't vote again
      return true;
    }
  } catch (error) {
    console.error('KV connection failed checking for user:', error);
  }
}

// *************** Initial Welcome Frame ***************
app.frame('/', async (c) => {
  // This is the context from the previous frame
  const { status } = c;

  return c.res({
    action: '/submit',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          There will be over 10,000 Kramer predictions before 9/29 at midnight
        </div>
      </div>
    ),
    intents: [
      <Button action="/vote" value="yes">
        Yes
      </Button>,
      <Button action="/vote" value="no">
        No
      </Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// *************** Voting Yes Frame ***************
app.frame('/vote', async (c) => {
  const { status, buttonValue, frameData } = c;

  // check for user fid in database
  const voted = await hasVoted(frameData?.fid);
  console.log(voted);

  // if someone already voted, redirect to separate frame + don't count there vote
  // hard coded for dev id - temp
  if (voted) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background:
              status === 'response'
                ? 'linear-gradient(to right, #432889, #17101F)'
                : 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            color: 'white',
          }}
        >
          <p>Sneaky, sneaky - you already voted friend</p>
        </div>
      ),
      intents: [
        <Button action="/results">Results</Button>,
        status === 'response' && <Button.Reset>Reset</Button.Reset>,
      ],
    });
  }

  await handleVote(buttonValue);

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'white',
        }}
      >
        <p>You voted... {buttonValue}</p>
        <p>Pretty okayish kinda choice</p>
      </div>
    ),
    intents: [
      <Button action="/results">Results</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// *************** Results Page ***************
app.frame('/results', async (c) => {
  const { status } = c;

  // Query to the database upon hitting frame since frames == stateless
  const votes = await getVotes();
  console.log(votes);

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'white',
        }}
      >
        All Results Here
        <p>Yes: {votes?.yes}</p>
        <p>No: {votes?.no}</p>
      </div>
    ),
    intents: [status === 'response' && <Button.Reset>Reset</Button.Reset>],
  });
});

// error handling frame
app.frame('/', (c) => {
  return c.error({
    message: 'Yikes - looks like an error occured',
    statusCode: 404,
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined';
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development';
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
