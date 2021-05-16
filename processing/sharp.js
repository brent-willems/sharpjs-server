// SHARPJS Image Processing

// TODO: Remove the redundant file operations
//  (atm there because of clash between persistence and buffered return values)

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const fm = require('../util/fileManagement')



// CreateTempfile
//  Creates a temporary file to write output to from sharp
function createTempFile(){
    let randomFile = fm.getTempPath() + "temp-" + Math.round(Math.random() * 10000) + ".png"

    fs.writeFileSync(randomFile, "")
    return randomFile
}
// RemoveTempFile
//  removes file after usage
async function removeTempFile(filePath){
    return fs.rm(filePath, ()=>{})
}

// based on: https://malcoded.com/posts/nodejs-image-resize-express-sharp/
exports.resize = async function(width, height) {
    let workingFile = fm.getWorkingFile()
    let tempFile = createTempFile()     // Create temporary file

    // Persistence operations for active file (to temp file first)
    await sharp(workingFile)
        .resize(width, height)
        //.png()
        .toFile(tempFile)

    // Actual file operation
    let bfr = await sharp(workingFile)
        .resize(width,height)
        .toBuffer()

    // Copy to activeFile and remove tempfile
    fs.copyFileSync(tempFile, workingFile)
    await removeTempFile(tempFile)

    return bfr
}

exports.transparency = async function(transparencyPercentage) {
    // Get Alpha value
    let transparencyVal = transparencyPercentage / 100;

    // Persistence
    let workingFile = fm.getWorkingFile()
    let tempFile = createTempFile()     // Create temporary file

    //console.log("workingfile IS: " + workingFile)

    await sharp(workingFile)
        .ensureAlpha(transparencyVal)
        .toFile(tempFile)

    // Actual file operation
    let bfr = await sharp(workingFile)
        .ensureAlpha(transparencyVal)
        .toBuffer()

    // Cleanup
    fs.copyFileSync(tempFile, workingFile)
    await removeTempFile(tempFile)

    return bfr
}

