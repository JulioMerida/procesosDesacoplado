function ClienteWS(){
    this.socket=undefined;
    this.email;
    this.codigo;
    this.ini=function(){
     //this.socket=io.connect();
     this.socket=io.connect("http://localhost:3001");
    }

    this.ini();

    
    this.conectar=function(){
        this.socket=io.connect("http://localhost:3001");
        this.lanzarServidorWS();
    }

    this.lanzarServidorWS=function(){
        let cli = this;
        this.socket.on('connect', function(){   						
            console.log("Usuario conectado al servidor de WebSockets");
    });

    this.socket.on("partidaCreada",function(datos){
        console.log(datos.codigo);
        ws.codigo=datos.codigo.codigo;
        cw.mostrarMsg("Creada partida con codigo: "+datos.codigo.codigo+", esperando rival...");
        
    });


    this.socket.on("unidoAPartida",function(datos){
        console.log(datos.codigo);
        ws.codigo=datos.codigo.codigo;
    });

    this.socket.on("partidaTerminada",function(){
        ws.codigo=undefined;
        cw.mostrarMsg("partida terminada");
        console.log("termino partida")
        cw.terminarPartida();
        
    });
    
    this.socket.on("listaPartidas",function(lista){
        if(lista.length!=0){
        console.log(lista);
        }
        cw.mostrarListaPartidas(lista);
    });

    this.socket.on("partidaIniciada",function(){
        cw.mostrarTablero();
    });
    this.socket.on("movimientosPeon",function(listadoMovimientos){
        console.log(listadoMovimientos);
        cw.pintarCasillas(listadoMovimientos);
    })

    // this.crearPartida=function(){
    //     this.socket.emit("crearPartida",{"email":this.email});
    // }
    this.crearPartida = function(email, callback) {
        this.socket.emit("crearPartida", {"email": email});
        this.socket.on("partidaCreada", function(datos) {
            console.log(datos.codigo);
            ws.codigo = datos.codigo;
            cw.mostrarMsg("Creada partida con codigo: " + datos.codigo.codigo + ", esperando rival...");
    
            if (callback) {
                callback(datos.codigo.codigo);
            }
        });
    }
    this.unirAPartida=function(email,codigo,callback){
        this.socket.emit("unirAPartida",{"email":email,"codigo":codigo});

        this.socket.on("unidoAPartida", function(datos) {
    
            if (callback) {
                callback(datos.exito);
            }
        });
    }
    this.terminarPartida = function(codigo){
        this.socket.emit("terminarPartida",{"codigo":codigo});
    }
    this.moverPeon = function(casilla,estadoPartida){
        //NO MUEVE EL PEON, CALCULA LOS MOVIMIENTOS POSIBLES DEL PEON
        this.socket.emit("moverPeon",{"casilla":casilla,"estadoPartida":estadoPartida});
    }

    

    }


}

