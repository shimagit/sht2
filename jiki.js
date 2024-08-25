//
// jiki,js 自機関連
//

//弾クラス
class Tama extends CharaBase
{
  constructor( x,y,vx,vy)
  {
    super( 6,x,y,vx,vy);
    //this.w = 4;
    //this.h = 6;
    this.r = 4;
  }

  update()
  {
    super.update();
    
    for( let i=0; i<teki.length; i++)
    {
      if( !teki[i].kill)
      {
        if( checkHit(
          this.x, this.y, this.r,
          teki[i].x, teki[i].y, teki[i].r))
        {
          this.kill=true;

          if((teki[i].hp-=10)<=0)
          {
            teki[i].kill=true;
            explosion(
              teki[i].x, teki[i].y,
              teki[i].vx>>3, teki[i].vy>>3 ); 
            score += teki[i].score;
            if(!rand(0,5))
            {
              item.push(new Item(50, this.x, this.y, 0, 200))
            }
          }
          else
          {
            expl.push(new Expl( 0, this.x, this.y, 0, 0))
          }
          if( teki[i].mhp>=1000 )
            {
              bossHP = teki[i].hp;
              bossMHP = teki[i].mhp;
            }  
          break;
        }
      }
    }
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
    this.x  = (FIELD_W/2)<<8;
    this.y  = (FIELD_H-50)<<8;
    this.mhp = 100;
    this.hp = this.mhp;

    this.speed  = 512;
    this.anime  = 0;
    this.reload = 0;
    this.relo2  = 0;
    this.r      = 3;
    this.damage = 0;
    this.muteki = 0;
    this.count  = 0;
    this.power  = 0;
  }

  update()
  {
    this.count++;
    if(this.damage)this.damage--;
    if(this.muteki)this.muteki--;

    if(key[32] && this.reload==0 )
      {
        //弾インスタンス生成（発射開始x,発射開始y,移動量x,移動量y）
        if(this.power = 1)
        {
          tama.push( new Tama(this.x,this.y,   0, -2000));
        }
        else
        {
          tama.push( new Tama(this.x+(6<<8),this.y-(10<<8),  0, -2000));
          tama.push( new Tama(this.x-(6<<8),this.y-(10<<8),  0, -2000));
          tama.push( new Tama(this.x+(8<<8),this.y-(5<<8), 200, -2000));
          tama.push( new Tama(this.x-(8<<8),this.y-(5<<8),-200, -2000));
        }
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
    if(this.muteki && (this.count&1)) return;
    drawSprite(2 + (this.anime>>2), this.x, this.y);
    if(this.count&1) return;
    drawSprite(9 + (this.anime>>2), this.x, this.y+(24<<8));
  }
}