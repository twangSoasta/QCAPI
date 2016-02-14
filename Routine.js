var fs = require('fs');
var command2Qc = require('./QingcloudReq.js');
var method = "GET";
var uri = "/iaas/";
var myParameterSample = {
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

if (false) {
// start instance 
var myParameterStart = {
    "count":1,
    "zone":"pek2",
    "instances.1":"i-k3t0spz8",
	"instances.2":"i-mkiiqn2z",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",   
    "action":"StartInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
//var instanceJson = {
//	"instances.1":"i-k3t0spz8",
//	"instances.2":"i-mkiiqn2z"
//};
//var paraObj = JSON.parse(myParameterStart);
//var InsObj = JSON.parse(instanceJson);
command2Qc.command2Qc(myParameterStart,method,uri);
}

if (true) {
// stop instance 
var myParameterStop = {
    "count":1,
    "zone":"pek2",
    "instances.1":"i-k3t0spz8",
	"instances.2":"i-mkiiqn2z",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",   
    "action":"StopInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterStop,method,uri);
}
