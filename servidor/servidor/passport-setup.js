const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});
passport.use(new GoogleStrategy({
  // clientID:"211171970949-djii8in9aka5bpdtm0qrgmfpag0icdi3.apps.googleusercontent.com",    //produccion
  // clientSecret :"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",
  // callbackURL:"https://procesos-ow4kn6kguq-ew.a.run.app/google/callback",
 clientID: "211171970949-lsrpr2epe9d02odkj1kcsqg8gecsjbdb.apps.googleusercontent.com", //desarrollo
 clientSecret: "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",
 callbackURL: "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, done) {
return done(null, profile);
}
));
passport.use(new FacebookStrategy({
    clientID: "6621650011252064",
    clientSecret: "1a0b46a8673fd118edd5774352295a15",
   callbackURL: "http://localhost:3000/auth/facebook/callback"
  //  callbackURL: "https://procesos-ow4kn6kguq-ew.a.run.app/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.use(
  new GoogleOneTapStrategy(
    {
     clientID: "211171970949-tku16b0acn451u5tje2713q7biui167u.apps.googleusercontent.com", // your google client ID DESARROLLO
     clientSecret: "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", // your google client secret
      // clientID:"211171970949-9f14k8uhnh2ritrgpd4p7b533rls36mp.apps.googleusercontent.com", //PRODUCCION
      // clientSecret:"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",
      verifyCsrfToken: false, // whether to validate the csrf token or not
    },
    function (profile, done) {
      // Here your app code, for example:
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      return done(null, profile);
    }
  )
);


