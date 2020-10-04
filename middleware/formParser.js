const formidable = require('formidable')

module.exports = (req, res, next) => {
  const form = formidable.IncomingForm()
  form.parse(req, (error, fields, files) => {
    if (error) {
      console.log(error)
    }
    console.log("fields", fields)
    req.body = fields
    next()
  })
}