// export.cpp : Defines the entry point for the DLL application.
//


#include "stdafx.h"
#include "export.h"
#include "time.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif


#pragma data_seg("SHARED")
static HHOOK hkb=NULL;
static HHOOK hms=NULL;
static HHOOK hshell=NULL;
static HHOOK hcwnd=NULL;
static HHOOK cbt=NULL;
FILE *f1,*f2;
HWND preHwnd;
char preLog[31];
CRect preRect;
char number[10];
char windowfile[30] = "c:\\logs\\window";
char mousefile[30] = "c:\\logs\\mouse";
#pragma data_seg()
#pragma comment(linker, "/section:SHARED,RWS")

HINSTANCE hins;
//	Note!
//
//		If this DLL is dynamically linked against the MFC
//		DLLs, any functions exported from this DLL which
//		call into MFC must have the AFX_MANAGE_STATE macro
//		added at the very beginning of the function.
//
//		For example:
//
//		extern "C" BOOL PASCAL EXPORT ExportedFunction()
//		{
//			AFX_MANAGE_STATE(AfxGetStaticModuleState());
//			// normal function body here
//		}
//
//		It is very important that this macro appear in each
//		function, prior to any calls into MFC.  This means that
//		it must appear as the first statement within the 
//		function, even before any object variable declarations
//		as their constructors may generate calls into the MFC
//		DLL.
//
//		Please see MFC Technical Notes 33 and 58 for additional
//		details.
//

/////////////////////////////////////////////////////////////////////////////
// CExportApp

BEGIN_MESSAGE_MAP(CExportApp, CWinApp)
	//{{AFX_MSG_MAP(CExportApp)
		// NOTE - the ClassWizard will add and remove mapping macros here.
		//    DO NOT EDIT what you see in these blocks of generated code!
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CExportApp construction


