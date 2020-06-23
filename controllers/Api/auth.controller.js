const bcrypt = require("bcrypt");
const User = require('../../models/user.model');
const mail = require("../../mail");

module.exports.postLogin = async function (req, res, next) {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "email is not exist"
        })
    }

    if (user.wrongLoginCount >= 4)
        return res.status(401).json({
            message: "You entered the wrong password too many times"
        })

    bcrypt.compare(password, user.password).then(async success => {
        if (!success) {
            user = await User.findOneAndUpdate({ _id: user.id }, { wrongLoginCount: user.wrongLoginCount + 1 }, { new: true });
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

            return res.status(401).json({
                message: err
            })
        }

        await User.findOneAndUpdate({ _id: user.id }, { wrongLoginCount: 0 });
        return res.status(200).json({
            message: "Login success"
        })
    });
}