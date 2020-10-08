const a:number[]=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

const MostrarPorPantalla=(num: number)=>{
    if(num%2==0){
        console.log(num)
    }
};
const MostrarPorPantalla2=(num: number)=>{
    
        console.log(num)
    
};
//for each
const for_each=(a:Array<number>,funcion:Function)=>{
    a.forEach(element => {
        
        funcion(element);
    });
}
/*for_each(a,(num:number)=>{if(num%2===0){
        console.log(num)
    }});*/

    //Map
const map=(arr:Array<number>,f:Function)=>{
    let b:number[]=[];
    for (let i = 0; i < arr.length; i++) {
        b[i]=f(arr[i]);
        
    }
    return b;
}
const Multiply2=(num:number)=>{
    return num*2;
}
/*console.log("Array transformado: ")
for_each(map(a,Multiplyby2),MostrarPorPantalla2);
console.log("Array Original: ")
for_each(a,MostrarPorPantalla2);*/


//Filter

const filter=(arr:Array<number>,f:Function)=>{
    const returnArr:number[]=[];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(f(element,index)) returnArr.push(element);
        
    }
    return returnArr;
}
const NumerosPares=(num:number,index:number)=> {
    return(num%2===0&&index>7);
}
console.log("Array filtrado: ")
for_each(filter(a,NumerosPares),MostrarPorPantalla2);
console.log("Array Original: ")
for_each(a,MostrarPorPantalla2);