LRESULT __declspec(dllexport)__stdcall  CALLBACK LowLevelKeyboardProc(
															  int nCode, 
															  WPARAM wParam, 
															  LPARAM lParam)
{
	//get all keystrokes
/*	
	char ch;			
	if (((DWORD)lParam & 0x40000000) &&(HC_ACTION==nCode))
	{		
		if ((wParam==VK_SPACE)||(wParam==VK_RETURN)||(wParam>=0x2f ) &&(wParam<=0x100)) 
		{
		
			f1=fopen("c:\\window.txt","a");
			if (wParam==VK_RETURN)
			{	
				ch='\n';
				fwrite(&ch,1,1,f1);
			}
			else
			{
				BYTE ks[256];
				GetKeyboardState(ks);
				WORD w;
				UINT scan;
				scan=0;
				ToAscii(wParam,scan,ks,&w,0);
				ch =char(w); 
				fwrite(&ch,1,1,f1);
			}
			fclose(f1);
		}
		 
	}
*/ 
	//get alt tab
	KBDLLHOOKSTRUCT *pkbhs = (KBDLLHOOKSTRUCT *) lParam; 
	if (nCode==HC_ACTION) 
	{ 
		if (((pkbhs->vkCode == VK_TAB || pkbhs->vkCode == VK_ESCAPE)
			&& pkbhs->flags & LLKHF_ALTDOWN) || 
			pkbhs->vkCode == VK_LWIN && (GetKeyState(0x44) ))//|| GetKeyState(0x4D)))
		{
			char temp[20];
			f1=fopen(windowfile,"a");
			
			time_t rawtime;
			time ( &rawtime );
			itoa((int)rawtime, temp, 10);
			fwrite(temp,1,strlen(temp),f1);
			char i ='\n';
			fwrite(&i,1,sizeof(i),f1);
			
			if(pkbhs->vkCode == VK_TAB)
				fwrite("Alt Tab", 1, strlen("Alt Tab"), f1);
			else if(pkbhs->vkCode == VK_ESCAPE)
				fwrite("Alt Escape", 1, strlen("Alt Escape"), f1);
			else if(pkbhs->vkCode == VK_LWIN)
			{
				if(GetKeyState(0x44))
					fwrite("Window D", 1, strlen("Window D"), f1);
				//		if(GetKeyState(0x4D))
				//			fwrite("Window M", 1, strlen("Window M"), f1);
			}
			fwrite(&i,1,sizeof(i),f1);
			fclose(f1);
		} 
		if(pkbhs->vkCode == VK_F1 && pkbhs->flags & LLKHF_ALTDOWN)
			UnHook();
	}

	LRESULT RetVal = CallNextHookEx( hkb, nCode, wParam, lParam );	
	
	return  RetVal;
	
}
LRESULT __declspec(dllexport)__stdcall CALLBACK LowLevelMouseProc(      
    int nCode,
    WPARAM wParam,
    LPARAM lParam)
{
	if(nCode == HC_ACTION)
	{
		//get info from clicking on window
		
		//		char ch;
		//		char mouse[] = "\nMouse: ";
		//f2=fopen("c:\\mouse.txt","a");
		/*		if (wParam == WM_LBUTTONDOWN)
		{
		CPoint p;
		char x[6];char k=' ';
		CRect r;
		
		  GetCursorPos(&p);
		  HWND window = WindowFromPoint(p);
		  window = GetAncestor(window, GA_ROOT);
		  WINDOWINFO info;
		  info.cbSize = sizeof(WINDOWINFO);
		  GetWindowInfo(window, &info);
		  r = info.rcWindow;
		  //			::GetWindowRect(window, &r);
		  itoa(r.top, x, 10);
		  fwrite(&x,1,sizeof(x),f1);
		  fwrite(&k,1,sizeof(k),f1);
		  itoa(r.bottom, x, 10);
		  fwrite(&x,1,sizeof(x),f1);
		  fwrite(&k,1,sizeof(k),f1);
		  itoa(r.left, x, 10);
		  fwrite(&x,1,sizeof(x),f1);
		  fwrite(&k,1,sizeof(k),f1);
		  itoa(r.right, x, 10);
		  fwrite(&x,1,sizeof(x),f1);
		  fwrite(&k,1,sizeof(k),f1);
		  
			char temp[51];
			//			itoa(info.wCreatorVersion, temp, 10);
			GetClassName(window, temp, 50);
			fwrite(temp, 1, strlen(temp),f1);
			
			  fwrite(&k,1,sizeof(k),f1);
			  
				GetWindowText(window, temp, 50);
				fwrite(temp, 1, strlen(temp),f1);
				
				  k='\n';
				  fwrite(&k,1,sizeof(k),f1);
	}*/
		
		//time, position, window underneath the cursor
		//if (wParam == WM_LBUTTONDOWN)
		//	if(wParam == WM_MOUSEMOVE
		//	 || wParam == WM_MOUSEACTIVATE
		//	)
		{
			f2=fopen(mousefile,"a");
			time_t rawtime;
			
			time ( &rawtime );
			char buffer[51];
			itoa((int)rawtime, buffer, 10);
			fwrite(buffer,1,strlen(buffer),f2);
			
	//		POINT p = ((MOUSEHOOKSTRUCT*)lParam)->pt;
			CPoint p;GetCursorPos(&p);
	//		HWND hwnd = ((MOUSEHOOKSTRUCT*)lParam)->hwnd;
			char i = '\n';
			char j = ' ';
	/*		char move[] = "Move   ";
			char activate[] = "Activate   ";
			char classname[] = "Classname: ";
			
			if(wParam == WM_MOUSEMOVE)
				fwrite(move, 1,strlen(move),f2);
			else if(wParam == WM_MOUSEACTIVATE)
				fwrite(activate, 1,strlen(activate),f2);
			
			fwrite(classname,1,strlen(classname),f2); 
			GetClassName(hwnd, buffer, 50);
			fwrite(buffer, 1, strlen(buffer),f2);
	*/		
	//		fwrite(&i,1,1,f2);
			fwrite(&j,1,1,f2);
			itoa(p.x,buffer,10);
			fwrite(buffer,1,strlen(buffer),f2);
			fwrite(&j,1,1,f2);
			itoa(p.y,buffer,10);
			fwrite(buffer,1,strlen(buffer),f2);		
			fwrite(&i,1,1,f2);
			fclose(f2);
		}
	}

	LRESULT RetVal = CallNextHookEx( hms, nCode, wParam, lParam );	
	
	return  RetVal;
}

