const mongoose = require('mongoose')
// const path = require('path')
// const coverImageBasePath = 'uploads/bookCover'

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
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
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
  // if(this.covername != null){
  //   return path.join('/', coverImageBasePath, this.covername)
  // }
  if(this.coverImage != null && this.coverImageType != null){
    return `data:${this.coverImageType};charset-utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Book', bookSchema)
// module.exports.coverImageBasePath = coverImageBasePath