'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const CustomMapSchema = new Schema({
    continent_id: { type: Schema.ObjectId, ref: 'Continent' },
    country_id: { type: Schema.ObjectId, ref: 'Country' },
    full_name: { type: String, required: true },
    description: { type: String },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
}, { timestamps: true })

CustomMapSchema.plugin(uniqueValidator)
module.exports = mongoose.model('CustomMap', CustomMapSchema)