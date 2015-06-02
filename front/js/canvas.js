function load_back_images( imgs_count, load_char_C){
	var json_str = "([";
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.jpg"},';
	json_str += '{"name":"'+'back'+'","path":'+'"images/flow.png"},';
	json_str+='])';
	var imgs_DATA = eval(json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_char_imagesA( pre, imgs_count, load_char_C){
	var json_str = "([";
	for (var i = 0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = pre+'_'+str + '.png';
		json_str += '{"name":"'+str+'","path":'+'"images/'+pre+'/'+str+'"},';
	}
	json_str+='])';
	var imgs_DATA = eval(json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_char_imagesB( pre, imgs_count, load_char_C){
	var json_str = "([";
	for (var i = 0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = pre+'_'+str + '.png';
		json_str += '{"name":"'+str+'","path":'+'"images/'+pre+'/'+str+'"},';
	}
	json_str+='])';
	var imgs_DATA = eval(json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_back_complete( result){
	showList_back.push( new LBitmapData( result["back"]));
	showList_back.push( new LBitmapData( result["flow"]));
	//display background
	back_Bitmap = new LBitmap( showList_back[0]);
	back_layer.addChild( back_Bitmap);
	load_char_imagesA( "Asu", imgs_countA, load_char_completeA);
}
function load_char_completeA(result){
	imglistA = result;
	load_char_imagesB( "Hyd", imgs_countB, load_char_completeB);		//load B after load A COMPLETE
	game_initA( imgs_countA);
}

function load_char_completeB(result){
	imglistB = result;
	game_initB( imgs_countB);
}
//========================================LOAD END==============

//=======================================DATA============
showListA = new Array();
showListB = new Array();
showList_back = new Array();
imglistA = {};
imglistB = {};
//imgs_countA = 230;
imgs_countA = 100;
imgs_countB = 100;
imgs_back_count = 2;
//imgs_countB = 676;
//=======================================DATA END ===========

function game_initA( imgs_count){
	showListA.push( new LBitmapData( imglistA["back"]));
	// imglist->showList->now_showbitmap
	for(var i=0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Asu_"+str + '.png';
		showListA.push( new LBitmapData( imglistA[ str]));
	}

	//display_char
	char_layerA = new LSprite();
	back_layer.addChild( char_layerA);
	char_layerA.x = -100;
	char_layerA.y = 180;
	display_charA( imgs_count);
}

function game_initB( imgs_count){
	showListB.push( new LBitmapData( imglistB["back"]));
	// imglist->showList->now_showbitmap
	for(var i=0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Hyd_"+str + '.png';
		showListB.push( new LBitmapData( imglistB[ str]));
	}
	//display_char
	char_layerB = new LSprite();
	back_layer.addChild( char_layerB);
	char_layerB.x = 500;
	char_layerB.y = 155;
	display_charB( imgs_count);
}
//================================================start=================
function main(){
	$(" #mylegend").width( width);
	$(" #mylegend").css( "margin", "0 auto");
	back_layer = new LSprite();
	addChild( back_layer);
	load_back_images( imgs_back_count, load_back_complete);  //load 1back->2A->3B
	sound = new LSound();
	sound.load("BGM.mp3");
	sound.addEventListener( LEvent.COMPLETE, function (){
		sound.play( 0, Infinity);
	});
}
//================================================end=================

//================================================display char=========
function display_char_nowA(){
	char_layerA.removeAllChild();
	var now_showBitmap = new LBitmap( showListA[ point_A]);
	char_layerA.addChild( now_showBitmap);
	point_A ++;
	if(point_A > imgs_countA) point_A = 1;
}
function display_charA(){
	point_A = 0;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowA);
}

function display_char_nowB(){
	char_layerB.removeAllChild();
	var now_showBitmap = new LBitmap( showListB[ point_B]);
	char_layerB.addChild( now_showBitmap);
	point_B ++;
	if(point_B > imgs_countB) point_B = 1;
}
function display_charB(){
	point_B = 0;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowB);
}
