/*
	layer:
		back,layerA,layerB,layerWhite[base!]
		[base layer never visible!]
	status:
		statusB,statusA,start_game
	json:
		statusB_json,statusA_json,preStart_json
	3: last success
*/


function load_back_images( imgs_count, load_char_C){
	var json_str = "([";
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.jpg"},';
	json_str += '{"name":"'+'flow'+'","path":'+'"images/flow.png"},';
	json_str += '{"name":"'+'blood'+'","path":'+'"images/blood.png"},';
	json_str += '{"name":"'+'ko'+'","path":'+'"images/KO.png"},';
	json_str += '{"name":"'+'hit'+'","path":'+'"images/hit.png"},';
	json_str += '{"name":"'+'miss'+'","path":'+'"images/miss.png"},';
	for(var  i = 0;i<=9;i++){
		json_str += '{"name":"'+'01_time_'+i.toString()+'","path":'+'"images/01_time_'+i.toString()+'.png"},';
	}
	for (var i = 1; i <= 9; i++) {
		json_str += '{"name":"'+'b0'+i.toString()+'","path":'+'"images/b0'+i.toString()+'.png"},';
	}
	json_str += '{"name":'+'"b10","path":'+'"images/b10.png"},';
	json_str+='])';
	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}
function display_global_now(){
	if( ( statusA !=4 || statusB !=4) && mark_collide == 1){
		statusB = 4;
		statusA = 4;
	}
	if( start_game == 0 && white_layer.y != 50){
		back_layer.visible = false;
		white_layer.y = 50;
		point_white = 0;
		white_layer.addEventListener( LEvent.ENTER_FRAME, display_white_now);
	}else{
		if( back_layer.visible == false && start_game == 1){
			back_layer.visible = true;
			white_layer.removeAllChild();
			white_layer.removeEventListener( LEvent.ENTER_FRAME, display_white_now);
			sound.play( 0, Infinity);
		}
	}
}
function display_white_now(){
	point_white ++;
	if(point_white < parseInt( preStart_json['s'])){
		point_white = parseInt( preStart_json['s']);
	}
	if(point_white > parseInt( preStart_json['t'])){
		point_white = parseInt( preStart_json['s']);
	}
	var now_showBitmap = new LBitmap( showListA[ point_white]);
	white_layer.removeAllChild();
	white_layer.addChild( now_showBitmap);
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
	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

//==============================
function sms (str) {
  var min = str.split(':')[0];
  var sed = str.split(':')[1];
  var ans =(min * 60 + sed) * 1000;
  return ans;
}
roll_Array = new Array();
flag_again = new Array();
function roll_finger(){
	var phore_T = 6095+10;
	var pre_phore_T = 6095+100;
	sound_current = Math.floor(sound.data.currentTime*1000);
	for( var x in gesture_json){
		var x_t = sms( gesture_json[x].time);
		if ( sound_current < x_t-phore_T && sound_current>x_t - pre_phore_T&& flag_again[ gesture_json[ x].index]===undefined){
			var rolling_Bitmap = new LBitmap( showList_finger[ gesture_json[ x].type]);
			roll_layer.addChild( rolling_Bitmap);
	 		roll_Array.push( rolling_Bitmap);
	 		console.log('start', (new Date()).getTime());
			flag_again[ gesture_json[ x].index] = true;
			break;
		}
		//console.log( gesture_json[x].time);
	}
	if( roll_Array.length>0 ){
		for( var x in roll_Array){
			roll_Array[x].x -= 5;
		}
		if( roll_Array[0].x < -500){
			roll_layer.removeChild( roll_Array[0]);
			roll_Array.shift();
			console.log( 'stop', (new Date()).getTime());
		}
	}
}

var blood_Bitmap_nowAX = 107;
var blood_Bitmap_nowAY = 86;

var blood_Bitmap_nowBX = 560;
var blood_Bitmap_nowBY = 86;
function building_blood(){
	// blood
	blood_layer = new LSprite();
	blood_Bitmap = new LBitmap( showList_back[2]);
	blood_layer.addChild( blood_Bitmap);
	back_layer.addChild( blood_layer);
	blood_layer.x = 90;
	blood_layer.y = 70;
//A
	blood_Bitmap_nowA = new LBitmap( showList_blood[ blood_A]);
	blood_Bitmap_nowA.x = blood_Bitmap_nowAX;
	blood_Bitmap_nowA.y = blood_Bitmap_nowAY;
	blood_Bitmap_nowA.scaleX = -1;
	back_layer.addChild( blood_Bitmap_nowA);
//B
	blood_Bitmap_nowB = new LBitmap( showList_blood[ blood_B]);
	blood_Bitmap_nowB.x = blood_Bitmap_nowBX;
	blood_Bitmap_nowB.y = blood_Bitmap_nowBY;
//	blood_Bitmap_nowB.scaleY = -1;
	back_layer.addChild( blood_Bitmap_nowB);
	//blood ----------------end
}
// include rolling-----------------------------------------------------BACK IMAGE BUILD
function load_back_complete( result){
	showList_back.push( new LBitmapData( result["back"]));
	showList_back.push( new LBitmapData( result["flow"]));
	showList_back.push( new LBitmapData( result["blood"]));
	showList_back.push( new LBitmapData( result["ko"]));		//3
	showList_back.push( new LBitmapData( result["hit"]));//4
	showList_back.push( new LBitmapData( result["miss"]));//5
	for (var i = 1; i <= 9; i++) {
		showList_blood.push( new LBitmapData ( result[ "b0" + i.toString()]));
	}
	showList_blood.push( new LBitmapData ( result[ "b10"]));
	for(var  i = 0;i<=9;i++){
		showList_finger.push( new LBitmapData( result[ "01_time_"+i.toString() ]));
	}
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
	// flow-------------end
	//ko hit miss
	ko_Bitmap = new LBitmap( showList_back[3]);
	back_layer.addChild( ko_Bitmap);
	ko_Bitmap.scaleX = 0.7;
	ko_Bitmap.scaleY = 0.7;
	ko_Bitmap.visible = false;

	hit_Bitmap_A = new LBitmap( showList_back[4]);
	back_layer.addChild( hit_Bitmap_A);
	hit_Bitmap_A.scaleX = 0.7;
	hit_Bitmap_A.scaleY = 0.7;
	hit_Bitmap_A.x = 240;
	hit_Bitmap_A.y = 200;
	hit_Bitmap_A.visible = false;

	miss_Bitmap_A = new LBitmap( showList_back[5]);
	back_layer.addChild( miss_Bitmap_A);
	miss_Bitmap_A.scaleX = 0.7;
	miss_Bitmap_A.scaleY = 0.7;
	miss_Bitmap_A.x = 240;
	miss_Bitmap_A.y = 200;
	miss_Bitmap_A.visible = false;

	hit_Bitmap_B = new LBitmap( showList_back[4]);
	back_layer.addChild( hit_Bitmap_B);
	hit_Bitmap_B.scaleX = 0.7;
	hit_Bitmap_B.scaleY = 0.7;
	hit_Bitmap_B.x = 700;
	hit_Bitmap_B.y = 200;
	hit_Bitmap_B.visible = false;

	miss_Bitmap_B = new LBitmap( showList_back[5]);
	back_layer.addChild( miss_Bitmap_B);
	miss_Bitmap_B.scaleX = 0.7;
	miss_Bitmap_B.scaleY = 0.7;
	miss_Bitmap_B.x = 700;
	miss_Bitmap_B.y = 200;
	miss_Bitmap_B.visible = false;

	//ko -- end
	building_blood();

	// sound mp3
	sound = new LSound();
	sound.load("BGM.mp3");
	sound_ok = new LSound();
	sound_ok.load( "ko.mp3");
	$.getJSON("gesture.json",function(data){
			gesture_json = data;
	});
	sound.addEventListener( LEvent.COMPLETE, function (){

		//Rolling ---------------start
		rolling_num = 1;
		rolling_speed = 2;
		rolling_put = rolling_speed;
		roll_layer = new LSprite();
		back_layer.addChild( roll_layer);
		roll_layer.x = 800;
		roll_layer.y = 330;
				//back_layer.addEventListener( LEvent.ENTER_FRAME, roll_finger);
		Roll_INTERVAL = setInterval( "roll_finger()", 50);
	});
	//Roling ---------------end
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
	white_layer.addEventListener( LEvent.ENTER_FRAME, display_global_now); //load all images complete
}
//========================================LOAD END==============

//=======================================DATA============
showListA = new Array();
showListB = new Array();
showList_back = new Array();
showList_blood = new Array();
showList_finger = new Array();
imglistA = {};
imglistB = {};
ko_music = 0;
forward_width = 40;					//forward attack width
//imgs_countA = 230;
imgs_countA = 230;
imgs_countB = 650;
init_margin_leftA = -100;
init_margin_leftB = 300;
A_layer_margin_Top = 175;
B_layer_margin_Top = 150;
A_attacking_times_MAX = 30;
B_attacking_times_MAX = 30;
blood_A = 9;
blood_B = 9;
imgs_back_count = 2;
mark_collide = 0;					//collide mark
statusA = -1;		//-1:start 0:prepare 1:true 2:attack 3:success 4:failure
statusB = -1;		//-1:start 0:prepare 1:true 2:attack 3:success 4:failure
start_game = 0;		// 0 not start  1:start
preStart_json={
	's':'210',
	't':'213'
}
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
			's':'62',
			't':'87'
		}
	},
	'attack':{
		0:{
			's':'89',
			't':'96'
		},
		1:{
			's':'132',
			't':'137'
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
	'failure':{
		0:{
			's':'157',
			't':'164',
		},
		1:{
			's':'166',
			't':'176',
		}
	}
};
statusB_json = {
	'start':{
		0:{
			's':'318',
			't':'320',
		},
		1:{
			's':'618',
			't':'620',
		}
	},
	'prepare':{
		's':'0',
		't':'17',
	},
	'true':{
		0:{
			's':'106',
			't':'122',
		},
		1:{
			's':'539',
			't':'557'
		}
	},
	'attack':{
		0:{
			's':'392',
			't':'401',
		},
		1:{
			's':'362',
			't':'371',
		}
	},
	'success':{
		0:{
			's':'565',
			't':'589',
		},
		1:{
			's':'313',
			't':'320',
		}
	},
	'failure':{
		0:{
			's':'426',
			't':'440',
		},
		1:{
			's':'489',
			't':'509'
		}
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
	char_layerA.y = A_layer_margin_Top;
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
	char_layerB.y = B_layer_margin_Top;
	display_charB( imgs_count);
}
//###########%%%%%%%================================MAIN START=================#####################%%%%%%%%%
function main(){
	$(" #mylegend").width( width);
	$(" #mylegend").css( "margin", "0 auto");
	back_layer = new LSprite();
	addChild( back_layer);
	white_layer = new LSprite();
	addChild( white_layer);
	back_layer.visible = false;
		load_back_images( imgs_back_count, load_back_complete);  //load 1back->2A->3B
}
//================================================end=================

//================================================display char=========
function display_char_nowA(){
	char_layerA.removeAllChild();
	var now_showBitmap = new LBitmap( showListA[ point_A]);
	char_layerA.addChild( now_showBitmap);
	point_A ++;
	if( statusA == -1){
		if( point_A < parseInt( statusA_json['start'][r_num_A]['s'])-2){
			point_A = parseInt( statusA_json['start'][r_num_A]['s'])-2;
		}
		if(point_A > parseInt( statusA_json['start'][r_num_A]['t'])){
			point_A = parseInt( statusA_json['start'][r_num_A]['s']);
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
		if(point_A < parseInt( statusA_json['true'][r_num_A]['s'])){
			point_A = parseInt( statusA_json['true'][r_num_A]['s']);
		}
		if(point_A > parseInt( statusA_json['true'][r_num_A]['t'])){
			if( A_attacking != 1 && point_A == parseInt( statusA_json['true'][r_num_A]['t'])+1){
				statusA = 0;
			}
			point_A = parseInt( statusA_json['true'][r_num_A]['s']);
		}
		// attack done
		if( A_attacking == 1){
			if( A_attacking_times == A_attacking_times_MAX)
			{
				A_attacking = 0;
				statusA = 0;
				statusB = 0;
			}else
				A_attacking_times ++;
		}
	}
	//forwarding attack
	if( statusA == 2){
		if( point_A == parseInt( statusA_json['attack'][r_num_A]['t'])+1){
			A_attacking_times = 0;
			A_attacking = 1;
			statusA = 1;
			statusB = 4;
			sub_blood_B();
			r_num_B = Math.floor(Math.random()*2);
		}else{
			if( point_A < parseInt( statusA_json['attack'][r_num_A]['s'])){
				point_A = parseInt( statusA_json['attack'][r_num_A]['s']);
			}

			if( point_A > parseInt( statusA_json['attack'][r_num_A]['t'])){
				point_A = parseInt( statusA_json['attack'][r_num_A]['s']);
			}
			char_layerA.x +=forward_width;
		}
	}

	//success
	if( statusA == 3){					//special detail
		if(point_A < parseInt( statusA_json['success'][r_num_A]['s'])){
			if( final_A_success == 1 && r_num_A == 1){
				if( point_A > parseInt( statusA_json['success'][r_num_A]['t2']))
					point_A = parseInt( statusA_json['success'][r_num_A]['t2']);
			}else
				point_A = parseInt( statusA_json['success'][r_num_A]['s']);
		}
		if(point_A > parseInt( statusA_json['success'][r_num_A]['t'])){
			if( final_A_success == 1 && r_num_A == 1){
				if( point_A == parseInt( statusA_json['success'][r_num_A]['t'])+1)
					point_A = parseInt( statusA_json['success'][r_num_A]['s2']);
			}
			else
				point_A = parseInt( statusA_json['success'][r_num_A]['s']);
		}
		back_layer.removeChild( blood_Bitmap_nowB);
		statusB = 4;
		final_A_success = 1;
		r_num_B = 0;		//SUCCESS_ POSITION
		if( ko_music != 1){
			sound.close();
			ko_Bitmap.visible = true;
			sound_ok.play();
			ko_music = 1;
		}
	}
	//failure
	if( statusA == 4){					//special detail
		if(point_A < parseInt( statusA_json[ 'failure'][r_num_A][ 's'])){
			point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 's']);
		}
		if(point_A > parseInt( statusA_json[ 'failure'][r_num_A][ 't'])){
			if( point_A == parseInt( statusA_json[ 'failure'][ r_num_A]['t']) + 1 && mark_collide == 1){
				statusB = 0;
				statusA = 0;
				mark_collide = 0;
			}

			if( point_A == parseInt( statusA_json[ 'failure'][ r_num_A]['t']) + 1 && final_B_success == 1){
				point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 't']);
			}else
				point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 's']);
		}
	}
}
function display_charA(){
	point_A = 0;
	final_A_success = 0;
	A_attacking = 0;
	A_start = 0;
	r_num_A = Math.floor(Math.random()*2);
	r_num_A = 1;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowA);
}

