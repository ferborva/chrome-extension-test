console.log('go bro!')

if (window) {
	console.log('window available')
	// This property will NOT BE AVAILABLE on the pages scope due to the isolated worlds paradigm imposed on the extensions system
	window.FBV = {
		txt: function(txt){
			console.log(txt);
		}
	}
}

var port = chrome.runtime.connect();

port.onMessage.addListener(function(message) {
	console.log('A message has been received through the runtime port from the webpage');
	console.log(message);
})

// Comunication channel with the background or another content-script in another tab
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log('message received from background');
  	console.log(request);
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello") {
      sendResponse({farewell: "goodbye"});
    } else {
    	sendResponse('SourceID sent correctly');
    	console.log('here we send the data to our beloved page');
    	if (navigator.mediaDevices.getUserMedia) {
    		console.log('Navigator Media Devices getUserMedia available');
    	}
    	var vid = document.createElement('video');
    	vid.autoplay = true;
    	console.log(document.getElementById('hidden-extension-interaction'));
    	document.getElementById('hidden-extension-interaction').click();
    }
  });




window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);