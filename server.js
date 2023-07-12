const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
//const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
//mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    //.then(() => console.log("Successfully connected to MongoDB"))
    //.catch(err => console.log(err));
    mongoose.connect(`mongodb+srv://gopiboorsu12:gopi123@cluster0.kzba70s.mongodb.net/?retryWrites=true&w=majority`,{    
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
    
    
    db.once('open', function(){
        console.log('Connected to Database :: MongoDB');
    });

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));