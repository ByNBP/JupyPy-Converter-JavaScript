document.addEventListener('DOMContentLoaded', function() {
    var convertCodeButton = document.getElementById('convertCode');



    convertCodeButton.addEventListener('click', function() {
          
        //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
        chrome.tabs.executeScript({
            file: "test.js" //argument here is a string but function.toString() returns function's code
        }, (results) => {
        });
    }, false);
  }, false);