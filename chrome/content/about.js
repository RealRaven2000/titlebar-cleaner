"use strict";

titlebarCleaner.about = {
  load: function() {
	  window.sizeToContent();
		// insert version number
		let theLabel = document.getElementById('versionNumber');
		if (theLabel) {
		  let ver = theLabel.getAttribute('value').replace("{1}", titlebarCleaner.Version);
		  theLabel.setAttribute('value', ver);
		}
		
	}
}