const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const route = require('./routes')
const db = require('./config/database')
const session = require('express-session')
const hbsHelpers = require('./util/handlebars')
// const methodOverride = require('method-override')

// Connect to database
db.connect()

const app = express()
const port = 3000

// Static file
app.use(express.static(path.join(__dirname, 'public')))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'vi5 research group',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      sameSite: 'none',
      secure: true
    }
  })
)

// Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    // defaultLayout: 'user',
    helpers: {
      increaseIndex: hbsHelpers.increaseIndex,
      createQuestionsTable: hbsHelpers.createQuestionsTable,
      compareNumber: hbsHelpers.compareNumber
    },
  })
)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// Routing
route(app)

app.listen(port, () =>
  console.log(`App is starting at http://localhost:${port}`)
)
