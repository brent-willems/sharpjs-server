// Code to map a LoremPicsum full URL to its unique ID
//  format of LormemPicsum response URL: https://i.picsum.photos/id/ ID / WIDTH / HEIGHT .jpg ?OTHER_DATA
module.exports = function toId(fullUrl) {
    let baseUrl = "https://i.picsum.photos/id/" // Base loremPicsum ID url
    return fullUrl.substr(baseUrl.length).split("/")[0]  // Remove the baseUrl, then split the url and get the first part, namely the unique LoremPicsum ID
}


