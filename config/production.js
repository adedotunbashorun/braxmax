module.exports = production = {
    app: {
        port: process.env.PORT || 5000
    },
    db: {
        url: (process.env.MONGODB_URI) ? process.env.MONGODB_URI : 'mongodb://heroku_gxrddznw:9qariqjloov1pq9k5er3kr8hrk@ds153766.mlab.com:53766/heroku_gxrddznw',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_DATABASE || 'mymappapi'        
    },
    env: 'production'
}