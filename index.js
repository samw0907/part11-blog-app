require('dotenv').config()
const app = require('./app')

const config = require('./utils/config')

const logger = require('./utils/logger')

app.listen(process.env.PORT || 3003, '0.0.0.0', () => {
// eslint-disable-next-line no-console
  console.log(`Server running on port ${process.env.PORT || 3003}`)
})
