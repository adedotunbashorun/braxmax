'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const ContinentSchema = new Schema({
    name: { type: String, required: true,index: { unique: true, dropDups: true } },
    description: { type: String, default: null },
    longtitude: { type: String , default: null},
    latitude: { type: String, default: null },
}, { timestamps: true })

ContinentSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Continent', ContinentSchema)