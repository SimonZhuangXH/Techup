app.post("/", (req,res) => {
    const uid = process.env.ALLOWED.split(",");
    const ups = process.env.PASS.split(",");
    const user = req.body.username;
    const pass = req.body.pass;
  
    if (uid.includes(user) && ups[uid.indexOf(user)]===pass) {
      // console.log("Authenticated")
      res.render('home', {authenticated:true});
      authenticated = true;
    } else {
      console.log(`Wrong pass for user: ${user}`);
      res.render('login', {not_authenticated:true});
    }
  });

  const HG = new User({
    name: "",
    password: ""
  })
  console.log(HG)
  HG.save()
  var Schema = mongoose.Schema;

  
    // passport.authenticate('local', function(err, user, info, status) {
  //   if (err) { 
  //     return next(err) }
  //   if (!user) { 
  //     return res.render(`login`,{not_authenticated:true})}
  //     req.login(user, next);
  // })(req, res, next);