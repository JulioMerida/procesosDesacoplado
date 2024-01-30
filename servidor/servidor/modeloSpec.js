const modelo = require("./modelo.js");
describe('El sistema...', function() {
let sistema;
beforeEach(function() {
sistema=new modelo.Sistema(true);
usr = {"nick":"Pepe","email":"pepe@pepe.es"};
});

it('inicialmente no hay usuarios', function() {
  //let esperado = { num : 0 };
  let esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(0);
});

it('agregar usuario',function(){
  let numero = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(0);
  let res = sistema.usuarioActivo(usr.email);
  expect(sistema.usuarioActivo(usr.email).res).toBe(false);
  sistema.agregarUsuario(usr);
  numero = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(1);
  res = sistema.usuarioActivo(usr.email);
  expect(sistema.usuarioActivo(usr.email).res).toBe(true);
});

it('numero usuarios',function(){
  let esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(0);
  sistema.agregarUsuario(usr);
  esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(1);
});

it('usuario activo',function(){
  let res = sistema.usuarioActivo(usr.email);
  expect(sistema.usuarioActivo(usr.email).res).toBe(false);
  sistema.agregarUsuario(usr);
  res = sistema.usuarioActivo(usr.email);
  expect(sistema.usuarioActivo(usr.email).res).toBe(true);
});

it('eliminar usuario',function(){
  let esperado = sistema.numeroUsuarios();
  let res = sistema.usuarioActivo(usr.email);
  expect(sistema.numeroUsuarios().num).toEqual(0);
  expect(sistema.usuarioActivo(usr.email).res).toBe(false);
  sistema.agregarUsuario(usr);
  res = sistema.usuarioActivo(usr.email);
  esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(1);
  expect(sistema.usuarioActivo(usr.email).res).toBe(true);
  sistema.eliminarUsuario(usr.email);
  res = sistema.usuarioActivo(usr.email);
  esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(0);
  expect(sistema.usuarioActivo(usr.email).res).toBe(false);
});

it('obtener usuarios',function(){
  let esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(0);
  sistema.agregarUsuario(usr.email);
  sistema.agregarUsuario({"nick":"Pepe1","email":"pepe2@pepe.es"});
  esperado = sistema.numeroUsuarios();
  expect(sistema.numeroUsuarios().num).toEqual(2);
});



describe("Metodos que acceden a datos",function(){
  
  let usrTest={"email":"test@test.es","password":"test","nick":"test"};

  beforeEach(function(done){
    sistema.cad.conectar(function(){
      //sistema.registrarUsuario(usrTest,function(res){     //este codigo solo se ejecuta una vez para tener el usuario en la bbdd y despues se comenta
          //sistema.confirmarCuenta(usrTest.email,function(){       //en vez de hacer este codigo para que lo confirme, confirmamos el usuario a mano en la base da datos
            done();   //indica que ya nos hemos conectado  
          //})
      //});
     // done();     
    })
  });
  afterEach(function(){
    //cerrar la conexion
  })

  it("Inicio de sesion correcto",function(done){
    sistema.loginUsuario(usrTest,function(res){
      expect(res.email).toEqual(usrTest.email);
      expect(res.email).not.toEqual(-1);
      done();
    });
  });

  it("Inicio de sesion incorrecto",function(done){
    let usr1= {"email":"test@test.es","password":"test23","nick":"test"}
    sistema.loginUsuario(usr1,function(res){
      expect(res.email).toEqual(-1);
      done();
    });

  });


})

describe("Pruebas de las partidas",function(){
  let usr2;
  let usr3;
  beforeEach(function(){
    usr2={"nick":"Pepa","email":"pepa@pepa.es"};
    usr3={"nick":"Pepo","email":"pepo@pepo.es"};
    sistema.agregarUsuario(usr);
    sistema.agregarUsuario(usr2);
    sistema.agregarUsuario(usr3);
  });
    it("Usuarios y partidas en el sistema",function(){
    expect(sistema.numeroUsuarios().num).toEqual(3);
    expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
  });

  it("Crear partida",function(){
    expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
    let res = sistema.crearPartida(usr.email);
    expect(res).not.toBe(-1);
    expect(sistema.obtenerPartidasDisponibles().length).toEqual(1);


  });

  it("Unir a partida",function(){
    let res = sistema.crearPartida(usr.email);
    let numjugadores = sistema.partidas[res.codigo].jugadores.length;
    expect(numjugadores).toEqual(1);
    let res2 = sistema.unirAPartida(usr2.email,res.codigo);
    numjugadores = sistema.partidas[res.codigo].jugadores.length;
    expect(numjugadores).toEqual(2);
    expect(res2.codigo).not.toEqual(-1);
  });

  it("Terminar partida",function(){
    expect(sistema.numeroPartidas().num).toEqual(0);
    let res = sistema.crearPartida(usr.email);
    expect(sistema.numeroPartidas().num).toEqual(1);
    let res2 = sistema.terminarPartida(res.codigo);
    expect(res2).not.toBe(-1);
    expect(sistema.numeroPartidas().num).toEqual(0);
  });


  it("Un usuario no puede estar dos veces",function(){
    let res = sistema.crearPartida(usr.email);
    let numjugadores = sistema.partidas[res.codigo].jugadores.length;
    expect(numjugadores).toEqual(1);
    let res2 = sistema.unirAPartida(usr.email,res.codigo);
    numjugadores = sistema.partidas[res.codigo].jugadores.length;
    expect(numjugadores).toEqual(1);
    expect(res2.codigo).toEqual(-1);
  });

  it("Obtener partidas",function(){
    expect(sistema.numeroPartidas().num).toEqual(0);
    let res = sistema.crearPartida(usr.email);
    expect(sistema.numeroPartidas().num).toEqual(1);
    let res2 = sistema.crearPartida(usr.email);
    expect(sistema.numeroPartidas().num).toEqual(2);
  })
  });




  
describe("Pruebas de los movimientos",function(){
 
  beforeEach(function(){
  });
    it("Movimiento del peon en posicion incial",function(){
    let casilla = {"fil":6,"col":0};
    let estadoInicial = {"peonBlanco":{"casilla":{"fil":6,"col":0},"tipo":"peonBlanco","codigoPartida":"asdasd"}}
    let resultadoEsperado = {"4/0":{"fil":4,"col":0},"5/0":{"fil":5,"col":0}};
    expect(sistema.moverPeon(casilla,estadoInicial)).toEqual(resultadoEsperado);
  });



  });

  

  



})
