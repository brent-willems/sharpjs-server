const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


// Helper fucntion
// based on: https://malcoded.com/posts/nodejs-image-resize-express-sharp/
module.exports = async function resize(path, width, height) {
//     const readStream = fs.createReadStream(path)
//
//
//     let transform = sharp()
//
//     // if (format) {
//     //     transform = transform.toFormat(format, {})
//     // }
//
//     if (width || height) {
//         transform = transform.resize(width, height)
//     }
//
//     transform= transform.toBuffer()
//
//     return readStream.pipe(transform)

    return await sharp(path).resize(width, height).toBuffer()

}