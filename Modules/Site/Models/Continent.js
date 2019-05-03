'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContinentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: null },
    lontitude: { type: String , default: null},
    latitude: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Continent', ContinentSchema)