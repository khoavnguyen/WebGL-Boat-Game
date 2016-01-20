//test edit 

// DESIGN 3
window.Namespace = {};

Namespace.Info = function ()
{
    this.startTime = new Date().getTime();
    this.activeTime = 0;
    this.rank = 0;
    this.numberOfAccess = 1;
    this.number = 0;
    this.parent = 0;
	this.markedStatus = 0;
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
    this.rank = 1 * this.numberOfAccess + 0.1 * this.activeTime; //+ (-0.01) * this.GetElapsedTime(endTime); 
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
 ////
    openFlag:false,
    ctrlFlag:false,
    rankFlag: false,
	markedToolbarStatus:0,
	
	newFlag:false,
	newIndex:-1,
	
	markFlag:0,
    count:1,
    newTab:null,
    Dummy: new Array(5),
	tabContextMenu:null,
	popupBox:null,
	tabbrowser:null,
	contextTab:null,
	arrowScrollBox: null,
	scrollButtonUp: null,
	scrollButtonDown: null,
	firstVisibleIndex: null,
	scrollButtonDown: null,
	tabbox: null,
	tabs: null,
	stack: null,
	ind: null,
	leftMostIndex: null,
	rightMostIndex: null,
	firstRank: null,
	secondRank: null,
	thirdRank: null,
	prevFirstVisibleIndex: null,
	highestRankedTabs: null,
	sortRank: null,
	sortIndex: null,


onDummyClick:function(e, index)
{
    xx = AddTabBeside.Dummy[index];
    if(xx >= 0)
	{
        gBrowser.tabContainer.selectedIndex = xx;
		AddTabBeside.TabData[xx].numberOfAccess++;
	}

},

////

 onLoad: function() {

   var container = gBrowser.tabContainer;
   container.addEventListener("TabOpen", this.onTabOpen, false);

   container.addEventListener("TabMove", this.onTabMove, false);
    
   container.addEventListener("TabSelect", this.onTabSelect, false);

   container.addEventListener("TabClose", this.onTabClose, false);
   
   window.addEventListener("unload", this.onUnload, false);
   
	AddTabBeside.getFirstVisibleIndex();
	prevFirstVisibleIndex = firstVisibleIndex;
	//markedToolbarStatus = 0;
    AddTabBeside.TabData[0] = new Namespace.Info();AddTabBeside.TabData[0].number = 1;
    for(i = 0; i < 5; i++)
	{
        AddTabBeside.Dummy[i] = 0;
		AddTabBeside.highestRankedTabs[i] = null;
	}
	
	//alert("ok");
	//gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(gBrowser.tabContainer.getItemAtIndex(0));
	//gBrowser.tabContainer.selectedIndex = 0;
/*		
	tabbrowser = gBrowser;
	tabbox = document.getAnonymousNodes(tabbrowser)[1];
	tabs = tabbox.childNodes[1].childNodes[2];
	stack = document.getAnonymousNodes(tabs)[0].childNodes[1].childNodes[2];
		  //  stack.removeChild(stack.childNodes[0]);
		//    stack.removeChild(stack.childNodes[0]);
	arrowScrollBox = document.getAnonymousNodes(tabs)[0].childNodes[1].childNodes[0]; */

//	scrollButtonUp = document.getAnonymousElementByAttribute(arrowScrollBox,"class","scrollbutton-up");
//	scrollButtonUp.addEventListener("onmousedown", scrollButtonUp.onmousedown = function () { AddTabBeside.onScrollButtonUpMouseDown(); }, false);
//	scrollButtonUp.addEventListener("onclick", scrollButtonUp.onclick = function (event) { AddTabBeside.onScrollButtonUpClick(event); }, false);
//	scrollButtonUp.addEventListener("onmouseup", scrollButtonUp.onmouseup = function () { AddTabBeside.onScrollButtonUpMouseUp(); },false);
//	scrollButtonUp.addEventListener("onmouseover", scrollButtonUp.onmouseover = function () { AddTabBeside.onScrollButtonUpMouseOver(); },false);
//	scrollButtonUp.addEventListener("onmouseout", scrollButtonUp.onmouseout = function () { AddTabBeside.onScrollButtonUpMouseOut(); },false);
	
//	scrollButtonDown = document.getAnonymousElementByAttribute(arrowScrollBox,"class","scrollbutton-down");
	
//	scrollButtonDown.addEventListener("onmousedown", scrollButtonDown.onmousedown = function () { AddTabBeside.onScrollButtonDownMouseDown(); }, false);
//	scrollButtonDown.addEventListener("onmouseup", scrollButtonDown.onmouseup = function () { AddTabBeside.onScrollButtonDownMouseUp(); }, false);
//	scrollButtonDown.addEventListener("onclick", scrollButtonDown.onclick = function (event) { AddTabBeside.onScrollButtonDownClick(event); }, false);
//	scrollButtonDown.addEventListener("onmouseover", scrollButtonDown.onmouseover = function () { AddTabBeside.onScrollButtonDownMouseOver(); }, false);
//	scrollButtonDown.addEventListener("onmouseout", scrollButtonDown.onmouseout = function () { AddTabBeside.onScrollButtonDownMouseOut(); }, false);

	//firstRank = gBrowser.tabContainer.getItemAtIndex(0);

/*
//	AddTabBeside.standout=clrprefs.getBoolPref("extensions.clrtabs.standout");
//	AddTabBeside.fadedeg = clrprefs.getIntPref("extensions.clrtabs.fadedeg");
//strip=null;if(!strip)alert(33);
   strip=document.getElementById('content').getElementsByClassName('tabs-alltabs-button');
  //  strip = document.getAnonymousElementByAttribute(document.getElementById('content'), 'anonid', 'alltabs-button');
    alert(strip[0].tooltipText);
   butt = document.createElement('button');
    butt.setAttribute('label', 'test');
    strip.appendChild(butt);


	/// them Mark button:
	    tabContextMenu =  document.getElementById("context_closeTab").parentNode;
		popupBox = document.getAnonymousElementByAttribute(tabContextMenu, "class", "popup-internal-box");
	    popupBox.appendChild(document.getElementById("mark-menuitem-button"));

	//	arrowScrollBox.removeChild(scrollButtonUp);

		

//	arrowScrollBox.insertBefore(scrollButtonUp,arrowScrollBox.childNodes[0]);
//	alert(arrowScrollBox.childNodes[0].getAttribute("class"));
	if (scrollButtonUp == null)
			alert("null");

	ind = arrowScrollBox.getIndexOfItem(scrollButtonUp);
	if (ind == null)
			alert("null");
	else
		alert(ind); */
		
		
},
/*
 onScrollButtonUpMouseDown: function()
 {
	gBrowser.tabContainer.mTabstrip._startScroll(-1);

	//gBrowser.tabContainer.mTabstrip._smoothScrollByPixels(-gBrowser.mTabs[0].clientWidth);
	
	var [start, end] = gBrowser.tabContainer.mTabstrip._startEndProps;
	var x = gBrowser.tabContainer.mTabstrip.scrollClientRect[start] - gBrowser.mTabs[0].clientWidth;
	var targetElement = null;
	
	targetElement = gBrowser.tabContainer.mTabstrip._elementFromPoint(x, -1);
	if (targetElement == null)
	{
		firstVisibleIndex = 0;
		gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(gBrowser.tabContainer.getItemAtIndex(0));
	}
	else
	{
		firstVisibleIndex = gBrowser.tabContainer.getIndexOfItem(targetElement) + 1;
		gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(targetElement.nextSibling);
	}
	//alert(firstVisibleIndex);
	gBrowser.tabContainer.adjustTabstrip();
	gBrowser.tabContainer.tabbox.adjustTabstrip();
//	event.stopPropagation();
	//gBrowser.tabContainer.mTabstrip._stopScroll();
	
 },

 onScrollButtonUpClick: function()
 {
	gBrowser.tabContainer.mTabstrip._distanceScroll(event);
	//AddTabBeside.getFirstVisibleIndex();
 },
   
  onScrollButtonUpMouseUp: function()
 {
	
	gBrowser.tabContainer.mTabstrip._stopScroll();
	AddTabBeside.getFirstVisibleIndex();
	AddTabBeside.moveHighestRankedTabsToLeft(firstVisibleIndex);
	
 },
 
   onScrollButtonUpMouseOver: function()
 {
	
	gBrowser.tabContainer.mTabstrip._continueScroll(-1);
	//AddTabBeside.getFirstVisibleIndex();
	
 },
 
   onScrollButtonUpMouseOut: function()
 {
	
	gBrowser.tabContainer.mTabstrip._pauseScroll();
	//AddTabBeside.getFirstVisibleIndex();
	
 },
 
onScrollButtonDownMouseDown: function()
 {

	gBrowser.tabContainer.mTabstrip._startScroll(1);
	//AddTabBeside.getFirstVisibleIndex();

 },
 */
 	/*
 onScrollButtonDownClick: function(event)
 {
	gBrowser.tabContainer.mTabstrip._distanceScroll(event);
	//AddTabBeside.getFirstVisibleIndex();



	//gBrowser.tabContainer.mTabstrip._smoothScrollByPixels(gBrowser.mTabs[0].clientWidth);
	var [start, end] = gBrowser.tabContainer.mTabstrip._startEndProps;
	//alert(gBrowser.tabContainer.mTabstrip._getScrollableElements[0].getAttribute("class"));
	var y = gBrowser.tabContainer.mTabstrip.scrollClientRect[end] + gBrowser.tabContainer.mTabstrip.scrollClientSize;
	var x = gBrowser.tabContainer.mTabstrip.scrollClientRect[start] - gBrowser.tabContainer.mTabstrip.scrollClientSize;
	targetElement = null;
	targetElement = gBrowser.tabContainer.mTabstrip._elementFromPoint(y, 1);
	var firstVisibleElement = null;
	firstVisibleElement	= gBrowser.tabContainer.mTabstrip._elementFromPoint(x, -1);
	
	if (firstVisibleElement == null)
	{
		firstVisibleIndex = 1;
		//gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(gBrowser.tabContainer.getItemAtIndex(0));
	}
	else
	{
		firstVisibleIndex = gBrowser.tabContainer.getIndexOfItem(firstVisibleElement) + 2;
		if( targetElement == null)
		{
			gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(gBrowser.tabContainer.getItemAtIndex(gBrowser.tabContainer.childNodes.length - 1));
		}
		else
		{
			gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(targetElement.previousSibling);
		}
	}
	//alert(firstVisibleIndex);
//	event.stopPropagation();
	gBrowser.tabContainer.mTabstrip._stopScroll(); 
 },
 */
 /*
 onScrollButtonDownMouseUp: function()
 {
	gBrowser.tabContainer.mTabstrip._stopScroll();
	//AddTabBeside.getFirstVisibleIndex();

 },
 
  onScrollButtonDownMouseOver: function()
 {
	gBrowser.tabContainer.mTabstrip._continueScroll(1);
	//AddTabBeside.getFirstVisibleIndex();

 },
 
  onScrollButtonDownMouseOut: function()
 {
	gBrowser.tabContainer.mTabstrip._pauseScroll();
	//AddTabBeside.getFirstVisibleIndex();

 },
 
 */
 onUnload: function() {
   var container = gBrowser.tabContainer;
   container.removeEventListener("TabOpen", this.onTabOpen, false);
   container.removeEventListener("TabSelect", this.onTabSelect, false);
   container.removeEventListener("TabMove", this.onTabMove, false);
   container.removeEventListener("TabClose", this.onTabClose, false);
/*   scrollButtonUp.removeEventListener("onmousedown", AddTabBeside.onScrollButtonUpMouseDown, false);
   scrollButtonUp.removeEventListener("onclick", AddTabBeside.onScrollButtonUpClick, false);
   scrollButtonUp.removeEventListener("onmouseup", AddTabBeside.onScrollButtonUpMouseUp, false);
   scrollButtonUp.removeEventListener("onmouseover", AddTabBeside.onScrollButtonUpMouseOver, false);
   scrollButtonUp.removeEventListener("onmouseout", AddTabBeside.onScrollButtonUpMouseOut, false);

   scrollButtonDown.removeEventListener("onclick", AddTabBeside.onScrollButtonDownClick, false);
   scrollButtonDown.removeEventListener("onmousedown", AddTabBeside.onScrollButtonDownMouseDown, false);
   scrollButtonDown.removeEventListener("onmouseup", AddTabBeside.onScrollButtonDownMouseUp, false);
   scrollButtonDown.removeEventListener("onmouseover", AddTabBeside.onScrollButtonDownMouseOver, false);
   scrollButtonDown.removeEventListener("onmouseout", AddTabBeside.onScrollButtonDownMouseOut, false);
*/

}, 

  onTabMove: function (e) {
    var movedTab = e.target;
     if(AddTabBeside.newFlag)
    {
      var temp = AddTabBeside.TabData[AddTabBeside.newIndex];
       var index = gBrowser.tabContainer.getIndexOfItem(movedTab);
       AddTabBeside.TabData[AddTabBeside.newIndex] = AddTabBeside.TabData[index];
       AddTabBeside.TabData[index] = temp;
    //  alert(AddTabBeside.PreviousIndex + ' ' +  index);
    //  AddTabBeside.PreviousIndex = index;

    }   
    else if(AddTabBeside.tabMoveFlag) //&& !AddTabBeside.afterTabOpenFlag)
    {
      var temp = AddTabBeside.TabData[AddTabBeside.PreviousIndex];
       var index = gBrowser.tabContainer.getIndexOfItem(movedTab);
       AddTabBeside.TabData[AddTabBeside.PreviousIndex] = AddTabBeside.TabData[index];
       AddTabBeside.TabData[index] = temp;
    //  alert(AddTabBeside.PreviousIndex + ' ' +  index);
      AddTabBeside.PreviousIndex = index;

    }
   else if(AddTabBeside.tabMoveFlag && AddTabBeside.afterTabOpenFlag)
   {
    //    alert('Open link in new tab');
        if(AddTabBeside.newTab)
        {
            newTabIndex = gBrowser.tabContainer.getIndexOfItem(AddTabBeside.newTab);
            kk = AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex];
            AddTabBeside.TabData[newTabIndex].parent = kk.number;
            ll = new Namespace.Info();ll = kk;
            if(gBrowser.tabContainer.selectedIndex != gBrowser.tabContainer.childNodes.length - 2)
            {
                ll = AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex + 2];
            }
            AddTabBeside.TabData[newTabIndex].startTime = (kk.startTime + ll.startTime) / 2;
            AddTabBeside.TabData[newTabIndex].activeTime = (kk.activeTime + ll.activeTime) / 2;
            AddTabBeside.TabData[newTabIndex].numberOfAccess = ll.numberOfAccess+ 1;
         }
   }
