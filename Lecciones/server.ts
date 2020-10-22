import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std@0.74.0/uuid/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const port = 8000;
const app = new Application();

const routes = new Router();

interface User{
    id:string;
    name:string;
}
interface Message{
    id:string;
    text:string;
    userID:string;
}
const usuarios=new Map<string,User>();
const mensajes=new Map<string,Message>();

usuarios.set('1',{
    id:'1',
    name:'Fernando'
});
usuarios.set('2',{
    id:'1',
    name:'Paco'
});

mensajes.set('1',{
    id:'1',
    text:'Hola Mundo',
    userID:'1'
});
mensajes.set('2',{
    id:'2',
    text:'By World',
    userID:'2'
});

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

//Traigo todos los elementos de las bases de MongoDB
let elementsCharacter:CharacterSchema[]=await charactersCollection.find();
let elementsLocation:LocationSchema[]=await locationsCollection.find();
let elementsEpisode:EpisodeSchema[]=await episodesCollection.find();

routes.get('/characters',async (ctx) =>{
     
    //console.log(element);
    ctx.response.body=elementsCharacter;
    
});
routes.get('/locations',async (ctx) =>{
     
  //console.log(element);
  ctx.response.body=elementsLocation;
  
});
routes.get('/episode',async (ctx) =>{
     
  //console.log(element);
  ctx.response.body=elementsEpisode;
  
});
routes.get('/episode/:id',async (ctx) =>{
  //const { name }= helpers.getQuery(ctx,{mergeParams:true});
  const { id }= helpers.getQuery(ctx,{mergeParams:true});
  //console.log(element);
  let aux=elementsEpisode.filter((elem)=>elem["id"]===Number(id));
  ctx.response.body=aux;
  
  
});
routes.get('/locations/:id',async (ctx) =>{
  //const { name }= helpers.getQuery(ctx,{mergeParams:true});
  const { id }= helpers.getQuery(ctx,{mergeParams:true});
  //console.log(element);
  let aux=elementsLocation.filter((elem)=>elem["id"]===Number(id));
  ctx.response.body=aux;
  
  
});
routes.get('/characters/:id',async (ctx) =>{
  const { name }= helpers.getQuery(ctx,{mergeParams:true});
  if(!name){
    console.log("no existe");
    
  }
  const { id }= helpers.getQuery(ctx,{mergeParams:true});
  //console.log(element);
  let aux=elementsCharacter.filter((elem)=>elem["id"]===Number(id));
  ctx.response.body=aux;
  
  
});




   


app.use(routes.routes());
app.use(routes.allowedMethods());
app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});
 
await app.listen({ port });