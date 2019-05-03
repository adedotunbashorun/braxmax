'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const MapSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User' },
    continent_id: { type: Schema.ObjectId, ref: 'Continent' },
    country_id: { type: Schema.ObjectId, ref: 'Country' },
    name: { type: String, required: true, index: { unique: true, dropDups: true }},
    description: { type: String },
    image:{type: String},
    html_file: { type: String },
    js_file: { type: String },
    zip_file: { type: String },
}, { timestamps: true })

MapSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Map', MapSchema)