import express,{Application,Request,Response} from 'express'
import passport from 'passport'
import passportFacebook from 'passport-facebook'
const FacebookStrategy = passportFacebook.Strategy
import session from 'express-session'


const app = express()
app.use(session({secret:"mysecret!!!!"}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function(user,cb){
	cb(null,user)
})

passport.deserializeUser(function(obj:string,cb){
	cb(null,obj)
})

passport.use(new FacebookStrategy({
    clientID: "495736404765946",
    clientSecret: "8632338ba5aa2d95117544b0d12dcd2c",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken:any, refreshToken:any, profile:any, done:any) {
 		console.log(profile);
 		return done(null,profile) 

    }
));

app.get('/',passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

app.get("/failed",(req,res)=>{
	res.send("YOUR FAILED LOGIN !!!")
})

app.get("/profile",(req,res)=>{
	console.log(req.user)
	res.send("successs login " + JSON.stringify(req.user))
})
// NOW FOR LOGOUT USER

app.get("/logout",(req,res)=>{
	req.session.destroy(function(err){
		res.clearCookie('connect.sid')
		res.send(" YOUR LOGOUT Now")
	})
})
// THANKS FOR WATCH
app.listen(3000,()=>console.log("server at 3000"))