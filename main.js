//デバッグフラグ
const DEBUG = true;

//`音量設定
let soundVolume = 0.2;

//効果音設定
se1 = new Audio("se1.wav"); //落下
se2 = new Audio("se2.wav"); //回転
se3 = new Audio("se3.wav"); //消した時
se4 = new Audio("Tetris_bgm.mp3");
se5 = new Audio("gameover.mp3");
se6 = new Audio("shot.mp3");
se7 = new Audio("hit.mp3");
se8 = new Audio("expl.mp3");
se9 = new Audio("speed.mp3");
se1.volume = soundVolume * 4;
se2.volume = soundVolume / 5;
se3.volume = soundVolume * 4;
se4.volume = soundVolume / 5;
se5.volume = soundVolume / 5;
se6.volume = soundVolume * 2;
se7.volume = soundVolume * 1;
se8.volume = soundVolume * 1;
se9.volume = soundVolume * 1;
se1.playbackRate = 5;
se2.playbackRate = 10;
se3.playbackRate = 2;
se6.playbackRate = 3;
se7.playbackRate = 1;
se8.playbackRate = 1;
se9.playbackRate = 1;

let drawCount=0;
let fps=0;
let lastTime=Date.now();

//スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
const GAME_SPEED = 1000/60;

//画面サイズ
const SCREEN_W = 180;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W * 2;
const CANVAS_H = SCREEN_H * 2;

//フィールドサイズ
const FIELD_W = SCREEN_W * 2;
const FIELD_H = SCREEN_H * 2;

//星の数
const STAR_MAX = 300;

//キャンバス
let can = document.getElementById("can"); //表示されるキャンバス
let con = can.getContext("2d");
can.width  = CANVAS_W;
can.height = CANVAS_H;

con.mozimageSmoothingEnabled    = SMOOTHING;
con.webkitimageSmoothingEnabled = SMOOTHING;
con.msimageSmoothingEnabled     = SMOOTHING;
con.imageSmoothingEnabled       = SMOOTHING;
con.font="20px 'Impact'";


//フィールド(仮想画面)
let vcan = document.createElement("canvas"); //表示されないキャンバス
let vcon = vcan.getContext("2d");
vcan.width  = FIELD_W;
vcan.height = FIELD_H;
vcon.font="12px 'Impact'";

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//
let gameStart = false;
let gameOver = false;
let score = 0;

//
let bossHP =0;
let bossMHP =0;

//星の実体
let star=[];

//キーボードの状態
let key=[];


//オブジェクト達
let teki=[];
let teta=[];
let tama=[];
let expl=[];
let item=[];
let jiki= new Jiki();
//teki[0]= new Teki( 75, 200<<8,200<<8, 0,0)

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//ゲーム初期化
function gameInit()
{
  for(let i=0;i<STAR_MAX;i++)star[i]=new Star();
  setInterval( gameLoop, GAME_SPEED );
}

//オブジェクトをアップデート
function updateObj( obj )
{
  for(let i=obj.length-1;i>=0;i--)
  {
    obj[i].update();
    if(obj[i].kill)obj.splice( i,1);
  }
}

//オブジェクトを描画
function drawObj( obj )
{
  for(let i=0;i<obj.length;i++)obj[i].draw(); 
}

//移動の処理
function updateAll()
{
  updateObj( star );
  updateObj( tama );
  updateObj( teta );
  updateObj( teki );
  updateObj( expl );
  updateObj( item );
  if(!gameOver)jiki.update();
}

//描画の処理
function drawAll()
{
  vcon.fillStyle=(jiki.damage)?"red":"black";
  vcon.fillRect(camera_x,camera_y,SCREEN_W,SCREEN_H);

  drawObj( star );
  drawObj( tama );
  if(!gameOver)jiki.draw();
  drawObj( teki );
  drawObj( expl );
  drawObj( teta );
  drawObj( item );
  
  //自機の範囲0〜FIEL_W
  //カメラの範囲0〜(FIELD_W-SCREEN_W)

  camera_x = Math.floor((jiki.x>>8)/FIELD_W * (FIELD_W-SCREEN_W));
  camera_y = Math.floor((jiki.y>>8)/FIELD_H * (FIELD_H-SCREEN_H));

  //ボスのHPを表示する

  if( bossHP>0 )
  {
    let sz  = (SCREEN_W-20)*bossHP/bossMHP;
    let sz2 = (SCREEN_W-20);

    vcon.fillStyle="rgba(255,0,0,0.5)";
    vcon.fillRect(camera_x+10,camera_y+10,sz,10);
    vcon.strokeStyle="rgba(255,0,0,0.9)";
    vcon.strokeRect(camera_x+10,camera_y+10,sz2,10);
  }

  //自機のHPを表示する
  if( jiki.hp>0 )
    {
      let sz  = (SCREEN_W-20)*jiki.hp/jiki.mhp;
      let sz2 = (SCREEN_W-20);
  
      vcon.fillStyle="rgba(0,0,255,0.5)";
      vcon.fillRect(camera_x+10,camera_y+SCREEN_H-14,sz,10);
      vcon.strokeStyle="rgba(0,0,255,0.9)";
      vcon.strokeRect(camera_x+10,camera_y+SCREEN_H-14,sz2,10);
    }
  //スコア表示
  vcon.fillStyle = "white";
  vcon.fillText("SCORE "+score,camera_x+100,camera_y+14 );
  
  //power up message
  if(jiki.powerFlag)
  {
     vcon.fillText(jiki.powerMessage,(jiki.x>>8)-10,(jiki.y>>8)-(jiki.count-jiki.powerMessageCount));
     if(jiki.count > jiki.powerMessageCount + 100)
      {jiki.powerFlag = false;}  
  }
 

  //仮想画面から実際のキャンバスにコピー

  con.drawImage( vcan ,camera_x,camera_y,SCREEN_W,SCREEN_H,0,0,CANVAS_W,CANVAS_H);
}