/*

   else if(!AddTabBeside.tabMoveFlag /*&& !AddTabBeside.afterTabOpenFlag && AddTabBeside.rankFlag)
   {    //alert('Ranking');
   }
   else if(AddTabBeside.ctrlFlag)
        alert('Crtl + T');*/
//   else if(!AddTabBeside.tabMoveFlag && !AddTabBeside.afterTabOpenFlag)
//        alert('else');
//  alert(AddTabBeside.openFlag + ' ' + AddTabBeside.ctrlFlag);
/* if(AddTabBeside.openFlag)
    AddTabBeside.ctrlFlag = true;
 else
    AddTabBeside.ctrlFlag =false;

    AddTabBeside.openFlag = false;
    AddTabBeside.afterTabOpenFlag = false;
    AddTabBeside.newTab = null; */
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


		// modify markButton:
		var markButton = document.getElementById("markButton");
		if(AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].markedStatus == 0)
		{
			markButton.setAttribute("label","Mark");
		}
		else
		{
			markButton.setAttribute("label","Unmark");
		}
    }
    AddTabBeside.tabSelectFlag = true;
 }, 

getFirstVisibleIndex: function()
{
	AddTabBeside.tabSelectFlag = true;

	var [start, end] = gBrowser.tabContainer.mTabstrip._startEndProps;
	var x = gBrowser.tabContainer.mTabstrip.scrollClientRect[start] + gBrowser.mTabs[0].clientWidth;
	var targetElement = null;
	
	targetElement = gBrowser.tabContainer.mTabstrip._elementFromPoint(x, 1);
	if (targetElement == null)
	{
		firstVisibleIndex = 0;
		//alert("null");
	}
	else
	{
		firstVisibleIndex = gBrowser.tabContainer.getIndexOfItem(targetElement);
		//alert(firstVisibleIndex);
	}
	
	//alert("ok");
	
}, 

 
 
