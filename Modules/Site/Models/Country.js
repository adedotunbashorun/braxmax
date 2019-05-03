'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrytSchema = new Schema({
    name: { type: String, required: true },
    continent_id: { type: Schema.ObjectId, ref: 'Continent' },
    description: { type: String, default: null },
    lontitude: { type: String , default: null},
    latitude: { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Country', CountrytSchema)