//情報の表示
function putInfo()
{
  con.fillStyle="white";

  if( gameOver )
  {
    if( gameStart ){
    let s = "GAME OVER";
    let w = con.measureText(s).width;
    let x = CANVAS_W/2 - w/2;
    let y = CANVAS_H/2 - 20;
    con.fillText(s,x,y);
    s = "Push 'R' key to restart !";
    w = con.measureText(s).width;
    x = CANVAS_W/2 - w/2;
    y = CANVAS_H/2 - 20+20;
    con.fillText(s,x,y);
      document.getElementById("RETRY").style.display=("block");
    } else {
      document.getElementById("START").style.display=("block");
    }
  }


  if(DEBUG)
  {
    drawCount++;
    if( lastTime +1000 <= Date.now() )
    {
      fps=drawCount;
      drawCount = 0;
      lastTime=Date.now();
    }
    con.fillText("FPS :"+fps,20,20);  
    con.fillText("Tama:"+tama.length,20,40);  
    con.fillText("Teki:"+teki.length,20,60);  
    con.fillText("Teta:"+teta.length,20,80);  
    con.fillText("Expl:"+expl.length,20,100);  
    con.fillText("X:"+(jiki.x>>8),20,120);  
    con.fillText("Y:"+(jiki.y>>8),20,140);  
    con.fillText("HP:"+jiki.hp,20,160);  
    con.fillText("SCORE:"+score,20,180);  
    con.fillText("COUNT:"+gameCount,20,200);  
    con.fillText("WAVE:"+gameWave,20,220);  
    con.fillText("ITEM:"+item.length,20,240); 
    con.fillText("WEAPON:"+jiki.weapon,20,260); 
    con.fillText("POWER:"+jiki.power,20,280); 

    //con.fillText("Power up !",jiki.x>>8,jiki.y>>8);  
  }
}

let gameCount =0;
let gameWave  =0;
let gameRound =0;

let starSpeed    = 100;
let starSpeedReq = 100;

//ゲームループ
function gameLoop()
{
  gameCount++;
  if( starSpeedReq>starSpeed )starSpeed++;
  if( starSpeedReq<starSpeed )starSpeed--;

  if( gameWave == 0)
  {
    if( rand(0,15)==1 )
    {
      let r = rand(0,1);
      teki.push( new Teki( 0,rand(0,FIELD_W)<<8,0,0,rand(300,1200)));
    }
    if( gameCount >60*20)
    {
      gameWave++;
      gameCount=0;
      starSpeedReq=200;
    }
  }
  else if( gameWave == 1)
  {
    if( rand(0,15)==1 )
    {
      let r = rand(0,1);
      teki.push( new Teki( 1,rand(0,FIELD_W)<<8,0,0,rand(300,1200)));
    }
    if( gameCount >60*20)
    {
      gameWave++;
      gameCount=0;
      starSpeedReq=100;
    }
  }
  else if( gameWave == 2)
  {
    if( rand(0,10)==1 )
    {
      let r = rand(0,1);
      teki.push( new Teki( 1,rand(0,FIELD_W)<<8,0,0,rand(300,1200)));
    }
    if( gameCount >60*20)
    {
      gameWave++;
      gameCount=0;
      teki.push( new Teki( 2,(FIELD_W/2)<<8,-(70<<8),0,200));
      starSpeedReq=600;

    }
  }
  else if( gameWave == 3)
  {
    if( teki.length == 0)
    {
      gameWave  = 0;
      gameCount = 0;
      gameRound++;
      starSpeedReq=100;
    }
  }
  
  updateAll();
  drawAll();
  putInfo();
}

window.onload = function()
{
  gameOver = true;
  const button_start = document.getElementById('START');
  const button_retry = document.getElementById('RETRY');
  startGame();
  button_start.addEventListener('click', function(){
    document.getElementById("START").style.display=("none");
    gameStart = true;
    retry()
  });
  button_retry.addEventListener('click', function(){
    retry();
    //delete jiki;
    //jiki = new Jiki();
    //gameOver = false;
    //score = 0;
    //startGame();
  });
  function startGame(){
    gameInit();
    document.getElementById("START").style.display=("none");
    document.getElementById("RETRY").style.display=("none");
  }
}
