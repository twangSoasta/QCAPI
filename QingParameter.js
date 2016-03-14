var fs = require('fs');
var querystring = require('querystring');

/*
var myParameter = {
    "count":1,
    "vxnets.1":"vxnet-0",
    "zone":"pek1",
    "instance_type":"small_b",
    "signature_version":1,
    "signature_method":"HmacSHA256",
    "instance_name":"demo",
    "image_id":"centos64x86a",
    "login_mode":"passwd",
    "login_passwd":"QingCloud20130712",
    "version":1,
    "access_key_id":"QYACCESSKEYIDEXAMPLE",
    "action":"RunInstances",
    "time_stamp":"2013-08-27T14:30:10Z"	
};
*/

function getString2Sign(myParameter,method,uri,secret,callback){
//get the current timestamp format
var date = new Date();
var month = date.getMonth()<10 ? "0"+(date.getMonth()+1):date.getMonth()+1;
var day = date.getDate()<10 ? "0"+date.getDate():date.getDate();
var timestamp = date.getFullYear()+"-"+ month +"-"+day+"T"+date.getHours()
                +":"+date.getMinutes()+":"+date.getSeconds()+"Z";
myParameter.time_stamp = timestamp;				
//sort based on the name of myParameter
var myParr =[];         // myParr is the array of objects of both the name and value
var arr = [];           // arr is the array for the name
var myParameterSort = {};  // the sorted object
for (var name in myParameter){
	myParr.push({"name":name,"value":myParameter[name]});
	arr.push(name);
}
arr.sort();
//console.log(myParr[0].name+" "+ myParr[0].value);

for(var i=0;i<myParr.length;i++){
	//myParameterSort[arr[i]] = encodeURIComponent(myParameter[arr[i]]);
	myParameterSort[arr[i]] = myParameter[arr[i]];
}


var myParameterSortStr = querystring.stringify(myParameterSort);  // it will url encoding by default 
//console.log(myParameterSort);

//console.log("query string without signature is:\n"+ myParameterSortStr);


var message = method + '\n' + uri + '\n' + myParameterSortStr;
//console.log(message);
//var testmessage = "GET\n/iaas/\naccess_key_id=QYACCESSKEYIDEXAMPLE&action=RunInstances&count=1&image_id=centos64x86a&instance_name=demo&instance_type=small_b&login_mode=passwd&login_passwd=QingCloud20130712&signature_method=HmacSHA256&signature_version=1&time_stamp=2013-08-27T14%3A30%3A10Z&version=1&vxnets.1=vxnet-0&zone=pek1";
//console.log(testmessage);
const crypto = require('crypto');
var hash = encodeURIComponent(crypto.createHmac('SHA256', secret).update(message).digest('base64'));
//console.log(hash+"\n");
var qString = myParameterSortStr + "&signature=" + hash;
//console.log("Final Query String==> ",qString);
callback(qString);
}

//var finalString = getString2Sign(myParameter,"GET","/iaas/");
//console.log(finalString);

exports.getString2Sign = getString2Sign;

