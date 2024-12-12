require('dotenv').config()
const app = require('./app')
// eslint-disable-next-line no-unused-vars
const config = require('./utils/config')
// eslint-disable-next-line no-unused-vars
const logger = require('./utils/logger')

app.listen(process.env.PORT || 3003, '0.0.0.0', () => {
// eslint-disable-next-line no-console
  console.log(`Server running on port ${process.env.PORT || 3003}`)
})
