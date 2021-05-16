/* API Router
    deals with all server functionality like file uploading, processing requests etc
 */

// Imports
const express = require('express');
const router = express.Router();

const fs = require('fs')  // Server filesystem handling
const path = require('path')  // NodeJS Path handling
const multer = require('multer') // Handling file uploads

const imgProcessing = require('../processing/sharp.js')  // Image processing
const fm = require('../util/fileManagement.js') // Active File management

// Configurations
let upload = multer({dest: 'temp/'}) // Multer configuration


// API ROUTES
// Uploading the image
router.post('/upload', upload.single("image"), (req, res) => {

    // Extract Parameters
    const imgData = req.file  // using Multer library to get the file parameter
    const imgId = req.body.id // id is used as filename

    const uploadedImgPath = imgData.path  // full destination path on server can be retrieved using .path
   // let newFullPath = uploadedImgPath + ".jpg"
    let renamedPath = "temp/" + imgId + ".jpg" // Only accepts .jpg atm, send as binary encoded blob

    // Add jpg extension
    fs.rename(uploadedImgPath, renamedPath, ()=>{
         fm.createWorkingFile(renamedPath).then(()=>{})
    })

    // Send OK status
    res.sendStatus(200)
})


// Resize image operation
router.get('/process/resize', (req, res) =>{

    // Get parameters
    const imgId = req.query.id;  // DEPRECATED (WOKRING WITH ACTIVE FILE NOW
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    // check if file exists
    let fileReady = fm.isReady()
    if (fileReady){
         imgProcessing.resize(width, height)
            .then((result) => {
                res.setHeader("content-type", 'application/json')
                res.status(202).json({
                    b64data: result.toString('base64'),
                    contentType: "image/png"
                })
            })
    } else {
        return res.sendStatus(503) // Server not ready
    }

})


// Transparency operation
router.get('/process/alpha', (req, res) =>{
    // Get parameters
    const imgId = req.query.id;  // DEPRECATED
    const transparencyPct = req.query.alpha

    let fileReady = fm.isReady()

    if (fileReady){
        imgProcessing.transparency(transparencyPct)
            .then((result) => {
                res.setHeader("content-type", 'application/json')
                res.status(202).json({
                    b64data: result.toString('base64'),
                    contentType: "image/png",
                })
            })
    } else {
        return res.sendStatus(503) // Server not ready
    }
})

//


module.exports = router;
