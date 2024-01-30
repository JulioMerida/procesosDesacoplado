const datos = require("./cad.js");
const correo=require("./email.js");
const bcrypt = require("bcrypt")
function Sistema(test){
    this.usuarios={};  //this.usuarios=[]   esto seria un array normal basado en indices pero al usar {} es como un diccionario
    this.partidas={};
    this.test=test;
    
   this.cad = new datos.CAD();
    this.agregarUsuario=function(usr){
        let res={"email":-1};
        let email = usr.email;//
        if (!this.usuarios[email]){
        this.usuarios[email]=new Usuario(usr);//
        res.email=email;
        console.log("Nuevo usuario en el sistema:"+email);
        }
        else{
        console.log("el email "+email+" está en uso"); 
        }
        return res;
        }
        

    this.obtenerUsuarios=function(){
        return this.usuarios;
        }

    this.obtenerPartidas=function(){
        return this.partidas;
    }

    this.usuarioOAuth=function(usr,callback){
        let modelo = this;
        this.cad.buscarOCrearUsuario(usr,function(res){
            console.log("El usuario "+res.email+" está registrado en el sistema");
            callback(res);
            modelo.agregarUsuario(usr);
        });
        let actividad = {
            "tipo-operacion":"registro OAuth",
            "usuario":usr,
            "fecha-hora":new Date()
        }
        modelo.cad.insertarActividad(actividad,function(){
            console.log("actividad OAuth insertada en la base de datos");
        });
        

    }
    

    this.obtenerOCrearUsuario = function(email){
        this.cad.buscarOCrearUsuario(email,function(res){
            console.log("El usuario "+res.email+" está registrado");
        });
    }

  
    this.crearPartida = function(email){
        let res = {"codigo":-1}
        let modelo = this;
        //this.usuarios[email]
        if (this.usuarios[email]) {
            let usr = this.usuarios[email];
            const codigo = this.obtenerCodigo();
            const partida = new Partida(codigo);
            partida.jugadores.push(usr);
            this.partidas[codigo]=partida;
            res = {"codigo":codigo};
            let actividad = {
                "tipo-operacion":"Crear Partida",
                "usuario":usr,
                "codigo":codigo,
                "fecha-hora":new Date()
            }
            if(!modelo.test){
            this.cad.insertarActividad(actividad,function(){
                console.log("log de crear partida insertado en la base de datos");
            });
            }
        }
        else
        {
            console.log("No se puede crear partida");
            console.log(this.usuarios);
        }
        return res;
    }
    this.obtenerCodigo = function(){
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let codigo="";
        for(let i=0;i<8;i++){
            codigo+= caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
        
    }
    this.terminarPartida=function(codigo){
        let res = {"codigo":-1};
        let modelo = this;
        if (codigo in this.partidas){
            delete this.partidas[codigo];
            console.log("Partida "+codigo+" borrada");
            res = {"codigo":codigo};
            let actividad = {
                "tipo-operacion":"Terminar partida",
                "codigo":codigo,
                "fecha-hora":new Date()
            }
            if(!modelo.test){
            this.cad.insertarActividad(actividad,function(){
                console.log("log de terminar partida insertado en la base de datos");
            });
            }
        }
        else{
            console.log("No existe la partida "+codigo);
        }
        return res;

    }
    this.unirAPartida=function(email,codigo){
        let res={"codigo":-1};
        let modelo = this;
        let usr = this.usuarios[email];
        let partida = this.partidas[codigo];
        if(partida && usr && partida.jugadores.length==1 && !partida.jugadores.includes(usr)){  //compruebo que existan partida y jugador, que solo hubiese un jugador y que el creador no pueda unirse
                partida.jugadores.push(usr);
                res={"codigo":partida.codigo};
                let actividad = {
                    "tipo-operacion":"Unir a Partida",
                    "usuario":usr,
                    "codigo":partida.codigo,
                    "fecha-hora":new Date()
                }
                if(!modelo.test){
                this.cad.insertarActividad(actividad,function(){
                    console.log("log de unir a partida insertado en la base de datos");
                });
             }
                
        }
        else
            console.log("No ha podido unirse a la partida");
        return res
        }
        
        this.obtenerPartidasDisponibles=function(){
            let lista=[];
            let creador;
            let codigo;
           
            for(var e in this.partidas){
  
            if(this.partidas[e].jugadores.length==1){              //solo hay un jugador asi que esta disponible
                creador = this.partidas[e].jugadores[0];
                codigo = this.partidas[e].codigo;
                let obj={"creador":creador,"codigo":codigo}
                lista.push(obj);
            }
            }
            return lista;
            };

            this.numeroPartidas=function(){
                //let numero_usuarios = Object.keys(this.usuarios).length;
                let res = {"num":Object.keys(this.partidas).length};
                return res;
              }

    this.usuarioActivo=function(email){
        let res = {"res":false};
        if (this.usuarios[email]){
            res = {"res":true}
        }
        return res;
    }

    this.eliminarUsuario=function(email){
        let res = {"res:":-1};
        let modelo = this;
        if (this.usuarios[email]){
            let usr = this.usuarios[email]
            delete this.usuarios[email];
            console.log("Usuario "+email+" borrado");
            res = {"res":email};
            let actividad = {
                "tipo-operacion":"Cerrar sesion",
                "usuario":usr,
                "fecha-hora":new Date()
            }
            if(!modelo.test){
            this.cad.insertarActividad(actividad,function(){
                console.log("log de cerrar sesion insertado en la base de datos");
            });
            }
        }
        else{
            console.log("No existe el usuario "+email);
        }
        return res;
    }

   
    this.confirmarUsuario=function(obj,callback){
        let modelo=this;
        this.cad.buscarUsuario({"email":obj.email,"confirmada":false,"key":obj.key},function(usr){
        if (usr){
        usr.confirmada=true;
        modelo.cad.actualizarUsuario(usr,function(res){
        callback({"email":res.email}); //callback(res)
        })
        let actividad ={
            "tipo-operacion":"registro local",
            "usuario":obj,
            "fecha-hora":new Date()
        }
        modelo.cad.insertarActividad(actividad,function(){
            console.log("log de registro local almacenado en la base de datos");
        })
        }
        else
        {
        callback({"email":-1});
        }
        })
        }
        
        this.loginUsuario=function(obj,callback){
            let modelo = this;
            this.cad.buscarUsuario({"email":obj.email,"confirmada":true},function(usr){
                if(usr)
                {
                    bcrypt.compare(obj.password, usr.password, function(err, result) {
                        if (result) {
                            callback(usr);
                            modelo.agregarUsuario(usr);
                            let actividad ={
                                "tipo-operacion":"login local",
                                "usuario":usr,
                                "fecha-hora":new Date()
                            }
                            modelo.cad.insertarActividad(actividad,function(){
                                console.log("log de login local almacenado en la base de datos");
                            });

                        }
                        else{
                            callback({"email":-1});
                        }
                    });
                   
                }
                else
                {
                    callback({"email":-1});
                }
            });
        }

         
          
            this.registrarUsuario=function(obj,callback){
                let modelo=this;
                this.cad.buscarUsuario(obj,function(usr){
                if (!usr){
                //el usuario no existe, luego lo puedo registrar
                    obj.key=Date.now().toString();
                    obj.confirmada=false;
                 
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(obj.password, salt, function(err, hash) {
                            // Store hash in the database
                            obj.password = hash;
                            console.log("contraseña"+obj.password);
                            modelo.cad.insertarUsuario(obj,function(res){
                                if(!modelo.test){
                                correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta");}
                                callback(res);
                                 });
                        });
                    })
                   
                  

                   
                }
                else
                {
                    callback({"email":-1});
                }
            });
            }
          
            this.comprobarColorPieza=function(tipo){
                let color = tipo.slice(-5);      //me quedo con los 5 ultimos caracteres(blanca o negra)
                if(color=="Negro"|| color=="Negra"){
                    return "negro"
                }
                else   
                    return "blanco"
            }
            this.comprobarPieza= function(casilla,estadoPartida){
                //casilla es donde quiero comprobar si hay algo
                Object.entries(estadoPartida).forEach((pieza) =>{
                    pieza = pieza[1];
                    if(pieza.casilla.fil == casilla.fil && pieza.casilla.col == casilla.col){
                        return true;
                    }
                })
                return false;
            }
        
            this.moverPeon = function(casilla,estadoPartida){
            
                let movimientosPosibles={};
                
                Object.entries(estadoPartida).forEach((pieza) =>{
                    pieza = pieza[1];
                if((pieza.casilla.fil == casilla.fil) && (pieza.casilla.col == casilla.col)){
                        if(pieza.tipo == "peonBlanco"){
                            if(casilla.fil==6){
                                if((this.comprobarPieza({"fil":casilla.fil-2,"col":casilla.col},estadoPartida)==false && this.comprobarPieza({"fil":casilla.fil-1,"col":casilla.col},estadoPartida)==false)){
                                    movimientosPosibles[casilla.fil-2+"/"+casilla.col]={"fil":casilla.fil-2,"col":casilla.col};
                                }
                            }
                            if(!this.comprobarPieza({"fil":casilla.fil-1,"col":casilla.col},estadoPartida)){
                                movimientosPosibles[casilla.fil-1+"/"+casilla.col]={"fil":casilla.fil-1,"col":casilla.col};
                            }
                            if(casilla.col!=0){
                            if(this.comprobarPieza({"fil":casilla.fil-1,"col":casilla.col-1},estadoPartida)){
                                //si hay pieza, me la puedo comer(en diagonal)
                                movimientosPosibles[casilla.fil-1+"/"+casilla.col-1]={"fil":casilla.fil-1,"col":casilla.col-1};
                            }
                            }
                            if(casilla.col!=7){
                            if(this.comprobarPieza({"fil":casilla.fil-1,"col":casilla.col+1},estadoPartida)){
                                //si hay pieza, me la puedo comer(en diagonal)
                                movimientosPosibles[casilla.fil-1+"/"+casilla.col+1]={"fil":casilla.fil-1,"col":casilla.col+1};
                            }
                            }
                        }
                        else{
                            if(casilla.fil==1){
                                if((this.comprobarPieza({"fil":casilla.fil+2,"col":casilla.col},estadoPartida)==false && this.comprobarPieza({"fil":casilla.fil+1,"col":casilla.col},estadoPartida)==false)){
                                    movimientosPosibles[casilla.fil+2+"/"+casilla.col]={"fil":casilla.fil+2,"col":casilla.col};
                                }
                            }
                            if(!this.comprobarPieza({"fil":casilla.fil+1,"col":casilla.col},estadoPartida)){
                                movimientosPosibles[casilla.fil+1+"/"+casilla.col]={"fil":casilla.fil+1,"col":casilla.col};
                            }
                            if(casilla.col!=0){
                            if(this.comprobarPieza({"fil":casilla.fil+1,"col":casilla.col-1},estadoPartida)){
                                //si hay pieza, me la puedo comer(en diagonal)
                                movimientosPosibles[casilla.fil+1+"/"+casilla.col-1]={"fil":casilla.fil+1,"col":casilla.col-1};
                            }
                            }
                            if(casilla.col!=7){
                            if(this.comprobarPieza({"fil":casilla.fil+1,"col":casilla.col+1},estadoPartida)){
                                //si hay pieza, me la puedo comer(en diagonal)
                                movimientosPosibles[casilla.fil+1+"/"+casilla.col+1]={"fil":casilla.fi+-1,"col":casilla.col+1};
                            }
                            }
        
        
                        }
                } 
            });
            return movimientosPosibles;
            }



    this.numeroUsuarios=function(){
        //let numero_usuarios = Object.keys(this.usuarios).length;
        let res = {"num":Object.keys(this.usuarios).length};
        return res;
      }
    if (!this.test){
      this.cad.conectar(function(){         //no se define una funcion si no que se llama
        console.log("Conectado a Mongo Atlas");
      });
    
    correo.conectar(function(){
        console.log("Variables secretas obtenidas");
    });
    }
}
   function Usuario(usr){
    this.nick=usr.nick;
    this.email=usr.email;
    this.clave;
    this.apellidos;
    this.nombre=usr.nombre;
    this.telefono;
    
   }

   function Partida(codigo){
    this.codigo = codigo;
    this.jugadores = [];
    this.maxJug = 2;

   

    }

   module.exports.Sistema=Sistema

  