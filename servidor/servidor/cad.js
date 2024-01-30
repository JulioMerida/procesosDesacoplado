var mongo=require("mongodb").MongoClient;
var ObjectId=require("mongodb").ObjectId;
const moment = require('moment');

function CAD(){
    this.usuarios;
    this.logs;
    // this.buscarUsuario=function(obj,callback){
    //     buscar(this.usuarios,{"email":obj.email},callback);
    // }
    this.buscarUsuario=function(obj,callback){
        buscar(this.usuarios,obj,callback);
    }
   

    this.buscarOCrearUsuario=function(usr,callback){
        //buscarOCrear(this.usuarios,{email:email},callback);
        buscarOCrear(this.usuarios,usr,callback);
    }

    function buscar(coleccion,criterio,callback){
        let col=coleccion;
        coleccion.find(criterio).toArray(function(error,usuarios){
            if (usuarios.length==0){
                callback(undefined);             
            }
            else{
                callback(usuarios[0]);
            }
        });
    }

function buscarOCrear(coleccion,criterio,callback)
    {
        coleccion.findOneAndUpdate(criterio, {$set: criterio}, {upsert: true,returnDocument:"after",projection:{email:1}}, function(err,doc) {
           if (err) { throw err; }
           else { 
                console.log("Elemento actualizado"); 
                console.log(doc.value.email);
                callback({email:doc.value.email});
            }
         });  
    }

    this.actualizarUsuario=function(obj,callback){
        actualizar(this.usuarios,obj,callback);
    };



    function actualizar(coleccion,obj,callback){
        coleccion.findOneAndUpdate({_id:ObjectId(obj._id)}, {$set: obj},
        {upsert: false,returnDocument:"after",projection:{email:1}},
        function(err,doc) {
        if (err) { throw err; }
        else {
            console.log("Elemento actualizado");
            //console.log(doc);
            //console.log(doc);
            callback({email:doc.value.email});
            }
            });
            }
            
        




    this.conectar=async function(callback){
        let cad=this;
        let client= new mongo("mongodb+srv://usr:usr@cluster0.szxoluk.mongodb.net/?retryWrites=true&w=majority");
        await client.connect();
        const database=client.db("sistema");
        cad.usuarios=database.collection("usuarios");
        cad.logs=database.collection("logs");
        callback(database);
    }

    this.eliminarUsuario=function(criterio,callback){
        eliminar(this.usuarios,criterio,callback);
    }

  
 
    function eliminar(coleccion,criterio,callback){
         coleccion.deleteOne(criterio,function(err,result){
             if(err) throw err;             
            callback(result);
         });
    }
    this.insertarActividad=function(actividad,callback){
        actividad["fecha-hora"] = moment(actividad["fecha-hora"]).format('YYYY-MM-DD HH:mm:ss');
        insertar(this.logs,actividad,callback);

        };
      

    this.insertarUsuario=function(usuario,callback){
        insertar(this.usuarios,usuario,callback);
        };
    function insertar(coleccion,elemento,callback){
        coleccion.insertOne(elemento,function(err,result){
        if(err){
            console.log("error");
        }
        else{
            console.log("Nuevo elemento creado");
            callback(elemento);
        }
        });
    }

}

module.exports.CAD=CAD;