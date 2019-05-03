'use strict'

const Activity = require('../../../functions/activity')
const Maps = require('../Models/Map')
const File = require('../../../functions/file')

class MapController { 

    static create(req, res, next) {
        try {
            if (!req.body.continent_id) {
                res.status(422).json({ 'error': 'Please provide continent for your map' })
            }
            if (!req.body.country_id) {
                res.status(422).json({ 'error': 'Please provide country' })
            }
            if (!req.body.name) {
                res.status(422).json({ 'error': 'Please provide name' })
            }
            const map = new Maps()
            map.user_id = req.body.user._id
            map.continent_id = req.body.continent_id
            map.country_id = req.body.country_id
            map.name = req.body.name
            map.description = req.body.description
            map.image = (req.body.image) ? File.Image(req.body.image) : ''
            map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file, req.body.name) : ''
            map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, req.body.name) : ''
            map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file, req.body.name) : ''
            map.save(function (error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else { Activity.activity_log(req, req.body.user_id,' Added map')
                    return res.status(201).json({ msg: 'map message Successfully received.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        try {
            Maps.findById(req.params.id).populate('user_id').then((map) => {                
                    map.user_id = req.body.user._id
                    map.continent_id = req.body.continent_id
                    map.country_id = req.body.country_id
                    map.name = req.body.name
                    map.description = req.body.description
                    map.image = (req.body.image) ? File.Image(req.body.image) : ''
                    map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file, req.body.name) : ''
                    map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, req.body.name) : ''
                    map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file, req.body.name) : ''
                    map.save(function (error) {
                        if (error) {
                            Activity.activity_log(req, req.body.user._id, 'Error Updating Map!')
                            return res.status(501).json({ error: error, msg: error.message })
                        } else {
                            Activity.activity_log(req, req.body.user._id, 'Map Updated Successfully')
                            return res.status(201).json({
                                'map': map,
                                'msg': map.user_id.first_name +
                                    ' Map Updated Successfully!'
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
            Maps.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
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
            Maps.find({ continent_id : req.params.continent_id}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
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
            Maps.find({ country_id: req.params.country_id }, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
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
            Maps.findById(req.params.id , null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((map) => {
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
            Maps.findByIdAndDelete( req.params.id, function (error, user) {
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
}

module.exports = MapController