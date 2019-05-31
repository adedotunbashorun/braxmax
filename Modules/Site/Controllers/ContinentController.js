'use strict'

const Continent = require('Modules/Site/Models/Continent')
const Country = require('Modules/Site/Models/Country')
const Activity = require('functions/activity')

class ContinentController{

    static create(req, res,next) {
        try {
            if (!req.body.name) {
                return res.status(422).json({ 'error': 'Please provide continent name' })
            }
            if (!req.body.description) {
                return res.status(422).json({ 'error': 'Please provide description' })
            }
            if (!req.body.longtitude) {
                return res.status(422).json({ 'error': 'Please provide longtitude' })
            }
            if (!req.body.latitude) {
                return res.status(422).json({ 'error': 'Please provide latitude' })
            }
            const continent = new Continent(req.body)
            continent.save(function(error) {
                if (error) {
                    Activity.activity_log(req, req.user, 'Error Creating Continent!')
                    return res.status(401).json({ error: error, msg: error.message })
                } else {
                    Activity.activity_log(req, null, req.user + ' Added Continent')
                    return res.status(201).json({ msg: 'Continent Successfully received.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        try {
            Continent.findById(req.params.id, function (error, continent) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    continent.name = (req.body.name) ? req.body.name : continent.name
                    continent.latitude = (req.body.latitude) ? req.body.latitude : continent.latitude
                    continent.longtitude = (req.body.longtitude) ? req.body.longtitude : continent.longtitude
                    continent.description = (req.body.description) ? req.body.description : continent.description
                    continent.save(function (error) {
                        if (error) {
                            Activity.activity_log(req, req.user, 'Error Updating Continent!')
                            return res.status(501).json({ error: error, msg: error.message })
                        } else {
                            Activity.activity_log(req, req.user, 'Continent Updated Successfully')
                            return res.status(201).json({
                                'continent': continent,
                                'msg': continent.name +
                                    ' Continent Updated Successfully!'
                            })
                        }
                    })
                }

            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }
    static getAllCountry(req, res, next) {
        try {
            Country.find({ continent_id: req.params.continent_id }, null, { sort: { 'createdAt': -1 } }).populate('continent_id').then((countries) => {
                return res.status(201).json({ countries: countries })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getAll(req, res, next) {
        try {
            Continent.find({}, null, { sort: { 'createdAt': -1 } }).then((continents) => {
                return res.status(201).json({ continents: continents })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            Continent.findById(req.params.id).then((continents) => {
                return res.status(201).json({ continents: continents })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }
}

module.exports = ContinentController