onTabOpen: function (e) {
   var newTab = e.target;
   AddTabBeside.PreviousIndex = gBrowser.tabContainer.selectedIndex;
   xx = new Namespace.Info();xx.number = ++AddTabBeside.count;
    AddTabBeside.TabData.splice(AddTabBeside.PreviousIndex + 1, 0, xx);
    if (gBrowser.tabContainer.childNodes.length > 2)
    {
        AddTabBeside.tabMoveFlag = false;AddTabBeside.openFlag = true;
        gBrowser.moveTabTo(newTab, AddTabBeside.PreviousIndex + 1);
        AddTabBeside.tabMoveFlag = true;
     //   alert(AddTabBeside.PreviousIndex);
    }   
    AddTabBeside.afterTabOpenFlag = true;
    AddTabBeside.newTab = newTab;

	// modify markButton:
/*	var markButton = document.getElementById("markButton");
	if(AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].markedStatus == 0)
	{
		markButton.setAttribute("label","Mark");
	}
	else
	{
		markButton.setAttribute("label","Unmark");
	}

*/	
//	newTab.style.setProperty('visibility','visible','important');

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
    var closedTabData = AddTabBeside.TabData.splice(closedIndex, 1);
    for(i = 0; i < AddTabBeside.TabData.length; i++)
    {
        if(AddTabBeside.TabData[i].parent == closedTabData[0].number)
        {
            AddTabBeside.TabData[i].parent = closedTabData[0].parent;
        }
    }
    if(closedIndex == gBrowser.tabContainer.childNodes.length - 1)
        AddTabBeside.PreviousIndex = closedIndex - 1;
    else if(closedIndex < gBrowser.tabContainer.selectedIndex)
        AddTabBeside.PreviousIndex--;
    if(closedIndex == gBrowser.tabContainer.selectedIndex)
        AddTabBeside.startActive = new Date().getTime();
   // alert('prev: ' + AddTabBeside.PreviousIndex);
    AddTabBeside.tabSelectFlag = false;
     
   for(i = 0; i < 5; i++)
    {
        if(closedIndex == AddTabBeside.Dummy[i])
        {
            AddTabBeside.Dummy[i] = -1;
            tabDummy = document.getElementById('Tab' + i);
            tabDummy.setAttribute('label', 'Blank');
        }
    }
    
    menu = document.getElementById('MarkedTabList');

	for(i = 0; i < menu.children.length; i++)
	{
		if(closedTabData[0].number == menu.children[i].getAttribute('value'))
		{
		    menu.removeChild(menu.children[i]);
		    break;
		}
	} 
 },

