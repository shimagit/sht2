let qx = 0;
let qy = 0;
let rx = 0;
let ry = 0;
let sx = 0;
let sy = 0;

function startup() {
  const el = document.getElementById("can");
  el.addEventListener("touchstart", handleStart);
  el.addEventListener("touchend", handleEnd);
  el.addEventListener("touchcancel", handleCancel);
  el.addEventListener("touchmove", handleMove);
  // log("Initialized.");
}

document.addEventListener("DOMContentLoaded", startup);

const ongoingTouches = [];

function handleStart(evt) {
  evt.preventDefault();
  // log("touchstart.");
  const el = document.getElementById("can");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    // log(`touchstart: ${i}.`);
    ongoingTouches.push(copyTouch(touches[i]));
    const color = colorForTouch(touches[i]);
    // log(`color of touch with id ${touches[i].identifier} = ${color}`);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // 最初に円を描く
    rx = touches[i].pageX;
    ry = touches[i].pageY;
    sx = rx;
    sy = ry;
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function handleMove(evt) {
  evt.preventDefault();
  const el = document.getElementById("can");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      // log(`continuing touch ${idx}`);
      ctx.beginPath();
      // log(`ctx.move( ${ongoingTouches[idx].pageX}, ${ongoingTouches[idx].pageY} );`,);
      qx = ongoingTouches[idx].pageX;
      qy = ongoingTouches[idx].pageY;
      sx = qx;
      sy = qy;
      // drawCircle(qx,qy,20,lightgreen);
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      // log(`ctx.line( ${touches[i].pageX}, ${touches[i].pageY} );`);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      // rx = touches[i].pageX;
      // ry = touches[i].pageY;
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    } else {
      // log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  // log("touchend");
  const el = document.getElementById("can");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      // log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  // log("touchcancel.");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }
}

function colorForTouch(touch) {
  let r = touch.identifier % 16;
  let g = Math.floor(touch.identifier / 3) % 16;
  let b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  const color = `#${r}${g}${b}`;
  return color;
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1; // 見つからない
}

function log(msg) {
  const container = document.getElementById("log");
  container.textContent = `${msg} \n${container.textContent}`;
}

/*

// 要素ら

var $document = $(document);
var $hitarea = $('#hitarea');
var $eventname = $('#eventname');
var $x = $('#x');
var $y = $('#y');

// タッチイベントが利用可能かの判別

var supportTouch = 'ontouchend' in document;

// イベント名

var EVENTNAME_TOUCHSTART = supportTouch ? 'touchstart' : 'mousedown';
var EVENTNAME_TOUCHMOVE = supportTouch ? 'touchmove' : 'mousemove';
var EVENTNAME_TOUCHEND = supportTouch ? 'touchend' : 'mouseup';

// 表示をアップデートする関数群

var updateXY = function(event) {
  // jQueryのイベントはオリジナルのイベントをラップしたもの。
  // changedTouchesが欲しいので、オリジナルのイベントオブジェクトを取得
  var original = event.originalEvent;
  var x, y;
  if(original.changedTouches) {
    x = original.changedTouches[0].pageX;
    y = original.changedTouches[0].pageY;
  } else {
    x = event.pageX;
    y = event.pageY;
  }
  $x.text(x);
  $y.text(y);
  console.log("abc",x,y)
};
var updateEventname = function(eventname) {
  $eventname.text(eventname);
};

// イベント設定

var handleStart = function(event) {
  updateEventname(EVENTNAME_TOUCHSTART);
  updateXY(event);
  $hitarea.css('background-color', 'red');
  bindMoveAndEnd();
};
var handleMove = function(event) {
  event.preventDefault(); // タッチによる画面スクロールを止める
  updateEventname(EVENTNAME_TOUCHMOVE);
  updateXY(event);
};
var handleEnd = function(event) {
  updateEventname(EVENTNAME_TOUCHEND);
  updateXY(event);
  $hitarea.css('background-color', 'blue');
  unbindMoveAndEnd();
};
var bindMoveAndEnd = function() {
  $document.on(EVENTNAME_TOUCHMOVE, handleMove);
  $document.on(EVENTNAME_TOUCHEND, handleEnd);
};
var unbindMoveAndEnd = function() {
  $document.off(EVENTNAME_TOUCHMOVE, handleMove);
  $document.off(EVENTNAME_TOUCHEND, handleEnd);
};

$hitarea.on(EVENTNAME_TOUCHSTART, handleStart);

*/

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
se10 = new Audio("get.mp3");
se11 = new Audio("shild.mp3");
se12 = new Audio("jikihidan.mp3");
se13 = new Audio("jikibakuhatu.mp3");
se14 = new Audio("power.mp3");
se15 = new Audio("BGM_nomal.mp3");
se16 = new Audio("BGM_boss.mp3");
se1.volume = soundVolume * 4;
se2.volume = soundVolume / 5;
se3.volume = soundVolume * 4;
se4.volume = soundVolume / 5;
se5.volume = soundVolume / 5;
se6.volume = soundVolume * 2;
se7.volume = soundVolume * 1;
se8.volume = soundVolume * 1;
se9.volume = soundVolume * 1;
se10.volume = soundVolume * 1;
se11.volume = soundVolume * 1;
se12.volume = soundVolume * 1;
se13.volume = soundVolume * 2;
se14.volume = soundVolume * 1;
se15.volume = soundVolume * 0.5;
se16.volume = soundVolume * 0.5;
se1.playbackRate = 5;
se2.playbackRate = 10;
se3.playbackRate = 2;
se6.playbackRate = 3;
se7.playbackRate = 1;
se8.playbackRate = 1;
se9.playbackRate = 1;
se10.playbackRate = 1;
se11.playbackRate = 1;
se12.playbackRate = 1;
se13.playbackRate = 1;
se14.playbackRate = 1;

let drawCount = 0;
let fps = 0;
let lastTime = Date.now();

//スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
const GAME_SPEED = 1000 / 60;

//画面サイズ
const SCREEN_W = 150; // 180;
const SCREEN_H = 220; // 320;

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
can.width = CANVAS_W;
can.height = CANVAS_H;

con.mozimageSmoothingEnabled = SMOOTHING;
con.webkitimageSmoothingEnabled = SMOOTHING;
con.msimageSmoothingEnabled = SMOOTHING;
con.imageSmoothingEnabled = SMOOTHING;
con.font = "20px 'Impact'";


//マウス操作設定
can.onmousedown = mymousedown;
can.onmouseup = mymouseup;
can.addEventListener('touchstart', mymousedown);
can.addEventListener('touchend', mymouseup);


//フィールド(仮想画面)
let vcan = document.createElement("canvas"); //表示されないキャンバス
let vcon = vcan.getContext("2d");
vcan.width = FIELD_W;
vcan.height = FIELD_H;
vcon.font = "12px 'Impact'";

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//
let gameStart = false;
let gameOver = false;
let score = 0;

//
let bossHP = 0;
let bossMHP = 0;

//星の実体
let star = [];

//キーボードの状態
let key = [];
let keyCode2 = 0;

//
let xx=0;
let yy=0;

//オブジェクト達
let teki = [];
let teta = [];
let tama = [];
let expl = [];
let item = [];
let jiki = new Jiki();
//teki[0]= new Teki( 75, 200<<8,200<<8, 0,0)

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//ゲーム初期化
function gameInit() {
  for (let i = 0; i < STAR_MAX; i++) star[i] = new Star();
  setInterval(gameLoop, GAME_SPEED);
}

//オブジェクトをアップデート
function updateObj(obj) {
  for (let i = obj.length - 1; i >= 0; i--) {
    obj[i].update();
    if (obj[i].kill) obj.splice(i, 1);
  }
}

//オブジェクトを描画
function drawObj(obj) {
  for (let i = 0; i < obj.length; i++) obj[i].draw();
}

//移動の処理
function updateAll() {
  updateObj(star);
  updateObj(tama);
  updateObj(teta);
  updateObj(teki);
  updateObj(expl);
  updateObj(item);
  if (!gameOver) jiki.update();
}

//描画の処理
function drawAll() {
  vcon.fillStyle = jiki.damage ? "red" : "black";
  vcon.fillRect(camera_x, camera_y, SCREEN_W, SCREEN_H);

  drawObj(star);
  drawObj(tama);
  if (!gameOver) jiki.draw();
  drawObj(teki);
  drawObj(expl);
  drawObj(teta);
  drawObj(item);

  //自機の範囲0〜FIEL_W
  //カメラの範囲0〜(FIELD_W-SCREEN_W)

  camera_x = Math.floor(((jiki.x >> 8) / FIELD_W) * (FIELD_W - SCREEN_W));
  camera_y = Math.floor(((jiki.y >> 8) / FIELD_H) * (FIELD_H - SCREEN_H));

  //ボスのHPを表示する

  if (bossHP > 0) {
    let sz = ((SCREEN_W - 20) * bossHP) / bossMHP;
    let sz2 = SCREEN_W - 20;

    vcon.fillStyle = "rgba(255,0,0,0.5)";
    vcon.fillRect(camera_x + 10, camera_y + 15, sz, 10);
    vcon.strokeStyle = "rgba(255,0,0,0.9)";
    vcon.strokeRect(camera_x + 10, camera_y + 15, sz2, 10);
  }

  //自機のHPを表示する
  if (jiki.hp > 0) {
    let sz = ((SCREEN_W - 20) * jiki.hp) / jiki.mhp;
    let sz2 = SCREEN_W - 20;

    vcon.fillStyle = "rgba(0,0,255,0.5)";
    vcon.fillRect(camera_x + 10, camera_y + SCREEN_H - 317, sz, 10);
    vcon.strokeStyle = "rgba(0,0,255,0.9)";
    vcon.strokeRect(camera_x + 10, camera_y + SCREEN_H - 317, sz2, 10);
  }
  //スコア表示
  vcon.fillStyle = "white";
  vcon.fillText("SCORE " + score, camera_x + 100, camera_y + 14);

  //power up message
  if (jiki.powerFlag) {
    vcon.fillText(
      jiki.powerMessage,
      (jiki.x >> 8) - 10,
      (jiki.y >> 8) - (jiki.count - jiki.powerMessageCount)
    );
    if (jiki.count > jiki.powerMessageCount + 100) {
      jiki.powerFlag = false;
    }
  }

  drawCircle(camera_x+ 20-0, camera_y+300-100, 20,"blue");
  drawCircle(camera_x+120-30, camera_y+282-100, 15,"blue");
  drawCircle(camera_x+163-30, camera_y+282-100, 15,"blue");
  drawCircle(camera_x+141-30, camera_y+260-100, 15,"blue");
  drawCircle(camera_x+141-30, camera_y+305-100, 15,"blue");
  drawCircle(camera_x+(qx/2-3)-15, camera_y+(qy/2-33)+23, 15,"orange");
  drawCircle(camera_x+(rx/2-3)-15, camera_y+(ry/2-33)+23, 10,"red");
  drawCircle(camera_x+(sx/2-3)-15, camera_y+(sy/2-33)+23, 7,"lightgreen");
  //drawCircle(camera_x+(xx-3), camera_y+(yy-10), 10,"red");
  console.log('zx='+xx, "zy="+yy, 'keyCode2='+keyCode2);


  vcon.fillstyle ="red";
  vcon.strokeStyle ="red";
  vcon.strokeText = "red ";
  vcon.fillStyle = "white";
  vcon.fillText("◎",    camera_x+ 14-0, camera_y+298-100);
  vcon.fillText("Shot", camera_x+  9-0, camera_y+310-100);
  vcon.fillText("←",   camera_x+115-30, camera_y+285-100);
  vcon.fillText("→",   camera_x+158-30, camera_y+285-100);
  vcon.fillText("↑",   camera_x+138-30, camera_y+262-100);
  vcon.fillText("↓",   camera_x+138-30, camera_y+308-100);

  //仮想画面から実際のキャンバスにコピー

  con.drawImage(
    vcan,
    camera_x,
    camera_y,
    SCREEN_W,
    SCREEN_H,
    0,
    0,
    CANVAS_W,
    CANVAS_H
  );
}

//情報の表示
function putInfo() {
  con.fillStyle = "white";

  if (gameOver) {
    se15.loop = false;
    se16.loop = false;
    se15.pause();
    se16.pause();
    if (gameStart) {
      let s = "GAME OVER";
      let w = con.measureText(s).width;
      let x = CANVAS_W / 2 - w / 2;
      let y = CANVAS_H / 2 - 20;
      con.fillText(s, x, y);
      s = "Push 'R' key to restart !";
      w = con.measureText(s).width;
      x = CANVAS_W / 2 - w / 2;
      y = CANVAS_H / 2 - 20 + 20;
      con.fillText(s, x, y);
      document.getElementById("RETRY").style.display = "block";
    } else {
      document.getElementById("START").style.display = "block";
    }
  }

  if (DEBUG) {
    drawCount++;
    if (lastTime + 1000 <= Date.now()) {
      fps = drawCount;
      drawCount = 0;
      lastTime = Date.now();
    }
    con.fillText("FPS :" + fps, 20, 20);
    con.fillText("Tama:" + tama.length, 20, 40);
    con.fillText("Teki:" + teki.length, 20, 60);
    con.fillText("Teta:" + teta.length, 20, 80);
    con.fillText("Expl:" + expl.length, 20, 100);
    con.fillText("X:" + (jiki.x >> 8), 20, 120);
    con.fillText("Y:" + (jiki.y >> 8), 20, 140);
    con.fillText("HP:" + jiki.hp, 20, 160);
    con.fillText("SCORE:" + score, 20, 180);
    con.fillText("COUNT:" + gameCount, 20, 200);
    con.fillText("WAVE:" + gameWave, 20, 220);
    con.fillText("ITEM:" + item.length, 20, 240);
    con.fillText("WEAPON:" + jiki.weapon, 20, 260);
    con.fillText("POWER:" + jiki.power, 20, 280);
    con.fillText("qx:" + qx, 20, 300);
    con.fillText("qy:" + qy, 20, 320);
    con.fillText("rx:" + rx, 20, 340);
    con.fillText("ry:" + ry, 20, 360);
    con.fillText("sx:" + sx, 20, 380);
    con.fillText("sy:" + sy, 20, 400);
    //drawCircle(qx,qy,20,"red");

    //con.fillText("Power up !",jiki.x>>8,jiki.y>>8);
  }
}

let gameCount = 0;
let gameWave = 0;
let gameRound = 0;

let starSpeed = 100;
let starSpeedReq = 100;

//ゲームループ
function gameLoop() {
  gameCount++;
  if (starSpeedReq > starSpeed) starSpeed++;
  if (starSpeedReq < starSpeed) starSpeed--;

  if (gameWave == 0) {
    if (rand(0, 15) == 1) {
      let r = rand(0, 1);
      teki.push(new Teki(0, rand(0, FIELD_W) << 8, 0, 0, rand(300, 1200)));
    }
    if (gameCount > 60 * 20) {
      gameWave++;
      gameCount = 0;
      starSpeedReq = 200;
    }
  } else if (gameWave == 1) {
    if (rand(0, 15) == 1) {
      let r = rand(0, 1);
      teki.push(new Teki(1, rand(0, FIELD_W) << 8, 0, 0, rand(300, 1200)));
    }
    if (gameCount > 60 * 20) {
      gameWave++;
      gameCount = 0;
      starSpeedReq = 100;
    }
  } else if (gameWave == 2) {
    if (gameCount > 60 * 18) {
      se15.volume = soundVolume * 0.1;
    } else if (gameCount > 60 * 17) {
      se15.volume = soundVolume * 0.2;
    } else if (gameCount > 60 * 16) {
      se15.volume = soundVolume * 0.3;
    } else if (gameCount > 60 * 15) {
      se15.volume = soundVolume * 0.4;
    } else {
      se15.volume = soundVolume * 0.5;
    }
    if (rand(0, 10) == 1) {
      let r = rand(0, 1);
      teki.push(new Teki(1, rand(0, FIELD_W) << 8, 0, 0, rand(300, 1200)));
    }
    if (gameCount > 60 * 20) {
      gameWave++;
      gameCount = 0;
      teki.push(new Teki(2, (FIELD_W / 2) << 8, -(70 << 8), 0, 200));
      starSpeedReq = 600;
      se15.pause();
      se15.loop = false;
      se16.currentTime = 0;
      se16.loop = true;
      se16.play();
    }
  } else if (gameWave == 3) {
    if (teki.length == 0) {
      gameWave = 0;
      gameCount = 0;
      gameRound++;
      starSpeedReq = 100;
      se16.pause();
      se16.loop = false;
      se15.currentTime = 0;
      se15.volume = soundVolume * 0.5;
      se15.loop = true;
      se15.play();
    }
  }

  updateAll();
  drawAll();
  putInfo();
}

window.onload = function () {
  gameOver = true;
  const button_start = document.getElementById("START");
  const button_retry = document.getElementById("RETRY");
  startGame();
  button_start.addEventListener("click", function () {
    document.getElementById("START").style.display = "none";
    gameStart = true;
    retry();
  });
  button_retry.addEventListener("click", function () {
    retry();
    //delete jiki;
    //jiki = new Jiki();
    //gameOver = false;
    //score = 0;
    //startGame();
  });
  function startGame() {
    gameInit();
    document.getElementById("START").style.display = "none";
    document.getElementById("RETRY").style.display = "none";
  }
};

// function controle()
// {
//   switch(keyCode2)
//   {
//     case 37:// 左
//         if ( checkMove( -1,  0 ))tetro_x--;
//         break;
//     case 38:// 上
//         //if ( checkMove(  0, -1 ))tetro_y--;
//         break;
//     case 39:// 右
//         if ( checkMove(  1,  0 ))tetro_x++;
//         break;
//     case 40:// 下
//         while( checkMove(0,  1 ))tetro_y++;
//         break;
//     case 32:// スペース
//         let ntetro = rotate();
//         if ( checkMove( 0, 0, ntetro))
//         {
//           se2.pause();
//           se2.play();
//           tetro = ntetro;
//         }
//         break;
//     }
//     drawAll();
// }

//キーボードが押された時の処理
//document.onkeydown = function(e)
//{
  //if (over) return;
  //keyCode2 = e.keyCode;
  //controle();
//}

//マウスのクリックボタンを離した時の処理
function mymouseup(e){
  key[32] = false;
  key[37] = false;
  key[38] = false;
  key[39] = false;
  key[40] = false;
  if (gameOver) return;
  //keyCode2 = 0;
} 

//マウスのクリックボタンを押した時の処理
function mymousedown(e) {
  //e.preventDefault() ;
  //var mouseX = !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
  //var mouseY = !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;
  //xx = camera_x + (mouseX>>1) //=camera_x+mouseX/100
  //yy = camera_y + (mouseY>>1) //camera_x+mouseX/100
  //xx = mouseX>>1 //=camera_x+mouseX/100
  //yy = mouseY>>1 //camera_x+mouseX/100
    //console.log('xx='+mouseX, "yy="+mouseY);
    //console.log('xx='+camera_x, "yy="+camera_y);
    //drawCircle(xx, yy, 35,"red");
    //drawCircle(camera_x, camera_y, 20,"white");
    keyCode2 = 0;
    console.log("*************",keyCode2,sx,sy)
    if (sx < 115 && 400 < sy) {
      keyCode2 = 32; //shot
      console.log("keyCode:",keyCode2," SHOT")
        } else {
          if(125-30 < xx && 155-30 > xx &&  290-100 < yy ) {
            keyCode2 = 40; //down
            console.log("keyCode:",keyCode2," Down")
          } else {
            if (125-30 < xx && 155-30 > xx && 240-100 < yy && 275-100 > yy ) {
              keyCode2 = 38; //up
              console.log("keyCode:",keyCode2," Up")
            } else {
              if (105-30 < xx && 135-30 > xx && 265-100 < yy && 295-100 > yy ) {
                keyCode2 = 37; //left
                console.log("keyCode:",keyCode2," Left")
              } else {
                if (150-30 < xx && 265-100 < yy && 295-100 > yy ) {
                  keyCode2 = 39; //right;
                  console.log("keyCode:",keyCode2," Right")
                }
              }
            }
          }
        }



  //if (gameOver) return;
    //e.preventDefault() ;
    //var mouseX = !isNaN(e.offsetX) ? e.offsetX : e.touches[0].clientX;
    //var mouseY = !isNaN(e.offsetY) ? e.offsetY : e.touches[0].clientY;
    //console.log("@@keyCode:",keyCode2)
    //keyCode2=0;
    /*
    if (xx < 130 && 570 < yy) {
      keyCode2 = 32; //shot
        } else {
          if(215 < xx && 245 > xx &&  590 < yy ) {
            keyCode2 = 40; //down
          } else {
            if (215 < xx && 245 > xx && 540 < yy && 570 > yy ) {
              keyCode2 = 38; //up
            } else {
              if (195 < xx && 225 > xx && 560 < yy && 590 > yy ) {
                keyCode2 = 37; //left
              } else {
                if (235 < xx && 265 > xx && 560 < yy && 590 > yy ) {
                  keyCode2 = 39; //right;
                }
                console.log("keyCode:",keyCode2," SHOT")
              }
            }
          }
        }
      */
        // if (xx < 40 && 280-100 < yy) {
        //   keyCode2 = 32; //shot
        //   console.log("keyCode:",keyCode2," SHOT")
        //     } else {
        //       if(125-30 < xx && 155-30 > xx &&  290-100 < yy ) {
        //         keyCode2 = 40; //down
        //         console.log("keyCode:",keyCode2," Down")
        //       } else {
        //         if (125-30 < xx && 155-30 > xx && 240-100 < yy && 275-100 > yy ) {
        //           keyCode2 = 38; //up
        //           console.log("keyCode:",keyCode2," Up")
        //         } else {
        //           if (105-30 < xx && 135-30 > xx && 265-100 < yy && 295-100 > yy ) {
        //             keyCode2 = 37; //left
        //             console.log("keyCode:",keyCode2," Left")
        //           } else {
        //             if (150-30 < xx && 265-100 < yy && 295-100 > yy ) {
        //               keyCode2 = 39; //right;
        //               console.log("keyCode:",keyCode2," Right")
        //             }
        //           }
        //         }
        //       }
        //     }
        //console.log("keyCode:",keyCode2," SHOT")
        console.log("---keyCode:",keyCode2)
        key[keyCode2] = true

    //controle();
    //drawCircle(mouseX, mouseY, 35,"red");
}

   //円を描く
   function drawCircle(x, y, r, color){
    vcon.fillStyle = color;
    vcon.beginPath();
    vcon.arc(x, y, r, 0, Math.PI*2);
    vcon.fill();
    }
