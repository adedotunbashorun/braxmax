var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
const formData = require("express-form-data")
const os = require("os")
var cors = require('cors')

const config = require('./config')

const app = express()

var passport = require('passport')

const port = config.app.port

try {
    mongoose.set('useCreateIndex', true)
    //config.db.url
    mongoose.connect("mongodb://heroku_gxrddznw:9qariqjloov1pq9k5er3kr8hrk@ds153766.mlab.com:53766/heroku_gxrddznw", { useNewUrlParser: true }).then(() => { // if all is ok we will be here
        console.log("connected")
    }).catch(err => { // we will not be here...
        console.error('App starting error: Network Issue')
        return { error: err.stack, message: "Error Connecting to mongo db" }
        process.exit()
    })
} catch (err) {
    console.log(err)
}

require('./passport-config')

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
}

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://www.adedotunbashorun.com', 'https://adedotunbashorun.herokuapp.com', 'http://localhost:3000'],
    credentials: true
}))

app.use(morgan('dev'))

const authRoutes = require('./Modules/Authentication/Routes')
const userRoutes = require('./Modules/User/Routes')
const siteRoutes = require('./Modules/Site/Routes')
const mapRoutes = require('./Modules/Map/Routes')
const bulkRoute = require('./Modules/BulkMessage/Routes')
const supportRoutes = require('./Modules/Support/Routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable 
app.use(formData.stream());
// union body and files
app.use(formData.union());

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', siteRoutes)
app.use('/api', mapRoutes)
app.use('/api', bulkRoute)
app.use('/api', supportRoutes)

//set static folder
app.use(express.static(path.join(__dirname, '/dist')))
app.use('/', express.static(path.join(__dirname,'')))



app.set('port',port)

module.exports = app