onShowClick: function(e) {

	//var doc = gBrowser.selectedBrowser.contentDocument;
	var markedToolbar = document.getElementById("MarkedToolbar");
	var showButton = document.getElementById("showButton");
	if (markedToolbarStatus == 0)
	{
		// hien toolbar ra va chuyen button thanh "hide"
		markedToolbar.setAttribute("hidden","false");
		showButton.setAttribute("label","Hide");
		markedToolbarStatus = 1;
	}
	else
	{		
		// chuyen button thanh "show" va giau toolbar di
		markedToolbar.setAttribute("hidden","true");
		showButton.setAttribute("label","Show");
		markedToolbarStatus = 0;
	}
} ,

onMenuPopupShowing: function()
{
	contextTab = tabbrowser.mContextTab;
	var ctTabIndex = gBrowser.tabContainer.getIndexOfItem(contextTab);
	var tabStatus = AddTabBeside.TabData[ctTabIndex].markedStatus;
	var markMenuButton = document.getElementById("mark-menuitem-button");
	if (tabStatus == 0)
	{
		alert(markMenuButton.getAttribute("label"));
	}
	else
	{
		alert(markMenuButton.getAttribute("label"));
	}
	
},


onMarkMenuButtonClick: function(e) {
//	tabbrowser = document.getElementById("context_closeTab").parentNode.parentNode.parentNode.parentNode;
    var tab = tabbrowser.mContextTab;				

//	var tab = gBrowser.tabContainer.getItemAtIndex(gBrowser.tabContainer.selectedIndex); 
	var tabClr = AddTabBeside.tabColors[1];
	var markButton = document.getElementById("markButton");
	var ctTabIndex = gBrowser.tabContainer.getIndexOfItem(tab);
	currTab = AddTabBeside.TabData[ctTabIndex];
	if(currTab.markedStatus == 0)
	{
		tab.style.setProperty('background-color',tabClr,'important');
		//markButton.setAttribute("label","Unmark");
		currTab.markedStatus = 1;
		if(AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].markedStatus == 0)
		{
			markButton.setAttribute("label","Mark");
		}
		else
		{
			markButton.setAttribute("label","Unmark");
		}
		
		/////////
		
        newMarkedTab = document.createElement('menuitem');
        newMarkedTab.setAttribute('label', tab.getAttribute('label'));
        newMarkedTab.setAttribute('value', currTab.number);
        newMarkedTab.setAttribute('oncommand', 'AddTabBeside.onMarkedTabClick(this.value)');
        list = document.getElementById('MarkedTabList');
        list.appendChild(newMarkedTab);
	}
	else
	{
		tab.style.removeProperty('background-color');
		//markButton.setAttribute("label","Mark");
		currTab.markedStatus = 0;
		
		if(AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].markedStatus == 0)
		{
			markButton.setAttribute("label","Mark");
		}
		else
		{
			markButton.setAttribute("label","Unmark");
		}
		
		menu = document.getElementById('MarkedTabList');

		for(i = 0; i < menu.children.length; i++)
		{
		    if(currTab.number == menu.children[i].getAttribute('value'))
		    {
		        menu.removeChild(menu.children[i]);
		        break;
		    }
		}
	}
		//AddTabBeside.setForeColor(tab);
	//AddTabBeside.clrSession.setTabValue(tab, "tabClr", tabClr);
	//AddTabBeside.setMIcolor(tab,tabClr);
	//AddTabBeside.fadeAllTabs();
} ,


