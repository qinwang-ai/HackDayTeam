function load_char_images(){
	var json_str = "([";
	for (var i = 0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Asu_"+str + '.png';
		json_str += '{"name":"'+str+'","path":'+'"images/Asu/'+str+'"},';
	}
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.jpg"},';
	json_str+='])';
	imgs_DATA = eval(json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function (progress){
		loadingLayer.setProgress(progress)},function(result){
		imglist = result;
		game_init();
	});
}
showList = new Array();
imglist = {};
imgs_count = 230;
function game_init(){
	showList.push( new LBitmapData( imglist["back"]));
	// imglist->showList->now_showbitmap
	for(var i=0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Asu_"+str + '.png';
		showList.push( new LBitmapData( imglist[ str]));
	}
	//display background
	back_layer = new LSprite();
	back_Bitmap = new LBitmap( showList[0]);
	back_layer.addChild( back_Bitmap);
	addChild( back_layer);

	//display_char
	char_layerA = new LSprite();
	back_layer.addChild( char_layerA);
	display_char();
}

function main(){
	$(" #mylegend").width( width);
	$(" #mylegend").css( "margin", "0 auto");
	sound = new LSound();
	sound.load("BGM.mp3");
	load_char_images();
	sound.addEventListener( LEvent.COMPLETE, function (){
		sound.play( 0, Infinity);
	});
}
function display_char_now(){
	char_layerA.removeAllChild();
	now_showBitmap = new LBitmap( showList[ point_A]);
	char_layerA.addChild( now_showBitmap);
	point_A ++;
	if(point_A > imgs_count) point_A = 1;
}
function display_char(){
	point_A = 1;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_now);
}




