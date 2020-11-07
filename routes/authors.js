const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('authors/index')
})

// router.use((req, res, next) => {
//   console.log(req.url, req.method)
//   next()
// })


module.exports = router
