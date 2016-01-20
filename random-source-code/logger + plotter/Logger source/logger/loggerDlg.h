// sgDlg.h : header file
//

#if !defined(AFX_SGDLG_H__43B82ED6_CC1C_494B_A96F_6BADA6C442DF__INCLUDED_)
#define AFX_SGDLG_H__43B82ED6_CC1C_494B_A96F_6BADA6C442DF__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

/////////////////////////////////////////////////////////////////////////////
// CLoggerDlg dialog


class CLoggerDlg : public CDialog
{
// Construction
public:
	CLoggerDlg(CWnd* pParent = NULL);	// standard constructor
	LRESULT onTrayNotify(WPARAM wParam,LPARAM lParam);
// Dialog Data
	//{{AFX_DATA(CLoggerDlg)
	enum { IDD = IDD_LOGGER_DIALOG };

	//}}AFX_DATA

	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CLoggerDlg)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:
	HICON m_hIcon;
	bool flag;
	// Generated message map functions
	//{{AFX_MSG(CLoggerDlg)
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	afx_msg void OnClose();
	afx_msg void OnDestroy();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_SGDLG_H__43B82ED6_CC1C_494B_A96F_6BADA6C442DF__INCLUDED_)
