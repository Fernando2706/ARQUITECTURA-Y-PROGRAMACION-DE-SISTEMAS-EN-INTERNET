//Imprimir, copiar, comparar por valor


interface IObjeto{
    name:string
    edad:number
    cena:string[]
    coche?:boolean
}

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
    genero:'M'
}

var printObject=(a:any)=>{
    Object.keys(a).forEach(elemento=>{
        console.log(elemento +":" +a[elemento]);
        
    })
}

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
     if(a===null||typeof a!=='object'){
         return a;
     }
     var objClonado=a.constructor()
     

     for(var elementos in a){
         objClonado[elementos]= deepClone(a[elementos])
     }
     return objClonado;
}
console.log(typeof(1));




console.log(deepEqual(persona1,persona2)); //false
console.log(deepEqual(persona1,persona4)); //true


const clone=deepClone(persona1);
printObject(clone)











