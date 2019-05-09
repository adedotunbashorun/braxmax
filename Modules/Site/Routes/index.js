'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../functions/auth')
const ExtraController = require('../Controllers/ExtraController')
const ContactController = require('../Controllers/ContactController')
const CountryController = require('../Controllers/CountryController')
const ContinentController = require('../Controllers/ContinentController')
const ActivityController = require('../Controllers/ActivityController')
const MailSettingsController = require('../Controllers/MailSettingsController')
const SystemSettingsController = require('../Controllers/SettingsController')
const ContinentSeeder = require('../Seeders/ContinentSeeder')


router.get('/country/all', (req, res, next) => {
    CountryController.getAll(req, res, next)
})

router.get('/country/:id', (req, res, next) => {
    CountryController.getOne(req, res, next)
})

router.get('/continent/all', (req, res, next) => {
    ContinentController.getAll(req, res, next)
})

router.get('/continent/:id', (req, res, next) => {
    ContinentController.getOne(req, res, next)
})

router.get('/continent/country/:continent_id', (req, res, next) => {
    ContinentController.getAllCountry(req, res, next)
})

router.post('/system/create', (req, res, next) => {
    SystemSettingsController.create(req, res, next)
})

router.get('/system/all', (req, res, next) => {
    SystemSettingsController.getAll(req, res, next)
})

router.post('/mail/create', (req, res, next) => {
    MailSettingsController.create(req, res, next)
})

router.get('/mail/all', (req, res, next) => {
    MailSettingsController.getAll(req, res, next)
})

router.get('/activities', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getAll(req, res, next)
})

router.get('/my_activities/:user_id', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getuserAll(req, res, next)
})

router.get('/my_recent_activities/:user_id', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getuserLastFive(req, res, next)
})

router.post('/contact/create', (req, res, next) => {
    ContactController.create(req, res, next)
})

router.get('/contact/all', (req, res, next) => {
    ContactController.getAll(req, res, next)
})

router.get('/counts/:user_id', [Guard.isValidUser], (req, res, next) => {
    ExtraController.countUserDoc(req, res, next)
})

router.get('/counts', [Guard.isValidUser], (req, res, next) => {
    ExtraController.countAllDoc(req, res, next)
})

router.post('/email_alert', (req, res, next) => {
    ExtraController.emailAlert(req, res, next)
})

router.get('/unsubscribe/:email', (req, res, next) => {
    ExtraController.deactivateAlertEmail(req, res, next)
})

router.get('/seed/continents', (req, res, next) => {
    ContinentSeeder.seedContinent(req, res, next)
})

module.exports = router