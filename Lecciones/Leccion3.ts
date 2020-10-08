const c = [[1, 2], [3, 4], [1, 5, 7]];
const d = c
const e = c.slice(0);


const h = [1, 2, 3,4,5,6,7,8,9,10]
const g = [...h]
//console.log(g);


//Declarar varias variables a partir de un array desestructurado 
//para eso se le ponen 3 puntos delante del array => ...h= 1  2 3
const [f, ...m] = [...h];
//console.log(f);
const max = (...numbers: number[]) => {
  let num = 0;
  for (let i of numbers) {
    if (i > num) num=i;
  }
  return num;
}
var j = max(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);





const i:number[]=h;

//h.map((value:number)=>2*value).filter(value=>value>10).forEach(value=>console.log(value))



const persona={
    name:"Alberto",
    edad:24,
    genero:'M',
    amigos:[
      {
        name:"Fernando",
        edad:20,
        genero:'M'
      },
      {
        name:"Jorge",
        edad:25,
        genero:'M'
      },
      {
        name:"Marian",
        edad:21,
        genero:'F'
      },
      {
        name:"Alicia",
        edad:20,
        genero:'F'
      },
      
    ],
    print:()=>{
        console.log("Su nombre es:"+persona.name)
        console.log("Su edad es:"+persona.edad)
        console.log("Su genero es:"+persona.genero)
        console.log("Sus amigos son:")
        persona.amigos.forEach(value=>{
          console.log(value.name)
        })
    }
}
persona.print();
console.log(" ")
persona.amigos.push({
  name:"Paco",
  edad:40,
  genero:'M'
})
persona.print()