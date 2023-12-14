const homeRouter = require('./home')
const settingsRouter = require('./settings')

const route = (app) => {
  app.use('/', homeRouter),
  app.use('/', settingsRouter)
}

module.exports = route
