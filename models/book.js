const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCover'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  pageCount: {
    type: Number,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  covername: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
})

bookSchema.virtual('coverImagePath').get(function(){
  if(this.covername != null){
    return path.join('/', coverImageBasePath, this.covername)
  }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath
