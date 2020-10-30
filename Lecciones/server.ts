import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std@0.74.0/uuid/mod.ts';
import { MongoClient} from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const port = 8000;
const app = new Application();
let status:number=0;
const routes = new Router();


interface CharacterSchema {
  _id: {$oid:string},
  id:number,
  name:string,
  status:string,
  species:string,
  type:string,
  gender:string,
  origin:number|string,
  location:number|string,
  image:string,
  episode:number[]|string[],
}

interface LocationSchema {
  _id: {$oid:string},
  id:number,
  name:string,
  type:string,
  dimennsion:string,
  residents:number[]
}

interface EpisodeSchema{
  _id: {$oid:string},
  id:number,
  name:string,
  air_date:string,
  episode:string,
  characters:string[]
}

//const DB_URL=Deno.env.get("DB_URL");
//const DB_NAME=Deno.env.get("DB_NAME");

//------No utilizo el metode .get de Deno ya que no me funcionaba-------
const client=new MongoClient();
client.connectWithUri("mongodb+srv://fernando:fernando@cluster0.mbxwu.mongodb.net/nebrija?retryWrites=true&w=majority");
const data_base=client.database("nebrija");
const characterCollection=data_base.collection<CharacterSchema>("CharactersCollection");
const episodeCollection=data_base.collection<EpisodeSchema>("EpisodesCollection");
const locationCollection=data_base.collection<LocationSchema>("LocationsCollection");


let characters:CharacterSchema[]=await characterCollection.find();
let episodes:EpisodeSchema[]=await episodeCollection.find();
let location:LocationSchema[]=await locationCollection.find();

let getData=  [
   characters=await characterCollection.find(),
   episodes=await episodeCollection.find(),
   location=await locationCollection.find(),
]

Promise.all(getData);
const updateArray=()=>{
  aux.forEach((element)=>{
    if(element.hasOwnProperty("_id")){
      //delete element["_id"];
    }
    var nameLocation="";
    var nameOrifin="";
    var nameEpisode="";
    location.forEach((key)=>{
      
      if(key["id"]===element["location"]){
        nameLocation=key["name"];
      }
      if(key["id"]===element["origin"]){
        nameOrifin=key["name"];
      }
    })
    element["location"]=nameLocation;
    element["origin"]=nameOrifin;
    var episodiosAux:string[]=[];
    for(var i = 0;i<element["episode"].length;i++){
      for(var j = 0; j<episodes.length;j++){
        if(element["episode"][i]===episodes[j]["id"]){
          episodiosAux.push(episodes[j]["name"]);
        }
      }
    }
    element["episode"]=episodiosAux;
    
  });
}




let aux:CharacterSchema[]=characters.slice();
updateArray();




routes.get('/character',(ctx)=>{
  ctx.response.body=characters;
  ctx.response.status=200;
});

routes.get('/character/:id',(ctx)=>{
  const { id }=helpers.getQuery(ctx,{mergeParams:true});
  let encontrado:boolean=false;
  aux.forEach(element=>{
    if(element["id"]===Number(id)){
      encontrado=true;
    }
  });
  if(encontrado){
    ctx.response.body=aux.filter(key=>key["id"]===Number(id));
    ctx.response.status=200;
  }else{
    ctx.response.body="Not found";
    ctx.response.status=404
  }
})

routes.put('/switchstatus/:id',async (ctx)=>{
  const { id }=helpers.getQuery(ctx,{mergeParams:true});
  let encontrado:boolean=false;
  aux.forEach(element=>{
    if(element["id"]===Number(id)){
      encontrado=true;
      if(element["status"]==="Alive"){
        element["status"]="Dead";
      }else if(element["status"]==="Dead"){
        element["status"]="Alive";
      }
    }
  })
  
  if(encontrado){
    await Promise.all([
      characterCollection.deleteMany({}),
    ]);
    await Promise.all([
      characterCollection.insertMany(aux),
    ]);
    ctx.response.body=aux.filter(key=>key["id"]===Number(id));
    ctx.response.status=200;
  }else{
    ctx.response.body="Not found";
    ctx.response.status=404
  }
  
  
})

routes.delete('/character/:id', async (ctx)=>{
  const { id }=helpers.getQuery(ctx,{mergeParams:true});
  let encontrado:boolean=false;
  aux.forEach(element=>{
    if(element["id"]===Number(id)){
      encontrado=true;
      characterCollection.deleteOne({"id":Number(id)});
    }
  })
  if(encontrado){
    Promise.all(getData);
    updateArray();
    ctx.response.body="OK";
    ctx.response.status=200;
  }else{
    ctx.response.body="Not found";
  ctx.response.status=404;
  }
  
})




routes.get('/status',(ctx)=>{
  ctx.response.body="OK";
  ctx.response.status=200;
})

app.use(routes.routes());
app.use(routes.allowedMethods());

app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});
 
await app.listen({ port });