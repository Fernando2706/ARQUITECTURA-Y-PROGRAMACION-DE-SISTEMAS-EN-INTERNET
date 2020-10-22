//Imprimir, copiar, comparar por valor

interface Persona{
    name:string,
    edad:number,
    cena:string[],
    coche?:boolean
    amigos?:Persona[]
}
//Creo los objetos que voy a usar en mis funciones
const persona1:Persona={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas"
    ]
}

const persona2:Persona={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas",
        "filete"
    ]
}
const persona3:Persona={
    name:"Fernando",
    edad:20,
    coche:false,
    cena:[

    ]
}
const persona4:Persona={
    name:"Fernando",
    edad:20,
    cena:[
        "patatas"
    ]
}
const persona5:Persona={
    name:"Paco",
    edad:20,
    coche:false,
    cena:[
        "sopa",
        "filetes"
    ],
    amigos:[
        {
            name:"Fernando",
            edad:20,
            cena:[
                "patatas"
            ]
        }
    ]
}
Object.keys(persona1).forEach(keys=>{
    console.log(typeof [1,2,3]);
    
})
//Funcion para imprimir cualquier Objeto
persona1["name"]

const printObject=(a: object)=>{
    Object.keys(a).forEach(keys=>{//recorro cada elemento del objeto
        if(keys in a){
            if(typeof a[keys as keyof typeof a]==='object'){
                //si el elemento es otro objeto lo recorro igual hasta llegar al limite
                console.log(keys+": ");
                
                printObject(a[keys as keyof typeof a])
            }else{
            console.log(keys+": "+a[keys as keyof typeof a]);//imprimo el elemento
            }
            
        }
        
        
    })
}

console.log("--------------FUNCION PARA IMPRIMIR OBJETOS--------------");


printObject(persona5);


var deepEqual=(a:object,b:Object):boolean=>{
    let equal:boolean=false;
    if(a===b){
        equal=true;//true si a y b tienen la misma referncia
    }else if(a!=null&&b!=null){
        if(Object.keys(a).length!=Object.keys(b).length){
            equal= false//si no tienen los mismos elementos no son iguales, asi que devolvemos false
        }else{
            for(var elemento in a) {//recorremos los elementos

                if(b.hasOwnProperty(elemento)){
                    equal=deepEqual(a[elemento as keyof typeof a],b[elemento as keyof typeof b]);
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


 const deepClone=function (a:object):object {
     if(typeof a!=='object'){
        //En caso de que a no sea un objeto se retorna

         return a;
     }
     var objClonado=a.constructor()
     

     for(var elementos in a){
         objClonado[elementos]= deepClone(a[elementos as keyof typeof a])//mediante recursividad iremos clonando cada elemento
     }
     return objClonado;//Una vez terminada la recursividad devolvemos el objeto
}



console.log("--------------FUNCION PARA COMPARAR EN PROFUNDIDAD DOS OBJETOS--------------");

console.log(deepEqual(persona1,persona2)); //false
console.log(deepEqual(persona1,persona4)); //true

console.log("--------------FUNCION PARA CLONAR EN PROFUNDIDAD--------------");

const clone=deepClone(persona5);
printObject(clone);