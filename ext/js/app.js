//This content script is injected into every page.
chrome.storage.local.get(["cooldown_date", "pause"], function (items) {

    if (items.cooldown_date || items.pause)
        return;

    chrome.storage.sync.get("blacklist_array", function (items) {

        for (let i = 0; i < items.blacklist_array.length; i++) { //TODO better way of checking
            if (location.href.includes(items.blacklist_array[i])) {
                showQuestion();
                return;
            }
        }
    });
});

function showQuestion() {

    //TODO: catch 404 errors by refreshing database
    chrome.storage.sync.get("database", function (items) {

        //add all questions to one big array
        let allQuestions = [];
        items.database.subjects.forEach(subjectInfo => {
            subjectInfo.questions.forEach(question => {
                allQuestions.push(question);
            });
        });

        let qpath = allQuestions[Math.random() * allQuestions.length | 0].qpath;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", qpath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == xhr.DONE) {

                let user_response = "";

                let retrieved = JSON.parse(xhr.response);
                retrieved.answer = retrieved.answer.toLowerCase();
                //TODO match user responses using regular expressions
                while (!user_response.toLowerCase().includes(retrieved.answer)) {
                    if (user_response != "")
                        alert("Wrong, please try again.");
                    user_response = prompt("MindMatter"
                        + "\n" + retrieved.question);
                    if (user_response == null)
                        user_response = "";
                }

                chrome.storage.local.set({ "cooldown_date": [new Date()] });
                /*
                 * background.js will listen for changes to storage. 
                 * When cooldown_duration is changed, a timeout will be set to remove the lock.
                 */
            }
        }
        xhr.send();
    });
}
