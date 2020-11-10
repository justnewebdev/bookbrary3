const express = require('express')
const router = express.Router()

const Author = require('../models/author')
const Book = require('../models/book')

router.get('/new', (req, res) => {
  res.render('authors/new', {author: new Author()})
})

router.get('/:id', async (req, res) => {
  try{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({author: author.id}).limit(10).exec()
    res.render('authors/show', {
      author,
      booksByAuthor: books
    })
  }catch{
    res.redirect('/authors')
  }
})

router.get('/:id/edit', async (req, res) => {
  try{
    const author = await Author.findById( req.params.id)
    res.render('authors/edit', {author})
  }catch(err){
    console.log(err)
    res.redirect('/authors')
  }
})


router.get('/', async (req, res) => {
  let searchOptions = {}

  if(req.query.name != null && req.query.name != ''){
    searchOptions.name = new RegExp(req.query.name, 'i')
  }

  try{
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors,
      searchOptions: req.query
    })
  }catch{
    res.redirect('/')
  }
})

router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })

  try{
    const newAuthor = await author.save()
    // res.redirect(`/authors/${author.id}`)
    res.redirect('/authors')
  }catch{
    res.render('authors/new', {
      author,
      errorMessage: 'Error Creating Author'
    })
  }

})

router.put('/:id', async (req, res) => {
  let author
  try{
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  }catch{
    if(author == null){
      res.redirect('/')
    }else{
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let author
  try{
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect(`/authors/`)
  }catch{
    if(author == null){
      res.redirect('/')
    }else{
      res.render('authors/show', {
        author,
        errorMessage: 'Cannot delete the author, cause it still has books'
      })
    }
  }

})


// router.use((req, res, next) => {
//   console.log(req.url, req.method)
//   next()
// })


module.exports = router
