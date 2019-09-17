"use strict";

const MENU_ITEM_ID = 'save-python-file-menu-item';
const NOTIFICATION_ID = 'save-python-file-notification';
const EXTENSION_TITLE = 'Save python file';
var urlInFile;
var notifications = 1;
var title = "";

function modifyDOM() {
  var title = document.getElementById("notebook_name").textContent;
  var codes = document.getElementsByClassName(" CodeMirror-line ");
  var code = "";
  for(i=0;i<codes.length;i++){
      code += codes[i].textContent + "\n";
  }
  code += '/*/*/*' + title;
  return code.toString();
}



function saveTextToFile() {   // Ana Metod
  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')()',
    allFrames: true,
    matchAboutBlank: true
  }, function (results) {
    if (results[0]) {
      var content = results[0].split('/*/*/*');
      createFileContents(content[0], function(fileContents) {
        var blob = new Blob([fileContents], {
          type: 'text/plain'
        });
        var url = URL.createObjectURL(blob);
          startDownloadOfTextToFile(url,content[1]+'.py');
      });
    }
    return "sa";
  });
}

function createFileContents(selectionText, callback) {  //Dosyaya yazma metodu
  if (urlInFile) {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
      var url = tabs[0].url;
      var text = url + '\n\n' + selectionText;
      callback(text);
    });
  } else {
    callback(selectionText);
  }
}

function startDownloadOfTextToFile(url, fileName) {   //İndirme metodu
  var options = {
    filename: fileName,
    url: url,
    
  };
  options.saveAs = true;  // Konum seçme diyalog Boolean
  chrome.downloads.download(options, function(downloadId) {
    if (downloadId) {
      if (notifications) {
        notify('Save operation started');
      }
    } else {
      var error = chrome.runtime.lastError.toString();
      if (error.indexOf('Download canceled by the user') >= 0) {
        if (notifications) {
          notify('Save canceled.');
        }
      } else {
        notify('Error occured.');
      }
    }
  });
}

function notify(message) {     //Bildirim metodu
  chrome.notifications.clear(NOTIFICATION_ID, function() {
    chrome.notifications.create(NOTIFICATION_ID, {
      title: EXTENSION_TITLE,
      type: 'basic',
      message: message,
      iconUrl: chrome.runtime.getURL('icon.png')
    });
  });
}

chrome.commands.onCommand.addListener(function(command) { // Komutla çalıştırma
  if (command === 'save-python-file') {
    chrome.tabs.executeScript({
      code: '(' + modifyDOM + ')()',
      allFrames: true,
      matchAboutBlank: true
    }, function (results) {
      if (results[0]) {
          saveTextToFile({
            selectionText: results[0]
          });
      }
    });
  }
});


