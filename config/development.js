module.exports = development ={
    app:{
        port: process.env.PORT || 5000
    },
    db: {
        url: 'mongodb://localhost:27017/mymappapi',
        host: process.env.Dev_DBHost || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'mymappapi'
    }
}