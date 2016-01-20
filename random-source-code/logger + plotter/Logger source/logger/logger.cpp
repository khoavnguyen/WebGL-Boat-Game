// logger.cpp : Defines the class behaviors for the application.
//

#include "stdafx.h"
#include "logger.h"
#include "loggerDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CLoggerApp

BEGIN_MESSAGE_MAP(CLoggerApp, CWinApp)
	//{{AFX_MSG_MAP(CLoggerApp)
		// NOTE - the ClassWizard will add and remove mapping macros here.
		//    DO NOT EDIT what you see in these blocks of generated code!
	//}}AFX_MSG
	ON_COMMAND(ID_HELP, CWinApp::OnHelp)
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CLoggerApp construction

CLoggerApp::CLoggerApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}

/////////////////////////////////////////////////////////////////////////////
// The one and only CLoggerApp object

CLoggerApp theApp;

/////////////////////////////////////////////////////////////////////////////
// CLoggerApp initialization

BOOL CLoggerApp::InitInstance()
{
	// Standard initialization
	// If you are not using these features and wish to reduce the size
	//  of your final executable, you should remove from the following
	//  the specific initialization routines you do not need.

#ifdef _AFXDLL
	Enable3dControls();			// Call this when using MFC in a shared DLL
#else
	Enable3dControlsStatic();	// Call this when linking to MFC statically
#endif

	CWnd *pWnd = NULL;

if(!::IsWindow(m_Invisible_pWnd.m_hWnd))
{
    LPCTSTR pstrOwnerClass = AfxRegisterWndClass(0);

    // Create an invisible parent window

    if(m_Invisible_pWnd.CreateEx(0, pstrOwnerClass, _T(""), WS_POPUP, 
                CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, 
                NULL, 0))
    {
        pWnd = &m_Invisible_pWnd;
    }
}

	CLoggerDlg dlg(pWnd);
	m_pMainWnd = &dlg;
	int nResponse = dlg.DoModal();
	if (nResponse == IDOK)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with OK
	}
	else if (nResponse == IDCANCEL)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with Cancel
	}

	// Since the dialog has been closed, return FALSE so that we exit the
	//  application, rather than start the application's message pump.
	return FALSE;
}
