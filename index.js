var express               = require("express"),
    mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	Usr                  = require("./models/users"),
	Invite                 = require("./models/invites"),
	Event                 = require("./models/event"),
	morgan                =require("morgan"),
    multer                = require("multer"),
	crypto                =  require("crypto"),
	nodemailer = require('nodemailer'),
    path = require('path'),
	helpers = require('./helpers'),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");
var mongoDB = ("mongodb+srv://dhanush:waffles@cluster0-qsgh3.mongodb.net/test?retryWrites=true&w=majority");
 mongoose.set('useUnifiedTopology', true);
 mongoose.connect(mongoDB, { useNewUrlParser: true });
var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(require("express-session")({
  secret : "i love trichy",
  resave : false,
  saveUninitialized: false,
}));
//======
var nodemailer = require('nodemailer');
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var transporter = nodemailer.createTransport({
service: 'Gmail',
auth: {
    user: 'dhanushted@gmail.com',
    pass: 'GOTno@Brains'
}
});

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listEvents);
});
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}
//======
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//======
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/placement/:id', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        console.log(req.file);
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
		
        else if (!req.file) {
            return res.render("upload");
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
    console.log(req.file.path); 
		var pathda = req.file.path;
		var pathba = "";
		for(var i = 6;i < pathda.length;i++){
			pathba += pathda[i]; 
		}
		console.log(pathba);
		Invite.findById(req.params.id,function(err,ins){
			ins.image = pathba;
			ins.save();
		res.render("placement",{ins: ins});
		})
		//res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });
});
app.post("/invitef/:id",function(req,res){
	Invite.findById(req.params.id,function(err,i){
		i.imgx = req.body.x;
		i.imgy = req.body.y;
		i.save();
		res.redirect("/home");
	})
})
app.get("/",function(req,res){
	res.render("login");
	console.log(User.length)
});
app.get("/signup",function(req,res){
	res.render("signup");
});
1
2
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
app.get("/home",islogin,function(req,res){
	Invite.find({user : req.user._id },function(err,inv){
		inv.forEach(function(i){
			if(i.dead === date){
				i.Name.forEach(function(ins){
					i.Name.pop();
				})
				i.save();
			}
		})
	})
	Event.find({id : req.user._id },function(er,event){
	Invite.find({Name: req.user.username},function(err,i){
		Invite.find({name: req.user.username},function(err,isn){
	  res.render("home",{event:event,user : req.user,i : i,inv : isn });})	})	
	})
});
app.get("/home/notification",function(req,res){
	Event.find({id : req.user._id },function(er,event){
	Invite.find({Name: req.user.username},function(err,i){
		Invite.find({name: req.user.username},function(err,isn){
			
	  res.render("homen",{event:event,user : req.user,i : i,inv : isn });})	})	
	})
});
app.post("/home/notification",function(req,res){
	Invite.find({user : req.user._id},function(err,is){
		is.forEach(function(ins){
			ins.notifya.forEach(function(insa){
				ins.notifya.pop();
			})	;
			ins.notifyd.forEach(function(insa){
				ins.notifyd.pop();
			})
			ins.save();
		})
		res.redirect("/home");
	})
})
app.get("/event/:id",islogin,function(req,res){
	console.log(req.params.id)
	User.findById(req.params.id,function(err,user){
		if(err){
			console.log(err);
		}
		console.log(user);
	User.find({},function(err,users){
	res.render("events",{user : user,users : users });
	})		
	})
});
app.post("/event/:id",function(req,res){
	 var name =  req.body.name;
	var date = req.body.date;
	var id  = req.params.id;
	var i1 = req.body.in1;
	var templ = req.body.gender;
	Invite.create({user : id ,usern : req.user.username},function(err,i){
		i.event = name;
		i.dead = req.body.deadline;
		i.content = req.body.content;
		i.Date = date;
		i.style = req.body.style;
		if(!(req.body.gender === "")){
		i.url = templ;	
		}
		if(!(req.body.in1 === "")){
		i.Name.push(req.body.in1);	
		}
		if(!(req.body.in2 === "")){
		i.Name.push(req.body.in2);	
		}
		if(!(req.body.in3 === "")){
		i.Name.push(req.body.in3);	
		}
		if(!(req.body.in4 === "")){
		i.Name.push(req.body.in4);	
		}
	    if(!(req.body.in5 === "")){
		i.Name.push(req.body.in5);	
		}
		if(!(req.body.in6 === "")){
		i.Name.push(req.body.in6);	
		}
		if(!(req.body.in7 === "")){
		i.Name.push(req.body.in7);	
		}
		if(!(req.body.in8 === "")){
		i.Name.push(req.body.in8);	
		}
		if(!(req.body.in9 === "")){
		i.Name.push(req.body.in9);	
		}
	    if(!(req.body.in10 === "")){
		i.Name.push(req.body.in10);	
		}
		i.save();
		i.Name.forEach(function(err,u){
			Usr.find({username : u},function(us){
		var mailOptions = {
  from: 'dhanushted@gmail.com',
  to: us.email,
  subject: 'Sending Email using Node.js',
  html: '<h1>Welcome</h1><p>That was easy!</p><a href="https://dsfwsf.run-ap-south1.goorm.io/"></a>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});		
			})
		})
	var newevent = { Name: name , Date : date, id : id };
	if(name === "" || date === ""){
		res.redirect("/event/" + req.params.id);
		}
	else{Event.create(newevent,function(err,e){
		if(err){
			console.log(err);
		}
			else{
	res.render("upload",{ins : i});
			}
		})
	;	}
	})
});
app.get("/invites/:id",islogin,function(req,res){
	Invite.findById(req.params.id,function(err,inv){
		if(err){
			console.log(err + "sasa");
			res.redirect("/home");
		}
		else{
			
		console.log(inv.Name);
	res.render("invited",{user : req.user ,i : inv });}
	})
});
app.get("/invites/new/:id",islogin,function(req,res){
	Invite.findById(req.params.id,function(err,inv){
		if(err){
			console.log(err + "sasa");
			res.redirect("/home");
		}
		else{
			inv.forEach(function(i){
				if(i.dead = date ){
					Invite.deleteMany({dead: date});
				}
			})
		console.log(inv.Name);
	res.render("invite",{user : req.user ,i : inv });}
	})
});
app.post("/invite/accept/:id/:user",function(req,res){
	Invite.findById(req.params.id,function(err,inv){
		if(err){
			console.log("erere")
		}
		else{
			for(var i = 0; i < inv.Name.length ; i++){
				if(inv.Name[i]=== req.user.username){
					console.log(inv.Name[i]);
					inv.Name.splice(i,1);
				}
			}
			inv.food.push(req.body.food);
			inv.strength += 1;
			inv.strength += req.body.add;
			inv.name.push(req.user.username);
			inv.notifya.push(req.user.username);
			inv.save();
			Usr.find({username : req.user.username},function(err,u){
				//====
			var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': inv.Date+'T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'end': {
    'dateTime': inv.Date+'T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': u.email},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};

calendar.events.insert({
  auth: auth,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created: %s', event.htmlLink);
});

			//====
			})
			
			res.redirect("/home");
		}
	})
});
app.post("/invite/reject/:id/:user",function(req,res){
	Invite.findById(req.params.id,function(err,inv){
		if(err){
			console.log("erere")
		}
		else{
			for(var i = 0; i < inv.Name.length ; i++){
				if(inv.Name[i]=== req.user.username){
					console.log(inv.Name[i]);
					inv.Name.splice(i,1);
					inv.save();
				}
			}
			inv.notifyd.push(req.user.username);
			inv.save();
			res.redirect("/home"); 
		}
	})
});
app.post("/signup",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username : req.body.username}),req.body.password,function(err,user){
		passport.authenticate("local")(req,res,function(){
			res.redirect("/home");
		})
	})
	Usr.create({username: req.body.username},function(err,u){
		u.email = req.body.email;
		u.save();
	})
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/home" ,
	failureRedirect:"/",
}),function(req,res){
	req.body.username
	req.body.password
	console.log("hi");
});
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

function islogin(req ,res ,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}
app.listen(3000,'0.0.0.0',function(){
  console.log("server");
})