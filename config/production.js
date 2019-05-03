module.exports = production = {
    app: {
        port: process.env.PORT || 5000
    },
    db: {
        url: (process.env.MONGODB_URI) ? process.env.MONGODB_URI : '',
        host: process.env.Prod_DBHost || 'localhost',
        port: parseInt(process.env.Prod_DB_PORT) || 27017,
        name: process.env.Prod_DB_NAME || 'mymappapi'        
    }
}