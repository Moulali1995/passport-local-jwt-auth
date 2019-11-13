var express = require('express')
var router = express.Router()
var LocalStrategy = require('passport-local').Strategy
var passport = require('passport')
var jwt = require('jsonwebtoken')
var private_key = 'ssshhh'
var User = {
  id: 7,
  name: 'james bond',
  username: 'bond',
  password: '007'
}
passport.use(new LocalStrategy(( username, password, done) => {
    if (User.username === username && User.password === password) {
      return done(null, User)
    } else {
      return done(null, false)
    }
  } 
))
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
 // if (User.id===id) {
    done(null, id)
 // } else { done(new Error('session error'), user) }
})

// to check whether the user is authenticated in the session
function isLoggedIn(req,res,next){
  const token=req.headers["x-auth-token"]
  if(!token){
    res.send(401,"Access denied! token not found...")
  }else{
  jwt.verify(token,private_key,(err,decoded)=>{
    if(err){
      res.sendStatus(401)
    }
    req.user=decoded
    next()
  })
}
  
}
router.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }),
  (req, res) => {
    const token = jwt.sign({
        payload:User     
    },private_key,{expiresIn:'2m'})
    res.header("x-auth-token",token).json(User)
   // res.json("login OK")
  }
)

router.get('/fail', (req, res) => {
  res.send('invalid credentials')
})

router.get('/user',isLoggedIn,(req,res)=>{
  res.json(req.user);
})

router.get('/logout',isLoggedIn,(req,res)=>{
  res.send("Logout not possible using jwt please use sessions")

})
module.exports = router
