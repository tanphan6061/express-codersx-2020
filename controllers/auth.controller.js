const bcrypt = require("bcrypt");
const User = require('../models/user.model');
const mail = require("../mail");

module.exports.login = function (req, res) {
  res.render("auth/login", {
    csrf: req.csrfToken()
  });
};

module.exports.logout = function (req, res) {
  res.clearCookie("userId");
  res.redirect('back');
}

module.exports.postLogin = async function (req, res) {
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    return res.render("auth/login", {
      errors: ["email is not exist"],
      old: req.body,
      csrf: req.csrfToken()
    });
  }

  if (user.wrongLoginCount >= 4)
    return res.render("auth/login", {
      errors: ["You entered the wrong password too many times"],
      old: req.body,
      csrf: req.csrfToken()
    });

  bcrypt.compare(password, user.password).then(async success => {
    if (!success) {
      user = await User.findOneAndUpdate({ _id: user.id }, { wrongLoginCount: user.wrongLoginCount + 1 },{new:true});
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
        old: req.body,
        csrf: req.csrfToken()
      });
    }

    await User.findOneAndUpdate({ _id: user.id }, { wrongLoginCount: 0 });
    res.cookie("userId", user.id, { signed: true });

    let directTo = req.cookies.directTo || '/';
    res.redirect(directTo);
  });
};
