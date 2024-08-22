//
// teki.js 敵関連
//


//敵弾クラス
class Teta extends CharaBase
{
  constructor(sn,x,y,vx,vy)
  {
    super(sn,x,y,vx,vy);
    this.r = 4;
  }

  update()
  {
    super.update()
    
    if(!gameOver && !jiki.muteki && checkHit(this.x, this.y, this.r,
                 jiki.x, jiki.y, jiki.r) )
    {
      this.kill=true;
      if((jiki.hp -=30)<=0 )
      {
        gameOver = true;
      }
      else
      {
        jiki.damage = 10;
        jiki.muteki = 60;
      }
    }

    this.sn=14 + ((this.count>>3)&1);
  }
}

//敵クラス
class Teki extends CharaBase
{
  constructor( tnum,x,y,vx,vy)
  {
    super( 0,x,y,vx,vy);
    this.flag = false;
    //this.w = 20;
    //this.h = 20;
    this.r = 10;
    this.tnum = tnum;
  }

  update()
  {
    //共通のアップデート
    super.update();

    //個別のアップデート

    tekiFunc[this.tnum](this);

    //当たり判定

    if(!gameOver && !jiki.muteki && checkHit(this.x, this.y, this.r,
      jiki.x, jiki.y, jiki.r) )
    {
      this.kill=true;
      if((jiki.hp -=30)<=0 )
      {
        gameOver = true;
      }
      else
      {
        jiki.damage = 10;
        jiki.muteki = 60;
      }
    }
  }

  draw()
  {
    super.draw();
  }
}

//弾を時期に向けて発射する
function tekiShot(obj,speed)
{
  if(gameOver)return;
  let an, dx, dy;
  an = Math.atan2( jiki.y - obj.y, jiki.x - obj.x );
  dx = Math.cos( an ) * speed;
  dy = Math.sin( an ) * speed; 
  teta.push( new Teta( 15, obj.x, obj.y, dx, dy ) );
}

//ピンクのヒヨコの移動パターン
function tekiMove01(obj)
{
  if( !obj.flag )
    {
      if (jiki.x > obj.x && obj.vx < 120 ) obj.vx+= 4;
      else if (jiki.x < obj.x && obj.vx > -120 ) obj.vx-= 4;
    }
    else
    {
      if (jiki.x < obj.x && obj.vx < 400 ) obj.vx+= 30;
      else if (jiki.x > obj.x && obj.vx > -400 ) obj.vx-= 30;
    }
    
    if( Math.abs( jiki.y-obj.y ) < (100<<8) && !obj.flag )
      {
        obj.flag = true;
        tekiShot(obj,600);
      } 
      if( obj.flag && obj.vy>-800) obj.vy-=30;

      //スプライトの変更

      const ptn = [39,40,39,41]
      obj.sn = ptn[ (obj.count>>3)&3 ];
    }
    
//黄色のヒヨコの移動パターン
function tekiMove02(obj)
{
  if( !obj.flag )
    {
      if (jiki.x > obj.x && obj.vx < 600 ) obj.vx+= 30;
      else if (jiki.x < obj.x && obj.vx > -600 ) obj.vx-= 30;
    }
    else
    {
      if (jiki.x < obj.x && obj.vx < 600 ) obj.vx+= 30;
      else if (jiki.x > obj.x && obj.vx > -600 ) obj.vx-= 30;
    }
    
    if( Math.abs( jiki.y-obj.y ) < (100<<8) && !obj.flag )
      {
        obj.flag = true;
        tekiShot(obj,600);
      }

      //スプライトの変更

      const ptn = [33,34,33,35]
      obj.sn = ptn[ (obj.count>>3)&3 ];
}

let tekiFunc = [
  tekiMove01,
  tekiMove02,
]