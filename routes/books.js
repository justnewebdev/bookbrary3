const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')

const Author = require('../models/author')
const Book = require('../models/book')

// const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMimeTypes = ['image/jpg', 'image/png', 'image/gif']

// const upload = multer({
//   dest: uploadPath,
//   filter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// })

router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

router.get('/', async (req, res) => {
  let query = Book.find()

  if(req.query.title != null && req.query.title != ''){
    query.regex('title', new RegExp(req.query.title, 'i'))
  }

  if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
    query.lte('publishDate', req.query.publishedBefore)
  }

  if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
    query.gte('publishDate', req.query.publishedAfter)
  }


  try{
    const books = await query.exec()
    res.render('books/index', {
      books,
      searchOptions: req.query
    })
  }catch{
    res.redirect('/')
  }
})

router.post('/', async (req, res) => {
  const filename = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    publishDate: req.body.publishDate,
    pageCount: req.body.pageCount,
    description: req.body.description,
    author: req.body.author,
  })


  try{
    saveCover(book, req.body.cover)
    const newBook = await book.save()
    res.redirect('/books')
  }catch(err){
    console.log(err)
    // if(book.covername != null){
    //   // removeBookCover(book.covername)
    // }
    renderNewPage(res, book, true)
  }
})

async function renderNewPage(res, book, hasError = false){
  try{
    const authors = await Author.find({})
    const params = {
      authors,
      book,
    }
    if(hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  }catch{
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded){
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

// function removeBookCover(book){
//   fs.unlink(path.join(uploadPath, book), err => {
//     console.log('Error Deleting book')
//   })
// }

module.exports = router
