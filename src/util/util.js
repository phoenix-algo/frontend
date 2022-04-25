const util = {
    stringToByteArray,
    decodeBase64String,
}

function stringToByteArray(str) {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++)
        bytes[i] = str.charCodeAt(i);
    return Array.from(bytes);
}

function decodeBase64String(text) {
    if (text == "" || text == undefined || text == null)
        return "";

    return atob(text)
}

export default util;