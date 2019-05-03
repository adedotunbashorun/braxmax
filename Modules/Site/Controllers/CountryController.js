'use strict'
const Country = require('../Models/Country')

class CountryController {
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