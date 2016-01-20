window.Namespace = {};

Namespace.Info = function ()
{
    this.startTime = new Date().getTime();
    this.activeTime = 0;
    this.rank = 0;
    this.numberOfAccess = 1;
};
 
Namespace.Info.prototype.GetElapsedTime = function(endTime)
{
    return (endTime - this.startTime) / 1000; 
};
   
Namespace.Info.prototype.AddActiveTime = function(activeTime)
{
    this.activeTime += activeTime / 1000;
};

Namespace.Info.prototype.Eval = function(endTime)
{
    this.rank = 0.5 * this.numberOfAccess + 0.5 * this.activeTime + (-0.01) * this.GetElapsedTime(endTime);
    return this.rank;
};
    
Namespace.Info.prototype.GetInfo = function()
{
    return this.startTime + ' ' + this.activeTime;
};

/////////////////////////////
currentTab = null;
AddTabBeside = {
	tabColors: ['rgb(147, 174, 229)','rgb(255, 218, 117)','rgb(188, 204, 157)','rgb(239, 157, 159)','rgb(186, 167, 225)','rgb(155, 191, 180)','rgb(247, 180, 130)','rgb(216, 171, 192)','rgb(147, 229, 174)','rgb(255, 117, 218)','rgb(188, 157, 204)','rgb(239, 159, 157)','rgb(186, 225, 167)','rgb(155, 180, 191)','rgb(247, 130, 180)','rgb(216, 192, 171)','rgb(174, 147, 229)','rgb(218, 255, 117)','rgb(204, 188, 157)','rgb(157, 239, 159)','rgb(167, 186, 225)','rgb(191, 155, 180)','rgb(180, 247, 130)','rgb(171, 216, 192)','rgb(229, 174, 147)','rgb(117, 218, 255)','rgb(157, 204, 188)','rgb(159, 157, 239)','rgb(225, 167, 186)','rgb(180, 191, 155)','rgb(130, 180, 247)','rgb(192, 171, 216)'],
	clrSession:window.navigator.userAgent.toLowerCase().indexOf('seamonkey')>=0?Components.classes["@mozilla.org/suite/sessionstore;1"].getService(Components.interfaces.nsISessionStore):Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore),
	txtreverse:null,//reversing of the tabs' text-color
	fadedeg:null,//variable 'fadedeg' tracks fade degree starting 0 to 9 translates to mozopacity 0 to 1 **some explaination mising**.
	clr:0,//tracks the tab color when using fixed pallette
	ctdebug:0,//enable message dump  to console?1:0
	
    PreviousIndex: 0,
    TabData : new Array(),
    startActive: new Date().getTime(),
	startSelect: new Date().getTime(),
	startTime: 0,
    endActive: 0,
    tabMoveFlag: true,
    tabSelectFlag: true,
    afterTabOpenFlag: false,
 onLoad: function() {
 
   var container = gBrowser.tabContainer;
   container.addEventListener("TabOpen", this.onTabOpen, false);

   container.addEventListener("TabMove", this.onTabMove, false);
    
   container.addEventListener("TabSelect", this.onTabSelect, false);

   container.addEventListener("TabClose", this.onTabClose, false);
   
   window.addEventListener("unload", this.onUnload, false);

    AddTabBeside.TabData[0] = new Namespace.Info();
//	AddTabBeside.standout=clrprefs.getBoolPref("extensions.clrtabs.standout");
//	AddTabBeside.fadedeg = clrprefs.getIntPref("extensions.clrtabs.fadedeg");
	

    
 },
 
 onUnload: function() {
   var container = gBrowser.tabContainer;
   container.removeEventListener("TabOpen", this.onTabOpen, false);
   container.removeEventListener("TabSelect", this.onTabSelect, false);
   container.removeEventListener("TabMove", this.onTabMove, false);
   container.removeEventListener("TabClose", this.onTabClose, false);

 }, 

 onTabMove: function (e) {
    var movedTab = e.target;
    
    if(AddTabBeside.tabMoveFlag && !AddTabBeside.afterTabOpenFlag)
    {
      var temp = AddTabBeside.TabData[AddTabBeside.PreviousIndex];
       var index = gBrowser.tabContainer.getIndexOfItem(movedTab);
       AddTabBeside.TabData[AddTabBeside.PreviousIndex] = AddTabBeside.TabData[index];
       AddTabBeside.TabData[index] = temp;
    //  alert(AddTabBeside.PreviousIndex + ' ' +  index);
      AddTabBeside.PreviousIndex = index;

    }
    AddTabBeside.afterTabOpenFlag = false;
 },

 onTabSelect: function (e) {
    if(AddTabBeside.tabSelectFlag)
    {
        AddTabBeside.endActive = new Date().getTime();
        AddTabBeside.TabData[AddTabBeside.PreviousIndex].AddActiveTime(AddTabBeside.endActive - AddTabBeside.startActive);

        AddTabBeside.PreviousIndex = gBrowser.tabContainer.selectedIndex;
        AddTabBeside.startActive = new Date().getTime();
	    AddTabBeside.startSelect = new Date().getTime();
	    AddTabBeside.startTime = AddTabBeside.TabData[AddTabBeside.PreviousIndex].activeTime;
	    AddTabBeside.TabData[AddTabBeside.PreviousIndex].numberOfAccess++;
    	
	    try
	    {
	    if(currentTab)
		    currentTab.updateProgress(currentTab.mLabel, 'tabprogressbar-progress',0);
	    }
	    catch(ex)
	    {
	    }
	    TabProgressBarService.initTab(e.originalTarget, e.currentTarget);
	    e.originalTarget.__tabprogressbar__progressListener.updateProgress(e.originalTarget.__tabprogressbar__progressListener.mLabel, 'tabprogressbar-progress',1);
    	currentTab = e.originalTarget.__tabprogressbar__progressListener;
    }
    AddTabBeside.tabSelectFlag = true;
 }, 
 
 onTabOpen: function (e) {
   var newTab = e.target;
   
    AddTabBeside.TabData.splice(AddTabBeside.PreviousIndex + 1, 0, new Namespace.Info());
    if (gBrowser.tabContainer.childNodes.length > 2)
    {
        AddTabBeside.tabMoveFlag = false;
        gBrowser.moveTabTo(newTab, AddTabBeside.PreviousIndex + 1);
        AddTabBeside.tabMoveFlag = true;

    }   
    AddTabBeside.afterTabOpenFlag = true;
    
	//AddTabBeside.startSelect = new Date().getTime();
	//AddTabBeside.startTime = AddTabBeside.TabData[AddTabBeside.PreviousIndex].activeTime;
   // try
	//{
	//if(currentTab)
	//	currentTab.updateProgress(currentTab.mLabel, 'tabprogressbar-progress',0);
	//}
	//catch(ex)
	//{
	//}
	//TabProgressBarService.initTab(e.originalTarget, e.currentTarget);
	//e.originalTarget.__tabprogressbar__progressListener.updateProgress(e.originalTarget.__tabprogressbar__progressListener.mLabel, 'tabprogressbar-progress',1);
	//currentTab = e.originalTarget.__tabprogressbar__progressListener;

 },
 