LRESULT __declspec(dllexport)__stdcall CALLBACK ShellProc(      
    int nCode,
    WPARAM wParam,
    LPARAM lParam)
{
	char temp[51];
	char opened[] = "Opened";
	char closed[] = "Closed";
	
	char handle[] = "Handle: ";
	char classname[] = "   Classname: ";
	char title[] = "   Title: ";
	char parent[] = "   Parent: ";

	HWND hwnd = (HWND)wParam;

	TCHAR szText[256];

	GetClassName(hwnd, szText, 256);
	if(!strcmp(szText, "Ghost"))
		return CallNextHookEx( hshell, nCode, wParam, lParam );

	if(nCode == HSHELL_WINDOWCREATED || nCode == HSHELL_WINDOWDESTROYED)
	{
/*		if (//(!IsWindowVisible(hwnd) && nCode == HSHELL_WINDOWCREATED) || 
			GetWindow(hwnd, GW_OWNER) != NULL)
			return CallNextHookEx( hshell, nCode, wParam, lParam );
*/		
		
		DWORD cchText = GetWindowText(hwnd, szText, 256);
		
		if (cchText == 0)
			return CallNextHookEx( hshell, nCode, wParam, lParam );

		
/*		
		char szClassName[256];
		GetClassName(hwnd, szClassName, sizeof(szClassName));
		if(!strcmp(szClassName, "#32770") || !strcmp(szClassName, "Progman") )
			return CallNextHookEx( hshell, nCode, wParam, lParam );
*/

		f1=fopen(windowfile,"a");
		
		time_t rawtime;
		time ( &rawtime );
		itoa((int)rawtime, temp, 10);
		fwrite(temp,1,strlen(temp),f1);
		char i ='\n';
		fwrite(&i,1,sizeof(i),f1);

/*		GetClassName(hwnd, temp, 50);
		if(!strcmp(temp, "#32770"))
			return CallNextHookEx(hshell, nCode, wParam, lParam );
*/
		if(nCode == HSHELL_WINDOWCREATED)
		{	fwrite(opened,1,strlen(opened),f1);strcpy(preLog, opened);}
		if(nCode == HSHELL_WINDOWDESTROYED)
		{	fwrite(closed,1,strlen(closed),f1);strcpy(preLog, closed);}
		
		fwrite(&i,1,sizeof(i),f1);

		fwrite(handle,1,strlen(handle),f1);
		itoa((int)(HWND)wParam, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		
		fwrite(classname,1,strlen(classname),f1);
		GetClassName((HWND)wParam, temp, 50);
		fwrite(temp, 1, strlen(temp),f1);		
		
/////// bo phan nay trong comment de khoi lay title
		
		fwrite(title,1,strlen(title),f1);
		GetWindowText((HWND)wParam, temp, 50);
		fwrite(temp, 1, strlen(temp),f1);

///////		
		

/*		HWND desktop = GetDesktopWindow();
		HWND parentwin = GetAncestor((HWND)wParam, GA_PARENT);
		if(!parentwin || parentwin == desktop)	//top level, unowned window
			parentwin = (HWND)wParam;
		fwrite(parent,1,strlen(parent),f1); 
		GetClassName(parentwin, temp, 50);
		fwrite(temp, 1, strlen(temp),f1);	
*/
		fwrite(&i,1,sizeof(i),f1);
		i = ' ';
		
		CRect r;
		::GetWindowRect((HWND)wParam, &r);
		preHwnd = (HWND)wParam;
		preRect = r;
		itoa(r.top, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		fwrite(&i,1,sizeof(i),f1);
		itoa(r.bottom, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		fwrite(&i,1,sizeof(i),f1);
		itoa(r.left, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		fwrite(&i,1,sizeof(i),f1);
		itoa(r.right, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		fwrite(&i,1,sizeof(i),f1);
		
		i = '\n';
		fwrite(&i,1,sizeof(i),f1);
		fclose(f1);
	}
	
	LRESULT RetVal = CallNextHookEx(hshell, nCode, wParam, lParam );	
	
	return  RetVal;
}

LRESULT __declspec(dllexport)__stdcall CALLBACK CallWndProc(      
    int code,
    WPARAM wParam,
    LPARAM lParam)
{
	if(code == HC_ACTION)
	{ 
		
		CWPSTRUCT *msg = (CWPSTRUCT*)lParam;
		char temp[51];

//		char closed[] = "Closed ";
		char moved[] = "Moved";
		char resized[] = "Resized";
		char active[] = "Active";
		char clickactive[] = "Clickactive";
//		char inactive[] = "Inactive";
		char min[] = "Minimized";
//		char normal[] = "Normal";
		char max[] = "Maximized";

		char handle[] = "Handle: ";
		char classname[] = "   Classname: ";
		char title[] = "   Title: ";
		char parent[] = "   Parent: ";

		WINDOWINFO info;
		info.cbSize = sizeof(WINDOWINFO);
		GetWindowInfo(msg->hwnd, &info);

	//	if(!IsWindowVisible(msg->hwnd) )
		//			GetWindow(msg->hwnd, GW_OWNER) != NULL )
			if((info.dwStyle & WS_VISIBLE) == 0)
				return CallNextHookEx( hcwnd, code, wParam, lParam );
			if(GetParent(msg->hwnd))
				return CallNextHookEx( hcwnd, code, wParam, lParam );
		
		TCHAR szText[256];
		DWORD cchText = GetWindowText(msg->hwnd, szText, 256);
		
		if (cchText == 0)
			return CallNextHookEx( hcwnd, code, wParam, lParam );

		GetClassName(msg->hwnd, szText, 256);
		if(!strcmp(szText, "Ghost"))
			return CallNextHookEx( hcwnd, code, wParam, lParam );

/*		char szClassName[256];
		GetClassName(msg->hwnd, szClassName, sizeof(szClassName));
		if(!strcmp(szClassName, "#32770") || !strcmp(szClassName, "Progman") )
			return CallNextHookEx( hcwnd, code, wParam, lParam );
*/

		
	/*	
		if(msg->message == WM_DISPLAYCHANGE)
		{
			f1=fopen(windowfile,"a");
			time_t rawtime;
			time ( &rawtime );
			char buffer[51];
			itoa((int)rawtime, buffer, 10);
			fwrite(&buffer,1,strlen(buffer),f1);
			
			char i ='\n';
			fwrite(&i,1,sizeof(i),f1);
			i= ' ';
			char str[10];
			int x = GetSystemMetrics(SM_CXSCREEN);itoa(x, str, 10);
			fwrite(str, 1, strlen(str),f1);fwrite(&i,1,sizeof(i),f1);
			x = GetSystemMetrics(SM_CYSCREEN);itoa(x, str, 10);
			fwrite(str, 1, strlen(str),f1);fwrite(&i,1,sizeof(i),f1);
			x = GetSystemMetrics(SM_XVIRTUALSCREEN);itoa(x, str, 10);
			fwrite(str, 1, strlen(str),f1);fwrite(&i,1,sizeof(i),f1);
			x = GetSystemMetrics(SM_YVIRTUALSCREEN);itoa(x, str, 10);
			fwrite(str, 1, strlen(str),f1);
			
			i ='\n';fwrite(&i,1,sizeof(i),f1);
			fclose(f1);
			return CallNextHookEx(hcwnd, code, wParam, lParam );
			
		}*/

		if(//msg->message == WM_SHOWWINDOW //
		//	msg->message == WM_CREATE)
			(msg->message == WM_ACTIVATE && LOWORD(msg->wParam) != WA_INACTIVE) ||

	//		msg->message == WM_SIZE ||
			 msg->message == WM_MOVE )
//	 msg->message == WM_WINDOWPOSCHANGED)
		{
/*			WINDOWINFO info;
		info.cbSize = sizeof(WINDOWINFO);
		GetWindowInfo(msg->hwnd, &info);

			if(!(info.dwStyle & WS_VISIBLE) || GetParent(msg->hwnd))
 
		//	if (!IsWindowVisible(msg->hwnd) )
				return CallNextHookEx( hcwnd, code, wParam, lParam );
*/		
/*			CREATESTRUCT* p = (CREATESTRUCT*)lParam;
//			if(!(p->style & WS_VISIBLE))
//				return CallNextHookEx( hcwnd, code, wParam, lParam );
			
			FILE* f0=fopen("c:\\logs\\test.txt","a");
			
			fwrite("b\n",1,strlen("b\n"),f0);
			fclose(f0);
*/			
			
			HWND window = msg->hwnd;
			
			//		WINDOWPOS *winpos = (WINDOWPOS*)msg->lParam;
			
		/*	HWND desktop = GetDesktopWindow();
			HWND parentwin = GetAncestor(msg->hwnd, GA_PARENT);
			HWND temphwnd = parentwin;
			while(temphwnd && temphwnd != desktop)
			{
				parentwin = temphwnd;
				temphwnd = GetAncestor(temphwnd, GA_PARENT);
			}
			if(!parentwin || parentwin == desktop)
				parentwin = msg->hwnd;
			
			GetClassName(parentwin, temp, 50);
			if(!strcmp(temp, "Message"))
				return CallNextHookEx(hcwnd, code, wParam, lParam );
	*/		
			HWND parentwin = msg->hwnd;

			CRect r;
			::GetWindowRect(parentwin, &r);
			
			if(r.top == 0 && r.bottom == 0 && r.left == 0 && r.right == 0)
				return CallNextHookEx(hcwnd, code, wParam, lParam );
			char test[15];
			if(msg->message == WM_ACTIVATE && LOWORD(msg->wParam) == WA_ACTIVE)
				strcpy(test, active);
			if(msg->message == WM_ACTIVATE && LOWORD(msg->wParam) == WA_CLICKACTIVE)
				strcpy(test, clickactive);
			else
				strcpy(test, moved);

			if(parentwin == preHwnd && !strcmp(preLog, test) && (preRect.bottom == r.bottom && preRect.top == r.top 
				&& preRect.left == r.left && preRect.right == r.right))
				return CallNextHookEx(hcwnd, code, wParam, lParam );

			preHwnd = parentwin;
			
			preRect = r; 
			
			//date time
			
			f1=fopen(windowfile,"a");

			time_t rawtime;
			
			time ( &rawtime );
			char buffer[51];
			itoa((int)rawtime, buffer, 10);
			fwrite(&buffer,1,strlen(buffer),f1);
			
			char i ='\n';
			fwrite(&i,1,sizeof(i),f1);
			
			//window status
			
			
			if(msg->message == WM_SIZE)
			{
				if(msg->wParam == SIZE_MAXIMIZED)
				{	fwrite(max,1,strlen(max),f1);}
				else if(msg->wParam == SIZE_MINIMIZED)
				{	fwrite(min,1,strlen(min),f1);}
				else if(msg->wParam == SIZE_RESTORED)
				{	fwrite(resized,1,strlen(resized),f1);}
			}
			else if(msg->message == WM_CREATE)
			{	fwrite("Created",1, strlen("Created"),f1);}
			else if(msg->message == WM_ACTIVATE)
			{
				WORD w = LOWORD(msg->wParam);
				if(w == WA_ACTIVE)
				{	fwrite(active,1,strlen(active),f1);strcpy(preLog, active);}
				else if(w == WA_CLICKACTIVE)
				{	fwrite(clickactive,1,strlen(clickactive),f1);strcpy(preLog, clickactive);}
			}
			
			else if(msg->message == WM_MOVE)
			{	fwrite(moved,1,strlen(moved),f1);strcpy(preLog, moved);}
			
/*			else if(msg->message == WM_WINDOWPOSCHANGED)
			{
				WINDOWPOS* pos = (WINDOWPOS*)lParam;
				
				if (pos->flags & SWP_SHOWWINDOW) {
					fwrite("Showed",1, strlen("Showed"),f1);
				}
				if (pos->flags & SWP_HIDEWINDOW) {
					fwrite("Hidden",1, strlen("Hidden"),f1);
				}
				if (pos->flags == (SWP_NOSIZE | SWP_NOZORDER)
					) {
					fwrite("Moved",1, strlen("Moved"),f1);
				}
				if (pos->flags == (SWP_NOSIZE | SWP_NOMOVE | SWP_NOZORDER | SWP_NOACTIVATE | SWP_FRAMECHANGED)
					) {
					fwrite("Resized",1, strlen("Resized"),f1);
				}
			}
*/
			fwrite(&i,1,sizeof(i),f1);
			
			
			//window info
			
			
	//		parentwin = ::GetForegroundWindow();
			
			fwrite(handle, 1, strlen(handle), f1);
			itoa((int)parentwin, temp, 10);
			fwrite(temp, 1, strlen(temp), f1);
			
			fwrite(classname,1,strlen(classname),f1); 
			GetClassName(parentwin, temp, 50);
			fwrite(temp, 1, strlen(temp),f1);

//////// bo phan nay trong comment de khoi lay title

			fwrite(title,1,strlen(title),f1);
			GetWindowText(parentwin, temp, 50);
			fwrite(temp, 1, strlen(temp),f1);
			
////////	

			/*
			fwrite(parent,1,strlen(parent),f1); 
			GetClassName(parentwin, temp, 50);
			fwrite(temp, 1, strlen(temp),f1);
			*/
			
			i ='\n';
			fwrite(&i,1,sizeof(i),f1);
			i= ' ';
			
			//coordinates
			
			
			itoa(r.top, temp, 10);
			fwrite(temp, 1, strlen(temp),f1);
			fwrite(&i,1,sizeof(i),f1);
			itoa(r.bottom, temp, 10);
			fwrite(temp, 1, strlen(temp),f1);
			fwrite(&i,1,sizeof(i),f1);
			itoa(r.left, temp, 10);
			fwrite(temp, 1, strlen(temp),f1);
			fwrite(&i,1,sizeof(i),f1);
			itoa(r.right, temp, 10);
			fwrite(temp, 1, strlen(temp),f1);
			fwrite(&i,1,sizeof(i),f1);
			
			i = '\n';
			fwrite(&i,1,sizeof(i),f1);

			fclose(f1);
		}
		
	}

	LRESULT RetVal = CallNextHookEx(hcwnd, code, wParam, lParam );
	
	return  RetVal;
}
LRESULT __declspec(dllexport)__stdcall CALLBACK CBTProc(      
    int nCode,
    WPARAM wParam,
    LPARAM lParam
)
{
	char temp[51];
	char opened[] = "Opened ";
	char closed[] = "Closed ";
	
	char handle[] = "Handle: ";
	char classname[] = "   Classname: ";
	char title[] = "   Title: ";
	char parent[] = "   Parent: ";

	if(nCode == HCBT_CREATEWND  
	//	nCode == HCBT_SETFOCUS
		
		)
	{
		HWND hwnd = (HWND)wParam;
		if ((!IsWindowVisible(hwnd)) ) 
	//		GetWindow(hwnd, GW_OWNER) != NULL)
			return 0;
/*		TCHAR szText[256];
		DWORD cchText = GetWindowText(hwnd, szText, 256);
		FILE*f9=fopen("c:\\test.txt", "a");
		fwrite("aat", 1, strlen("aat"), f9);
		fclose(f9);
		if (cchText == 0)
			return 0;
*/	
/*			HWND desktop = GetDesktopWindow();
			HWND parentwin = GetAncestor(hwnd, GA_PARENT);
			HWND temphwnd = parentwin;
			while(temphwnd && temphwnd != desktop)
			{
				parentwin = temphwnd;
				temphwnd = GetAncestor(temphwnd, GA_PARENT);
			}
			if(!parentwin || parentwin == desktop)
				parentwin = hwnd;
*/			
		  HWND parentwin = hwnd;
			f1=fopen(windowfile,"a");
		
		time_t rawtime;
			
			time ( &rawtime );
			itoa((int)rawtime, temp, 10);
		fwrite(temp,1,strlen(temp),f1);

		char i ='\n';
		fwrite(&i,1,sizeof(i),f1);

		fwrite(handle,1,strlen(handle),f1);
		itoa((int)parentwin, temp, 10);
		fwrite(temp, 1, strlen(temp),f1);
		
		fwrite(classname,1,strlen(classname),f1);
		GetClassName(parentwin, temp, 50);
		fwrite(temp, 1, strlen(temp),f1);

		i = '\n';
		fwrite(&i,1,sizeof(i),f1);
		fclose(f1);
	}
	return 0;
}

BOOL __declspec(dllexport)__stdcall Hook()
{
	FILE* f=fopen("config.txt", "r");
	fscanf(f, "%s", number);
	fclose(f);
	strcat(number, ".txt");
	strcat(mousefile, number);
	strcat(windowfile, number);
	f1=fopen(windowfile,"w");
	fclose(f1);
	f2=fopen(mousefile,"w");
	fclose(f2);

	preHwnd = NULL;
	preLog[0] = '\0';
	preRect.bottom = preRect.left = preRect.right = preRect.top = 0;

	hkb=SetWindowsHookEx(WH_KEYBOARD_LL,(HOOKPROC)LowLevelKeyboardProc,hins,0);
	hms = SetWindowsHookEx(WH_MOUSE_LL, (HOOKPROC)LowLevelMouseProc, hins, 0);
	hshell = SetWindowsHookEx(WH_SHELL, (HOOKPROC)ShellProc, hins, 0);
//	cbt = SetWindowsHookEx(WH_CBT, (HOOKPROC)CBTProc, hins, 0);
	hcwnd = SetWindowsHookEx(WH_CALLWNDPROC, (HOOKPROC)CallWndProc, hins, 0);
	return TRUE;
}
BOOL __declspec(dllexport)  UnHook()
{
	return UnhookWindowsHookEx(hkb) & 
		UnhookWindowsHookEx(hms) & 
		UnhookWindowsHookEx(hshell) & 
//		UnhookWindowsHookEx(cbt);
		UnhookWindowsHookEx(hcwnd);
} 


BOOL CExportApp::InitInstance ()
{
	
	AFX_MANAGE_STATE(AfxGetStaticModuleState());
	hins=AfxGetInstanceHandle();
	return TRUE;
	
}
BOOL CExportApp::ExitInstance ()
{
	return TRUE;
}

CExportApp::CExportApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}

/////////////////////////////////////////////////////////////////////////////
// The one and only CExportApp object

CExportApp theApp;
