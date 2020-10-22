import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std@0.74.0/uuid/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

 
const port = 8000;
const app = new Application();

const routes = new Router();

interface CharacterSchema {
        _id: { $oid: string };
        id: number,
        name:string,
        status: string,
        species: string,
        type: string,
        gender: string,
        origin: number,
        location: number,
        image: string,
        episode: number[],
}

interface LocationSchema {
        _id: { $oid: string };
        id: number;
        name: string;
        type: string;
        dimension: string;
        residents: number[];
}

interface EpisodeSchema {
        _id: { $oid: string };
        id: number;
        name: string;
        air_date: string;
        episode: string;
        characters: number[];
}

const DB_URL = Deno.env.get("DB_URL");
  const DB_NAME = Deno.env.get("DB_NAME");


  if(!DB_URL || !DB_NAME){
    throw Error("Please define DB_URL and DB_NAME on .env file");
  }

  const client = new MongoClient();
  
  client.connectWithUri(DB_URL);
  const db = client.database(DB_NAME);
  const charactersCollection = db.collection<CharacterSchema>("CharactersCollection");
  const episodesCollection = db.collection<EpisodeSchema>("EpisodesCollection");
  const locationsCollection = db.collection<LocationSchema>("LocationsCollection");

routes.get('/',async (ctx) =>{
    let element;
    
    element: await charactersCollection.find(),
     
    ctx.response.body="hola";
});



app.use(routes.routes());
app.use(routes.allowedMethods());


app.addEventListener('listen', () => {
    console.log(`Listening on localhost:${port}`);
  });
await app.listen({ port });