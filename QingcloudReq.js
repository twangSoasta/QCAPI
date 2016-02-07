var https = require('https');
var QingParameter = require('./QingParameter.js');
var method = "GET";
var uri = "/iaas/";

var myParameter = {
    "count":1,
//    "vxnets.1":"vxnet-0",
    "zone":"pek2",
//    "instance_type":"c2m8",
    "instances.1":"i-k3t0spz8",
//	"rdbs.1":"rdb-pcq7sjea",
    "signature_version":1,                    //must need 
    "signature_method":"HmacSHA256",          //must need 
//    "instance_name":"demo",
//    "image_id":"centos64x86a",
//    "login_mode":"passwd",
//    "login_passwd":"Visenergy2015",      
    "version":1,                             //must need 
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",  //must need 
    "action":"StartInstances",            //must need
//	"action":"StopRDBs",
    "time_stamp":"2013-08-27T14:30:10Z"	     //will be substitute by the real timestamp in the call
};

var queryString = QingParameter.getString2Sign(myParameter,method,uri);
console.log("query string with signature is:\n"+queryString);

var options = {
  hostname: 'api.qingcloud.com',
  port: 443,
  path: '/iaas/?access_key_id=QYACCESSKEYIDEXAMPLE&action=RunInstances&count=1&image_id=centos64x86a&instance_name=demo&instance_type=small_b&login_mode=passwd&login_passwd=QingCloud20130712&signature_method=HmacSHA256&signature_version=1&time_stamp=2013-08-27T14%3A30%3A10Z&version=1&vxnets.1=vxnet-0&zone=pek1&signature=32bseYy39DOlatuewpeuW5vpmW51sD1A%2FJdGynqSpP8%3D',
  method: "GET"
};

options.path = uri + "?" + queryString;
options.method = method;

var req = https.request(options, (res) => {
  console.log('statusCode: ', res.statusCode);
  console.log('headers: ', res.headers);
  console.log("*********************************************************************************");
  
  res.on('data', (d) => {
    process.stdout.write(d+"\n");
	dObj = JSON.parse(d);
	console.log(dObj);
  });
});
req.end();

req.on('error', (e) => {
  console.error(e);
});