onMarkClick: function(e) {				

	var tab = gBrowser.tabContainer.getItemAtIndex(gBrowser.tabContainer.selectedIndex); 
	var tabClr = AddTabBeside.tabColors[1];
	var markButton = document.getElementById("markButton");
	var ctTabIndex = gBrowser.tabContainer.getIndexOfItem(tab);
	currTab = AddTabBeside.TabData[ctTabIndex];
	if(currTab.markedStatus == 0)
	{
		tab.style.setProperty('background-color',tabClr,'important');
		markButton.setAttribute("label","Unmark");
		currTab.markedStatus = 1;
		
		/////////
		
        newMarkedTab = document.createElement('menuitem');
        newMarkedTab.setAttribute('label', tab.getAttribute('label'));
        newMarkedTab.setAttribute('value', currTab.number);
        newMarkedTab.setAttribute('oncommand', 'AddTabBeside.onMarkedTabClick(this.value)');
        list = document.getElementById('MarkedTabList');
        list.appendChild(newMarkedTab);
	}
	else
	{
		tab.style.removeProperty('background-color');
		markButton.setAttribute("label","Mark");
		currTab.markedStatus = 0;
		
		
		menu = document.getElementById('MarkedTabList');

		for(i = 0; i < menu.children.length; i++)
		{
		    if(currTab.number == menu.children[i].getAttribute('value'))
		    {
		        menu.removeChild(menu.children[i]);
		        break;
		    }
		}
	}
		//AddTabBeside.setForeColor(tab);
	//AddTabBeside.clrSession.setTabValue(tab, "tabClr", tabClr);
	//AddTabBeside.setMIcolor(tab,tabClr);
	//AddTabBeside.fadeAllTabs();
} ,