onTabClose: function (e) {
    var closedTab = e.target;
//    alert(gBrowser.tabContainer.getIndexOfItem(closedTab));
    var closedIndex = gBrowser.tabContainer.getIndexOfItem(closedTab);
    AddTabBeside.TabData.splice(closedIndex, 1);
    if(closedIndex == gBrowser.tabContainer.childNodes.length - 1)
        AddTabBeside.PreviousIndex = closedIndex - 1;
    else if(closedIndex < gBrowser.tabContainer.selectedIndex)
        AddTabBeside.PreviousIndex--;
    if(closedIndex == gBrowser.tabContainer.selectedIndex)
        AddTabBeside.startActive = new Date().getTime();
   // alert('prev: ' + AddTabBeside.PreviousIndex);
    AddTabBeside.tabSelectFlag = false;
 },
 
 algorithm: function () {
 //   alert(AddTabBeside.TabData[0].rank);
    prev = gBrowser.tabContainer.getItemAtIndex(AddTabBeside.PreviousIndex);
    //cong them activeTime cho tab dang duoc chon 
    AddTabBeside.endActive = new Date().getTime();
    AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].AddActiveTime(AddTabBeside.endActive - AddTabBeside.startActive);
    AddTabBeside.startActive = new Date().getTime();	
	
    //cap nhat rank cho tat ca cac tab truoc khi di chuyen
    for(var i = 0; i < AddTabBeside.TabData.length; i++)
    {
        AddTabBeside.TabData[i].Eval(AddTabBeside.startActive);
    }
    
	try
	{
		if(currentTab)
		{
			var percent = parseInt((AddTabBeside.startActive - AddTabBeside.startSelect) * 100 / 1000 / (AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex - 1].activeTime - AddTabBeside.startTime));
			currentTab.updateProgress(currentTab.mLabel, 'tabprogressbar-progress',percent);
	    }
	}
	catch(ex)
	{
	}
    
    for(var i = 1; i < AddTabBeside.TabData.length; i++)
    {
        if(AddTabBeside.TabData[i].rank > AddTabBeside.TabData[i - 1].rank) //tab co rank cao thi chuyen ve ben trai
        {
            //alert(AddTabBeside.TabData[i - 1].rank + '\r\n' + AddTabBeside.TabData[i].rank); 
            temp = AddTabBeside.TabData[i];
            AddTabBeside.TabData[i] = AddTabBeside.TabData[i - 1];
            AddTabBeside.TabData[i - 1] = temp;
            
            AddTabBeside.tabMoveFlag = false;
            gBrowser.moveTabTo(gBrowser.tabContainer.getItemAtIndex(i - 1), i); 
            AddTabBeside.tabMoveFlag = true;
            

			var tab = gBrowser.tabContainer.getItemAtIndex(i - 1); 
			var tabClr = AddTabBeside.tabColors[AddTabBeside.clr%32];
			AddTabBeside.clr++;					
			
			tab.style.setProperty('background-color',tabClr,'important');
			AddTabBeside.setForeColor(tab);
		//	AddTabBeside.clrSession.setTabValue(tab, "tabClr", tabClr);
			//AddTabBeside.setMIcolor(tab,tabClr);
		//	AddTabBeside.fadeAllTabs(); 
            AddTabBeside.startSelect = new Date().getTime(); 
			AddTabBeside.startSelect = temp.activeTime;
        }
    }
    
    AddTabBeside.PreviousIndex = gBrowser.tabContainer.getIndexOfItem(prev);

  
  //  gBrowser.moveTabTo(gBrowser.tabContainer.getItemAtIndex(1),0);
 },

	
	setForeColor:function(tab)
		{
			var clrprefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			AddTabBeside.txtreverse = clrprefs.getBoolPref("extensions.clrtabs.txtreverse");
			
		if(AddTabBeside.txtreverse)
			{		 
			rgb = document.defaultView.getComputedStyle(tab, null).getPropertyValue("background-color").toString();
			rgb = rgb.replace(/ /g,''); //strip spaces
			re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
			rgb.toLowerCase();
			re.exec(rgb);
			r = RegExp.$1
			g = RegExp.$2;
			b =	RegExp.$3;
			hsl=AddTabBeside.get_hsl(r,g,b);
			h = hsl[0];
			s = hsl[1];
			l = hsl[2];
			l = parseInt(l);		
			if(l < 50 )	//if luminance is low
				{
				tab.style.setProperty('color','#ffffff','important');	//set the foreground to white
				}
			else
				{
				tab.style.setProperty('color','rgb(0,0,0)','important');
				}

			//tab.style.setProperty('color','rgb('+(255-parseInt(r))+','+(255-parseInt(g))+','+(255-parseInt(b))+')','important');

			}
		else
			{
			tab.style.setProperty('color','rgb(0,0,0)','important');
			}
		},
		
		get_hsl:function gethsl(r,g,b)
				{
		    r /= 255, g /= 255, b /= 255;
		    var max = Math.max(r, g, b), min = Math.min(r, g, b);
		    var h, s, l = (max + min) / 2;
		    if(max == min)
		    	{
		        h = s = 0; // achromatic
		    	}
		    else
		    	{
		        var d = max - min;
		        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		        switch(max){
		            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
		            case g: h = (b - r) / d + 2; break;
		            case b: h = (r - g) / d + 4; break;
		        }
		        h /= 6;
		    	}    
		    h=Math.floor(h*360)
		    while(h>360)
			    {
			    h = h-360;
			    }
		   	s = Math.floor(s*100);
			l = Math.floor(l*100);
		    return [h,s,l];
			//document.getElementById("color").style.backgroundColor  = ;
			},
			
