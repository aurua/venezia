/* 작성자: 김중훈.
*  내용: 간단한 베네치아 게임 구현.
*  word는 단어의 생성자.
* 시작버튼 클릭시 initGame()이 호출됨.
* manager()에서 게임의 흐름(레벨상승,난이도, 단어생성)을 조절함.
* 사용자가 타자입력시 checkAnswer()이 호출됨.
*/
var height=parseInt(window.getComputedStyle(bg).getPropertyValue('height').split('p')[0]);
var width=parseInt(window.getComputedStyle(bg).getPropertyValue('width').split('p')[0]);
//화면안에 있는 단어를 관리하는 연관 배열. key는 string, value는 해당 word object.
var wordarr = [];
var bomb = 3;
var running =false;
//외부 변수 : wordlist-> wordlist.js에 포함된 단어풀에 해당되는 배열.
//			  bword1, bword2 -> 폭탄을 사용하는 단어.

//str는 단어,movement는 0 또는 1,moveAmount는 움직일 떄의 속도,main은 main id를 가진 document element.
//color는 단어의 색깔 결정, string: "normal", "red", "green", "blue" 
function word(str,movement,moveAmount,color,main) {
	//단어의 string
	this.str = str;
	//단어가 움직여야 하는 지
	this.live = true;
	//단어의 document element
	var span= document.createElement("span");
	var word = document.createTextNode(str);
	span.appendChild(word);
	main.appendChild(span);
	span.style.top="10px";
	var sleft =Math.floor((Math.random() * (width-10)));
	span.style.left=sleft+"px";
	span.setAttribute("class","word");
	
	this.elem = span;
	this.left =sleft;
	this.movement=movement;
	this.moveAmount=moveAmount;
	this.level = parseInt(document.getElementById("level").innerHTML);
	this.color = color;
	if(color == "red")
	{
		this.elem.style.backgroundColor="#ff8a80";
	}
	else if(color == "green")
	{
		this.elem.style.backgroundColor="#00ffcc";	
	}
	else if(color == "blue")
	{
		this.elem.style.backgroundColor="#33ccff";
	}
	//단어의 움직임을 구현하는 함수.
	this.move = function(){
  		var id = setInterval(frame, 50);
  		var curword = this;
  		function frame() 
  		{
  	 		var life=parseInt(document.getElementById('life').innerHTML);
      		var pos = parseInt(curword.elem.style.top.split('p')[0]);
    		
    		if (pos > height) {
    			curword.remove();
      			document.getElementById('life').innerHTML=--life;
      			clearInterval(id);
      
    		} else {

      				pos+=curword.moveAmount; 
     				//console.log(pos);
     				curword.elem.style.top = pos + 'px'; 
      				//elem.style.left = pos + 'px'; 
      				if(curword.movement == 1)
      				{
      					var left = parseInt(curword.elem.style.left.split('p')[0]);

      					if(curword.left-30-3*curword.level > left)
      					{

      						curword.movement = 2;
      					}
      					else
      					{
      						//console.log(left-curword.moveamount);
      						curword.elem.style.left = (left-curword.moveAmount) + 'px';
      					}
      				}
      				if(curword.movement == 2)
					{
						var left = parseInt(curword.elem.style.left.split('p')[0]);
      					if(curword.left < left)
      					{
      						curword.movement = 1;
      					}
      					else
      					{
      						curword.elem.style.left = (left+curword.moveAmount) + 'px';
      					}
					}
      				if(curword.live==false || life == 0)
      					{
      						curword.remove();
      						clearInterval(id);
      					}

    				}
  		}

	}
	this.die = function(){
				this.live =false;
				}

	this.remove= function(){
				var str=this.elem.innerHTML;
    			this.elem.parentNode.removeChild(this.elem);
      			delete wordarr[str];
				}
}
function initGame(){
if(!running)
{
	running = true;
	//level,score,life 초기화
	document.getElementById("userInput").focus();
	var life = 5;
	var moveAmount = 4;
	bomb =3;
	document.getElementById("level").innerHTML="1";
	document.getElementById("score").innerHTML="0";
	document.getElementById("life").innerHTML=""+life;
	document.getElementById("bomb").innerHTML=""+bomb;
	var bg=document.getElementById('bg');
	var id = setInterval(manager, 1000);
	
	function manager( )
		{
			//wordlist 는 wordlist.js 에 있는 단어풀에 해당하는 배열.
			var arr=wordlist;
			
			var main=document.getElementById("main");
			
			var h1=document.getElementById("gameover");
			if(h1 != null)
				h1.parentNode.removeChild(h1);
			var index=Math.floor((Math.random() * arr.length));
			//단어 움직임 조절.
			//movement = 0 일반 움직임.
			//movement = 1,2 흔들림.
			var movement=0;
			var level = parseInt(document.getElementById("level").innerHTML);
			var score = parseInt(document.getElementById("score").innerHTML);
			if(Math.floor((Math.random() * level)) > 2.5)
				movement =1;
			//한 화면에 같은 단어없게 
			if(!(arr[index] in wordarr))
			{
				
				//단어생성=> 랜덤한 주기로 생성.
				if(Math.random() *level > 0.25+0.28*level )
				{ 
					//폭탄 추가하는 단어 생성.
					if(Math.random()  < 0.028 )
						var newword=new word(arr[index],movement,moveAmount,"red",main);
					//느리게 만드는 단어 생성.
					else if(Math.random()  < 0.03)
						var newword=new word(arr[index],movement,moveAmount,"green",main);
					else if(Math.random() < 0.12)
						var newword=new word(arr[index],movement,moveAmount,"blue",main);
					//일반 단어 생성.
					else
						var newword=new word(arr[index],movement,moveAmount,"normal",main);
					wordarr[arr[index]]=newword;
					//level 업
					if(score*0.13 > level )
					{
					
						document.getElementById("level").innerHTML=++level;
						if(level%2 == 0)
							moveAmount++;
					}
					//단어를 움직이기 시작한다.
				
					newword.move();
				}
			}
			life = parseInt(document.getElementById('life').innerHTML);
		
			if(life == 0)
			{
				clearInterval(id);
				gameover();
			}
		}
}	
}

