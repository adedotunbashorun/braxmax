const local = require('./local')
const production = require('./production')
const development = require('./development')

let config = {};

if (process.env.NODE_ENV == 'production') {
    config = production;
} else if (process.env.NODE_ENV == 'development') {
    config = development;
}else{
    config = local;
}
config.settings = {
    mail:{

    },
    system: {

    }
}

module.exports = config