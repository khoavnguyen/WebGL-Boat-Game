// stdafx.h : include file for standard system include files,
//  or project specific include files that are used frequently, but
//      are changed infrequently
//
#ifdef WINVER
#undef WINVER
#endif
#define WINVER 0x500

#ifndef _WIN32_IE
#define _WIN32_IE 0x0500    // enable shell v5 features
#elif _WIN32_IE < 0x0500
#undef _WIN32_IE
#define _WIN32_IE 0x0500    // enable shell v5 features
#endif

#if !defined(AFX_STDAFX_H__117FF653_CF09_4C96_B9A8_84CA455D7471__INCLUDED_)
#define AFX_STDAFX_H__117FF653_CF09_4C96_B9A8_84CA455D7471__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000


#define VC_EXTRALEAN		// Exclude rarely-used stuff from Windows headers

#include <afxwin.h>         // MFC core and standard components
#include <afxext.h>         // MFC extensions
#include <afxdisp.h>        // MFC Automation classes
#include <afxdtctl.h>		// MFC support for Internet Explorer 4 Common Controls
#ifndef _AFX_NO_AFXCMN_SUPPORT
#include <afxcmn.h>			// MFC support for Windows Common Controls

#endif // _AFX_NO_AFXCMN_SUPPORT


//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_STDAFX_H__117FF653_CF09_4C96_B9A8_84CA455D7471__INCLUDED_)