cl:function(msg)
			{
			if(AddTabBeside.ctdebug) dump("\ncl:\t"+msg);
			},
			
fadeNode:function(node,opacity)
				{
				node.style.setProperty('opacity',opacity,'important');
				},
fadeAllTabs:function(event)
				{		
				//AddTabBeside.cl("TabSelect")
				AddTabBeside.setTaBottomClr();	
				//dump("\nCaller: "+arguments.callee.caller.toString());
				try
					{
					var tblength = gBrowser.mTabContainer.childNodes.length;
					for(var loop = 0; loop < tblength; loop++)
						{			
						if(AddTabBeside.fadedeg)
							{
							AddTabBeside.fadeNode(gBrowser.mTabContainer.childNodes[loop],(10-AddTabBeside.fadedeg)/10);				
							}
						else
							{
							AddTabBeside.fadeNode(gBrowser.mTabContainer.childNodes[loop],'1');
							}		
						}
					/*
					for(var loop = 0; loop < tblength; loop++)
						{
						try
							{				 
							if(AddTabBeside.fadedeg)
								{
								for(var count=0;count< gBrowser.mTabContainer.childNodes.length;count++)						
									{
									AddTabBeside.fadeNode(gBrowser.mTabContainer.childNodes[count],(10-AddTabBeside.fadedeg)/10);
									dump("\n\tColorfulTabs Fade: " +tblength);
									}
								}
							else
								{					
								for(var count=0;count<gBrowser.mTabContainer.childNodes.length;count++)
									{
									AddTabBeside.fadeNode(gBrowser.mTabContainer.childNodes[count],'1');
									}
								}
							}
						catch(e)
							{
							dump("\nColorfulTabs Log: Error: " + e);
							Components.utils.reportError(e);
							}
						}
					*/
					}
				catch(e)
					{
					dump("\nColorfulTabs Log: Error: " + e);
					}
			/*	if(AddTabBeside.standout)
					{		
					try
						{		 
						for(var count=0;count< gBrowser.mTabContainer.childNodes.length;count++)						
							gBrowser.mTabContainer.childNodes[count].className = gBrowser.mTabContainer.childNodes[count].className.replace(" standout","");			
						}
					catch(e)
						{
						AddTabBeside.cl("\nColorfulTabs Error in function AddTabBeside.fadeAllTabs: "+e+". standout "+count2);
						}
					gBrowser.selectedTab.className=gBrowser.selectedTab.className+" standout";
					}*/
				/*else
					{
					for(var count=0;count< gBrowser.mTabContainer.childNodes.length;count++)						
							{
							if(gBrowser.mTabContainer.childNodes[count].className.match(" standout"))
								{
								gBrowser.mTabContainer.childNodes[count].className.replace(" standout","")
								}
							}
					}
				*/
				if(AddTabBeside.fadedeg)
					{
					try
						{			 
						AddTabBeside.fadeNode(gBrowser.selectedTab,"1");
						}
					catch(e)
						{
						dump("\nColorfulTabs Error in function AddTabBeside.fadeAllTabs: "+e+". Iteration failed on value "+count2);
						}
					}
				},
