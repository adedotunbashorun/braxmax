'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const CountrytSchema = new Schema({
    name: { type: String, required: true,index: { unique: true, dropDups: true } },
    continent_id: { type: Schema.ObjectId, ref: 'Continent' },
    description: { type: String, default: null },
    longtitude: { type: String , default: null},
    latitude: { type: String, default: null },
}, { timestamps: true })

CountrytSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Country', CountrytSchema)