function main(){
	$(" #mylegend").width( width);
	$(" #mylegend").css( "margin", "0 auto");
	loader = new LLoader();
	loader.addEventListener(LEvent.COMPLETE,loadBitmapdata);
	loader.load( "images/back.jpg", "bitmapData");
}

function loadBitmapdata(event){  
    var bitmapdata = new LBitmapData(loader.content,0,0,width,height);
    var bitmap = new LBitmap(bitmapdata);
	addChild(bitmap);
}

