function JS3(a){var b=this,c=document.getElementById(a),d=c.getContext("2d"),e=[],f=[],h=[],l=[],y=!0,s="#ffffff",z="My Canvas",A=0,v=!1,B=!1,g,k,m,n,q;Object.defineProperty(this,"width",{get:function(){return c.width}});Object.defineProperty(this,"height",{get:function(){return c.height}});Object.defineProperty(this,"numChildren",{get:function(){return e.length}});Object.defineProperty(this,"mousePressed",{get:function(){return null!=g}});Object.defineProperty(this,"interactive",{get:function(){return B},
set:function(a){(B=a)?(c.addEventListener("mousedown",C),c.addEventListener("mouseup",u),c.addEventListener("mousemove",D),c.addEventListener("mouseover",E),c.addEventListener("mouseout",F),document.body.addEventListener("mouseup",u)):(c.removeEventListener("mousedown",C),c.removeEventListener("mouseup",u),c.removeEventListener("mousemove",D),c.removeEventListener("mouseover",E),c.removeEventListener("mouseout",F),document.body.removeEventListener("mouseup",u))}});Object.defineProperty(this,"position",
{get:function(){for(var a=0,b=0,d=c;null!=d;)a+=d.offsetLeft,b+=d.offsetTop,d=d.offsetParent;return{x:a,y:b}}});Object.defineProperty(this,"drawClean",{set:function(a){y=a}});Object.defineProperty(this,"radial",{set:function(a){n=a;q=s=void 0;r()}});Object.defineProperty(this,"linear",{set:function(a){q=a;n=s=void 0;r()}});Object.defineProperty(this,"background",{set:function(a){s=a;q=n=void 0;r()}});Object.defineProperty(this,"windowTitle",{set:function(a){z=a}});JS3setStageEvents(this);this.setSize=
function(a,b){c.width=a;c.height=b};this.addChild=function(a){a.parent=b;a.stage=d;e.push(a)};this.addChildAt=function(a,c){c<=e.length&&(a.parent=b);a.stage=d;e.splice(c,0,a)};this.getChildAt=function(a){return e[a]};this.getChildAtRandom=function(){return e[Math.floor(Math.random()*e.length)]};this.removeChild=function(a){for(var b=e.length-1;0<=b;b--)if(e[b]==a){removeChildAt(b);break}};this.removeChildAt=function(a){e[a].parent=null;e[a].stage=null;e.splice(a,1)};this.run=function(a,b,c,d){for(var e=
h.length-1;0<=e;e--)if(a==h[e].f)return;a=new JS3Runner(a,b,c,d);h.push(a);return a};this.stop=function(a){G(a)};this.tween=function(a,b,c){if(!a.isTweening){a.isTweening=!0;var d=new JS3Tween(a,b,c);void 0==d.delay?(d.start=Date.now(),l.push(d)):setTimeout(function(){d.start=Date.now();l.push(d)},1E3*d.delay)}};this.clear=function(){for(;e.length;)e[0]=null,e.splice(0,1);for(;f.length;)f[0]=null,f.splice(0,1);e=[];f=[];r()};this.reset=function(){for(;l.length;)l[0]=null,l.splice(0,1);for(;h.length;)h[0]=
null,h.splice(0,1);l=[];h=[];this.clear()};this.save=function(){var a=c.toDataURL("image/png"),b=window.open("","_blank","width="+c.width+", height="+c.height);b.document.write('<!DOCTYPE html style="padding:0; margin:0"><head><title>'+z+"</title>");b.document.write('</head><body style="background: #f2f2f2; padding:0; margin:0">');b.document.write('<img src="'+a+'"/>');b.document.write("</body></html>");b.document.close()};this.drawLine=function(a){a.stage=d;f.push(new JS3Line(a))};this.drawArc=function(a){a.stage=
d;f.push(new JS3Arc(a))};this.drawRect=function(a){a.stage=d;f.push(new JS3Rect(a))};this.drawCircle=function(a){a.stage=d;f.push(new JS3Circle(a))};this.drawTri=function(a){a.stage=d;f.push(new JS3Tri(a))};this.drawText=function(a){a.stage=d;f.push(new JS3Text(a))};var C=function(){d.dx=d.mx;d.dy=d.my;g=k;j(k,"mouseDown")},u=function(){if(m)j(m,"dragComplete"),m=g=void 0;else{var a=Date.now();200<a-A?k==g&&j(k,"click"):k==g&&j(k,"doubleClick");g=void 0;A=a}j(k,"mouseUp")},D=function(a){var w=0,x=
0,f=c;do w+=f.offsetLeft,x+=f.offsetTop;while(f=f.offsetParent);d.mx=a.pageX-w;d.my=a.pageY-x;a:{for(a=e.length-1;0<=a;a--)if(e[a].mouse&&e[a].enabled){a=e[a];break a}a=b}a!=k&&(j(a,"mouseOver"),j(k,"mouseOut"));k=a;window.document.body.style.cursor=k!=b?"pointer":"default";g&&g.draggable&&(void 0==m?(m=g,j(g,"dragStart")):(g.x+=d.mx-d.dx,g.y+=d.my-d.dy,d.dy=d.my,d.dx=d.mx,j(g,"dragChange")));v?(v=!1,j(b,"stageEnter")):j(a,"mouseMove")},E=function(){v=!0},F=function(){j(b,"stageLeave")},j=function(a,
b){for(var c=a;a;){if(a["_"+b])a["_"+b](H(b,c,a));a=a.parent}},H=function(a,c,e){a=new JS3Event(a,c,e,d.mx,d.my);c==b&&(a.target.name="Stage");return a};window.onfocus=function(){b._windowFocusIn&&b._windowFocusIn(new JS3Event("focusIn",b,b))};window.onblur=function(){b._windowFocusOut&&b._windowFocusOut(new JS3Event("focusOut",b,b))};var r=function(){if(n){var a=d.createRadialGradient(c.width/2,c.height/2,0,c.width/2,c.height/2,c.width/2);d.fillStyle=JS3.drawGradient(n,a)}else q?(a=d.createLinearGradient(0,
0,c.width,0),d.fillStyle=JS3.drawGradient(q,a)):d.fillStyle=s||"#ffffff";d.fillRect(0,0,c.width,c.height)},G=function(a){for(var b=h.length-1;0<=b;b--)a==h[b].f&&h.splice(b,1)};JS3.func.push(function(){for(var a=0;a<l.length;a++){t=l[a];if(0==t.elapsed&&void 0!=t.onStart)t.onStart();t.elapsed=Date.now()-t.start;for(p in t.props)t.object[p]=t.easeFunc(t.elapsed,t.props[p].a,t.props[p].b,t.duration);if(t.elapsed>=t.duration){l.splice(a,1);t.object.isTweening=!1;for(p in t.props)t.object[p]=t.props[p].a+
t.props[p].b;if(void 0!=t.onComplete)t.onComplete()}}for(var a=Date.now(),b=0;b<h.length;b++){var c=h[b];if(void 0===c.d||a-c.t>1E3*c.d)c.f(),c.t=a,void 0!=c.r&&(c.r--,0==c.r&&(G(c.f),void 0!=c.o&&c.o()))}y&&r();for(i=0;i<e.length;)a=e[i],a.update(a),i++;for(;f.length;)a=f[0],a.update(a),f.splice(0,1)})}JS3.getRandomColor=function(){return"#"+Math.round(16777215*Math.random()).toString(16)};
JS3.getRandomValue=function(a,b){return void 0==a?Math.random():void 0==b?Math.random()*a:Math.random()*(b-a)+a};JS3.drawLine=function(a){a.cx=(a.x1+a.x2)/2;a.cy=(a.y1+a.y2)/2;JS3.openShape(a);a.stage.moveTo(a.x1-a.cx,a.y1-a.cy);a.stage.lineTo(a.x2-a.cx,a.y2-a.cy);JS3.drawShape(a)};
JS3.drawArc=function(a){a.cx=(a.x1+a.x2)/2;a.cy=(a.y1+a.y2)/2;JS3.openShape(a);a.stage.moveTo(a.x1-a.cx,a.y1-a.cy);a.stage.quadraticCurveTo(a.xc-a.cx,a.yc-a.cy,a.x2-a.cx,a.y2-a.cy);a.mouse=a.stage.isPointInPath(a.stage.mx,a.stage.my);JS3.stroke(a);a.stage.restore()};JS3.drawRect=function(a){JS3.getCntrPt(a);JS3.openShape(a);a.stage.rect(-a.cx,-a.cy,2*a.cx,2*a.cy);JS3.drawShape(a)};
JS3.drawCirc=function(a){JS3.getCntrPt(a);var b=0.5522848*a.cx,c=0.5522848*a.cy;JS3.openShape(a);a.stage.moveTo(-a.cx,0);a.stage.bezierCurveTo(-a.cx,-c,-b,-a.cy,0,-a.cy);a.stage.bezierCurveTo(b,-a.cy,a.cx,-c,a.cx,0);a.stage.bezierCurveTo(a.cx,c,b,a.cy,0,a.cy);a.stage.bezierCurveTo(-b,a.cy,-a.cx,c,-a.cx,0);JS3.drawShape(a)};
JS3.drawTri=function(a){6==a.pts.length?JS3.drawTriByPoints(a):a.width==a.height?JS3.drawTriEquilateral(a):JS3.drawTriDistorted(a);JS3.openShape(a);a.stage.moveTo(a._x1,a._y1);a.stage.lineTo(a._x2,a._y2);a.stage.lineTo(a._x3,a._y3);a.stage.lineTo(a._x1,a._y1);JS3.drawShape(a)};JS3.drawTriEquilateral=function(a){var b=a.width||a.size,c=(a.height||a.size)*(Math.sqrt(3)/2);a._x1=0;a._y1=-2*c/3;a._x2=b/2;a._y2=c/3;a._x3=-b/2;a._y3=c/3;a.cx=b/2;a.cy=c/2+c/2/3};
JS3.drawTriDistorted=function(a){var b=a.width||a.size,c=a.height||a.size;a._x1=0;a._y1=-c/2;a._x2=b/2;a._y2=c/2;a._x3=-b/2;a._y3=c/2;a.cx=b/2;a.cy=c/2};JS3.drawTriByPoints=function(a){a.cx=(a.pts[0]+a.pts[2]+a.pts[4])/3;a.cy=(a.pts[1]+a.pts[3]+a.pts[5])/3;a._x1=a.pts[0]-a.cx;a._y1=a.pts[1]-a.cy;a._x2=a.pts[2]-a.cx;a._y2=a.pts[3]-a.cy;a._x3=a.pts[4]-a.cx;a._y3=a.pts[5]-a.cy};
JS3.drawImage=function(a){!1!=a.image.src&&(a.cx=a.image.width/2,a.cy=a.image.height/2,JS3.openShape(a),a.stage.rect(-a.cx,-a.cy,2*a.cx,2*a.cy),a.stage.drawImage(a.image,-a.cx,-a.cy),JS3.drawShape(a))};JS3.drawText=function(a){var b=a.bold?"Bold ":"",b=b+(a.italic?"Italic ":"");a.stage.font=b+a.size+"pt "+a.font;a.stage.textAlign="left";a.stage.textBaseline="top";a.cy=JS3getTextHeight(a)/2;a.cx=a.stage.measureText(a.text).width/2;JS3.openShape(a);a.fill&&JS3.fill(a);a.stroke&&JS3.stroke(a);JS3.drawShape(a)};
JS3.fill=function(a){a._gradient&&a.drawGradient(a);a.stage.globalAlpha=a.alpha*a.fillAlpha;a.stage.fillStyle=a.color||a.fillColor;a instanceof JS3Text?a.stage.fillText(a.text,-a.cx,-a.cy):a.stage.fill();a.stage.globalAlpha=1};JS3.stroke=function(a){a.stage.globalAlpha=a.alpha*a.strokeAlpha;a.stage.lineCap=a.capStyle;a.stage.lineWidth=a.strokeWidth;a.stage.strokeStyle=a.strokeColor;a instanceof JS3Text?a.stage.strokeText(a.text,-a.cx,-a.cy):a.stage.stroke();a.stage.globalAlpha=1};
JS3.getCntrPt=function(a){a.cx=a.width/2||a.size/2;a.cy=a.height/2||a.size/2};JS3.openShape=function(a){a.stage.save();a.stage.globalAlpha=a.alpha;a.stage.translate(a.x+a.cx,a.y+a.cy);a.stage.scale(a.scaleX,a.scaleY);a.stage.rotate(a.rotation*Math.PI/180);a.stage.beginPath()};JS3.drawShape=function(a){a.stage.closePath();a.mouse=a.stage.isPointInPath(a.stage.mx,a.stage.my);a.fill&&JS3.fill(a);a.stroke&&JS3.stroke(a);a.stage.restore()};
JS3.drawRadial=function(a){var b=a.stage.createRadialGradient(0,0,0,0,0,a.size/2);a.color=JS3.drawGradient(a._gradient,b)};JS3.drawLinear=function(a){var b=a.stage.createLinearGradient(-a.width/2,0,a.width/2,0);a.color=JS3.drawGradient(a._gradient,b)};JS3.drawGradient=function(a,b){var c=a.length;if(1==c)return a[0];for(var d=0;d<c;d++)b.addColorStop(1/(c-1)*d,JS3.ToRGB(a[d]));return b};JS3.copyProps=function(a,b){for(var c in a)b[c]=a[c]};
JS3.ToRGB=function(a){a=JS3.getHexFromName(a);"#"==a.charAt(0)&&(a=a.substring(1,7));var b=parseInt(a.substring(0,2),16),c=parseInt(a.substring(2,4),16);a=parseInt(a.substring(4,6),16);return"rgba("+b+","+c+","+a+", 1)"};
JS3.getHexFromName=function(a){switch(a){case "aqua":return"#00FFFF";case "black":return"#000000";case "blue":return"#0000FF";case "fuchsia":return"#FF00FF";case "gray":return"#000000";case "grey":return"#808080";case "green":return"#808080";case "lime":return"#00FF00";case "maroon":return"#800000";case "navy":return"#000080";case "olive":return"#808000";case "purple":return"#800080";case "red":return"#ff0000";case "silver":return"#C0C0C0";case "teal":return"#008080";case "white":return"#ffffff";
case "yellow":return"#FFFF00"}return a};linear=function(a,b,c,d){return c*a/d+b};easeInQuad=function(a,b,c,d){a/=d;return c*a*a+b};easeOutQuad=function(a,b,c,d){a/=d;return-c*a*(a-2)+b};easeInOutQuad=function(a,b,c,d){a/=d/2;if(1>a)return c/2*a*a+b;a--;return-c/2*(a*(a-2)-1)+b};easeInCubic=function(a,b,c,d){a/=d;return c*a*a*a+b};easeOutCubic=function(a,b,c,d){a/=d;a--;return c*(a*a*a+1)+b};easeInOutCubic=function(a,b,c,d){a/=d/2;if(1>a)return c/2*a*a*a+b;a-=2;return c/2*(a*a*a+2)+b};
easeInQuart=function(a,b,c,d){a/=d;return c*a*a*a*a+b};easeOutQuart=function(a,b,c,d){a/=d;a--;return-c*(a*a*a*a-1)+b};easeInOutQuart=function(a,b,c,d){a/=d/2;if(1>a)return c/2*a*a*a*a+b;a-=2;return-c/2*(a*a*a*a-2)+b};easeInQuint=function(a,b,c,d){a/=d;return c*a*a*a*a*a+b};easeOutQuint=function(a,b,c,d){a/=d;a--;return c*(a*a*a*a*a+1)+b};easeInOutQuint=function(a,b,c,d){a/=d/2;if(1>a)return c/2*a*a*a*a*a+b;a-=2;return c/2*(a*a*a*a*a+2)+b};
easeInSine=function(a,b,c,d){return-c*Math.cos(a/d*(Math.PI/2))+c+b};easeOutSine=function(a,b,c,d){return c*Math.sin(a/d*(Math.PI/2))+b};easeInOutSine=function(a,b,c,d){return-c/2*(Math.cos(Math.PI*a/d)-1)+b};easeInExpo=function(a,b,c,d){return c*Math.pow(2,10*(a/d-1))+b};easeOutExpo=function(a,b,c,d){return c*(-Math.pow(2,-10*a/d)+1)+b};easeInOutExpo=function(a,b,c,d){a/=d/2;if(1>a)return c/2*Math.pow(2,10*(a-1))+b;a--;return c/2*(-Math.pow(2,-10*a)+2)+b};
easeInCirc=function(a,b,c,d){a/=d;return-c*(Math.sqrt(1-a*a)-1)+b};easeOutCirc=function(a,b,c,d){a/=d;a--;return c*Math.sqrt(1-a*a)+b};easeInOutCirc=function(a,b,c,d){a/=d/2;if(1>a)return-c/2*(Math.sqrt(1-a*a)-1)+b;a-=2;return c/2*(Math.sqrt(1-a*a)+1)+b};JS3.func=[];JS3.loop=function(){JS3.getFrameRate();for(var a=0;a<JS3.func.length;a++)JS3.func[a]();window.getAnimFrame(JS3.loop)};
window.getAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();JS3.getFrameRate=function(){var a=window.mozAnimationStartTime||Date.now();5<a-JS3.FT&&(JS3.FR=1E3/(a-JS3.FT),JS3.FT=a)};
JS3.showFrameRate=function(a,b,c){if(!document.getElementById("JS3FR")){var d=0;yy=0;c&&(d=c.position.x,yy=c.position.y);a&&(d+=a);b&&(yy+=b);var e=document.createElement("div");e.setAttribute("id","JS3FR");e.style.position="absolute";e.style.left=d+"px";e.style.top=yy+"px";e.style.background="#333";e.style.border="1px solid #555";e.style.color="#00ff00";e.style.padding="10px";e.style.fontSize="16px";e.style.fontFamily="Arial,sans-serif";e.style.textShadow="1px 1px 0 #000";e.innerHTML="60.0 fps";
document.body.appendChild(e);setInterval(function(){var a=JS3.FR.toFixed(1);e.innerHTML=a+" fps";e.style.color=15>a?"#ff0000":15<=a&&30>=a?"#ffff00":"#00ff00"},1E3)}};JS3.FR=0;JS3.FT=Date.now()-1;window.getAnimFrame(JS3.loop);function JS3Line(a){JS3getBaseProps(this);JS3getLineProps(this);this.update=JS3.drawLine;a&&JS3.copyProps(a,this)}function JS3Arc(a){JS3getBaseProps(this);JS3getLineProps(this);this.update=JS3.drawArc;a&&JS3.copyProps(a,this)}
function JS3Tri(a){JS3getBaseProps(this);JS3getPolyProps(this);this.update=JS3.drawTri;a&&JS3.copyProps(a,this)}function JS3Rect(a){JS3getBaseProps(this);this.update=JS3.drawRect;a&&JS3.copyProps(a,this)}function JS3Circle(a){JS3getBaseProps(this);this.update=JS3.drawCirc;a&&JS3.copyProps(a,this)}function JS3Text(a){JS3getBaseProps(this);JS3getTextProps(this);this.update=JS3.drawText;a&&JS3.copyProps(a,this)}
function JS3Image(a){JS3getImageProps(this);this.update=JS3.drawImage;this.fill=this.stroke=!1;a&&JS3.copyProps(a,this)}
function JS3getBaseProps(a){Object.defineProperty(a,"size",{get:function(){return a._size},set:function(b){a._size=a.width=a.height=b}});Object.defineProperty(a,"width",{get:function(){return a._width},set:function(b){a._width=b;a.pts=[]}});Object.defineProperty(a,"height",{get:function(){return a._height},set:function(b){a._height=b;a.pts=[]}});Object.defineProperty(a,"linear",{set:function(b){a._gradient=b;a.drawGradient=JS3.drawLinear}});Object.defineProperty(a,"radial",{set:function(b){a._gradient=
b;a.drawGradient=JS3.drawRadial}});a.x=a.y=a.rotation=0;a._size=25;a.fillColor="#ddd";a.strokeColor="#ccc";a.fill=a.stroke=!0;a.alpha=a.scaleX=a.scaleY=a.fillAlpha=a.strokeAlpha=1;a.strokeWidth=2;JS3setObjEvents(a)}function JS3getLineProps(a){a.capStyle="butt";a.x1=a.y1=a.cx=a.cy=a.x2=a.y2=0;Object.defineProperty(a,"color",{set:function(b){a.strokeColor=b}});Object.defineProperty(a,"thickness",{set:function(b){a.strokeWidth=b}})}
function JS3getPolyProps(a){a.pts=[];Object.defineProperty(a,"x1",{set:function(b){a.pts[0]=b}});Object.defineProperty(a,"y1",{set:function(b){a.pts[1]=b}});Object.defineProperty(a,"x2",{set:function(b){a.pts[2]=b}});Object.defineProperty(a,"y2",{set:function(b){a.pts[3]=b}});Object.defineProperty(a,"x3",{set:function(b){a.pts[4]=b}});Object.defineProperty(a,"y3",{set:function(b){a.pts[5]=b}})}
function JS3getImageProps(a){a.image=new Image;Object.defineProperty(a,"src",{set:function(b){a.image.src=b}});Object.defineProperty(a,"ready",{set:function(b){a.image.onload=b}});Object.defineProperty(a,"width",{get:function(){return a.image.width}});Object.defineProperty(a,"height",{get:function(){return a.image.height}});a.x=a.y=a.rotation=0;a.fillColor="#ddd";a.strokeColor="#ccc";a.fill=a.stroke=!0;a.alpha=a.scaleX=a.scaleY=a.fillAlpha=a.strokeAlpha=1;a.strokeWidth=2;JS3setObjEvents(a)}
function JS3getTextProps(a){a.size=12;a.font="Arial";a.color="#333";a.stroke=a.bold=a.italic=!1}function JS3getTextHeight(a){var b=document.getElementsByTagName("body")[0],c=document.createElement("div");c.appendChild(document.createTextNode("M"));c.setAttribute("style","font-family:"+a.font+"; font-size:"+a.size+"pt; line-height:normal");b.appendChild(c);a=c.offsetHeight;b.removeChild(c);return a}
function JS3setObjEvents(a){Object.defineProperty(a,"down",{set:function(b){a._mouseDown=b;a.enabled=!0}});Object.defineProperty(a,"up",{set:function(b){a._mouseUp=b;a.enabled=!0}});Object.defineProperty(a,"over",{set:function(b){a._mouseOver=b;a.enabled=!0}});Object.defineProperty(a,"out",{set:function(b){a._mouseOut=b;a.enabled=!0}});Object.defineProperty(a,"click",{set:function(b){a._click=b;a.enabled=!0}});Object.defineProperty(a,"dclick",{set:function(b){a._doubleClick=b;a.enabled=!0}});Object.defineProperty(a,
"draggable",{get:function(){return a._draggable},set:function(b){a._draggable=b;!0==b&&(a.enabled=!0)}});Object.defineProperty(a,"dragStart",{set:function(b){a._dragStart=b;a.draggable=!0}});Object.defineProperty(a,"dragChange",{set:function(b){a._dragChange=b;a.draggable=!0}});Object.defineProperty(a,"dragComplete",{set:function(b){a._dragComplete=b;a.draggable=!0}})}
function JS3setStageEvents(a){Object.defineProperty(a,"down",{set:function(b){a._mouseDown=b}});Object.defineProperty(a,"up",{set:function(b){a._mouseUp=b}});Object.defineProperty(a,"move",{set:function(b){a._mouseMove=b}});Object.defineProperty(a,"click",{set:function(b){a._click=b}});Object.defineProperty(a,"dclick",{set:function(b){a._doubleClick=b}});Object.defineProperty(a,"enter",{set:function(b){a._stageEnter=b}});Object.defineProperty(a,"leave",{set:function(b){a._stageLeave=b}});Object.defineProperty(a,
"focusIn",{set:function(b){a._windowFocusIn=b}});Object.defineProperty(a,"focusOut",{set:function(b){a._windowFocusOut=b}})}function JS3Event(a,b,c,d,e){this.x=d;this.y=e;this.type=a;this.target=b;this.owner=c}function JS3Tween(a,b,c){this.object=a;this.duration=1E3*b;this.delay=c.delay;this.elapsed=this.start=0;this.onStart=c.onStart;this.onComplete=c.onComplete;this.easeFunc=c.ease||linear;this.props={};for(var d in c)JS3isNumber(c[d])&&(this.props[d]={a:a[d],b:c[d]-a[d]})}
function JS3Runner(a,b,c,d){this.f=a;this.d=b;this.r=c;this.o=d;this.t=Date.now();Object.defineProperty(this,"delay",{set:function(a){this.d=a}});Object.defineProperty(this,"onComplete",{set:function(a){this.o=a}});Object.defineProperty(this,"repeatCount",{set:function(a){this.r=a}})}function JS3Trace(a){try{console.log(a)}catch(b){}}function JS3isNumber(a){return!isNaN(parseFloat(a))&&isFinite(a)}if(void 0==trace)var trace=JS3Trace;