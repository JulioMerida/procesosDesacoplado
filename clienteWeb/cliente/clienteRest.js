function ClienteRest(){
this.url="http://localhost:3001";

this.obtenerUsuarios = function () {
    const token = $.cookie("token");
    $.ajax({
        type: 'GET',
        url: this.url + "/obtenerUsuarios",
        headers: {
            'authtoken': token
        },
        success: function (data) {
            console.log(data);
        }
    });
}
this.numeroUsuarios = function () {
    const token = $.cookie("token");
    $.ajax({
        type: 'GET',
        url: this.url + "/numeroUsuarios",
        headers: {
            'authtoken': token
        },
        success: function (data) {
            console.log('Numero de usuarios en el sistema es: ' + data.num);
        }
    });
}

this.usuarioActivo = function (email) {
    const token = $.cookie("token");
    $.ajax({
        type: 'GET',
        url: this.url + "/usuarioActivo/" + email,
        headers: {
            'authtoken': token
        },
        success: function (data) {
            if (data.res) {
                console.log("El usuario " + email + " está activo")
            } else {
                console.log("El usuario " + email + " no está activo")
            }
        }
    });
}
this.eliminarUsuario = function (email) {
    const token = $.cookie("token");
    $.ajax({
        type: 'GET',
        url: this.url + "/eliminarUsuario/" + email,
        headers: {
            'authtoken': token
        },
        success: function (data) {
            if (data.res == email) {
                console.log("El usuario " + email + " ha sido eliminado")
            } else {
                console.log("El usuario " + email + " no se ha podido eliminar")
            }
        }
    });
}

    this.enviarJwt=function(jwt){
        const token = $.cookie("token"); 
        $.ajax({
        type:'POST',
        url:this.url+'/enviarJwt',
        headers: {
            'authtoken': token 
        },
        data: JSON.stringify({"jwt":jwt}),
        success:function(data){
        let msg="El email "+email+" está ocupado";
        if (data.email!=-1){
            console.log("Usuario "+data.email+" ha sido registrado");
            msg="Bienvenido al sistema, "+data.email;
            $.cookie("email",data.email);
            $.cookie("token",data.data);
                cw.eliminarBtnOAuth();

            cw.mostrarCrearPartida();
        }
        else{
            console.log("El email ya está ocupado");
        }
        cw.limpiar();
        cw.mostrarMsg(msg);
        },
        error:function(xhr, textStatus, errorThrown){
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
        },
        contentType:'application/json'
        //dataType:'json'
        });
    }



    this.enviarJwtFb=function(jwt){
        const token = $.cookie("token"); 
        $.ajax({
        type:'POST',
        url:this.url+'/enviarJwtFb',
        headers: {
            'authtoken': token 
        },
        data: JSON.stringify({"jwt":jwt}),
        success:function(data){
        let msg="El email "+email+" está ocupado";
        if (data.email!=-1){
            console.log("Usuario "+data.email+" ha sido registrado");
            msg="Bienvenido al sistema, "+data.email;
            $.cookie("email",data.email);
            $.cookie("token",data.data);
            cw.mostrarCrearPartida();


        }
        else{
            console.log("El email ya está ocupado");
        }
        cw.limpiar();
        cw.mostrarMsg(msg);
        },
        error:function(xhr, textStatus, errorThrown){
        //console.log(JSON.parse(xhr.responseText));
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
        },
        contentType:'application/json'
        //dataType:'json'
        });
    }

    this.registrarUsuario=function(email,password){
        const token = $.cookie("token");

        $.ajax({
            type:'POST',
            url:this.url+'/registrarUsuario',
            headers: {
                'authtoken': token
            },
            data: JSON.stringify({"email":email,"password":password}),
            success:function(data){
                if (data.email!=-1){				
                    console.log("Usuario "+data.email+" ha sido registrado");
                    // mostrar un mensaje diciendo: consulta tu email
                    //$.cookie("email",data.email);
                    cw.limpiar();
                    //cw.mostrarMensaje("Bienvenido al sistema, "+data.email);
                    cw.mostrarLogin();
                  
                }
                else{
                    console.log("El email está ocupado");
                    cw.mostrarMsg("El email está ocupado");
                    cw.mostrarModal("No se ha podido registrar el usuario");
                }
                },
                error:function(xhr, textStatus, errorThrown){
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
                },
            contentType:'application/json'
        });
    }

    this.loginUsuario=function(email,password){
        $.ajax({
            type:'POST',
            url:this.url+'/loginUsuario',
            data: JSON.stringify({"email":email,"password":password}),
            success:function(data){
                if (data.email!=-1){	
                    cw.limpiar();			
                    console.log("Usuario "+data.email+" ha logeado");

    
                    cw.mostrarMsg("Bienvenido al sistema, "+data.email);
                    $.cookie("email", data.email);
                    $.cookie("token",data.data);
                    cw.mostrarCrearPartida();
                    
                    ws.email=data.email;
                  

                  
                  
                }
                else{
                    console.log("No se ha podido logear");
                    cw.mostrarMsg("Usuario o contraseña incorrectas");
                }
                },
                error:function(xhr, textStatus, errorThrown){
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
                },
            contentType:'application/json'
        });
    }
    // this.cerrarSesion=function(){
    //     $.getJSON(this.url+"/cerrarSesion",function(){
    //     console.log("Sesión cerrada");
    //     $.removeCookie("email");
    //     });
    //     }
    this.cerrarSesion = function () {
        const token = $.cookie("token"); 
    
        $.ajax({
            type: 'GET',
            url: this.url + "/cerrarSesion",
            headers: {
                'authtoken': token 
            },
            success: function () {
                console.log("Sesión cerrada");
                $.removeCookie("email");
                $.removeCookie("token");
                ws.terminarPartida($.cookie("codigoPartida"));
                $.removeCookie("codigoPartida");
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Error al cerrar sesión: " + textStatus);
            }
        });
    };
     
}

function onSignIn(response) {
    let jwt=response.credential;
    rest.enviarJwt(jwt);
    cw.eliminarBtnOAuth();
    }


    // function checkLoginState() {
    //     FB.getLoginStatus(function(response) {
    //       this.onSignInFb(response)
    //       statusChangeCallback(response);
    //     });
    //   }
    function onSignInFb(response) {
        FB.getLoginStatus(function(response){
            let jwt=response;
            rest.enviarJwtFb(jwt);
            cw.eliminarBtnOAuth();

        })      
        }
    