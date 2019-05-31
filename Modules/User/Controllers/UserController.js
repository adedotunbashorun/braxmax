'use strict'

const Activity = require('functions/activity')
const File = require('functions/file')
const User = require('Modules/User/Models/User')

class UserController {    

    static update(req, res, next) {
        try {
            User.findById(req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.title = (req.body.title) ? req.body.title : user.title
                    user.first_name = (req.body.first_name) ? req.body.first_name : user.first_name
                    user.last_name = (req.body.last_name) ? req.body.last_name : user.last_name
                    user.email = (req.body.email) ? req.body.email : user.email
                    user.username = (req.body.username) ? req.body.username : user.username
                    user.city = (req.body.city) ? req.body.city : user.city
                    user.country = (req.body.country) ? req.body.country : user.country
                    user.phone = (req.body.phone) ? req.body.phone : user.phone
                    user.postal_code = (req.body.postal_code) ? req.body.postal_code : user.postal_code
                    user.address = (req.body.address) ? req.body.address : user.address
                    user.save(function (error) {
                        if (error) {
                            Activity.activity_log(req, user._id, 'Error Updating Profile!')
                            return res.status(501).json({ error: error, msg: error.message })
                        } else {
                            Activity.Email(user, 'Profile Update', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Your profile has been updated succesfully.</p>'))
                            Activity.activity_log(req, user._id, 'Profile Updated Successfully')
                            return res.status(201).json({
                                'user': user,
                                'msg': user.first_name +
                                    ' Profile Updated Successfully!'
                            })
                        }
                    })
                }

            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            User.find({ deleted_at: null }, null, { sort: { 'created_at': -1 } }, function (error, users) {
                if (error) return res.json(error)
                return res.json({ users: users })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getOne(req, res, next) {
        try {
            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    return res.status(201).json({ user: user })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static forgetPassword(req, res, next) {
        try {
            User.findOne({ email: req.body.email, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    if (user) {
                        var pword = Activity.makeid(6)
                        user.password = User.hashPassword(pword)
                        Activity.Email(user, 'Forget Password', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ' This is your new default password.<br><span style="color: #1D4BB7">' + pword + '</span><br/>kindly log on to the application to set a new one.</p>'))
                        user.save()
                        return res.status(201).json({ msg: "A mail has been sent to you." })
                    } else {
                        return res.status(501).json({ msg: 'user not found.' })
                    }
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static resetPassword(req, res, next) {
        try {
            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    if (user.isValid(req.body.old_password)) {
                        user.password = User.hashPassword(req.body.password)
                        Activity.Email(user, 'Reset Password', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ',You have successfully reset your password,<br>Thank you.</p>'))
                        user.save()
                        return res.status(201).json({ msg: "password reset successfully." })
                    } else {
                        return res.status(501).json({ msg: "your old password is incorrect, please check your old password." })
                    }
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static delete(req, res, next) {
        try {
            User.findOneAndRemove({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    return res.json({ user: user, msg: user.first_name + " was deleted successfully" })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static profileImage(req,res,next){
        try {
            User.findById(req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.profile_image = (req.body.image) ? File.Image(req.body.image, user.username) : ''
                    user.save()
                    return res.status(201).json({ user: user })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

}

module.exports = UserController