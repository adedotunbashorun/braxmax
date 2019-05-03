'use strict'

const Continent = require('../Models/Continent')
const Country = require('../Models/Country')

class ContinentController{

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