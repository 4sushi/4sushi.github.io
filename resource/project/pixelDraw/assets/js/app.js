require(["app/Dessin"], function(Dessin) {

	var dessin = new Dessin("canvas", "#000000");
	dessin.evenementCanvas();
	dessin.evenementMenu();
  dessin.evenementCouleur();
  dessin.evenementDownload();

});
