// Image Storage Management
//  Keeps track of the uploaded files and their

// Imports
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

const tempPath =  path.resolve(__dirname, "/../temp/") + "/"
const prependedTempPath = ".." + tempPath
const tempPathAbsolute =  path.join(__dirname, "/../temp/")

// State veriables
let originalFileId = null // Contains ID of original file
let originalFile = null  // Contains absolute path to original file
let activeFile = null;  // Contains absolute path to the active working file
let activeReady = false;  // Boolean stating whether file is ready for use


// FILE UTILITIES
// ConvertFromBlob
//  ==> Renames Multer uploaded file to new image id and adds extension to raw image file
exports.convertFromBlob = function(rawImagePath, id, extension = ".jpg"){
    let newPath = tempPath + id + extension
    fs.renameSync(rawImagePath, newPath)
    return newPath
}

exports.getRelativeImagePath = function(imgId){
    return ".." + tempPath + imgId
}


// ACTIVE FILE MANAGEMENT
// Private functions

/// Sets a certain file as active
function setActive(id, origFile, actFile){
    originalFileId = id
    originalFile =  origFile
    activeFile = actFile
    activeReady = true;
}

/// Removes the active file from disk if there is any
function removeActive(){
    activeReady = false;
    if (activeFile){
        // Remove files
        fs.rmSync(activeFile)
        fs.rmSync(originalFile)
        // Reset variables
        activeFile = null
        originalFile = null;
        originalFileId = null;
    }
}


// INTERFACE FUNCTIONS

exports.getTempPath = function(){
    return tempPathAbsolute
}
// isReady
//  Checks whether working file is ready to use or not
exports.isReady = function (){
    return activeReady
}


// createWorkingFile
//  Updates the current active file, and returns the full id
exports.createWorkingFile = async function(imgPath) {
    // Remove Active file if it exists
    removeActive()

    // Image Path operations
    let prepImgPath = "../" + imgPath  // Prepended relative path (since filemanagement.js is in subfolder)
    let absoluteImgPath = path.join(tempPathAbsolute, prepImgPath)    // get absolute path of input image
    let imageFile = path.relative(prependedTempPath, prepImgPath)     // extract the filename
    let imageId = imageFile.split(".")[0]                   // extract the id (without extension)

    // Active file name and path
    let actFile = imageId + "active.png"
    let actDestination = tempPathAbsolute + actFile

    // DEV LOGS
    // console.log("ImgPath is:  " + imgPath)
    // console.log("AbsImgPath is:  " + absoluteImgPath)
    // console.log("prep: " + prepImgPath)
    // console.log("actfile: " + actFile)
    // console.log("Destination path: "  + actDestination)

    //Create png formatted working file
    sharp(absoluteImgPath)
        .png()
        .toFile(actDestination)
        .then((info) => {
            setActive(imageId, imgPath, actDestination)
            return activeFile // returns the full path (for usage in api)
        })
}


// resetWorkingFile
//  Resets the current (edited) active file to the original file
exports.resetWorkingFile = async function(){
    activeReady = false            // set to not active during re-creation file
    const activeDest = activeFile  // Save active file full path

    // Delete current active file
    fs.rmSync(activeFile)

    // Get the original file, and convert to .png formatted working file again
    await sharp(originalFile)
        .png()
        .toFile(activeDest)
        .then(()=>{
            activeReady = true
        })
}

// Returns path to the current active file if ready, otherwise returns null
exports.getWorkingFile = function() {
    if (activeReady) {
        return activeFile
    } else {
        return null
    }
}