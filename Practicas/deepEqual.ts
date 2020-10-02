//Imprimir, copiar, comparar por valor


//Creo los objetos que voy a usar en mis funciones
const persona1={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas"
    ]
}

const persona2={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas",
        "filete"
    ]
}
const persona3={
    name:"Fernando",
    edad:20,
    coche:false
}
const persona4={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas"
    ]
}
const persona5={
    name:"Paco",
    edad:20,
    coche:false,
    genero:'M',
    amigos:[
        {
            name:"Fernando",
            edad:20
        }
    ]
}

//Funcion para imprimir cualquier Objeto

const printObject=(a:any)=>{
    Object.keys(a).forEach(elemento=>{
        if(typeof a[elemento]!=='object'){

            
            console.log(elemento +":" +a[elemento]);
        }else{
            console.log(elemento+": ");

            printObject(a[elemento]);
        }
        
    })
}

printObject(persona5);


var deepEqual=(a:any,b:any):boolean=>{
    let equal:boolean=false;
    if(a===b){
        equal=true;
    }else if(a!=null&&b!=null){
        if(Object.keys(a).length!=Object.keys(b).length){
            equal= false
        }else{
            for(var elemento in a) {

                if(b.hasOwnProperty(elemento)){
                    equal=deepEqual(a[elemento],b[elemento]);
                }else{
                    return false;
                }
            }
        }
    }
    else{
        equal= false
    }
    return equal;
}


 const deepClone=function (a:any) {
     if(typeof a!=='object'){
        //En caso de que a no sea un objeto se retorna

         return a;
     }
     var objClonado=a.constructor()//mediante
     

     for(var elementos in a){
         objClonado[elementos]= deepClone(a[elementos])//mediante recursividad iremos clonando cada elemento
     }
     return objClonado;//Una vez terminada la recursividad devolvemos el objeto
}




console.log(deepEqual(persona1,persona2)); //false
console.log(deepEqual(persona1,persona4)); //true


const clone=deepClone(persona1);
printObject(clone)