//checkAnswer
function checkAnswer(event){
		if(event.keyCode === 13)
		{
			var input = document.getElementById('userInput');
			var str =input.value;
			
			input.value = "";
			//사용자가 단어를 맞춘 경우.
			if(str in wordarr)
			{
				//폭탄 증가하는 단어의 경우.
				if(wordarr[str].color == "red")
				{
					document.getElementById("bomb").innerHTML=""+(++bomb);
				}
				//전체가 느려지는 단어의 경우.
				if(wordarr[str].color == "green")
				{
					for(var key in wordarr)
					{
						wordarr[key].moveAmount=3;
					}
				}
				//전체가 약간 위로 올라가는 단어.
				if(wordarr[str].color == "blue")
				{
					for(var key in wordarr)
					{
						var pos = parseInt(wordarr[key].elem.style.top.split('p')[0]);
						pos -= 100;
						wordarr[key].elem.style.top=pos+"px";
					}	
				}
				wordarr[str].die();
				var score = parseInt(document.getElementById('score').innerHTML);
				
				score += str.length;
				document.getElementById('score').innerHTML = score;
			}
			//폭탄 사용시.
			if((str===bword1||str===bword2)&(bomb>0))
			{
				document.getElementById("bomb").innerHTML=""+(--bomb);
				for(var key in wordarr)
				{
					wordarr[key].die();
				}
			}
		}

	
}
//게임오버 화면.
function gameover()
{
	
	var img=document.createElement("img");
	
	img.setAttribute("src","./image/game-over.png");
	img.setAttribute("id","gameover");
	document.getElementById("main").appendChild(img);
	
	img.style.position='absolute';
	img.style.top=Math.floor(height/2-100)+'px';
	img.style.left=Math.floor(width/2-340)+'px';
	running = false;
}