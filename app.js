// CARREGANDO MODULOS
  const express = require('express')
  const handlebars = require('express-handlebars')
  const bodyParser = require("body-parser")
  const mongoose = require("mongoose")
  const path = require('path')
  const session = require('express-session')
  const flash = require('connect-flash')
  const admin = require("./routes/admin")
  const user = require("./routes/user")
  const app = express()

// CONFIGURAÇÕES
    app.use(express.static(__dirname + '/public'));
  // SESSION
    app.use(session({
      secret: "sdjgh58755213fhjgre23hgc548700000xxxxrdsk",
      resave: true,
      saveUninitialized: true
    }))
    app.use(flash())

  // MIDDLEWARE
     app.use((req, res, next) => {
       res.locals.success_msg = req.flash("success_msg")
       res.locals.error_msg = req.flash("error_msg")
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
    mongoose.connect("mongodb://localhost/restaurante").then(()=>{
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
  app.use('/user', user)

// OUTROS
  const port = 3000
  app.listen(port, () => {
    console.log("servidor rodando na porta 3000")
  })