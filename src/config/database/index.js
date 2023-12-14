const mongoose = require('mongoose')
const connectionStr =
  'mongodb+srv://funlish:cntt4701104@funlish.ixuxxok.mongodb.net/Math-Multiple-Choice-Testing-System?retryWrites=true&w=majority'

async function connect() {
  try {
    await mongoose.connect(connectionStr, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    console.log('Connect successfully!!!')
  } catch (error) {
    console.log(`Connect failure!!!\nError: ${error}`)
  }
}

module.exports = { connect }
