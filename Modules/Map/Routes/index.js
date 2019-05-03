'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../functions/auth')
const MapController = require('../Controllers/MapController')

router.post('/map/create', [Guard.isValidUser],(req,res,next) =>{
    MapController.create(req,res,next)
})

router.patch('/map/update/:id', [Guard.isValidUser], (req, res, next) => {
    MapController.update(req, res, next)
})

router.get('/maps', [Guard.isValidUser], (req, res, next) => {
    MapController.getAll(req, res, next)
})

router.get('/maps/country/:country_id', [Guard.isValidUser], (req, res, next) => {
    MapController.getAllByCountry(req, res, next)
})

router.get('/maps/continent/:continent_id', [Guard.isValidUser], (req, res, next) => {
    MapController.getAllByContinent(req, res, next)
})

router.get('/map/:id', [Guard.isValidUser], (req, res, next) => {
    MapController.getOne(req, res, next)
})

router.delete('/map/:id', [Guard.isValidUser], (req, res, next) => {
    MapController.delete(req, res, next)
})

module.exports = router