setTaBottomClr:function()
				{
				var ss = new Array();
				var ss = document.styleSheets;
				for (var i=0; i < ss.length; i++)
					{
					switch (ss[i].href)
						{
						case 'chrome://content/skin/clrtabs.css':
						case 'chrome://content/skin/clrtabs-seamonkey.css':
							var clrSS = ss[i];
							break;
						}
					}
				try
					{
					clrSS.cssRules[2].style.setProperty ('background-color',document.defaultView.getComputedStyle(gBrowser.selectedTab, null).getPropertyValue("background-color").toString() ,'important' );
					}
				catch(e)
					{
					dump("\nctlog:\terror in function AddTabBeside.setTaBottomClr "+e);
					}
				}
};


// Insure that our code gets loaded at start-up
window.addEventListener("load", function(e) { AddTabBeside.onLoad(e); }, false);

window.setInterval(function(){AddTabBeside.algorithm();},1000);

var TabProgressBarService = { 
	disabled : false,
	
/* Utilities */ 
	
	get browser() 
	{
		return gBrowser;
	},
 
	getTabs : function(aTabBrowser) 
	{
		return aTabBrowser.ownerDocument.evaluate(
				'descendant::*[local-name()="tab"]',
				aTabBrowser.mTabContainer,
				null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
				null
			);
	},
  
/* Initializing */ 
	
	init : function() 
	{
		if (!('gBrowser' in window)) return;

		window.removeEventListener('load', this, false);

		document.getElementById('statusbar-progresspanel').setAttribute('tabprogressbar-hidden', true);

		this.initTabBrowser(gBrowser);

		this.initialized = true;
	},

	initTabBrowser : function(aTabBrowser) 
	{
		let (tabs, i, maxi, listener) {
			tabs = this.getTabs(aTabBrowser);
			for (i = 0, maxi = tabs.snapshotLength; i < maxi; i++)
			{
				this.initTab(tabs.snapshotItem(i), aTabBrowser);
			}

			aTabBrowser.addEventListener('TabSelect', this, false);
			aTabBrowser.addEventListener('TabOpen',  this, false);
			aTabBrowser.addEventListener('TabClose', this, false);
			aTabBrowser.addEventListener('TabMove',  this, false);
		}

		if ('swapBrowsersAndCloseOther' in aTabBrowser) {
			eval('aTabBrowser.swapBrowsersAndCloseOther = '+aTabBrowser.swapBrowsersAndCloseOther.toSource().replace(
				'{',
				'{ TabProgressBarService.destroyTab(aOurTab);'
			).replace(
				'if (aOurTab == this.selectedTab) {this.updateCurrentBrowser(',
				'TabProgressBarService.initTab(aOurTab); $&'
			));
		}
	},	
 
	initTab : function(aTab, aTabBrowser) 
	{
		if (aTab.__tabprogressbar__progressListener)
			delete aTab.__tabprogressbar__progressListener;

		var filter = Components
				.classes['@mozilla.org/appshell/component/browser-status-filter;1']
				.createInstance(Components.interfaces.nsIWebProgress);
		var listener = new TabProgressBarProgressListener(aTab, aTabBrowser);
		filter.addProgressListener(listener, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
		aTab.linkedBrowser.webProgress.addProgressListener(filter, Components.interfaces.nsIWebProgress.NOTIFY_ALL);
		aTab.__tabprogressbar__progressListener = listener;
		aTab.__tabprogressbar__progressFilter   = filter;
	},
  
	destroy : function() 
	{
		this.destroyTabBrowser(gBrowser);

		window.removeEventListener('unload', this, false);
	},
	
	destroyTabBrowser : function(aTabBrowser) 
	{
		aTabBrowser.removeEventListener('TabSelect', this, false);
		aTabBrowser.removeEventListener('TabOpen',  this, false);
		aTabBrowser.removeEventListener('TabClose', this, false);
		aTabBrowser.removeEventListener('TabMove',  this, false);

		var tabs = this.getTabs(aTabBrowser);
		for (var i = 0, maxi = tabs.snapshotLength; i < maxi; i++)
		{
			this.destroyTab(tabs.snapshotItem(i));
		}
	},
 
	destroyTab : function(aTab) 
	{
		try {
			aTab.linkedBrowser.webProgress.removeProgressListener(aTab.__tabprogressbar__progressFilter);
			aTab.__tabprogressbar__progressFilter.removeProgressListener(aTab.__tabprogressbar__progressListener);

			delete aTab.__tabprogressbar__progressListener.mLabel;
			delete aTab.__tabprogressbar__progressListener.mTab;
			delete aTab.__tabprogressbar__progressListener.mTabBrowser;

			delete aTab.__tabprogressbar__progressFilter;
			delete aTab.__tabprogressbar__progressListener;
		}
		catch(e) {
			dump(e+'\n');
		}
	},
  
	disableAllFeatures : function() 
	{
		this.disabled = true;
	},
	enableAllFeatures : function()
	{
		this.disabled = false;
	},
}; 
function TabProgressBarProgressListener(aTab, aTabBrowser) 
{
	this.mTab = aTab;
	this.mLabel = document.getAnonymousElementByAttribute(this.mTab, 'class', 'tab-text');
	this.mTabBrowser = aTabBrowser;
}
TabProgressBarProgressListener.prototype = {
	mTab        : null,
	mLabel      : null,
	mTabBrowser : null,
	onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress)
	{
		
	},
	updateProgress : function(aTarget, aAttr, aPercentage)
	{
		if (aPercentage >= 0 && aPercentage < 100) {
			aTarget.setAttribute(aAttr, aPercentage);
		}
		else  {
			aTarget.removeAttribute(aAttr);
		}
	},
	onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus)
	{
		const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
		if (
			aStateFlags & nsIWebProgressListener.STATE_STOP &&
			aStateFlags & nsIWebProgressListener.STATE_IS_NETWORK
			) {
		}
	},
	onLocationChange : function(aWebProgress, aRequest, aLocation)
	{
	},
	onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage)
	{
	},
	onSecurityChange : function(aWebProgress, aRequest, aState)
	{
	},
	QueryInterface : function(aIID)
	{
		if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
			aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			aIID.equals(Components.interfaces.nsISupports))
			return this;
		throw Components.results.NS_NOINTERFACE;
	}
};
currentSelectTab = null;