using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;

namespace WebBrowser
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void buttonGo_Click(object sender, EventArgs e)
        {
            String url = textBoxAddressBar.Text;
            if (url == "" || url == "Type to search")
                webBrowser1.Navigate("http://www.google.com");
            

            if (!url.StartsWith("www."))
                url = "www." + url;
            
            webBrowser1.Navigate(textBoxAddressBar.Text);
            tabPage2.Text = "Loading";
        }

        private void buttonClose_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void textBoxAddressBar_Enter(object sender, EventArgs e)
        {
            textBoxAddressBar.SelectAll();
        }

        private void textBoxAddressBar_DragDrop(object sender, DragEventArgs e)
        {
            webBrowser1.Navigate(sender.ToString());
        }

        private void toolStripMenuItem1_Click(object sender, EventArgs e)
        {
            System.Windows.Forms.WebBrowser newBrowser = new System.Windows.Forms.WebBrowser();
            TabPage newTab = new TabPage(); newTab.Controls.Add(newBrowser);
            newBrowser.Dock = System.Windows.Forms.DockStyle.Fill;
            newBrowser.Location = new System.Drawing.Point(3, 3);
            newBrowser.MinimumSize = new System.Drawing.Size(20, 20);
            newBrowser.Name = "webBrowser1";
            newBrowser.Size = new System.Drawing.Size(640, 394);
            newBrowser.TabIndex = 6;
            tabControl1.TabPages.Add(newTab);
       //     newBrowser.Navigate("http://www.google.com");
        }

        private void tabControl1_MouseClick(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Right)
                contextMenuStrip1.Show(tabControl1, e.Location);
        }

        private void buttonPrevious_Click(object sender, EventArgs e)
        {
            webBrowser1.GoBack();
        }

        private void buttonNext_Click(object sender, EventArgs e)
        {
            webBrowser1.GoForward();
        }

        private void buttonRefresh_Click(object sender, EventArgs e)
        {
            webBrowser1.Refresh();
        }

        private void webBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            tabPage2.Text = webBrowser1.DocumentTitle;
        }

        private void webBrowser1_ProgressChanged(object sender, WebBrowserProgressChangedEventArgs e)
        {
            progressBar1.Maximum = (int)e.MaximumProgress;
            progressBar1.Value = (int)e.CurrentProgress;
        }

        private void textBoxAddressBar_MouseClick(object sender, MouseEventArgs e)
        {
            textBoxAddressBar.SelectAll();
        }

        private void textBoxAddressBar_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)13)
                buttonGo_Click(buttonGo, EventArgs.Empty);
        }
    }
}