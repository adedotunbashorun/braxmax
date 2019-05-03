module.exports = local = {
    app: {
        port: process.env.PORT || 5000
    },
    db: {
        url: 'mongodb://localhost:27017/mymappapi',
        host: process.env.Local_DBHost || 'localhost',
        port: parseInt(process.env.Local_DB_PORT) || 27017,
        name: process.env.Local_DB_NAME || 'mymappapi'
    }
}