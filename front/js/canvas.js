function load_back_images( imgs_count, load_char_C){
	var json_str = "([";
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.jpg"},';
	json_str += '{"name":"'+'flow'+'","path":'+'"images/flow.png"},';
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
	//flow
	flow_layer = new LSprite();
	flow_Bitmap = new LBitmap( showList_back[1]);
	flow_layer.addChild( flow_Bitmap);
	back_layer.addChild( flow_layer);

	flow_layer.x = 120;
	flow_layer.y = 320;
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
forward_width = 30;
//imgs_countA = 230;
imgs_countA = 230;
imgs_countB = 200;
init_margin_leftA = -100;
init_margin_leftB = 300;
A_attacking_times_MAX = 30;
B_attacking_times_MAX = 30;
imgs_back_count = 2;
statusA = -1;		//-1:start 0:prepare 1:true 2:attack 3:hurt
statusB = 0;		//-1:start 0:prepare 1:true 2:attack 3:hurt
statusA_json = {
	'start':{
		0:{
			's':'109',
			't':'111'
		},
		1:{
			's':'197',
			't':'199'
		}
	},
	'prepare':{
		's':'0',
		't':'7'
	},
	'true':{
		0:{
			's':'8',
			't':'48'
		},
		1:{
			's':'49',
			't':'87'
		}
	},
	'attack':{
		0:{
			's':'89',
			't':'96'
		}
	},
	'success':{
		0:{
			's':'102',
			't':'106',
		},
		1:{
			's':'214',
			't':'218',
			's2':'204',
			't2':'209'
		}
	},
};
statusB_json = {
	'prepare':{
		's':'0',
		't':'17'
	}
};
//imgs_countB = 676;
//=======================================DATA END ===========

function game_initA( imgs_count){
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
	char_layerA.x = init_margin_leftA;
	char_layerA.y = 180;
	display_charA( imgs_count);
}

function game_initB( imgs_count){
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
	char_layerB.x = init_margin_leftB;
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
	if( statusA == -1){
		var r_num = 0;
		if( point_A < parseInt( statusA_json['start'][r_num]['s'])-2){
			point_A = parseInt( statusA_json['start'][r_num]['s'])-2;
		}
		if(point_A > parseInt( statusA_json['start'][r_num]['t'])){
			point_A = parseInt( statusA_json['start'][r_num]['s']);
		}
	}

	if( statusA == 0){
		char_layerA.x = init_margin_leftA;
		if(point_A < parseInt( statusA_json['prepare']['s'])){
			point_A = parseInt( statusA_json['prepare']['s']);
		}
		if(point_A > parseInt( statusA_json['prepare']['t'])){
			point_A = parseInt( statusA_json['prepare']['s']);
		}
	}
	// finger ok
	if( statusA == 1){
		var r_num = 0;
		if(point_A < parseInt( statusA_json['true'][r_num]['s'])){
			point_A = parseInt( statusA_json['true'][r_num]['s']);
		}
		if(point_A > parseInt( statusA_json['true'][r_num]['t'])){
			point_A = parseInt( statusA_json['true'][r_num]['s']);
		}
		if( A_attacking == 1){
			if( A_attacking_times == A_attacking_times_MAX)
			{
				A_attacking = 0;
				statusA = 0;
			}else
				A_attacking_times ++;
		}
	}
	//forwarding attack
	if( statusA == 2){
		var r_num = 0;
		if( point_A == parseInt( statusA_json['attack'][r_num]['t'])+1){
			A_attacking_times = 0;
			A_attacking = 1;
			statusA = 1;
		}else{
			if( point_A < parseInt( statusA_json['attack'][r_num]['s'])){
				point_A = parseInt( statusA_json['attack'][r_num]['s']);
			}

			if( point_A > parseInt( statusA_json['attack'][r_num]['t'])){
				point_A = parseInt( statusA_json['attack'][r_num]['s']);
			}
			char_layerA.x +=forward_width;
		}
	}

	//success
	if( statusA == 3){					//special detail
		var r_num = 1;
		if(point_A < parseInt( statusA_json['success'][r_num]['s'])){
			if( final_A_success == 1 && r_num == 1){
				if( point_A > parseInt( statusA_json['success'][r_num]['t2']))
					point_A = parseInt( statusA_json['success'][r_num]['t2']);
			}else
				point_A = parseInt( statusA_json['success'][r_num]['s']);
		}
		if(point_A > parseInt( statusA_json['success'][r_num]['t'])){
			if( final_A_success == 1 && r_num == 1){
				if( point_A == parseInt( statusA_json['success'][r_num]['t'])+1)
					point_A = parseInt( statusA_json['success'][r_num]['s2']);
			}
			else
				point_A = parseInt( statusA_json['success'][r_num]['s']);
		}
		final_A_success = 1;
	}
}
function display_charA(){
	point_A = 0;
	final_A_success = 0;
	A_attacking = 0;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowA);
}

function display_char_nowB(){
	char_layerB.removeAllChild();
	var now_showBitmap = new LBitmap( showListB[ point_B]);
	now_showBitmap.scaleX = -1;
	char_layerB.addChild( now_showBitmap);
	point_B ++;
	if( statusB == 0){
		if( point_B < parseInt( statusB_json['prepare']['s'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
		if( point_B > parseInt( statusB_json['prepare']['t'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
	}
}
function display_charB(){
	point_B = 0;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowB);
}
function game_over(){

}
