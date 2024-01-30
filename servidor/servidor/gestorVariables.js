const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

async function accessCLAVECORREO(callback) {
    const name = 'projects/211171970949/secrets/CLAVECORREO/versions/1';
      const [version] = await client.accessSecretVersion({
        name: name,
      });
      //console.info(`Found secret ${version.name} with state ${version.state}`);
      const datos=version.payload.data.toString("utf8");
      //console.log("Datos "+datos);
      //callback(datos)
      return datos;
}

async function accessCORREO(callback) {
    const name = 'projects/211171970949/secrets/CORREO/versions/1';
      const [version] = await client.accessSecretVersion({
        name: name,
      });
      //console.info(`Found secret ${version.name} with state ${version.state}`);
      const datos=version.payload.data.toString("utf8");
      //console.log("Datos "+datos);
      //callback(datos)
      return datos;
}

module.exports.obtenerOptions = async function(callback) {
  const options = {
    user: "",
    pass: ""
  };

  let pass = await accessCLAVECORREO();
  let user = await accessCORREO();
  options.user = user;
  options.pass = pass;
  callback(options);

};



