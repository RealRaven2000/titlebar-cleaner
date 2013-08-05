/* BEGIN LICENSE BLOCK

for detail, please refer to license.txt in the root folder of this extension

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or (at your option) any later version.

If you use large portions of the code please attribute to the authors
(Axel Grude, Alexander Malfait)

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You can download a copy of the GNU General Public License at
http://www.gnu.org/licenses/gpl-3.0.txt or get a free printed
copy by writing to:
  Free Software Foundation, Inc.,
  51 Franklin Street, Fifth Floor,
  Boston, MA 02110-1301, USA.
END LICENSE BLOCK */


/*===============
  Project History
  ===============

  Personnel:
  AG - Lead Developer and owner of the Mozdev project
  MP - Marky Mark (German locale)

  22/11/2012 - 0.1.3
		AG - Released first tryout version 
		
  22/11/2012 - 0.2
		MP - German locale
		AG - Improved Icons
		
	14/12/2012 - 0.3
	  AG Reversed Switching logic (the button pushed in means a clean title bar)
		
	WIP - 0.4
	  AG - add button to toolbar automatically by Leszek Zyczkowski
		AG - French Locale by Gerard Durand
		AG - Firefox support (experimental) - note that this currently only works only when window is maximized.
		AG - improved about dialog
		
		
*/

var titlebarCleaner = {
	_version: "0.4.1",
  _pref: null,
  initialized: false,
  service: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	get Version() {
	  return this._version;
	},
  onLoad: function() {
    // initialization code
    this.initialized = true;
		
		// add button automatically
		//   code by Leszek Zyczkowski
		let firstRun = this.service.getBoolPref('extensions.titlebarCleaner.firstRun');
		if (firstRun) {
			let toolbar = document.getElementById(this.ToolbarName);
			if (!toolbar.currentSet.match('titlebarCleaner_Button')) {
					var newset = toolbar.currentSet.concat(',titlebarCleaner_Button');
					toolbar.currentSet = newset;
					toolbar.setAttribute('currentset', newset);
					document.persist(toolbar.id, "currentset");
			}
			this.service.setBoolPref('extensions.titlebarCleaner.firstRun', false);
		}		
		
    this.strings = document.getElementById("titlebarCleaner-strings");
		let button = document.getElementById('titlebarCleaner_Button');
		if (button) {
			let isTitleBar = this.service.getBoolPref(this.TabInTitleBoolPref);
			button.checked = !isTitleBar;
		}
  },
	
	get Application() {
		if (null == this.mAppName) {
			var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
											.getService(Components.interfaces.nsIXULAppInfo);
			const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
			const THUNDERBIRD_ID = "{3550f703-e582-4d05-9a08-453d09bdfdc6}";
			const SEAMONKEY_ID = "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}";
			const POSTBOX_ID = "postbox@postbox-inc.com";
			switch(appInfo.ID) {
				case FIREFOX_ID:
					return this.mAppName='Firefox';
				case THUNDERBIRD_ID:
					return this.mAppName='Thunderbird';
				case SEAMONKEY_ID:
					return this.mAppName='SeaMonkey';
				case POSTBOX_ID:
					return this.mAppName='Postbox';
				default:
					this.mAppName=appInfo.name;
					this.logDebug ( 'Unknown Application: ' + appInfo.name);
					return appInfo.name;
			}
		}
		return this.mAppName;
	},	
	
	get ToolbarName() {
		switch (this.Application) {
			case 'Thunderbird':
				return 'mail-bar3';
			case 'Firefox':
				return 'nav-bar';
			case 'Postbox': // not supported yet
				return 'mail-bar7';
			case 'SeaMonkey': // not supported yet
				return 'nav-bar';
		}
	},
	
	get TabInTitleBoolPref() {
		if (this._pref)
			return this._pref;
		switch (this.Application) {
			case 'Thunderbird':
				this._pref = 'mail.tabs.drawInTitlebar';
				break;
			case 'Firefox':
				this._pref = 'browser.tabs.drawInTitlebar';
				break;
			case 'Postbox': // not supported yet
				this._pref = 'mail.tabs.drawInTitlebar';
				break;
			case 'SeaMonkey': // not supported yet
				this._pref = 'mail.tabs.drawInTitlebar';
				break;
		}
		return this._pref;
	},

  onMenuItemCommand: function(e) {
	/*
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
																	
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));
																*/
		let button = document.getElementById('titlebarCleaner_Button');
		let thePref = this.TabInTitleBoolPref;
		if (button) {
		
			let isTitleBar = this.service.getBoolPref(thePref);
			isTitleBar = !isTitleBar;
			this.service.setBoolPref(thePref, isTitleBar);
			button.checked = !isTitleBar;
		}
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    titlebarCleaner.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () { titlebarCleaner.onLoad(); }, false);

/*
titlebarCleaner.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e) {
    titlebarCleaner.showFirefoxContextMenu(e);
  }, false);
};

titlebarCleaner.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-titlebarCleaner").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { titlebarCleaner.onFirefoxLoad(); }, false);
*/