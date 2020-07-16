const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')


const errorController = require('./controllers/error')
const User = require('./models/user')
const shopController = require('./controllers/shop')
const isAuth = require('./middleware/is-auth')

const MONGODB_URI =
  'mongodb+srv://brian:Xh3xfglahEAIf3tV@cluster0-vv8md.mongodb.net/shop'

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
)
app.use(flash())

// passes variables to local views once they are rendered
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  next()
})

app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
  .then(user => {
    if(!user) {
      return next()
    }
    req.user = user
    next()
  })
  .catch(err => {
    throw new Error(err)
  })
})

app.post('/create-order', isAuth, shopController.postOrder)

app.use(csrfProtection)
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get('/500', errorController.get500)
app.use(errorController.get404)

// express error handling middleware
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500', 
    isAuthenticated: req.session.isLoggedIn 
  })
})

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    app.listen(3000)
    console.log('3000 is your magic port')
  })
  .catch(err => {
    console.log(err)
  })