function display_char_nowB(){
	char_layerB.removeAllChild();
	var now_showBitmap = new LBitmap( showListB[ point_B]);
	now_showBitmap.scaleX = -1;
	char_layerB.addChild( now_showBitmap);
	point_B ++;
	if( statusB == -1){
		if( point_B < parseInt( statusB_json['start'][r_num_B]['s'])-2){
			point_B = parseInt( statusB_json['start'][r_num_B]['s'])-2;
		}
		if(point_B > parseInt( statusB_json['start'][r_num_B]['t'])){
			point_B = parseInt( statusB_json['start'][r_num_B]['s']);
		}
	}

	if( statusB == 0){
		char_layerB.x = init_margin_leftB;
		if(point_B < parseInt( statusB_json['prepare']['s'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
		if(point_B > parseInt( statusB_json['prepare']['t'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
	}
	// finger ok
	if( statusB == 1){
		if(point_B < parseInt( statusB_json['true'][r_num_B]['s'])){
			point_B = parseInt( statusB_json['true'][r_num_B]['s']);
		}
		if(point_B > parseInt( statusB_json['true'][r_num_B]['t'])){
			if( B_attacking != 1 && point_B == parseInt( statusB_json['true'][r_num_B]['t'])+1){
				statusB = 0;
			}
			point_B = parseInt( statusB_json['true'][r_num_B]['s']);
		}
		if( B_attacking == 1){
			if( B_attacking_times == B_attacking_times_MAX)
			{
				B_attacking = 0;
				statusB = 0;
				statusA = 0;
			}else
				B_attacking_times ++;
		}
	}
	//forwarding attack
	if( statusB == 2){
		if( point_B == parseInt( statusB_json['attack'][r_num_B]['t'])+1){
			B_attacking_times = 0;
			B_attacking = 1;
			statusB = 1;
			statusA = 4;
			sub_blood_A();
			r_num_A = Math.floor(Math.random()*2);
		}else{
			if( point_B < parseInt( statusB_json['attack'][r_num_B]['s'])){
				point_B = parseInt( statusB_json['attack'][r_num_B]['s']);
			}

			if( point_B > parseInt( statusB_json['attack'][r_num_B]['t'])){
				point_B = parseInt( statusB_json['attack'][r_num_B]['s']);
			}
			char_layerB.x -=forward_width;
		}
	}

	//success
	if( statusB == 3){					//special detail
		if(point_B < parseInt( statusB_json['success'][r_num_B]['s'])){
			point_B = parseInt( statusB_json['success'][r_num_B]['s']);
		}
		if(point_B > parseInt( statusB_json['success'][r_num_B]['t'])){
			if( point_B == parseInt( statusB_json['success'][r_num_B]['t'])+1)
				point_B = parseInt( statusB_json['success'][r_num_B]['t']-2);
			else
				point_B = parseInt( statusB_json['success'][r_num_B]['s']);
		}
		back_layer.removeChild( blood_Bitmap_nowA);
		statusA = 4;
		final_B_success = 1;
		r_num_A = 1;
		if( ko_music != 1){
			ko_music = 1;
			ko_Bitmap.visible = true;
			sound.close();
			sound_ok.play();
		}
	}
	//failure
	if( statusB == 4){					//special detail
		if(point_B < parseInt( statusB_json[ 'failure'][r_num_B][ 's'])){
			point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 's']);
		}
		if(point_B > parseInt( statusB_json[ 'failure'][r_num_B][ 't'])){
			if( point_B == parseInt( statusB_json[ 'failure'][ r_num_B][ 't']) + 1 && mark_collide == 1){
				statusB = 0;
				statusA = 0;
				mark_collide = 0;
			}
			if( point_B == parseInt( statusB_json[ 'failure'][ r_num_B]['t']) + 1 && final_A_success == 1){
							point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 't']);
			}else
				point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 's']);
		}
	}
}
function display_charB(){
	point_B = 0;
	final_B_success = 0;
	B_attacking = 0;
	B_start = 0;
	r_num_B = Math.floor(Math.random()*2);
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowB);
}
function game_over(){

}
function sub_blood_B(){
	blood_B --;
	back_layer.removeChild( blood_Bitmap_nowB);
	blood_Bitmap_nowB = new LBitmap( showList_blood[ blood_B]);
	back_layer.addChild( blood_Bitmap_nowB);
	blood_Bitmap_nowB.x = blood_Bitmap_nowBX;
	blood_Bitmap_nowB.y = blood_Bitmap_nowBY;
}

function sub_blood_A(){
	blood_A --;
	back_layer.removeChild( blood_Bitmap_nowA);
	blood_Bitmap_nowA = new LBitmap( showList_blood[ blood_A]);
	back_layer.addChild( blood_Bitmap_nowA);
	blood_Bitmap_nowA.x = blood_Bitmap_nowAX;
	blood_Bitmap_nowA.y = blood_Bitmap_nowAY;
	blood_Bitmap_nowA.scaleX = -1;
}
