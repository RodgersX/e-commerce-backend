const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// extract user from one central point and use it anywhere else in my code
app.use((req, res, next) => {
    User.findById('5eca31129ee595178cb7841d')
        .then(user => {
            req.user = user
            next()
        }).catch(err => console.log(err))
}) 

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose.set('useNewUrlParser', true)
mongoose.connect('mongodb+srv://brian:Xh3xfglahEAIf3tV@cluster0-vv8md.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
    .then(result => {
        User.findOne().then(user => {
           if(!user) {
                const user = new User({
                    name: 'Mawira',
                    email: 'mawira@test.com',
                    cart: {
                        items: []
                    }
                })
                user.save()
           }
        })
        app.listen(3000)
        console.log('Listening to port 3000...')
        
    }).catch(err => console.log(err))

