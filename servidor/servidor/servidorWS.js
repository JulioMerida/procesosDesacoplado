function ServidorWS(io){
    this.enviarAlRemitente=function(socket,mensaje,datos){
		socket.emit(mensaje,datos);
	};

    this.enviarATodosMenosRemitente=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
        }

    this.enviarGlobal=function(io,mens,datos){
        io.emit(mens,datos);
        }

    this.enviarATodos=function(io,nombre,mens){
        io.sockets.in(nombre).emit(mens);
    }
    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }

    this.lanzarServidor=function(io,sistema){
        io.on("connection",function(socket){
            console.log("Capa WS activa");
            let lista = [];
           

            let srv = new ServidorWS(io);
            srv.enviarATodosMenosRemitente(socket,"listaPartidas",lista);
            socket.on("crearPartida",function(datos){
                let codigo = sistema.crearPartida(datos.email);
                if (codigo.codigo !=-1){
                 socket.join(codigo.codigo);
                }
                srv.enviarAlRemitente(socket,"partidaCreada",{"codigo":codigo});
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodosMenosRemitente(socket,"listaPartidas",lista);
                });
            
            socket.on("unirAPartida",function(datos){
                let codigo = sistema.unirAPartida(datos.email,datos.codigo);
                if(codigo.codigo!=-1){
                    socket.join(codigo.codigo);
                }
                srv.enviarAlRemitente(socket,"unidoAPartida",{"exito": true,"codigo":codigo.codigo});
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(io,codigo.codigo,"partidaIniciada");

                srv.enviarATodosMenosRemitente(socket,"listaPartidas",lista);
              
                
                
            });

            socket.on("terminarPartida",function(datos){
                let codigo = sistema.terminarPartida(datos.codigo);
                if(codigo.codigo!=-1){
                    socket.join(codigo);
                }
                let lista = sistema.obtenerPartidasDisponibles();
                srv.enviarATodos(io,codigo.codigo,"partidaTerminada");

                srv.enviarATodosMenosRemitente(socket,"listaPartidas",lista);

            });

            socket.on("moverPeon",function(data){
                let casilla = data.casilla;
                let estado = data.estadoPartida.estadoPartida;
                let codigo = data.estadoPartida.codigoPartida;
                let listadoMovimientos=sistema.moverPeon(casilla,estado);
                srv.enviarAlRemitente(socket,"movimientosPeon",listadoMovimientos);
                //srv.enviarATodos(io,codigo,"movimientosPeon",listadoMovimientos);

            }
            )
                    
        })
       
    };
 

}

module.exports.ServidorWS = ServidorWS;