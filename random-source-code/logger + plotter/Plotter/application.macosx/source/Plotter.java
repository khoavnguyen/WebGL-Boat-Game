import processing.core.*; 
import processing.xml.*; 

import java.awt.*; 

import java.applet.*; 
import java.awt.*; 
import java.awt.image.*; 
import java.awt.event.*; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class Plotter extends PApplet {

BufferedReader mouseReader, windowReader;
String mouseEntry, windowEntry;
ArrayList windowList;

Point origin;
Point mouse;
String time, mouseTime, windowTime;
float [] sizing;

boolean auto;
boolean running;
PFont font;

int [] resolution = {
  1024, 768};

public void setup()
{
  frameRate(3);
  size(1000, 750);
  smooth();
  strokeWeight(5);
  stroke(150);
  background(240);
  origin = new Point(150, 10);
  mouse = new Point(0,0);
  time = mouseTime = windowTime = "0";
  sizing = new float [2];
  sizing[0] = (float)resolution[0] / 800;
  sizing[1] = (float)resolution[1] / 600;


  rect(origin.x, origin.y, 800, 600); 
  rect(25, 25, 50, 50);
  fill(0, 255, 0);
  triangle(45, 40, 45, 60, 60, 50);
  hint(ENABLE_NATIVE_FONTS);
  auto = true;
  running = false;
  font = loadFont("ArialMT-48.vlw"); 
  textFont(font, 20); 

  mouseReader = null;
  windowReader = null;
  windowList = new ArrayList();
  selectFile();
}

public void selectFile()
{
  String loadPath;
  //  loadPath = selectInput("Load mouse log"); 
  //  mouseReader = createReader(loadPath);

  loadPath = selectInput("Load session log");
  windowReader = createReader(loadPath);
  readSession();


  loadPath = selectInput("Load window log");
  windowReader = createReader(loadPath);
}

public void draw() {

  //  auto = false;plot();
  if(auto)
  {
    fill(0, 255, 0);
    triangle(45, 40, 45, 60, 60, 50);
    plot();  
  }
  else
  {
    fill(255, 255, 0);
    triangle(45, 40, 45, 60, 60, 50);
  }
}
public void readSession()
{
  try
  {
    time = windowReader.readLine();
    windowReader.readLine();
    String temp = windowReader.readLine();
    String[] pieces = split(temp, ' ');
    resolution[0] = PApplet.parseInt(pieces[2]);
    resolution[1] = PApplet.parseInt(pieces[3]);

    sizing[0] = (float)resolution[0] / 800;
    sizing[1] = (float)resolution[1] / 600;

    temp = windowReader.readLine();

    while(temp != null)
    {
      pieces = split(temp, ' ');
      CWindow x = new CWindow();
      x.handle = pieces[0];
      x.classname = pieces[1];
      x.title = temp;

      temp = windowReader.readLine();
      if(temp == null)
        break;
      pieces = split(temp, ' ');
      x.rect.x = PApplet.parseInt(pieces[2]);
      x.rect.y = PApplet.parseInt(pieces[0]);
      x.rect.width = PApplet.parseInt(pieces[3]) - PApplet.parseInt(pieces[2]);
      x.rect.height = PApplet.parseInt(pieces[1]) - PApplet.parseInt(pieces[0]);
      if(x.rect.x < 0 && x.rect.y < 0 && PApplet.parseInt(pieces[2]) < 0 && PApplet.parseInt(pieces[3]) < 0)
        x.rect.x = x.rect.y = x.rect.width = x.rect.height = -1;
      windowList.add(0, x);
      temp = windowReader.readLine();
    }
    windowReader.close();
  }
  catch (IOException e) 
  {
    e.printStackTrace();
    windowEntry = null;
  }
}
public void readWindow()
{
  try
  {
    windowTime = windowReader.readLine();
    if(windowTime == null)
    {
      noLoop();  
      running = false;
    }
    
    String status = windowReader.readLine();
    if(status.equals("Window D") || status.equals("Alt Tab") || status.equals("Alt Escape"))
      return;

    String temp = windowReader.readLine();
    String [] piece = split(temp, ' ');
    CWindow x = new CWindow();
    x.handle = piece[1];
    x.classname = piece[3];
    x.title = temp;

    temp = windowReader.readLine();
    String [] pieces = split(temp, ' ');
    x.rect.x = PApplet.parseInt(pieces[2]);
    x.rect.y = PApplet.parseInt(pieces[0]);
    x.rect.width = PApplet.parseInt(pieces[3]) - PApplet.parseInt(pieces[2]);
    x.rect.height = PApplet.parseInt(pieces[1]) - PApplet.parseInt(pieces[0]);
    if(x.rect.x < 0 && x.rect.y < 0 && PApplet.parseInt(pieces[2]) < 0 && PApplet.parseInt(pieces[3]) < 0)
      x.rect.x = x.rect.y = x.rect.width = x.rect.height = -1;
    deleteWindow(x);
    
    if(!status.equals("Closed"))
      windowList.add(windowList.size(), x);
  }
  catch (IOException e) 
  {
    e.printStackTrace();
    windowEntry = null;
  }
}
public void deleteWindow(CWindow x)
{
  int n = windowList.size();
  for(int i = 0; i < n; i++)
  {
    CWindow temp = (CWindow)windowList.get(i);
    if(temp.handle.equals(x.handle))
    {
      windowList.remove(i);
      temp = null;
      return;
    }
  }
}
public void readMouse()
{
  try 
  {
    mouseEntry = mouseReader.readLine();
  } 
  catch (IOException e) {
    e.printStackTrace();
    mouseEntry = null;
  }
  if (mouseEntry == null) {
    // Stop reading because of an error or file is empty
    noLoop();  
    running = false;
  } 
  else {

    String[] pieces = split(mouseEntry, ' ');
    mouseTime = pieces[0];
    int x = PApplet.parseInt(pieces[1]);
    int y = PApplet.parseInt(pieces[2]);

    mouse.x = (int)(x / sizing[0] + origin.x);
    mouse.y = (int)(y / sizing[1] + origin.y);

  }
}

public void plot()
{
  fill(255, 255, 255);
  rect(origin.x, origin.y, 800, 600); 
  //plot window
  readWindow();
  
   noStroke();
   fill(240);
   rect(0, 100, 140, 200);
   stroke(150);
   fill(0, 102, 153);
  text(windowTime, 0, 100, 140, 200);
  
  String tree = new String();
  tree = "";
  int n = windowList.size();
  for(int i = 0; i < n; i++)
  {
    CWindow k = (CWindow)windowList.get(i);
    tree = k.title + "\n" + tree;
    Rectangle rec = new Rectangle();
    
    rec.x = (int) (k.rect.x / sizing[0] + origin.x);
    if(rec.x < origin.x)
      rec.x = origin.x;
    if(rec.x > origin.x + 800)
      continue;
    rec.y = (int) (k.rect.y / sizing[1] + origin.y);
    if(rec.y < origin.y)
      rec.y = origin.y;
    if(rec.y > origin.y + 600)
      continue;
      
    rec.width = k.rect.width;
    if(rec.width < 0)
      continue;    
    rec.width = (int)(rec.width / sizing[0]);
    if(rec.x + rec.width > origin.x + 800)
      rec.width = origin.x + 800 - rec.x;
      
    rec.height = k.rect.height;
    if(rec.height < 0)
      continue;
    rec.height = (int)(rec.height / sizing[1]);
    if(rec.y + rec.height > origin.y + 600)
      rec.height = origin.y + 600 - rec.y;

    fill(255, 255, 255);
    stroke(150);
    rect(rec.x, rec.y, rec.width, rec.height);
    noStroke();
    rect(rec.x + 10, rec.y + 10, rec.width - 20, rec.height - 20);
    stroke(150);
    fill(0,0,0);  
    text(k.title, rec.x + 10, rec.y + 10, rec.width - 20, rec.height - 20);
  }
  fill(255, 255, 255);
  rect(50, 620, 900, 120);
  textFont(font, 10); 
  fill(0,0,0);  
  text(tree, 80, 630, 850, 110);
  textFont(font, 20); 
  
  
  //plot mouse
  /*  readMouse();    
   noStroke();
   fill(240);
   rect(0, 100, 140, 200);
   stroke(150);
   fill(0, 102, 153);
   text(mouseTime, 0, 100, 140, 200);
   
   point(mouse.x, mouse.y);*/
}
public void mouseClicked()
{
  if(mouseX <= 100 && mouseY <= 100)
  {
    auto = !auto;
  }
}
  




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


  static public void main(String args[]) {
    PApplet.main(new String[] { "Plotter" });
  }
}
