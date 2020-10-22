import { Application, Router, helpers } from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import { v4 } from 'https://deno.land/std@0.74.0/uuid/mod.ts';

 
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

routes.get('/users', (ctx) => {
    ctx.response.body = Array.from(usuarios.values());
  });
routes.get('/users/:userID',(ctx)=>{
    const {userID}=helpers.getQuery(ctx,{mergeParams:true});
    ctx.response.body=usuarios.get(userID);
});
routes.get('/message', (ctx) => {
    ctx.response.body = Array.from(mensajes.values());
  });
routes.get('/message/:messageID',(ctx)=>{
    const {messageID}=helpers.getQuery(ctx,{mergeParams:true});
    ctx.response.body=mensajes.get(messageID);
});
routes.post('/messages', async (ctx) => {
    const id = v4.generate();
   
    const { value } = ctx.request.body({ type: 'json' });
    const { text } = await value;
   
    mensajes.set(id, {
      id,
      text,
      userID: '', // TODO
    });
   
    ctx.response.body = mensajes.get(id);
  });
   


app.use(routes.routes());
app.use(routes.allowedMethods());
app.addEventListener('listen', () => {
  console.log(`Listening on localhost:${port}`);
});
 
await app.listen({ port });