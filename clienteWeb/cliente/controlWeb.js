function ControlWeb(){
    this.eliminarBtnOAuth=function(){
        $("#g_id_signin").remove();
        $("#f_id_signin").remove();
        }
    
   
    this.limpiar = function(){
        $("#mAU").remove();
        $("#fmLogIn").remove();
        $("#fmRegistro").remove();
        $("#mbtnCrear").remove();
    }
  
    this.mostrarMsg=function(msg){
        $('#mMsg').remove();
        let cadena = '<h3 id="mMsg">'+msg+'</h3>';
        $('#msg').append(cadena);
    }

    this.mostrarCrearPartida = function(){
        console.log("ANTES DE CREAR EL BOTON");
        $("#mbtnCrear").remove();   
        let cadena = '<button type="submit"id="mbtnCrear" class="btn btn-primary">Crear Partida</button>';
        $('#btnCrear').append(cadena);
        console.log("DESPUES DE CREAR EL BOTON");

        $("#btnCrear").on("click",function(){
            let email=$.cookie("email");
            ws.crearPartida(email,function(codigo){
                $.cookie("codigoPartida", codigo);
            });
            $("#mbtnCrear").remove();
            cw.mostrarTerminarPartida();
        });
    }
    this.mostrarTerminarPartida = function(){
        $("#mbtnTerminar").remove();
        let cadena = '<button type="submit"id="mbtnTerminar" class="btn btn-primary">Terminar Partida</button>';
        $('#btnTerminar').append(cadena);
        $("#btnTerminar").on("click",function(){
            let codigoPartida=$.cookie("codigoPartida");
            ws.terminarPartida(codigoPartida);
        });
    }
    this.moverPieza = function(fil, col){
       casilla = fil + "/" + col
       let mover =  document.getElementById(casilla);
       let seleccionada = document.getElementsByClassName('seleccionada');
        
    }
    this.pintarCasillas = function(movimientosPosibles){
        $('.pintadas').removeClass('pintadas');
        for (let fil = 0; fil < 8; fil++) {
            for (let col = 0; col < 8; col++) {
                for(movimiento in movimientosPosibles){
                    let casilla = document.getElementById(fil+"/"+col);
                    if(movimiento == casilla.id ){
                        casilla.classList.add('pintadas');
                        let boton = document.createElement("button");
                        boton.setAttribute('onClick',`cw.moverPieza(${fil},${col})`);
                        casilla.appendChild(boton);
                    }
                }
            }
        }
    }
    this.terminarPartida=function(){
        console.log("terminando partida");
        $.removeCookie("codigoPartida");
        $("#tablero").remove();
        $("#mbtnTerminar").remove();
        cw.mostrarCrearPartida();
    }
    this.mostrarTablero = function(){
        $("#tablero").load("./cliente/tablero.html",function(){
            console.log("tablero creado");
            inicializarTablero();
            $("#mbtnCrear").remove();
            $('#mMsg').remove();
            $("#tablaPartidas").remove();
            cw.mostrarTerminarPartida();
        })
    }
    this.mostrarListaPartidas = function(lista){
        $("#tablaPartidas").remove();
      
        if(lista.length!=0 && !ws.codigo && $.cookie("email")){
        $("#listaPartidas").load("./cliente/tablaPartidas.html",function(){
            if ($.cookie("codigoPartida")) {
                cw.mostrarMsg("Creada partida con código: " + $.cookie("codigoPartida") + ", esperando rival...");
            }
            else{
            lista.forEach(function(partida) {
                let fila = '<tr> <td>'+partida.codigo+'</td> <td>'+partida.creador.email+'</td> <td><button class="btnUnirse" data-codigo="'+partida.codigo+'">Unirse a Partida</button></td></tr>';
                $("#tablaPartidasBody").append(fila);
                console.log(partida)
            });
            $(".btnUnirse").on("click",function(){    //ES .btnUnirse PORQUE ES UN CLASE, NO UN ID. NO PUEDO USAR ID PORQUE ENTONCES TODOS LOS BOTONES TENDRIAN EL MISMO ID
                let codigoPartida = $(this).data("codigo");
                ws.unirAPartida($.cookie("email"),codigoPartida,function(exito){            //añado el callback para comprobar si se ha podido unir a la
                    if(exito){
                        $.cookie("codigoPartida", codigoPartida);
                    }
                });
                
            });
        
             }
        });
        }
        
    }

    this.comprobarSesion=function(){
        //let email=localStorage.getItem("email");
        let email = $.cookie("email");
        if (email){
            cw.mostrarMsg("Bienvenido al sistema, "+email);
            ws.email=email;
            cw.eliminarBtnOAuth();
            if ($.cookie("codigoPartida")) {
                cw.mostrarMsg("Creada partida con código: " + $.cookie("codigoPartida") + ", esperando rival...");
                cw.mostrarTerminarPartida();
            }
            else{
                cw.mostrarCrearPartida();

            }
        }
        else{
            //cw.mostrarAgregarUsuario();
            cw.mostrarLogin();
            cw.init();
        }
        }
        this.salir=function(){
            //localStorage.removeItem("email");
            $.removeCookie("email");
            $.removeCookie("token");
            $.removeCookie("codigoPartida");

            location.reload();
            rest.cerrarSesion();
            }
        // this.salir=function(){
        //     //let nick = localStorage.getItem("nick");
        //     let nick = $.cookie("nick");
        //     //localStorage.removeItem("nick");
        //     $.removeCookie("nick");
            

        //     location.reload();
        //     cw.mostrarMsg("Cerrando sesión de "+nick);
        //     }
            this.init=function(){
                let cw=this;
                google.accounts.id.initialize({
                     client_id:"211171970949-tku16b0acn451u5tje2713q7biui167u.apps.googleusercontent.com", //desarrollo
                   //client_id:"211171970949-9f14k8uhnh2ritrgpd4p7b533rls36mp.apps.googleusercontent.com",//produccion
                    auto_select:false,
                    callback:cw.handleCredentialsResponse
                });
                google.accounts.id.prompt();
            }

            this.handleCredentialsResponse=function(response){
            let jwt=response.credential;
            //let user=JSON.parse(atob(jwt.split(".")[1]));
            //console.log(user.name);
            //console.log(user.email);
            //console.log(user.picture);
  
            rest.enviarJwt(jwt);
   
            }


           
            
            this.mostrarModal=function(m){
                $("#msg").remove();
                let cadena="<div id='msg'>"+m+"</div>";
                $('#mBody').append(cadena)
                $('#miModal').modal();
                // $('#btnModal').on('click',function(){
                // })
                }
               

            this.mostrarRegistro=function(){
                if ($.cookie('email')){
                    return true;
                };
                $("#fmRegistro").remove();
                $("#registro").load("./cliente/registro.html",function(){
                    $("#btnRegistro").on("click",function(){
                        let email=$("#email").val();
                        let pwd=$("#pwd").val();
                        if (email && pwd){
                            rest.registrarUsuario(email,pwd);
                            console.log(email+" "+pwd);
                        }
                    });
                });
            }
            this.mostrarLogin=function(){
                if ($.cookie('email')){
                    return true;
                };
                $("#fmLogin").remove();
                $("#registro").load("./cliente/login.html",function(){
                    $("#btnLogin").on("click",function(e){
                        e.preventDefault();
                        let email=$("#email").val();
                        let pwd=$("#pwd").val();
                        if (email && pwd){
                            rest.loginUsuario(email,pwd);
                            console.log(email+" "+pwd);
                            cw.eliminarBtnOAuth();
                        }
                    });
                });
            }
        


            
           

            

                   
           

}