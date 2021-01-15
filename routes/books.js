const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')

const Author = require('../models/author')
const Book = require('../models/book')

// const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// const upload = multer({
//   dest: uploadPath,
//   filter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// })

router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

router.get('/:id', async (req, res) => {
  try{
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', {
      book
    })
  }catch{
    res.redirect('/books')
  }
})

router.get('/:id/edit', async (req, res) => {
  try{
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  }catch{
    res.redirect('/')
  }
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

	console.log(query)

  try{
    const books = await query.sort({createdAt: 'desc'}).populate('author').exec()
    res.render('books/index', {
      books,
      searchOptions: req.query
    })
  }catch{
    res.redirect('/')
  }
})

router.post('/', async (req, res) => {
  // const filename = req.file != null ? req.file.filename : null
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
    res.redirect(`/books/${newBook.id}`)
  }catch(err){
    console.log(err)
    // if(book.covername != null){
    //   // removeBookCover(book.covername)
    // }
    renderNewPage(res, book, true)
  }
})

router.put('/:id', async (req, res) => {
  let book
  try{
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover != null && req.body.cover != ''){
      saveCover(book, req.body.cover)
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  }catch{
    if(book == null){
      res.redirect('/books')
    }else{
      renderEditPage(res, book, true)
    }
  }
})

router.delete('/:id', async (req, res) => {
  let book
  try{
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect(`/books/`)
  }catch{
    if(book == null){
      res.redirect('/books')
    }else{
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    }
  }

})

async function renderFormPage(res, book, form, hasError = false){
  try{
    const authors = await Author.find({})
    const params = {
      authors,
      book,
    }
    if(hasError && form == 'edit'){
      params.errorMessage = 'Error Updating Book'
    }else if(hasError && form == 'new'){
      params.errorMessage = 'Error Creating Book'
    }
    res.render(`books/${form}`, params)
  }catch{
    res.redirect('/books')
  }
}

async function renderNewPage(res, book, hasError = false){
  renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false){
  renderFormPage(res, book, 'edit', hasError)
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
