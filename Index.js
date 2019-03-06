

document.addEventListener('DOMContentLoaded' , function(){
	chrome.tabs.executeScript(null, {
		file: 'jquery.min.js'
	});
	chrome.tabs.executeScript(null, {
		file: 'content.js'
	});
	chrome.tabs.insertCSS(null, {
		file: 'index.css'
	});
});