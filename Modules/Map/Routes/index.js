'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('functions/auth')
const MapController = require('Modules/Map/Controllers/MapController')
const CustomMapController = require('Modules/Map/Controllers/CustomMapController')

router.post('/map/create', [Guard.isValidUser], (req,res,next) =>{
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


router.post('/custom_map/create', [Guard.isValidUser], (req,res,next) =>{
    CustomMapController.create(req,res,next)
})

router.patch('/custom_map/update/:id', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.update(req, res, next)
})

router.get('/custom_maps', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.getAll(req, res, next)
})

router.get('/custom_maps/country/:country_id', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.getAllByCountry(req, res, next)
})

router.get('/custom_maps/continent/:continent_id', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.getAllByContinent(req, res, next)
})

router.get('/custom_map/:id', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.getOne(req, res, next)
})

router.delete('/custom_map/:id', [Guard.isValidUser], (req, res, next) => {
    CustomMapController.delete(req, res, next)
})

module.exports = router