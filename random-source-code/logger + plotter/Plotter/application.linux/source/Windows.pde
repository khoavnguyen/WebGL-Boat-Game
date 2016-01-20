import java.awt.*;

class CWindow
{
  public String handle;
  public String classname;
  public String title;
  public Rectangle rect;
  
  public CWindow()
  {
    handle = classname = title = null;
    rect = new Rectangle();
  }
  public void setHandle(String x)
  {
    handle = x;
  }
    
  public void setClassname(String x)
  {
    classname = x;
  }
    
  public void setTitle(String x)
  {
    title = x;
  }
   
  public void setRect(Rectangle x)
  {
    rect = x;
  }
}

