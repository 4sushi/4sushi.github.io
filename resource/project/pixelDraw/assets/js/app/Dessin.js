define(function(){

function Historique() {
	this.objs = [];
};

Historique.prototype.ajouter = function(obj){
	this.objs.push(obj);
};

Historique.prototype.ajouterDebut = function(obj){
	this.objs.unshift(obj);
};

Historique.prototype.retirer = function(pos){

	this.objs.splice(pos, 1);
};

Historique.prototype.retirerDernier = function(){

	if (this.estVide()) return;

	this.objs.pop();
};

Historique.prototype.vider = function(){
	this.objs = [];
};

Historique.prototype.existe = function(obj){
	var pos = this.objs.indexOf(obj);
	return (pos > -1);
};

Historique.prototype.estVide = function(){
	return(this.objs.length == 0);
};

Historique.prototype.position = function(obj){
	if(!this.existe(obj)) return;

	return this.objs.indexOf(obj);
};

/**********************
   HistoriqueCouleur
***********************/

function HistoriqueCouleur(nbCouleurs) {
	Historique.call(this);
	this.NB_MAX = nbCouleurs;
};

HistoriqueCouleur.prototype = Object.create(Historique.prototype);
HistoriqueCouleur.prototype.constructor = HistoriqueCouleur;

HistoriqueCouleur.prototype.estPlein = function(){
	return (this.objs.length == this.NB_MAX);
};

HistoriqueCouleur.prototype.decalage = function(c){

};

HistoriqueCouleur.prototype.analyseCouleur = function(c){

	if(c == '#ffffff') return;

	if( this.existe(c) )
	{
		var pos = this.position(c);

		if(this.estVide(c)  || pos != 0 )
		{
			this.retirer(pos);
			this.ajouterDebut(c);
			this.changementCouleur();
		}
	}
	else
	{
		if( this.estPlein() ){
			this.retirerDernier();
		}
		this.ajouterDebut(c);
		this.changementCouleur();
	}
};

HistoriqueCouleur.prototype.changementCouleur = function(){

	for(var i = 0; i < this.objs.length ; i++)
	{
		$('.histoColor').eq(i).css('backgroundColor', this.objs[i]);
	}
};

/**
 * Représente un dessin
 * @constructor
 * @param {string} nomIdCanvas - id du canvas
 * @param {string} coulPinceau - couleur de base du pinceau en héxadécimal
 */
function Dessin(nomIdCanvas, coulPinceau) {
	this.canvas = document.getElementById(nomIdCanvas);
	this.ctx = canvas.getContext("2d");
	this.coulPinceau = coulPinceau;
	this.TAILLE_PIXEL = 9;
	this.NOMBRE_PIXEL = 45;
	this.pixels = [];
	this.histoPrec = [];
	this.histoSuiv = [];
	this.histoCouleur = new HistoriqueCouleur(18);
	this.mode = 'normal'; // Normal | gomme | symétrie

	var obj = this;

	$('#colorSelector').ColorPicker({
		color: coulPinceau,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			obj.changerCoulPinc('#'+hex);

		}
	});

	$('#colorSelector').css('background-color', coulPinceau);
};




/**
 * Retourne les coordonnés de l'angle en haut à gauche d'un pixel
 * @param {string} x - pos x du point par rapport à la fenêtre entière
 * @param {string} y - pos y du point par rapport à la fenêtre entière
 * @returns {{posX : number, posY : number}}
 */
Dessin.prototype.getPosAnglePixel = function(x, y)
{
	x = x - (x % this.TAILLE_PIXEL);
	y = y - (y % this.TAILLE_PIXEL);

	return({x : x, y : y});
};

Dessin.prototype.dessinerPixel = function(x, y, coul)
{
	this.ctx.fillStyle = coul;
	var pos = this.getPosAnglePixel(x, y);
	this.ctx.fillRect(pos.x, pos.y, this.TAILLE_PIXEL - 1, this.TAILLE_PIXEL - 1);

	this.histoCouleur.analyseCouleur(coul);

};

Dessin.prototype.getPosPixelCentre = function()
{
	return (Math.round(this.NOMBRE_PIXEL / 2) -1) * this.TAILLE_PIXEL ;
};

Dessin.prototype.getPosSymetrie = function(x, y)
{
	if(this.mode == "symétrieX")
		x = this.NOMBRE_PIXEL * this.TAILLE_PIXEL - 1 - x;
	if(this.mode == "symétrieY")
		y = this.NOMBRE_PIXEL * this.TAILLE_PIXEL - 1 - y;

	return({x : x, y : y});
};


Dessin.prototype.nouveau = function()
{
	if(confirm("New draw ? ")){
		this.canvas.width = this.canvas.width; // Canvas vierge
		this.pixels = [];
		this.histoPrec = [];
		this.histoSuiv = [];
	}
};

Dessin.prototype.changerCoulPinc = function(c)
{
	$('#colorSelector').css('backgroundColor', c);
	this.coulPinceau = c;
};

Dessin.prototype.evenementCanvas = function()
{
	var obj = this;

	$('#canvas').click(function(e) {

		// Position du clique par rapport à l'angle haut/gauche du canvas
		var x = e.pageX - Math.round( $(this).offset().left );
		var y = e.pageY - Math.round( $(this).offset().top );

		if(obj.mode == "normal")
		{
			obj.dessinerPixel(x, y, obj.coulPinceau);
		}
		else if(obj.mode == "gomme")
		{
			obj.dessinerPixel(x, y, "#ffffff");
		}
		else if(obj.mode == "symétrieX" || obj.mode == "symétrieY")
		{
			obj.dessinerPixel(x, y, obj.coulPinceau);
			var pos = obj.getPosSymetrie(x, y);
			obj.dessinerPixel(pos.x, pos.y, obj.coulPinceau);
		}

	});

	$('#canvas').dblclick(function(e) {

		// Position du clique par rapport à l'angle haut/gauche du canvas
		var x = e.pageX - Math.round( $(this).offset().left );
		var y = e.pageY - Math.round( $(this).offset().top );

		obj.dessinerPixel(x, y, "#ffffff");

		if(obj.mode == "symétrieX" || obj.mode == "symétrieY")
		{

			var pos = obj.getPosSymetrie(x, y);
			obj.dessinerPixel(pos.x, pos.y, "#ffffff");
		}
	});
};

Dessin.prototype.evenementMenu = function()
{

	var obj = this;

	$('#rightMenu li a').click(function(e) {


		var elementsClasse = this.className.split(' ');
		var action = elementsClasse[0];
		elementsClasse.shift()
		var params = elementsClasse;

		switch(action)
		{
			case "return" :
				break;

			case "new" :
				obj.nouveau();
				break;

			case "pixelCenter" :
				var posCentre = obj.getPosPixelCentre();
				obj.dessinerPixel(posCentre, posCentre, obj.coulPinceau);
				break;

			case "erase":
				$('ul li a').removeClass('activate');
				if(obj.mode == "gomme"){
					obj.mode = "normal";
				}
				else{
					$('ul li a.erase').addClass('activate');
					obj.mode = "gomme";
				}
				break;

			case "symetrie" :
				$('ul li a').removeClass('activate');
				if(obj.mode == "symétrieX" && params[0] == 'X' ||  obj.mode == "symétrieY" && params[0] == 'Y'){
					obj.mode = "normal";
				}
				else{
					$('ul li a.symetrie.'+ params[0]).addClass('activate');
					obj.mode = "symétrie" + params[0];
				}
				break;

		}
	});
};

Dessin.prototype.evenementCouleur = function(){

	var obj = this;

	$('#rightMenu .histosColor .histoColor').click(function(e) {
		var color = $(this).css('background-color');
		if(color == "rgb(255, 255, 255)"){
			return;
		}
		obj.changerCoulPinc(color);
	});
}

Dessin.prototype.evenementDownload = function(){

	var obj = this;

	$('#bottomMenu .png').click(function(e) {
    this.download = "pixeldraw.png";
		this.href = document.getElementById("canvas").toDataURL();
	});

	$('#bottomMenu .jpg').click(function(e) {

		var canvasTmp = document.createElement('canvas');
		var ctxTmp = canvasTmp.getContext('2d');
		canvasTmp.width  = obj.canvas.width;
		canvasTmp.height = obj.canvas.height;
		ctxTmp.fillStyle = "#ffffff";
		ctxTmp.fillRect(0, 0, obj.canvas.width, obj.canvas.height);
		ctxTmp.drawImage(obj.canvas, 0, 0);
    	this.download = "pixeldraw.jpg";
		this.href = canvasTmp.toDataURL('image/jpeg');
	});
}

return Dessin;

});
