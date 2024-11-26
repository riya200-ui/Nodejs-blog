require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride =  require('method-override')
const cookieParser = require('cookie-parser');

const connectDB = require('./server/config/db');
const {isActivRoute} = require('./server/helpers/routeHelpers')
const session = require('express-session');
const MongoStore = require('connect-mongo');


const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.locals.isActivRoute = isActivRoute

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }),
}))


app.use(express.static('public'));

// app.get('',(req,res) => {
//     res.send('hello world');
// });

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT, ()=> {
    console.log(`app listenng on port ${PORT}`);
});