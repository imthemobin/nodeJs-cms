require('app-module-path').addPath(__dirname)
const App = require('app/index')

require('dotenv').config()
global.config = require('./config/index')

new App();