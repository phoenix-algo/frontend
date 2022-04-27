const util = {
    stringToByteArray,
    decodeBase64String,
    formattedDate,
    formattedTime,
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

function formattedDate(time) {
    const dateObj = new Date(time);
    
    const month = dateObj.getUTCMonth() + 1 < 10 ? "0" + (dateObj.getUTCMonth() + 1) : dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate() < 10 ? "0" + dateObj.getUTCDate() : dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear() < 10 ? "0" + dateObj.getUTCFullYear() : dateObj.getUTCFullYear();

    return day + "/" + month + "/" + year;
}

function formattedTime(time) {
    const date = new Date(time);
    
    const hour = date.getHours() < 10 ? "0" +  date.getHours() : date.getHours();
    const min  = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return hour + ":" + min;
}

export default util;