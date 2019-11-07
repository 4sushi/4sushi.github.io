var root = null;
var useHash = true; // Defaults to: false
var hash = '#'; // Defaults to: '#'
var router = new Navigo(root, useHash, hash);

var converter = new showdown.Converter();

router
  .on('home', function () {
    loadHTML('#main', 'pages/home.html');
  })
  .on('projects', function (params) {
    loadMarkdown('#main', 'pages/projects.md');
  })
  .on('projects/:project', function (params) {
    if(params && params.project){
      loadMarkdown('#main', 'pages/projects/'+params.project+'.md');
    }
  })
  .on('about', function (params) {
    loadHTML('#main', 'pages/about.html');
  })
  .on('fuck', function () {
    window.location.href = ("resource/project/fuck/index.html");
  })
  .on('pixelDraw', function () {
    window.location.href = ("resource/project/pixelDraw/index.html");
  })
  .on('*', function () {
    router.navigate('home');
  })
  .resolve();


function loadHTML(domId, url){
  $.ajax({
      url: url,
      type:'get',
      dataType:'html',
      success:function(html){
        $(domId).html(html);
     }
  });
}

function loadMarkdown(domId, url){
  $.ajax({
      url: url,
      type:'get',
      mimeType: 'text/plain; charset=utf-8',
      dataType:'text',
      success:function(markdown){
        var html = converter.makeHtml(markdown);
        $(domId).html(html);
        hljs.initHighlightingOnLoad();
     }
  });
}
