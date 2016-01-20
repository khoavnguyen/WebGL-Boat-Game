window.Namespace = {};

Namespace.Info = function ()
{
    this.startTime = new Date().getTime();
    this.activeTime = 0;
    this.rank = 0;
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
    this.rank = 0.5 * this.GetElapsedTime(endTime) + 0.5 * this.activeTime;
    return this.rank;
};
    
Namespace.Info.prototype.GetInfo = function()
{
    return this.startTime + ' ' + this.activeTime;
};

/////////////////////////////

var AddTabBeside = {
	tabColors: ['rgb(147, 174, 229)','rgb(255, 218, 117)','rgb(188, 204, 157)','rgb(239, 157, 159)','rgb(186, 167, 225)','rgb(155, 191, 180)','rgb(247, 180, 130)','rgb(216, 171, 192)','rgb(147, 229, 174)','rgb(255, 117, 218)','rgb(188, 157, 204)','rgb(239, 159, 157)','rgb(186, 225, 167)','rgb(155, 180, 191)','rgb(247, 130, 180)','rgb(216, 192, 171)','rgb(174, 147, 229)','rgb(218, 255, 117)','rgb(204, 188, 157)','rgb(157, 239, 159)','rgb(167, 186, 225)','rgb(191, 155, 180)','rgb(180, 247, 130)','rgb(171, 216, 192)','rgb(229, 174, 147)','rgb(117, 218, 255)','rgb(157, 204, 188)','rgb(159, 157, 239)','rgb(225, 167, 186)','rgb(180, 191, 155)','rgb(130, 180, 247)','rgb(192, 171, 216)'],
	clrSession:window.navigator.userAgent.toLowerCase().indexOf('seamonkey')>=0?Components.classes["@mozilla.org/suite/sessionstore;1"].getService(Components.interfaces.nsISessionStore):Components.classes["@mozilla.org/browser/sessionstore;1"].getService(Components.interfaces.nsISessionStore),
	txtreverse:null,//reversing of the tabs' text-color
	fadedeg:null,//variable 'fadedeg' tracks fade degree starting 0 to 9 translates to mozopacity 0 to 1 **some explaination mising**.
	clr:0,//tracks the tab color when using fixed pallette
	ctdebug:0,//enable message dump  to console?1:0
	
    PreviousIndex: 0,
    TabData : new Array(),
    startActive: new Date().getTime(),
    endActive: 0,
    tabMoveFlag: true,
 onLoad: function() {
 
   var container = gBrowser.tabContainer;
   container.addEventListener("TabOpen", this.onTabOpen, false);

   container.addEventListener("TabMove", this.onTabMove, false);
    
   container.addEventListener("TabSelect", this.onTabSelect, false);

   container.addEventListener("TabClose", this.onTabClose, false);
   
   window.addEventListener("unload", this.onUnload, false);

 //   AddTabBeside.test[0] = 0;AddTabBeside.test[1] = 1;AddTabBeside.test[2] = 2;AddTabBeside.test[3] = 3;AddTabBeside.test[4] = 4;

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
//test: new Array(),

 onTabMove: function (e) {
    if(AddTabBeside.tabMoveFlag)
    {
     var movedTab = e.target;
    
    /*    var xx = AddTabBeside.test.splice(AddTabBeside.PreviousIndex,1);
        AddTabBeside.test.splice(gBrowser.tabContainer.getIndexOfItem(movedTab), 0, xx[0]);
        alert(gBrowser.tabContainer.getIndexOfItem(movedTab));
    */
       var info = AddTabBeside.TabData.splice(AddTabBeside.PreviousIndex, 1);
       AddTabBeside.TabData.splice(gBrowser.tabContainer.getIndexOfItem(movedTab), 0, info[0]);
       AddTabBeside.PreviousIndex = gBrowser.tabContainer.getIndexOfItem(movedTab);
    }
 },

 onTabSelect: function (e) {
 
    AddTabBeside.endActive = new Date().getTime();
    AddTabBeside.TabData[AddTabBeside.PreviousIndex].AddActiveTime(AddTabBeside.endActive - AddTabBeside.startActive);

/*    alert('Tab "' + gBrowser.tabContainer.getItemAtIndex(AddTabBeside.PreviousIndex).label + '" was last viewed in ' + (AddTabBeside.endActive - AddTabBeside.startActive)/1000 + ' seconds.\n\r' 
    + 'Active time: ' + AddTabBeside.TabData[AddTabBeside.PreviousIndex].activeTime + ' seconds.\n\r'
    + 'Elapsed time: ' + AddTabBeside.TabData[AddTabBeside.PreviousIndex].GetElapsedTime() + ' seconds.' + '\n Its rank is:' + AddTabBeside.TabData[AddTabBeside.PreviousIndex].Eval(AddTabBeside.startActive));
*/
 //   alert(AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].rank);

    AddTabBeside.PreviousIndex = gBrowser.tabContainer.selectedIndex;
    AddTabBeside.startActive = new Date().getTime();

//	gBrowser.moveTabTo(e.target,0);
 }, 
 
 onTabOpen: function (e) {
   var newTab = e.target;
 //  if (gBrowser.tabContainer.childNodes.length > 2) {
 //    gBrowser.moveTabTo(newTab, this.PreviousIndex + 1);
    var x = gBrowser.tabContainer.childElementCount - 1;
    AddTabBeside.TabData[x] = new Namespace.Info();
    
    //alert rank to test index
 //   AddTabBeside.TabData[x].rank = x;
   /*if (gBrowser.tabContainer.childNodes.length > 2) {
     gBrowser.moveTabTo(newTab, this.mPreviousIndex + 1);
   }*/
 },
 
onTabClose: function (e) {
    var closedTab = e.target;
//    alert(gBrowser.tabContainer.getIndexOfItem(closedTab));
    AddTabBeside.TabData.splice(gBrowser.tabContainer.getIndexOfItem(closedTab), 1);
 },
 
 algorithm: function () {
 //   alert(AddTabBeside.TabData[0].rank);
 
    //cong them activeTime cho tab dang duoc chon 
    AddTabBeside.endActive = new Date().getTime();
    AddTabBeside.TabData[gBrowser.tabContainer.selectedIndex].AddActiveTime(AddTabBeside.endActive - AddTabBeside.startActive);
    AddTabBeside.startActive = new Date().getTime();
    
    //cap nhat rank cho tat ca cac tab truoc khi di chuyen
    for(var i = 0; i < AddTabBeside.TabData.length; i++)
    {
        AddTabBeside.TabData[i].Eval(AddTabBeside.startActive);
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
                      
        }
    }


  
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

window.setInterval(function(){AddTabBeside.algorithm();},5000);

