#if !defined(AFX_HODLL_H__B2A458DC_71E2_47D5_9EA0_58385D558643__INCLUDED_)
#define AFX_HODLL_H__B2A458DC_71E2_47D5_9EA0_58385D558643__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#ifndef __AFXWIN_H__
	#error include 'stdafx.h' before including this file for PCH
#endif

//#include "resource.h"


LRESULT __declspec(dllexport)__stdcall  CALLBACK LowLevelKeyboardProc(
                            int nCode, 
                            WPARAM wParam, 
                            LPARAM lParam);

LRESULT __declspec(dllexport)__stdcall CALLBACK LowLevelMouseProc(      
    int nCode,
    WPARAM wParam,
    LPARAM lParam);

LRESULT __declspec(dllexport)__stdcall CALLBACK ShellProc(      
    int nCode,
    WPARAM wParam,
    LPARAM lParam);

LRESULT __declspec(dllexport)__stdcall CALLBACK CallWndProc(      
    int code,
    WPARAM wParam,
    LPARAM lParam);


BOOL __declspec(dllexport)__stdcall  Hook();

BOOL __declspec(dllexport)  UnHook();

class CExportApp : public CWinApp
{
public:
BOOL ExitInstance ();
	CExportApp();
  BOOL InitInstance ();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CExportApp)
	//}}AFX_VIRTUAL

	//{{AFX_MSG(CExportApp)
		// NOTE - the ClassWizard will add and remove member functions here.
		//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_HODLL_H__B2A458DC_71E2_47D5_9EA0_58385D558643__INCLUDED_)
