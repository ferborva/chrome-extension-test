// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action. Makes the body background red. Simple but fun example
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // No tabs or host permissions needed!
//   console.log('Turning ' + tab.url + ' red!');
//   chrome.tabs.executeScript({
//     code: 'document.body.style.backgroundColor="red"'
//   });
// });
// 
console.log('Background.js into action!');

var sourceIdTemp = '';
// Comunication action launched from the background to the content-script!!!!!
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function(response) {
            console.log(response.farewell);
        });
    });
});



// This block of code opens the Picker UI to select a media source with desktopCapture
// chrome.desktopCapture.chooseDesktopMedia(['screen', 'window'], function(streamId) {
// 	console.log(streamId);
// })


// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//   	console.log('message received');
//   	console.log(request);
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({farewell: "goodbye"});
//   });


// This instruction can be sent from the web page to the background.js file 
// 
// chrome.runtime.sendMessage('iplnnmkiacihpmoaccbjeaacmefjkjni', {greeting: 'hello'}, function(resp){console.log('response'); console.log(resp)});
// 
// and a similar channel to that created with the content-script will be made.



// Lets create a simple example to retrieve a call from the web page requesting a sourceId for a webRTC Retransmission of your screen

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
  	console.log('message received');
  	console.log(request);
  	if (request.screens) {
	    chrome.desktopCapture.chooseDesktopMedia(['window', 'screen'], function(streamId) {
			console.log(streamId);
			sourceIdTemp = streamId;
			// Send the message to the content-script with the source-id
			chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		        chrome.tabs.sendMessage(tabs[0].id, { sourceId: streamId }, function(response) {
		            console.log(response);
		        });
		    });
		});
  	} else if (request.sourceId) {
  		sendResponse({sourceId: sourceIdTemp});
  	}
  });


// This is the instruccion send from the browser to ask to the source id
// 
// chrome.runtime.sendMessage('iplnnmkiacihpmoaccbjeaacmefjkjni', {screens: true}, function(resp){console.log('SourceID data requested')});