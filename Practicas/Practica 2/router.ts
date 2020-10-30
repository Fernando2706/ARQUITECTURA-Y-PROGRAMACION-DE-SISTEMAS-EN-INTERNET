
import { Router, helpers  } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { Database } from "https://deno.land/x/mongo@v0.12.1/ts/database.ts";


interface CarSchema{
    id:number,
    seats:number,
    busy?:boolean
    id_cliente?:number,
}
interface PersonSchema{
    id:number,
    people:number,
    id_car:number
}

const router= new Router();
router.get('/status',(ctx)=>{
    try {
        ctx.response.body="OK";//Si todo funciona correctamente
        ctx.response.status=200
    } catch (error) {
        ctx.response.body=error;//En caso de que haya un error este se devuelve 
        ctx.response.status=500
    }
});

router.put('/cars',async (ctx)=>{
    try {
        const db:Database=ctx.state.db;//Recuperamos la base de datos
        const flotaCollection=db.collection<CarSchema>("Flota");//Accedemos a las colecciones que se necesitan para completar la practica
        const clientCollection=db.collection<PersonSchema>("Clientes");

        const a=ctx.request.headers.get("Content-Type");

        if(a==="application/json"){//Nos aseguramos que el Content-Type sea de tipo application/json
            console.log("Es un application/json");

            const body=await ctx.request.body();//Obtenemos el body del request
            const value=await body.value;//>Obtenemos los valores de dicho body
            let allOk:boolean=true;//variable auxiliar que nos ayuda con el funcionamiento del coodigo
            value.forEach((element:CarSchema) => {//Recorremos cada coche, en caso de que un coche tenga un tamaño no admitido se establece la variable anteior a false
                if(element.seats<4||element.seats>6){
                   allOk=false;
                }else{
                    element.busy=false;//Por defecto el coche no estara ocupado
                }
            });
            if(allOk){//Si todos los coches del body tienen un tamaño correcto se procede a enviar los datos de la flota a la base de datos
                Promise.all([
                    flotaCollection.deleteMany({}),
                    clientCollection.deleteMany({})
                ]);//Se eliminan las colecciones anteriores tal y como dictamina el enunciado
                
                
                flotaCollection.insertMany(value);//Se insertan la flota en la base de datos
                ctx.response.status=200;
                
            }else{
                ctx.response.status=400;
                ctx.response.body="Bad request";
            }

        }else{
            throw Error("No se reconoce el contenido del header");
        }
        


        

    } catch (error) {
        ctx.response.body=error;
        ctx.response.status=500;
    }
});

router.post('/journey',async (ctx)=>{
    try {
        const db:Database=ctx.state.db;
        const flotaCollection=db.collection<CarSchema>("Flota");
        const clientCollection=db.collection<PersonSchema>("Clientes");

        const a=ctx.request.headers.get("Content-Type");

        if(a==="application/json"){
            console.log("Es un application/json");

            const body=await ctx.request.body();
            const value=await body.value;
            let allOk:boolean=true;
            let numPeople=0;
            value.forEach((element:PersonSchema) => {//Nos aseguramos que los clientes que pidan un coche no sean mas de 6 personas
                
                if(element.people>6){
                   allOk=false;
                }else{
                    numPeople=element.people;
                }
            });
                
            
            ctx.response.body=value;
            if(allOk){
                if(numPeople<4){//Si la persona que contrata el coche son menos que el numero de plazas minima se les mete en cualquier coche
                    var car=await flotaCollection.findOne({
                        busy:false
                    });//se busca un coche que este libre
                    if(car){
    
                        flotaCollection.updateOne({
                            id:car.id
                        },
                        {$set:{
                            busy:true
                        }});
                        value.forEach((element:PersonSchema) => {
                            element.id_car=car!.id;
                        });
                        
                        
                        
                        clientCollection.insertMany(value!);//Se añade a la coleccion de clientes el cliente con sus datos
    
    
                        ctx.response.status=200;
                        ctx.response.body="Accepted";
                    }else{
                        ctx.response.status=404;
                        ctx.response.body="No hay coches disponibles"; //Si ya no hay coches disponibles
                    }
                }else{
                    var car=await flotaCollection.findOne({
                        busy:false,
                        seats:numPeople
                    });
                    if(car){
    
                        flotaCollection.updateOne({
                            id:car.id
                        },
                        {$set:{
                            busy:true
                        }});
                        value.forEach((element:PersonSchema) => {
                            element.id_car=car!.id;
                        });
                        
                        
                        
                        clientCollection.insertMany(value!);
    
    
                        ctx.response.status=200;
                        ctx.response.body="Accepted";
                    }else{
                        ctx.response.status=404;
                        ctx.response.body="No hay coches disponibles"; 
                    }

                }
            }else{
                ctx.response.status=400;
                ctx.response.body="Bad request";
            }

        }else{
            throw Error("No se reconoce el contenido del header");
        }
        


        

    } catch (error) {
        ctx.response.body=error;
        ctx.response.status=500;
    }
});


router.post('/dropoff/:id',async (ctx)=>{
    try {
        const { id }=helpers.getQuery(ctx,{mergeParams:true});
        const db:Database=ctx.state.db;
        const flotaCollection=db.collection<CarSchema>("Flota");
        const clientCollection=db.collection<PersonSchema>("Clientes");

        const a=ctx.request.headers.get("Content-Type");
        var id_num:number=Number(id);
        var aux= await clientCollection.findOne({
            id:id_num
        });

        if(aux){
            let id_car:number=aux!.id_car;

            clientCollection.deleteOne({//Se borra el cliente que ha solicitado el viaje
                id:id_num
            });
            flotaCollection.updateOne({//Se actualiza el coche a libre de nuevo
                id:id_car
            },
            {
                $set:{
                    busy:false
                }
            }
            );
            ctx.response.body="OK";
            ctx.response.status=200;
        }else{
            ctx.response.body="Not found";
            ctx.response.status=404;
        }
        

        

    } catch (error) {
        ctx.response.body=error;
        ctx.response.status=500;
    }
});
router.post('/locate/:id',async (ctx)=>{
    try {
        const { id }=helpers.getQuery(ctx,{mergeParams:true});
        const db:Database=ctx.state.db;
        const flotaCollection=db.collection<CarSchema>("Flota");
        const clientCollection=db.collection<PersonSchema>("Clientes");

        const a=ctx.request.headers.get("Content-Type");
        var id_num:number=Number(id);
        if(a==="application/json"){
            var aux= await clientCollection.findOne({//Se busca al cliente
                id:id_num
            });
    
            if(aux){
                let id_car:number=aux!.id_car;
    
                
                var car= await flotaCollection.findOne({//Se busca al coche
                    id:id_car
                });
                ctx.response.body=car;//Se muestran los datos del coche
                ctx.response.status=200;
            }else{
                ctx.response.body="Not found";
                ctx.response.status=404;
            }
        }
        

        

    } catch (error) {
        ctx.response.body=error;
        ctx.response.status=500;
    }
});


export {router as default};