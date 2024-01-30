const fs=require("fs");
const express = require('express');
const app = express();
const cors=require("cors");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const httpServer = require('http').Server(app);
const {Server} = require("socket.io");

const cookieSession=require("cookie-session");
const args = process.argv.slice(2); 
let test=false; 
test=eval(args[0]); //test=true test=false
const modelo = require("./servidor/modelo.js");
const moduloWS = require("./servidor/servidorWS.js");


let ws = new moduloWS.ServidorWS();
let io = new Server(httpServer,{cors:{ origins: '*:*'}});


const PORT = process.env.PORT || 3001;  //variable de entorno del sistema operativo si esta definida y si no el puerto 3000
const bodyParser=require("body-parser");


const verifyToken = (req, res, next) => {
    const token = req.header('authtoken');
  
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });
  
    try {
      const verifiedGoogle = jwt.verify(token, "211171970949-4do7q74vstpqtemil229th342je1hekr.apps.googleusercontent.com");
      req.user = verifiedGoogle;
      return next(); // Continuamos
  
    } catch (errorGoogle) {
      try {
        const verifiedFacebook = jwt.verify(token, "1317316788957977");
        req.user = verifiedFacebook;
        return next(); // Continuamos
  
      } catch (errorFacebook) {
        return res.status(400).json({ error: 'Token no es válido' });
      }
    }
  };
    
   
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors({
    origin:"http://localhost:3000"
   }));
    
app.use(express.static(__dirname + "/"));
    app.use(cookieSession({
        name: 'Batalla Naval',
        keys: ['key1', 'key2']
    }));

    app.post("/loginUsuario",function(request,response){
        sistema.loginUsuario(request.body,function(user){
        let token=jwt.sign({email:user.email,id:user._id},"211171970949-4do7q74vstpqtemil229th342je1hekr.apps.googleusercontent.com");
        response.header("authtoken",token).json({error:null,data:token,email:user.email});
        })
        })
        
let sistema = new modelo.Sistema(test);




app.get("/obtenerUsuarios",verifyToken,function(request,response){
    let lista  = sistema.obtenerUsuarios();
    response.send(lista);
});

app.get("/usuarioActivo/:email",verifyToken,function(request,response){
    let email = request.params.email;
    let res = sistema.usuarioActivo(email);
    response.send(res);
});
app.get("/numeroUsuarios",verifyToken,function(request,response){
    let res = sistema.numeroUsuarios();
    response.send(res);
});

app.get("/eliminarUsuario/:email",verifyToken,function(request,response){
    let email=request.params.email; 
    let res=sistema.eliminarUsuario(email);
    response.send(res);
});

app.post('/enviarJwt',function(request,response){
    let jswt=request.body.jwt;
    let user=JSON.parse(atob(jswt.split(".")[1]));
    let email=user.email;
    sistema.usuarioOAuth({"email":email},function(obj){
        let token=jwt.sign({email:obj.email,id:obj._id},"211171970949-4do7q74vstpqtemil229th342je1hekr.apps.googleusercontent.com");
        response.header("authtoken",token).json({error:null,data:token,email:obj.email});
    })
    });


    app.post('/enviarJwtFb',async function(request,response){
        let authResponse = request.body.jwt.authResponse;
        if(authResponse.accesToken){
        let accesstoken = authResponse.accessToken;
        // let user=JSON.parse(atob(jswt.split(".")[1]));
        // let email=user.email;
        const url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${accesstoken}`;
        const { data: userInfo } = await axios.get(url);
        let email = userInfo.email;
        sistema.usuarioOAuth({"email":email},function(obj){
            let token=jwt.sign({email:obj.email,id:obj._id},"1317316788957977");
            response.header("authtoken",token).json({error:null,data:token,email:obj.email});
        })
    }
    else 
    console.log("No se ha podido logear con facebook")
        });


   app.get("/confirmarUsuario/:email/:key",function(request,response){
    
    let email=request.params.email;
    let key=request.params.key;
    sistema.confirmarUsuario({"email":email,"key":key},function(usr){
    if (usr.email!=-1){
    response.cookie('email',usr.email);
    }
    // response.redirect('/');
    response.redirect('http://localhost:3000')
    });
    })

    app.post("/registrarUsuario",function(request,response){
        sistema.registrarUsuario(request.body,function(res){
            response.send({"email":res.email});
        });
    });

  
    app.get("/cerrarSesion",verifyToken,function(request,response){
        let email=request.user.email;
        response.redirect("/");
        if (email){
        sistema.eliminarUsuario(email);
        }

        });

httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});

ws.lanzarServidor(io,sistema);

