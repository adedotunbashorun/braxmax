'use strict'

const Continent = require('../Models/Continent')
const ContinentSeeder = {}

ContinentSeeder.seedContinent = (req, res) => {
    try{
        //deleting all db data
        Continent.remove({ _id: { $ne: null } }).then(() => {

        }).catch(error => {
            return res.status(422).json({ error: error })
        })
        // create some events
        const continents = [
            { name: 'Africa' },
            { name: 'Europe' },
            { name: 'Asia' },
            { name: 'Australia' },
            { name: 'South America' },
            { name: 'North America' },
            { name: 'Antarctica'}
        ]

        // use the Continent model to insert/save
        continents.forEach(cont => {
            var newp = new Continent(cont)
            newp.save()
        })

        // seeded!
        return res.status(201).json({ msg: 'Continent Seeded' })
    } catch (err) {
        return res.status(422).json({ error: err, msg: err.message })
    }
}
module.exports = ContinentSeeder