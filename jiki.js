//
// jiki,js 自機関連
//

//弾クラス
class Tama extends CharaBase
{
  constructor( x,y,vx,vy)
  {
    super( 5,x,y,vx,vy);
  }

  update()
  {
    super.update();
  }

  draw()
  {
    super.draw();
  }
}

//自機クラス
class Jiki
{
  constructor()
  {
    this.x = (FIELD_W/2)<<8;
    this.y = (FIELD_H/2)<<8;
    this.speed = 512;
    this.anime = 0;
    this.reload = 0;
    this.relo2 = 0;
  }

  update()
  {
    if(key[32] && this.reload==0 )
      {
        //弾インスタンス生成（発射開始x,発射開始y,移動量x,移動量y）
        tama.push( new Tama(this.x+(4<<8),this.y-(10<<8),  0, -2000));
        tama.push( new Tama(this.x-(4<<8),this.y-(10<<8),  0, -2000));
        tama.push( new Tama(this.x+(8<<8),this.y-(10<<8), 80, -2000));
        tama.push( new Tama(this.x-(8<<8),this.y-(10<<8),-80, -2000));
        this.reload = 4;
        if(++this.relo2==4)
        {
          this.reload=20;
          this.relo2=0;
        }
      }
      if( !key[32] ) this.reload= this.relo2=0;

      if( this.reload>0) this.reload--; 
    if( key[37] && this.x>this.speed)
      {
        this.x -=this.speed;
        if(this.anime>-8 )this.anime--;
      }
      else if( key[39]  && this.x<=(FIELD_W<<8)-this.speed)
      {
        this.x +=this.speed;
        if(this.anime<8 )this.anime++;
      }
      else
      {
        if(this.anime>0) this.anime--;
        if(this.anime<0) this.anime++;
      }
      if( key[38] && this.y>this.speed )this.y -=this.speed;
  
      if( key[40] && this.y<= (FIELD_H<<8)-this.speed)this.y +=this.speed;

  }

  draw()
  {
    drawSprite(2 + (this.anime>>2), this.x, this.y);
  }
}