const mongoose = require('mongoose');
const Account = mongoose.model('Account');

const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const secretKey = crypto.randomBytes(64).toString('hex');
const passwordRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})');

module.exports = app => {

    // Routes

    // Login 
    app.post('/account/login', async (req, res) => {

        var response = {};

        const { rUsername, rPassword } = req.body;
        if (rUsername == null || !passwordRegex.test(rPassword)) {

            response.code = 1;
            response.msg = 'Invalid credentials';
            res.send(response);
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername }, 'username adminFlag password');
        if (userAccount != null) {
            argon2i.verify(userAccount.password, rPassword).then(async (success) => {
                if (success) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();

                    // Generate a unique token
                    const token = jwt.sign(
                        {
                            username: userAccount.username,
                            adminFlag: userAccount.adminFlag,
                        },
                        secretKey
                    );

                    response.code = 0;
                    response.msg = 'Login successful';
                    response.data = (({ username, adminFlag }) => ({ username, adminFlag }))(userAccount);
                    response.token = token;
                    res.send(response);

                    return;
                }
                else {
                    response.code = 1;
                    response.msg = 'Invalid credentials';
                    res.send(response);
                    return;
                }
            });
        } else {
            response.code = 1;
            response.msg = 'Invalid credentials';
            res.send(response);
            return;
        }

    });

    // Create an account
    app.post('/account/create', async (req, res) => {


        var response = {};

        const { rUsername, rPassword } = req.body;
        if (rUsername == null || rUsername.lenght < 4 || rUsername.lenght > 16) {
            response.code = 1;
            response.msg = 'Invalid credentials';
            res.send(response);
            return;
        }

        if (!passwordRegex.test(rPassword)) {
            response.code = 3;
            response.msg = 'Unsafe password';
            res.send(response);
            return;
        }

        var userAccount = await Account.findOne({ username: rUsername }, '_id');
        if (userAccount == null) {
            //Create a new account
            console.log("Creating new account");

            // Generate a unique access token
            crypto.randomBytes(32, function (err, salt) {
                if (err) {
                    console.log(err);
                }

                argon2i.hash(rPassword, salt).then(async (hash) => {
                    var newAccount = new Account({
                        username: rUsername,
                        password: hash,
                        salt: salt,

                        lastAuthentication: Date.now(),
                    })

                    await newAccount.save();

                    response.code = 0;
                    response.msg = 'Account created';
                    response.data = (({ username }) => ({ username }))(newAccount);
                    res.send(response);

                    return;
                })
            });
        }
        else {
            response.code = 2;
            response.msg = 'Account already exists';
            res.send(response);
        }
        return;

    });

};