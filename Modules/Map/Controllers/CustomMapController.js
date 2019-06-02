'use strict'

const Activity = require('functions/activity')
const CustomMap = require('Modules/Map/Models/CustomMap')

class CustomMapController { 

    static create(req, res, next) {
        try {
            if (!req.body.continent_id) {
                return res.status(422).json({ 'error': 'Please provide continent for your map' })
            }
            if (!req.body.country_id) {
                return res.status(422).json({ 'error': 'Please provide country' })
            }
            if (!req.body.full_name) {
                return res.status(422).json({ 'error': 'Please provide name' })
            }
            if (!req.body.email) {
                return res.status(422).json({ 'error': 'Please provide email' })
            }

            const map = new CustomMap()
            map.continent_id = req.body.continent_id
            map.country_id = req.body.country_id
            map.full_name = req.body.full_name
            map.description = req.body.description
            map.email = req.body.email
            map.save(function (error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else { 
                    Activity.Email(map, 'New Request', Activity.html('<p style="color: #000">Hello ' + map.full_name +', Thank you for using Brax Map.<br> \r\n Your map request has been received.</p>'))
                    Activity.activity_log(req, req.body.user_id,' Added map')
                    return res.status(201).json({ msg: 'Map Successfully created.' })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        try {
            CustomMap.findById(req.params.id).then((map) => {
                map.continent_id = (req.body.continent_id) ? req.body.continent_id : map.continent_id
                map.country_id = (req.body.country_id) ? req.body.country_id : map.country_id
                map.full_name = (req.body.full_name) ? req.body.full_name : map.full_name
                map.description = req.body.description
                map.email = (req.body.email) ? req.body.email : map.email
                map.save(function (error) {
                    if (error) {
                        Activity.activity_log(req, req.user, 'Error Updating Map!')
                        return res.status(501).json({ error: error, msg: error.message })
                    } else {
                        Activity.activity_log(req, req.user, 'Map Updated Successfully')
                        return res.status(201).json({
                            'map': map,
                            'msg':' Map Updated Successfully!'
                        })
                    }
                })
            }).catch((err) =>{
                return res.status(401).json({ error: err, msg: err.message })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            CustomMap.find({}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getAllByContinent(req, res, next) {
        try {
            CustomMap.find({ continent_id : req.params.continent_id}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getAllByCountry(req, res, next) {
        try {
            CustomMap.find({ country_id: req.params.country_id }, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            CustomMap.findById(req.params.id , null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((map) => {
                return res.status(201).json({ map: map })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static delete(req, res, next) {
        try {
            CustomMap.findByIdAndDelete( req.params.id, function (error, map) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    return res.json({ map: map, msg:"map was deleted successfully" })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }
}

module.exports = CustomMapController