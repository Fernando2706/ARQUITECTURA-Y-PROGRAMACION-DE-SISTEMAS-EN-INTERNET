const json=fetch("https://rickandmortyapi.com/api/character");


json.then((response)=>{
    return response.json();
}).then((jsonData)=>{
   let numberofEpisode=0;
   let id=0;
   
   
    for(let i=0;i<jsonData["results"].length;i++){

        
        if(jsonData["results"][i]["episode"].length>numberofEpisode){
            numberofEpisode=jsonData["results"][i]["episode"].length;
            id=jsonData["results"][i]["id"];
        }
    }
    let result=jsonData["results"][id-1];
   console.log("El personaje con mas episodios es: "+result["name"]);
   
    
    
    
})