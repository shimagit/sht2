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
    
    if(!jiki.muteki && checkHit(this.x, this.y, this.r,
                 jiki.x, jiki.y, jiki.r) )
    {
      this.kill=true;
      jiki.damage = 10;
      jiki.muteki = 60;
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

    tekiFunc[this.tnum]();

    tekiMove();

    //当たり判定
    if(!jiki.muteki && checkHit(this.x, this.y, this.r,
      jiki.x, jiki.y, jiki.r) )
      {
      this.kill=true;
      jiki.damage = 10;
      jiki.muteki = 60;
      }

  }

  draw()
  {
    super.draw();
  }
}

//ピンクのヒヨコの移動パターン
function tekiMove01()
{
  if( !this.flag )
    {
      if (jiki.x > this.x && this.vx < 120 ) this.vx+= 4;
      else if (jiki.x < this.x && this.vx > -120 ) this.vx-= 4;
    }
    else
    {
      if (jiki.x < this.x && this.vx < 400 ) this.vx+= 30;
      else if (jiki.x > this.x && this.vx > -400 ) this.vx-= 30;
    }
    
    if( Math.abs( jiki.y-this.y ) < (100<<8) && !this.flag )
      {
        this.flag = true;
        
        let an, dx, dy;
        an = Math.atan2( jiki.y - this.y, jiki.x - this.x );
        
        an += rand(-10, 10) * Math.PI/180;
        
        dx = Math.cos( an ) * 1000;
        dy = Math.sin( an ) * 1000;
        
        teta.push( new Teta( 15, this.x, this.y, dx, dy ) );
      }
      if( this.flag && this.vy>-800) this.vy-=30;
    }
    
//黄色のヒヨコの移動パターン
function tekiMove02()
{

  if( !this.flag )
    {
      if (jiki.x > this.x && this.vx < 120 ) this.vx+= 4;
      else if (jiki.x < this.x && this.vx > -120 ) this.vx-= 4;
    }
    else
    {
      if (jiki.x < this.x && this.vx < 400 ) this.vx+= 30;
      else if (jiki.x > this.x && this.vx > -400 ) this.vx-= 30;
    }

    if( Math.abs( jiki.y-this.y ) < (100<<8) && !this.flag )
    {
      this.flag = true;

      let an, dx, dy;
      an = Math.atan2( jiki.y - this.y, jiki.x - this.x );

      an += rand(-10, 10) * Math.PI/180;

      dx = Math.cos( an ) * 1000;
      dy = Math.sin( an ) * 1000;

      teta.push( new Teta( 15, this.x, this.y, dx, dy ) );
    }
    if( this.flag && this.vy>-800) this.vy-=30;
}

let tekiFunc = [
  tekiMove01,
  tekiMove02,
]