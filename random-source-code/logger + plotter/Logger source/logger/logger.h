// logger.h : main header file for the LOGGER application
//

#if !defined(AFX_LOGGER_H__DBFD3216_8814_4D9B_9387_F3B82C7C1261__INCLUDED_)
#define AFX_LOGGER_H__DBFD3216_8814_4D9B_9387_F3B82C7C1261__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#ifndef __AFXWIN_H__
	#error include 'stdafx.h' before including this file for PCH
#endif

#include "resource.h"		// main symbols

/////////////////////////////////////////////////////////////////////////////
// CLoggerApp:
// See logger.cpp for the implementation of this class
//

class CLoggerApp : public CWinApp
{
public:
	CLoggerApp();
protected:
    CWnd m_Invisible_pWnd;
// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CLoggerApp)
	public:
	virtual BOOL InitInstance();
	//}}AFX_VIRTUAL

// Implementation

	//{{AFX_MSG(CLoggerApp)
		// NOTE - the ClassWizard will add and remove member functions here.
		//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_LOGGER_H__DBFD3216_8814_4D9B_9387_F3B82C7C1261__INCLUDED_)
