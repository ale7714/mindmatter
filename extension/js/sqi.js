//sqi.js: provides functions that relate to interactions with remote repository

/**
 * @param {string} errMsg
 * @param {XMLHttpRequest} xhr
 * @throws XMLHttpRequest
 */
function connectionError(errMsg, xhr) {
    errMsg = `[${new Date()}] Mind Matter[sqi.js]: ERROR: ${errMsg}`;
    console.error(errMsg);
    alert(errMsg);
    throw xhr;
}

/**
 * updates question_index in chrome.storage.sync
 * @param {string} url 
 * @param {function} callback 
 */
function retrieveQI(url = 'https://jennydaman.github.io/mindmatter/subjects.json', callback) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.onload = function () {
        if (this.status != 200)
            connectionError(`Unexpected response code from server.\n${xhr.status}    ${xhr.statusText}`, this);
        chrome.storage.sync.set({ question_index: xhr.response }, callback);
    };
    xhr.onerror = function () {
        connectionError('XMLHttpRequest.onerror: I have no idea why.', this);
    };
    xhr.send();
}
