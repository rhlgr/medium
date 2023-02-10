var express = require('express');
var router = express.Router();
const User = require("../model/usermodel");
const Blog = require("../model/blogmodel");
const passport = require("passport");
const localstr = require("passport-local");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
passport.use(User.createStrategy());

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/ourstory', function (req, res, next) {
  res.render('ourstory');
});
router.get('/Membership', function (req, res, next) {
  res.render('Membership');
});
router.get('/Write', function (req, res, next) {
  res.render('Write');
});
router.get('/Signin', function (req, res, next) {
  res.render('Signin');
});
router.get('/Get-started', function (req, res, next) {
  res.render('Get-started');
});
router.get('/email', function (req, res, next) {
  res.render('email');
});
router.get('/signup', function (req, res, next) {
  res.render('signup');
});
router.get('/reset',isLoggedIn, function (req, res, next) {
  res.render('reset');
});

router.get('/forget', function (req, res, next) {
  res.render('forget');
});


router.get('/settings', isLoggedIn, function (req, res, next) {
  res.render('settings', {user: req.user});
});

router.get('/overlay', isLoggedIn, function (req, res, next) {
  res.render('overlay', {user: req.user});
});
router.post('/reset', isLoggedIn, function (req, res, next) {
  req.user.changePassword(
    req.body.oldpassword,
     req.body.newpassword,
      function(err) {
        if(err) return res.send(err);
        res.redirect('/logout');
      }
  )
});


router.post("/forget", function (req, res, next) {
  User.findOne({ email: req.body.email })
      .then((user) => {
          if (!user)
              return res.send(
                  "Not found <a href='/forget-password'>Try Harder!</a>"
              );

          // next page url
          const pageurl =
              req.protocol +
              "://" +
              req.get("host") +
              "/changepassword/" +
              user._id;

          // send email to the email with gmail
          const transport = nodemailer.createTransport({
              service: "gmail",
              host: "smtp.gmail.com",
              port: 465,
              auth: {
                  user: "rhlgr321@gmail.com",
                  pass: "gorxrvnglsmciugx",
              },
          });

          const mailOptions = {
              from: "Rahul Pvt. Ltd.<rhlgr321@gmail.com>",
              to: req.body.email,
              subject: "Password Reset Link",
              text: "Do not share this link to anyone.",
              html: `<a href=${pageurl}>Password Reset Link</a>`,
          };

          
          transport.sendMail(mailOptions, (err, info) => {
              if (err) return res.send(err);
              console.log(info);
              user.resetPasswordToken = 1;
              user.save();
              return res.send(
                  "<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox , <br/>check spam in case not found in inbox.</h1>"
              );
          });
          // ------------------------------
      })
      .catch((err) => {
          res.send(err);
      });
});
router.get("/changepassword/:id", function (req, res, next) {
  res.render("changepassword", { id: req.params.id });
});

router.post("/changepassword/:id", function (req, res) {
  User.findById(req.params.id)
      .then((user) => {
          if (user.resetPasswordToken === 1) {
              user.setPassword(req.body.password, function (err) {
                  if (err) return res.send(err);
                  user.resetPasswordToken = 0;
                  user.save();
                  res.redirect("/logout");
              });
          } else {
              res.send(
                  "Link Expired! <a href='/forget'>Try Again.</a>"
              );
          }
      })
      .catch((err) => res.send(err));
    })


router.post("/signup", function (req, res, next) {
  const { name, username, email, password } = req.body;

  const CreateUser = new User({ name, username, email });

  User.register(CreateUser, password)
    .then(() => {
      const authenticate = User.authenticate();
      authenticate(email, password, function (err, result) {
        if (err) res.send(err);
        res.redirect("/home");
      });
    })
    .catch((err) => res.send(err));
});

router.post('/email', passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/"
}),
function (req, res, next) { });



router.get('/home', isLoggedIn, function (req, res, next) {
  res.render('home');
});


router.get('/profile', isLoggedIn, function (req, res, next) {
  console.log(req.user);
  res.render('profile', { user: req.user });
});
router.post("/profile", upload.single("avatar"), function (req, res, next) {
  const updatedUser = {
      about: req.body.about,
      username:req.body.username,
  };
  if (req.file) {
     if (req.body.oldavatar !== "dummy.png") {
     fs.unlinkSync( path.join( __dirname, "..", "public", "uploads", req.body.oldavatar ))
      }
      updatedUser.avatar = req.file.filename;
  }
  User.findByIdAndUpdate(req.user._id, updatedUser )
      .then(() => {
          res.redirect("/profile");
      })
      .catch((err) => res.send(err));
});

router.get('/delete',isLoggedIn, function(req, res, next) {
  User.findByIdAndDelete(req.user._id)
  .then(()=>{
    res.redirect('/home');
  })
  .catch((err)=> res.send(err))
  });

router.post("/settings", function (req, res, next) {
User.findByIdAndUpdate(req.user._id, req.body)
.then(() => {
 res.redirect("/settings");
     })
 .catch((err) => res.send(err));
});

router.post("/overlay", function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, req.body)
  .then(() => {
   res.redirect("/settings");
       })
   .catch((err) => res.send(err));
  });

  router.get("/writee", function (req, res, next) {
    res.render("writee");
  });


  router.post("/writee", isLoggedIn, async function (req, res, next) {
    const newBlog = new Blog({
        author: req.user._id,
        blog: req.body,
    });
    req.user.lists.push(newBlog._id);
    await req.user.save();
    await newBlog.save();
});



router.get("/lists", isLoggedIn, function (req, res, next) {
    User.findById(req.user._id)
        .populate("lists")
        .then((user) => {
            res.render("lists", { title: "User Blog", lists: user.lists });
        })
        .catch((err) => res.send(err));
});


















function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}


router.post("/uploadFile", upload.single("avatar"), function (req, res, next) { 
  res.json({
     success : 1,
     file: {
         url : "http://localhost:3000/uploads/"+ req.file.filename,

     }
 })
 
 })
router.get("/logout", function (req, res, next) {
  req.logout(function () {
    res.redirect("/");
  });
});
module.exports = router;