onMarkedTabClick: function(tabNumber)
{
    for(i = 0; i < AddTabBeside.TabData.length; i++)
    {
        if(AddTabBeside.TabData[i].number == tabNumber)
            gBrowser.tabContainer.selectedIndex = i;
    }
},

onUnmarkAllTabsClick: function(e)
{
	var markButton = document.getElementById("markButton");
	
	var tab = gBrowser.tabContainer.getItemAtIndex(gBrowser.tabContainer.selectedIndex); 
	tab.style.removeProperty('background-color');
	markButton.setAttribute("label","Mark");
	
	for(var i = 0; i < AddTabBeside.TabData.length; i++)
    {
        tab = gBrowser.tabContainer.getItemAtIndex(i); 
		tab.style.removeProperty('background-color');
		AddTabBeside.TabData[i].markedStatus = 0;
    }
    button = document.getElementById('MarkedTabListButton');
    menu = document.getElementById('MarkedTabList');
    button.removeChild(menu);
    newMenu = document.createElement('menupopup');
    newMenu.setAttribute('id', 'MarkedTabList');
    button.appendChild(newMenu);
},

 algorithm: function () {
 //   alert(AddTabBeside.TabData[0].rank);
//    prev = gBrowser.tabContainer.getItemAtIndex(AddTabBeside.PreviousIndex);
//	alert (AddTabBeside.PreviousIndex + gBrowser.tabContainer.getIndexOfItem(prev));
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
    
 /*   for(var i = 1; i < AddTabBeside.TabData.length; i++)
    {
        if(AddTabBeside.TabData[i].rank > AddTabBeside.TabData[i - 1].rank) //tab co rank cao thi chuyen ve ben trai
        {
            if(AddTabBeside.TabData[i - 1].number != AddTabBeside.TabData[i].parent)
            {//alert(AddTabBeside.TabData[i - 1].activeTime + ' ' + AddTabBeside.TabData[i - 1].numberOfAccess);
                //alert(AddTabBeside.TabData[i - 1].rank + '\r\n' + AddTabBeside.TabData[i].rank); 
                temp = AddTabBeside.TabData[i];
                AddTabBeside.TabData[i] = AddTabBeside.TabData[i - 1];
                AddTabBeside.TabData[i - 1] = temp;
                
                AddTabBeside.tabMoveFlag = false;AddTabBeside.rankFlag = true;
                gBrowser.moveTabTo(gBrowser.tabContainer.getItemAtIndex(i - 1), i); 
                AddTabBeside.tabMoveFlag = true;AddTabBeside.rankFlag = false;
                

		    //	var tab = gBrowser.tabContainer.getItemAtIndex(i - 1); 
		    //	var tabClr = AddTabBeside.tabColors[AddTabBeside.clr%32];
		    //	AddTabBeside.clr++;					
    			
		    //	tab.style.setProperty('background-color',tabClr,'important');
		    //	AddTabBeside.setForeColor(tab);
		    //	AddTabBeside.clrSession.setTabValue(tab, "tabClr", tabClr);
		    //	AddTabBeside.setMIcolor(tab,tabClr);
		    //	AddTabBeside.fadeAllTabs(); 
    		
                AddTabBeside.startSelect = new Date().getTime(); 
			    AddTabBeside.startSelect = temp.activeTime;
            }
        }
    }
    */

	AddTabBeside.sortTabs();
//	firstRank = gBrowser.tabContainer.getItemAtIndex(sortIndex[0]);
    for(i = 0; i < 5; i++)
    {
        tabDummy = document.getElementById('Tab' + i);
        separator = document.getElementById('Sep' + i);
        if(i < sortRank.length)
        {
			//AddTabBeside.highestRankedTabs[i] = gBrowser.tabContainer.getItemAtIndex(sortIndex[i]);
            tab = gBrowser.tabContainer.getItemAtIndex(sortIndex[i]);
            tabDummy.setAttribute('label', tab.getAttribute('label'));
            tabDummy.setAttribute('hidden', 'false');
            separator.setAttribute('hidden', 'false');
            AddTabBeside.Dummy[i] = sortIndex[i]; 
        }
        else
        {
            tabDummy.setAttribute('label', 'Blank');
            tabDummy.setAttribute('hidden', 'true');
            separator.setAttribute('hidden', 'true');
            AddTabBeside.Dummy[i] = -1;
        }      
    } 
	AddTabBeside.getFirstVisibleIndex();
	for (i = 0; i < 1; i++)
	{
		AddTabBeside.moveHighestRankedTabs(i);
	}
/*	AddTabBeside.getFirstVisibleIndex();
	if (firstVisibleIndex != sortIndex[0])
	{
		//alert(stringRank + stringIndex + "\n" + firstVisibleIndex + " " + index[0]);
		AddTabBeside.tabMoveFlag = true; //;AddTabBeside.rankFlag = true;
		gBrowser.moveTabTo(firstRank, firstVisibleIndex);
		AddTabBeside.tabMoveFlag = false; //;AddTabBeside.rankFlag = false;
		//prevFirstVisibleIndex = firstVisibleIndex;
//		AddTabBeside.moveHighestRankedTabsToLeft();
	} */

 },
 
 sortTabs: function()
 {
	sortRank = new Array(AddTabBeside.TabData.length);
    sortIndex = new Array(AddTabBeside.TabData.length);
    for(i = 0; i < sortRank.length; i++)
    {   
        sortRank[i] = AddTabBeside.TabData[i].rank;
        sortIndex[i] = i;
    }
    for(i = 0; i < sortRank.length - 1; i++)
    {    for(j = i + 1; j < sortRank.length; j++)
        {
            if(sortRank[i] < sortRank[j])
            {
                temp = sortRank[i];
                sortRank[i] = sortRank[j];
                sortRank[j] = temp;
                
                temp = sortIndex[i];
                sortIndex[i] = sortIndex[j];
                sortIndex[j] = temp;
            }
        }
    }
/*	var stringRank = "rank: ";
	var stringIndex = "index: ";
	for (i=0; i< rank.length; i++)
	{
		stringRank += rank[i];
		stringRank += "-";
		stringIndex += index[i];
		stringIndex += " ";
	} */
},

