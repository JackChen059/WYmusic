/*
* @Author: Marte
* @Date:   2017-06-29 10:31:25
* @Last Modified by:   Marte
* @Last Modified time: 2017-07-07 09:39:25
*/

'use strict';
// function ajax(sty,adr,dui){
  function ajax(option){
  var type=option.type;
  var url=option.url;
  var async=option.async;
  var success=option.success;
  var xml = null;
    if(window.XMLHttpRequest){
      xml = new XMLHttpRequest();
    }else{
      xml = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xml.open(type,url,async);

    xml.send();

    xml.onreadystatechange = function(){
      if(xml.readyState == 4){
        if(xml.status == 200){
          var body = JSON.parse(xml.responseText);
          success(body)
        }
      }
    }
  }
// }



