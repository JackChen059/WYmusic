/*
* @Author: Marte
* @Date:   2017-07-06 11:34:18
* @Last Modified by:   Marte
* @Last Modified time: 2017-07-11 14:23:49
*/

'use strict';
window.onload=function(){
  var oSearch = document.getElementById('search');
  var oBtn = document.getElementById('btn');
  var oul = document.getElementById('ul');
  var lyric = document.getElementById('lyric');
  var audio = document.getElementById('audio');
  var show = document.getElementById('show');
  var talk = document.getElementById('talk');
  var pic = document.getElementById('pic');
  var word = document.getElementById('word');
  var head = document.getElementById('head');
  var talkName = document.getElementById('talkName');

//搜索音乐
  oBtn.onclick=function(){
    ajax({
      type:'get',
      url:'https://api.imjad.cn/cloudmusic/?type=search&s='+oSearch.value+'&limit=9',
      async:true,
      success:function(data){
        oul.innerHTML = '';
        for(var i = 0 ;i<data.result.songs.length;i++){
          var ali = document.createElement('li');
          var img = document.createElement('img');
          var oP = document.createElement('p');
          var oName = document.createElement('a');
          var oSong = document.createElement('p');
          var oMv = document.createElement('button');

          oMv.style.float='right';
          oMv.style.marginRight='20px';
          oP.style.height='70px';
          img.style.height='200px';

          img.setAttribute('src',data.result.songs[i].al.picUrl);
          img.setAttribute('song_id',data.result.songs[i].id);
          img.setAttribute('talk_id',data.result.songs[i].id);
          img.setAttribute('title', data.result.songs[i].name)
          img.setAttribute('singer', data.result.songs[i].ar[0].name)
          oMv.setAttribute('MV_id',data.result.songs[i].mv);
          oSong.innerText =  data.result.songs[i].name;
          oName.innerHTML = data.result.songs[i].ar[0].name;
          // osong_name.innerText =  data.result.songs[i].name;
          // osinger.innerHTML = data.result.songs[i].ar[0].name;
          // show.appendChild(osong_name);
          // show.appendChild(osinger);
          oMv.innerText = '播放MV';
          oP.appendChild(oName);
          oP.appendChild(oSong);
          if(data.result.songs[i].mv!=0){
            oP.appendChild(oMv);
          }
          ali.appendChild(img);
          ali.appendChild(oP);
          oul.appendChild(ali);
        }
      }
    })
  }

//播放音乐

  oul.onclick=function(e){
    var eve = e||event;
    var target = eve.srcElement || eve.target;
    if(target.nodeName.toLowerCase() == 'img'){
    var vid = document.getElementsByTagName('video')[0];
    var oTalk = document.createElement('div');
    var oHead = document.createElement('div');
    var otalkName = document.createElement('div');
    var talkImg = document.createElement('img')
    var img = document.createElement('img');
    talk.innerText = '';
    // oTalk.innerText ='';
    // talkImg.innerHTML ='';
    // otalkName.innerText ='';

    ajax({
      type:'get',
      url:'https://api.imjad.cn/cloudmusic/?type=search&s='+oSearch.value+'&limit:10',
      async:true,
      success:function(data){
          show.innerHTML = ''
          var osinger = document.createElement('p');
          var osong_name = document.createElement('p')
          osong_name.innerText = target.getAttribute('title');
          osinger.innerHTML = target.getAttribute('singer');
          show.appendChild(osong_name);
          show.appendChild(osinger);

      }
    })

    // audio.currentTime = 0;
    // audio.play();
    // oTalk.innerText ='';
    // talkImg.innerHTML ='';
    // otalkName.innerText ='';
    lyric.style.display = 'block';
    vid.style.display = 'none'

    ajax({
      type:'get',
      url:'https://api.imjad.cn/cloudmusic/?type=song&id='+target.getAttribute('song_id')+'&br:128000',
      async:true,
      success:function(data){
        audio.setAttribute('src',data.data[0].url);

        //歌词
      ajax({
        type:'get',
        url:'https://api.imjad.cn/cloudmusic/?type=lyric&id='+target.getAttribute('song_id')+'&br:128000',
        async:true,
        success:function(data){
          var lyr = JSON.stringify(data.lrc.lyric);
          // console.log(lyr);
          var lyric_arr = [];
          var reg = /\[\d{2}:\d{2}.\d{1,3}\]/g;
          var reg1 = /\[\d{2}:\d{2}.\d{1,3}\]/g;

          var lyric_arr = lyr.slice(1,-1);
          var lyric_arr = lyric_arr.split(/\\n/g);
          var lyric_time = [];
          var lyric_body = [];

          for(var i = 0;i<lyric_arr.length-1;i++){
            // console.log(lyric_arr[i]);
            lyric_time.push(lyric_arr[i].match(reg));
            lyric_body.push(lyric_arr[i].replace(reg1,''))
          }

          lyric_time.forEach(function(arr,index){
            var arr2;
            if(arr != null){
              arr2 = arr.toString();
            }else{
              arr2 = '[00:00.00]'
            }
            var t = arr2.slice(1,-1).split(':');
            lyric_arr.push([parseInt(t[0],10)*60 + parseFloat(t[1]),lyric_body[index]]);
            // console.log(lyric_arr);
          })
          // for(var i=0;i<lyric_arr.length;i++){
          //           console.log(lyric_arr[i])
          //         }
          audio.ontimeupdate =function(){
            for(var i=0;i<lyric_arr.length;i++){
              if(this.currentTime >=lyric_arr[i][0]){
                lyric.innerHTML='';
                var pp = document.createElement('p');
                pp.innerText = lyric_arr[i][1];
                lyric.appendChild(pp);
              }
            }
          }
        }
      })

      //评论
      ajax({
        type:'get',
        url:'https://api.imjad.cn/cloudmusic/?type=comments&id='+target.getAttribute('talk_id')+'&br:128000',
        async:true,
        success:function(data){
          console.log("2");
          console.log(talk.innerText);
          if(talk.innerText!=''){
            console.log("1");
            talk.innerText = '';
          }

          oTalk.style.height= '100%';
          oTalk.style.fontSize= '20px';
          oTalk.style.marginTop= '20px';
          talkImg.style.height= '80px';
          talkImg.style.width= '100%';
          talkImg.style.marginBottom = '2px';
          // console.log(data.hotComments[0].content);
          oTalk.innerText = data.hotComments[0].content;
          talkImg.setAttribute('src',data.hotComments[0].user.avatarUrl);
          otalkName.innerText = data.hotComments[0].user.nickname;
          word.appendChild(oTalk);
          oHead.appendChild(talkImg);
          head.appendChild(oHead);
          talkName.appendChild(otalkName);
          pic.appendChild(talkName);
          pic.appendChild(head);
          talk.appendChild(word);
          talk.appendChild(pic);
          }
        })
      }
    })
  }

    //播放MV
    if(target.nodeName.toLowerCase() == 'button'){
    var vid = document.getElementsByTagName('video')[0];
    vid.style.display = 'block';
    // audio.pause()


    ajax({
      type:'get',
      url:'https://api.imjad.cn/cloudmusic/?type=mv&id='+target.getAttribute('MV_id'),
      async:true,
      success:function(data){
        var obj = data.data.brs;
          var arr=[];
          for(var i in obj){
            if(obj.hasOwnProperty(i)){
              arr.push(data.data.brs[i]);
            }
          }
        vid.setAttribute('src',data.data.brs["240"]);
      }
    })
  }
}

}