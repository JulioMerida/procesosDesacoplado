const nodemailer = require('nodemailer');
const gv = require('./gestorVariables.js');
const url="http://localhost:3001";
//const url="https://procesos-ow4kn6kguq-ew.a.run.app";

let options = {
    user: "",//"juliomeridaortiz@gmail.com",
    pass: "" 
}

// gv.accessCLAVECORREO(function(clave){                   //hacer que esto se haga todo en un unico metodo obtenerOptions
//     options.pass=clave;
//     gv.accessCORREO(function(correo){
//         options.user=correo;
        
//     });
// });

//  gv.obtenerOptions(function(res){
//      options = res;
// });
//al llamar a conectar es cuando se obtienen las variables secretas
module.exports.conectar = function(callback){
    gv.obtenerOptions(function(res){
        options = res;
        callback(res);
    });
}

module.exports.enviarEmail=async function(direccion, key,men) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
    service: "gmail",
    auth: options ,
    tls:{rejectUnauthorized:false}
    });

    //si haces console.log(result)   te da informacion acerca de errores
const result = await transporter.sendMail({
    from: options.user,
    to: direccion,
    subject: men,
    text: 'Pulsa aquí para confirmar cuenta',
    html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'/confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
});
}

