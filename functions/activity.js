const ActivityLog = require('../Modules/Site/Models/ActivityLog')
const EmailAlert = require('../Modules/Site/Models/Email')
const User = require('../Modules/User/Models/User')
const request = require('request')
var nodemailer = require("nodemailer")
var sgTransport = require("nodemailer-sendgrid-transport")
const config = require('../braxmax.json')

var options = {
    auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD
    }
}

var client = nodemailer.createTransport(sgTransport(options))

var fs = require('fs')
const Activity = {}
var result = {}
var item
var trans
var data = {}



Activity.Base64_encode = function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file)
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64')
}

Activity.makeid = function(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}

Activity.Email = function(data, subject, message) {
    try {
        var email = {
            from: config.app_name,
            to: (data.email) ? data.email : config.email,
            subject: subject,
            html: message
        }

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}

Activity.Email1 = function (data, subject, message) {
    try {
        var email = {
            from: 'AdedotunBashorun',
            to: (data.email) ? data.email : 'adedotunolawale@gmail.com',
            subject: subject,
            html: message
        }

        client.sendMail(email, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}

Activity.html = function (data){
    return  '<div id="content" style="background-color: #1D4BB7width:100%">'+
                '<nav>'+
                    '<div class="container-fluid">'+
                            '<span><a href="https://sofatotravels.com"><img src="https://sofatotravels.com/static/images/sofato/logo/Sofato-Logo-Allwhite.png" style="width: 120px height: 45px padding:10px" class="img-responsive"></a></span>'+
                    '</div>'+
                '</nav>'+
                '<div style="background-color: #fefefepadding:20pxcolor:#000">'+ data + '</div>'+
            '</div>'
}

Activity.html2 = function (data) {
    return '<div id="content" style="background-color: #1D4BB7width:100%">' +
        '<nav>' +
        '<div class="container-fluid">' +
        '<span><a href="https://adedotunbashorun.com"><img src="http://www.adedotunbashorun.com/img/bashorun.png" style="width: 120px height: 45px padding:10px" class="img-responsive"></a></span>' +
        '</div>' +
        '</nav>' +
        '<div style="background-color: #fefefepadding:20pxcolor:#000">' + data + '</div>' +
        '</div>'
}

Activity.SupportEmail = function(data, subject, message) {
    try {
        var email = {
            from: config.app_name,
            to: (data.user_id) ? data.user_id.email : config.email,
            subject: subject,
            html: message
        }

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}

Activity.BulkEmail = async(message) => {
    if (message.others !== '' && message.medium === 'email') {
        var str = message.others
        var str_array = str.split(',')

        for (var i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace.
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "")
            // Add additional code here, such as:
            console.log(str_array[i])
            try {
                var email = {
                    from: config.app_name,
                    to: str_array[i],
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                console.log(error)
                // return res.status(401).json({ "success": false, "message": error })
            }
        }
    }
    if (message.receiver === 'subscribers'){
        this.Subscribers(message)
    } else if (message.receiver === 'all users'){
        this.Users(message)
    } else if (message.receiver === 'all') {
        this.Users(message)
        this.Subscribers(message)
    }else{
        User.find({ user_type: message.receiver }, null, { sort: { 'created_at': -1 } }, function(error, users) {
            if (error) return res.json(error)
            for (user of users) {
                try {
                    var email = {
                        from: config.app_name,
                        to: user.email,
                        subject: message.title,
                        html: this.html(message.message)
                    }

                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Message sent: " + info.response)
                        }
                    })
                } catch (error) {
                    return res.status(401).json({ "success": false, "message": error })
                }
            }
        })
    }   
}

Activity.Subscribers = (message)=>{
    EmailAlert.find({ status: 1 }, null, { sort: { 'created_at': -1 } }, function (error, emails) {
        if (error) return res.json(error)
        for (user of emails) {
            try {
                var email = {
                    from: config.app_name,
                    to: user.email,
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                return res.status(401).json({ "success": false, "message": error })
            }
        }
    })
}

Activity.Users = (message) => {
    User.find({ deleted_at: null }, null, { sort: { 'created_at': -1 } }, function (error, users) {
        if (error) return res.json(error)
        for (user of users) {
            try {
                var email = {
                    from: config.app_name,
                    to: user.email,
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                return res.status(401).json({ "success": false, "message": error })
            }
        }
    })
}

Activity.activity_log = async(req, user_id, description) => {
    if (user_id) {
        let logs = new ActivityLog()
        logs.user_id = user_id
        logs.description = description
        logs.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return logs.save()
    }
}

Activity.alertEmail = async (req) => {
    if (req) {
        let alert = new EmailAlert()
        alert.email = req.body.email
        alert.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return alert.save()
    }
}

Activity.Transaction = async(req, res, type) => {
    var options = {
        method: 'POST',
        json: true,
        url: 'https://api.paystack.co/transaction/verify/' + req.body.reference,
        headers: {
            'Authorization': 'Bearer ' + config.paystack_test_secret_key
        }
    }
    request.get(options, (err, body) => {
        if (err) return res.json(err)
        data.transaction = body.body
        trans = new Payment()
        trans.type = type
        trans.reference = req.body.reference
        trans.user_id = req.body.user_id
        trans.status = body.body.data.status
        trans.message = body.body.message
        trans.fees = body.body.data.fees / 100
        trans.fees_split = body.body.data.fees_split / 100
        trans.amount = body.body.data.amount / 100
        trans.save()
        return result.transaction = trans
    })
}


module.exports = Activity