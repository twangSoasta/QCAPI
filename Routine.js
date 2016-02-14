var fs = require('fs');
var command2Qc = require('./QingcloudReq.js');
var resObj = {};
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
command2Qc.command2Qc(myParameterStart,method,uri,function(resObj){
	
});
}

if (false) {
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
command2Qc.command2Qc(myParameterStop,method,uri,function(resObj){
	
});
}

if (false) {
// create instance 
var myParameterCreate = {
    "count":3,
	"image_id":"img-7cqsetqo",
	"instance_type":"c1m1",
    "zone":"pek2",
	"instance_name":"twLG",
	"login_mode":"passwd",
	"login_passwd":"Soasta2006",
    "instances.1":"i-k3t0spz8",
	"instances.2":"i-mkiiqn2z",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",   
    "action":"RunInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterCreate,method,uri,function(resObj){
	
});
}

if (false) {
// create EIPs 
var myParameterCreateEip = {
    "count":3,
	"bandwidth":2,
	"billing_mode":"traffic",
	"eip_name":"twEIP",
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",   
    "action":"AllocateEips",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterCreateEip,method,uri,function(resObj){
	
});
}

if (true) {
// Describe EIPs 
var myParameterDesEip = {
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":"VKPQBQSYDKMPGZEJXFJS",   
    "action":"DescribeEips",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterDesEip,method,uri,function(resObj){
	console.log("resObj:\n",resObj);
});
}



