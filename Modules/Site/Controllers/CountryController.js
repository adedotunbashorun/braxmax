'use strict'
const Country = require('../Models/Country')
const Activity = require('../../../functions/activity')

class CountryController {

    static create(req, res,next) {
        try {
            if (!req.body.name) {
                return res.status(422).json({ 'error': 'Please provide country name' })
            }
            if (!req.body.continent_id) {
                return res.status(422).json({ 'error': 'Please provide continent_id' })
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
            const country = new Country(req.body)
            country.save(function(error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else {
                    Activity.activity_log(req, null, req.user + ' Added country')
                    return res.status(201).json({ msg: 'country Successfully received.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        try {
            Country.findById(req.params.id, function (error, country) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    country.name = (req.body.name) ? req.body.name : continent.name
                    country.continent_id = (req.body.continent_id) ? req.body.continent_id : continent.continent_id
                    country.latitude = (req.body.latitude) ? req.body.latitude : country.latitude
                    country.longtitude = (req.body.longtitude) ? req.body.longtitude : country.longtitude
                    country.description = (req.body.description) ? req.body.description : country.description
                    country.save(function (error) {
                        if (error) {
                            Activity.activity_log(req, req.user, 'Error Updating country!')
                            return res.status(501).json({ error: error, msg: error.message })
                        } else {
                            Activity.activity_log(req, req.user, 'country Updated Successfully')
                            return res.status(201).json({
                                'country': country,
                                'msg': country.name +
                                    ' country Updated Successfully!'
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
            Country.find({}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').then((countries) => {
                return res.status(201).json({ countries: countries })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            Country.findById(req.params.id).populate('continent_id').then((country) => {
                return res.status(201).json({ country: country })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

}

module.exports = CountryController