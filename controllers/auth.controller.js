// const md5 = require("md5");
const bcrypt = require("bcrypt");
const db = require("../db");
const mail = require("../mail");

module.exports.login = function(req, res) {
  res.render("auth/login");
};

module.exports.logout = function(req,res){
  res.clearCookie("userId");
  res.redirect('/');
}

module.exports.postLogin = function(req, res) {
  let { email, password } = req.body;
  let user = db
    .get("users")
    .find({ email })
    .value();

  if (!user) {
    return res.render("auth/login", {
      errors: ["email is not exist"],
      old: req.body
    });
  }

  if (user.wrongLoginCount >= 4)
    return res.render("auth/login", {
      errors: ["You entered the wrong password too many times"],
      old: req.body
    });

  bcrypt.compare(password, user.password).then(success => {
    if (!success) {
      db.get("users")
        .find({ id: user.id })
        .assign({ wrongLoginCount: user.wrongLoginCount + 1 })
        .write();

      let err = "You entered the wrong password too many times";

      if (user.wrongLoginCount < 4) {
        err = `Incorrect password. You can try it ${4 -
          user.wrongLoginCount} more times`;

        if (user.wrongLoginCount === 3) {
          mail.send(
            user.email,
            "Login Warning",
            `Hi ${user.username},<br/>
             Your account entered the wrong password 3 times.<br/>
             You only have 1 correct login.<br/> 
             If you log in incorrectly again your account will be temporarily locked.`
          );
        }
      }

      return res.render("auth/login", {
        errors: [err],
        old: req.body
      });
    }

    db.get("users")
      .find({ id: user.id })
      .assign({ wrongLoginCount: 0 })
      .write();

    res.cookie("userId", user.id, { signed: true });
    res.redirect("/");
  });

  // if (user.password != md5(password)) {
  //   return res.render("auth/login", {
  //     errors: ["incorrect password"],
  //     old: req.body
  //   });
  // }
};
