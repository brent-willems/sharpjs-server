/* API Router
    deals with all server functionality like file uploading, processing requests etc
 */

// Imports
const express = require('express');
const router = express.Router();

const fs = require('fs')  // Server filesystem handling
const path = require('path')  // NodeJS Path handling
const multer = require('multer') // Handling file uploads
const sharpjs = require('../processing/sharp.js')  // Image processing

// Configurations
let upload = multer({dest: 'temp/'}) // Multer configuration


// Uploading the image
router.post('/upload', upload.single("image"),(req, res) => {

    // Extract Parameters
    const imgData = req.file  // using Multer library to get the file parameter
    const imgId = req.body.id // id is used as filename

    const uploadedImgPath = imgData.path  // full destination path on server can be retrieved using .path
    let newFullPath = uploadedImgPath + ".jpg"
    let renamedPath = "temp/" + imgId + ".jpg"

    // Add jpg extension
    fs.rename(uploadedImgPath, renamedPath, ()=>{})

    // DEV LOGS
    console.log("Image fileId: " + imgId)
    console.log("Image original path: " + uploadedImgPath)
    console.log("Image new Path: " + newFullPath)
    console.log("Image renamed Path: " + renamedPath)

    // Convert Blob to buffer
    // fs.writeFile(imgPath, imgData, {}, function (res){console.log("File written: " + res)})

    // res.setHeader('Content-Type', 'application/json')
    res.sendStatus(200)
})



router.get('/process', (req, res) =>{
    // Get parameters
    const imgId = req.query.id;
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    // check if file exists
    let filePath = "temp/" + imgId + ".jpg"
    console.log(filePath)
    let fileExists = fs.existsSync(filePath)
    if (fileExists){
         sharpjs(filePath,width, height)
            .then((result) => {
                res.setHeader("content-type", 'application/json')
                console.log(result)
                res.status(202).json({
                    b64data: result.toString('base64'),
                    contentType: result.contentType,
                    extension: ".jpg"
                })
            })
    }
})



module.exports = router;
