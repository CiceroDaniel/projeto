// CARREGANDO MODULOS
  const express = require('express')
  const handlebars = require('express-handlebars')
  const bodyParser = require("body-parser")
  const mongoose = require("mongoose")
  const path = require('path')
  const session = require('express-session')
  const flash = require('connect-flash')
  const admin = require("./routes/admin")
  const usuario = require("./routes/user")
  const passport = require('passport')
  require("./config/auth")(passport)
  const app = express()
  // const DB = require("./config/db")

// CONFIGURAÇÕES
    app.use(express.static(__dirname + '/public'));
  // SESSION
    app.use(session({
      secret: "sdjgh58755213fhjgre23hgc548700000xxxxrdsk",
      resave: true,
      saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

  // MIDDLEWARE
     app.use((req, res, next) => {
       res.locals.success_msg = req.flash("success_msg")
       res.locals.error_msg = req.flash("error_msg")
       res.locals.error = req.flash("error")
       res.locals.user = req.user || null;
       next()
     })

  // BODY-PARSER
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

  // HANDLEBARS
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.set("views", "./views");

  // MONGOOSE
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb+srv://daniel:da1227 @cluster0.imgykqg.mongodb.net/?retryWrites=true&w=majority").then(()=>{
      console.log("Conectado ao mongo")
    }).catch((err)=>{
      console.log("erro ao se conectar: "+err)
    })

// ROTAS
  app.get('/', (req, res)=>{
    res.render('index')
  }) 

  app.get('/login', (req, res)=>{
    res.render('/login')
  })

  app.use('/admin', admin)
  app.use('/usuario', usuario)

// OUTROS
  const PORT = process.env.PORT ||3000
  app.listen(PORT, () => {
    console.log("servidor rodando na porta 3000")
  })