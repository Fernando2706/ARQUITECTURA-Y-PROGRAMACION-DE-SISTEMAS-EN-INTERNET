import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std@0.74.0/uuid/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import router from "./router.ts"

 
const port = 8000;
const app = new Application();

const DB_URL = Deno.env.get("DB_URL");
const DB_NAME = Deno.env.get("DB_NAME");

  if (!DB_URL || !DB_NAME) {
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

const client = new MongoClient();
client.connectWithUri(DB_URL);
const db = client.database(DB_NAME);

app.use(async (ctx, next) => {
  ctx.state.db = db;
  await next();
});

app.use(router.routes());

app.addEventListener('listen', () => {
    console.log(`Listening on localhost:${port}`);
  });
await app.listen({ port });