moveHighestRankedTabs: function (destIndex)
{
	highestRankedTabs = gBrowser.tabContainer.getItemAtIndex(sortIndex[destIndex]);
//	second = gBrowser.tabContainer.getItemAtIndex(sortIndex[destIndex + 1]);
//	var tempp = gBrowser.tabContainer.getIndexOfItem(second);
	//thirdRank = gBrowser.tabContainer.getItemAtIndex(index[2]);
	
	if ((firstVisibleIndex + destIndex) != sortIndex[destIndex])
	{
		//alert(stringRank + stringIndex + "\n" + firstVisibleIndex + " " + index[0]);
/*		if(sortIndex[destIndex] == gBrowser.tabContainer.selectedIndex)
		{
		    AddTabBeside.tabMoveFlag = true; //;AddTabBeside.rankFlag = true;
		    gBrowser.moveTabTo(highestRankedTabs, (firstVisibleIndex + destIndex));
		    AddTabBeside.tabMoveFlag = false; //;AddTabBeside.rankFlag = false;
		}
		else
		{*/
		    AddTabBeside.newFlag = true; //;AddTabBeside.rankFlag = true;
		    AddTabBeside.newIndex = sortIndex[destIndex];
		    gBrowser.moveTabTo(highestRankedTabs, (firstVisibleIndex + destIndex));
		    AddTabBeside.newFlag = false; //;AddTabBeside.rankFlag = false;
//		}
		//prevFirstVisibleIndex = firstVisibleIndex;
//		AddTabBeside.moveHighestRankedTabsToLeft();

        AddTabBeside.PreviousIndex = sortIndex[destIndex];
	} 
//	AddTabBeside.sortTabs();
//	var tempp2 = gBrowser.tabContainer.getIndexOfItem(second);
//	if (tempp != tempp2)
//		alert( tempp + " " + tempp2);

//	AddTabBeside.PreviousIndex = gBrowser.tabContainer.getIndexOfItem(prev);
//alert (AddTabBeside.PreviousIndex + gBrowser.tabContainer.getIndexOfItem(prev));
//	else if (firstVisibleIndex > prevFirstVisibleIndex)
//		AddTabBeside.moveHighestRankedTabsToRight(firstVisibleIndex);
//	gBrowser.tabContainer.mTabstrip.ensureElementIsVisible(firstRank, false);
  //  gBrowser.moveTabTo(gBrowser.tabContainer.getItemAtIndex(1),0);
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