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
routes.get('/characters/:filter',async (ctx) =>{
  
  const { filter }= helpers.getQuery(ctx,{mergeParams:true});
  var id:number=0;
  var name:string="";
  var status:string="";
  var gender:string="";
  var isId:boolean=false;
  var isName:boolean=false;
  var isGender:boolean=false;
  var isStatus:boolean=false;
  var type:string="";
  var result:string=" ";
  var isType:boolean=true;
  var aux:string=filter.slice(0);
  for(var i=0;i<aux.length;i++){
    if(aux.charAt(i)==='='){
      isType=false;
      continue
      
    }
    if(aux.charAt(i)==='$'){
      
      if(type==="id"){
        isId=true;
        id=Number(result);

      }else if(type==="name"){
        isName=true;
        name+=result;
      }else if(type==="gender"){
        isGender=true;
        gender+=result;
      }else if(type==="status"){
        isStatus=true;
        status+=status;
      }
      isType=true;
      type="";
      result="";
      continue;
    }
    

    if(isType){
        type+=aux.charAt(i);
    }else{
      
        result+=aux.charAt(i);
    }
    
    if(i==filter.length-1){
      
      if(type==="id"){
        isId=true;
        id=Number(result);

      }else if(type==="name"){
        isName=true;
        name+=result;
      }else if(type==="gender"){
        isGender=true;
        gender+=result;
      }else if(type==="status"){
        isStatus=true;
        status+=result;
      }
      
    }
  }
  
  
  let element:CharacterSchema[]=[];
  if(isId){
    element=elementsCharacter.filter((elemt)=>elemt["id"]===id);
  }else{
      if(isName){
        element=elementsCharacter.filter((elemt)=>elemt["name"].includes(name));
        if(isGender){

          element=element.filter((elemt)=>{
            
            

            return elemt["gender"]===gender;
          });
          if(isStatus){
            element=element.filter((elemt)=>{
              return elemt["status"]===status;
            });
          }
        }else if(isStatus){
          element=element.filter((elemt)=>elemt["status"]===status);
        }
      }else if(isGender){
        
        element=elementsCharacter.filter((elemt)=>{
          
          
          return elemt["gender"]===gender.slice(1);
        });
        if(isStatus){
          element=element.filter((elemt)=>{
            
            return elemt["status"]===status;
          });
        }
      }else if(isStatus){
        element=elementsCharacter.filter((elemt)=>elemt["status"]===status.slice(1));
      }
      

  }
  
  
    
    ctx.response.body=element;
  }
    

  
  
  
);




   


app.use(routes.routes());
app.use(routes.allowedMethods());
app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});
 
await app.listen({ port });