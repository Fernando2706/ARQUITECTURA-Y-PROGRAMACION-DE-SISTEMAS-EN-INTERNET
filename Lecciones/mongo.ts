import { MongoClient } from "https://deno.land/x/mongo@v0.12.1/mod.ts";


const cliente = new MongoClient();
cliente.connectWithUri("mongodb+srv://fernando:fernando@cluster0.mbxwu.mongodb.net/nebrija?retryWrites=true&w=majority");

interface UserSchema{
    _id:{$oid:string}
    name:string;
    year:number;

}
interface CoursesSchema{
    _id:{$oid:string}
    name:string;
    year:number;
}
interface EpisodeSchema{
    _id:{$oid:string}
    id:number;
    name:string;
    air_date:string;
    episode:string;
    characters:string[];
    url:string;
    created:string;
}
interface OriginSchema{
    name:string;
    url:string;
}
interface LocationsSchema{
    name:string;
    url:string;
}
interface CharacterSchema{
    _id:{$oid:string}
    id:number;
    name:string;
    status:string;
    species:string;
    type:string;
    gender:string;
    origin:OriginSchema
    location:LocationsSchema;
    image:string;
    episode:string[];
    url:string;
    created:string;
}
interface LocationSchema{
    id:number;
    name:string;
    type:string;
    dimension:string;
    residents:string[];
    url:string;
    created:string;
}




  
interface IInfo {
next?: string;
}

interface IData {
info: IInfo;
results: EpisodeSchema[]
}
  //Subo los episodios a MongoDB
const url = "https://rickandmortyapi.com/api/episode/";
let responseEpisodes = await fetch(url);
let dataEpisodes: IData = await responseEpisodes.json();
const episodes: EpisodeSchema[]=dataEpisodes.results;
while(dataEpisodes.info.next) {
    responseEpisodes=await fetch(dataEpisodes.info.next);
    dataEpisodes=await responseEpisodes.json();
    episodes.push(...dataEpisodes.results);

}

const db=cliente.database("nebrija");
const courses=db.collection<EpisodeSchema>("EpisodeCollection");



episodes.forEach( async (episode)=> {

    const finded=await db.collection<EpisodeSchema>("EpisodeCollection").findOne({id:episode["id"]});
    if(finded===null){
        const insertCourse=await courses.insertOne(episode);
    }else{
        console.log("Ya existe este elemento");
        
    }
    
})

interface IDataLocation{
    info: IInfo;
    results: LocationSchema[]
}

//Subo las localizaciones a MongoDB
const urlLocations="https://rickandmortyapi.com/api/location";
let responseLocation = await fetch(urlLocations);
let dataLocation: IDataLocation = await responseLocation.json();
const locations:LocationSchema[]=dataLocation.results;
while(dataLocation.info.next){
    responseLocation=await fetch(dataLocation.info.next);
    dataLocation=await responseLocation.json();
    locations.push(...dataLocation.results);
}
const location=db.collection<LocationSchema>("LocationCollection");

locations.forEach(async (locationIn)=>{
    const finded=await db.collection<LocationSchema>("LocationCollection").findOne({id:locationIn["id"]});
    if(finded===null){
        const location2=await location.insertOne(locationIn);
    }else{
        console.log("Ya existe este elemento");
        
    }
})

interface IDataCharacter{
    info: IInfo;
    results: CharacterSchema[];
}
const urlCharacters="https://rickandmortyapi.com/api/character";
let respondeCharacter=await fetch(urlCharacters);
let dataCharacter:IDataCharacter=await respondeCharacter.json();
const character:CharacterSchema[]=dataCharacter.results;
while(dataCharacter.info.next) {
    respondeCharacter= await fetch(dataCharacter.info.next);
    dataCharacter=await respondeCharacter.json();
    character.push(...dataCharacter.results);
}

const characterCollection=db.collection<CharacterSchema>("CharacterCollection");
character.forEach(async (characters)=>{
    const finded=await db.collection<CharacterSchema>("CharacterCollection").findOne({id:characters["id"]});
    if(finded===null){
        const characte=await characterCollection.insertOne(characters);
    }else{
        console.log("Ya existe este elemento");
        
    }
})