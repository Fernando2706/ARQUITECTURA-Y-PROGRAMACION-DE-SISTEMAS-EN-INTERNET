interface IInfo{
    next: string
}
interface IResult{
    characters:string[]
}
interface IData{
    info:IInfo;
    result:IResult[]
}

let url:string="https://rickandmortyapi.com/api/episode?page=1"
let response= await fetch(url);
let data: IData = await response.json();

const episodes:IResult[]=data.result;

while(data.info.next){
    response=await fetch(data.info.next);
    data= await response.json();
    episodes.push(...data.result);
}

const characters:{[key:string]:number}={}

episodes.forEach((ep)=>{
    ep.characters.forEach((url)=>{
        if(characters[url]) characters[url]++;
        else characters[url]=1;
    })
})

export { };

