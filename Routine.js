const NUMEIP_INSTANCES = 5;
var fs = require('fs');
var csv = fs.readFileSync("../files/access_key_soasta.csv").toString();
var querystring = require('querystring');
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
//    "login_passwd":"XYZ",      
    "version":1,                             //must need 
    "access_key_id":access_key_id,  //must need 
    "action":"StartInstances",            //must need
//	"action":"StopRDBs",
    "time_stamp":"2013-08-27T14:30:10Z"	     //will be substitute by the real timestamp in the call
};

var keyString = csv.split(",")[0];
var access_key_id = keyString.substring(keyString.indexOf("'")+1,keyString.length-1);

 

if (false) {
// create instance 
var myParameterCreate = {
    "count":NUMEIP_INSTANCES,
//	"image_id":"img-7cqsetqo",        //vis
    "image_id":"img-1wbv1ydv",
	"instance_type":"c1m1",
    "zone":"pek2",
	"instance_name":"twLG",
	"login_mode":"passwd",
	"login_passwd":"Soasta2006",
    "vxnets.1":"vxnet-0",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"RunInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterCreate,method,uri,function(resObj){
	
});
}

if (false) {
// create EIPs 
var myParameterCreateEip = {
    "count":NUMEIP_INSTANCES,
	"bandwidth":2,
	"billing_mode":"traffic",
	"eip_name":"twEIP",
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"AllocateEips",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterCreateEip,method,uri,function(resObj){
	
});
}

if (false) {
// Describe EIPs 
var OVERWRITE_FILE = false;
var myParameterDesEip = {
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"DescribeEips",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterDesEip,method,uri,function(resObj){
	var eipSetLength = resObj.eip_set.length;
	var eipArr = [];
	if (OVERWRITE_FILE){
	fs.writeFileSync('./eipid.log',""); 
	fs.writeFileSync('./eipaddr.log',""); 
	}
	   resObj.eip_set.forEach(function(eipObj){
		  if (eipObj.eip_name === "twEIP" && eipObj.status === "available" ) {
			  eipArr.push(eipObj.eip_addr);
			  fs.appendFileSync('./eipid.log',eipObj.eip_id+','); 
	          fs.appendFileSync('./eipaddr.log',eipObj.eip_addr+','); 
		  }	  
	   });
	   console.log("eipArr:\n",eipArr); 
	   
});
}

if (true) {
// Describe Instances 
var OVERWRITE_FILE = false;
var myParameterDesIns = {
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"DescribeInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
command2Qc.command2Qc(myParameterDesIns,method,uri,function(resObj){
	var InsSetLength = resObj.instance_set.length;
	var InsArr = [];
	if (OVERWRITE_FILE) {
	fs.writeFileSync('./instanceid.log',"");   //create an empty or clear the existing log
	}
	   resObj.instance_set.forEach(function(InsObj){
		  if (InsObj.instance_name === "twLG" && InsObj.status === "running" ) {
			  InsArr.push(InsObj.instance_id);
			  fs.appendFileSync('./instanceid.log',InsObj.instance_id+',');
		  }	  
	   });
	   console.log("InsArr:\n",InsArr); 
	   
});
}

if (false) {
// Associate EIP with Instance 
var myParameterAssociate = {	
    "eip":"",
	"instance":"",
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"AssociateEip",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
var fileEipId = fs.readFileSync('./eipid.log').toString();
var eipId = fileEipId.split(',');
var fileInsId = fs.readFileSync('./instanceid.log').toString();
var insId = fileInsId.split(',');	
console.log(eipId + "\n" + insId);
if (eipId.length != insId.length) {
	console.log("Error: EIP number:"+eipId.length," mismatches "+"INSTANCE number:"+insId.length);
} else {
	for (i=0; i< eipId.length -1;i++){
		console.log(i);
		myParameterAssociate.eip = eipId[i];
       	myParameterAssociate.instance = insId[i];
		console.log(myParameterAssociate);
		command2Qc.command2Qc(myParameterAssociate,method,uri,function(resObj){
	
           });
	}
 }
}

if (false) {
// Dissociate EIP with Instance 
var myParameterDissociate = {
    "zone": "pek2",
    "signature_version": "1",                     
    "signature_method": "HmacSHA256",              
    "version":"1",                              
    "access_key_id": access_key_id,   
    "action": "DissociateEips",            
    "time_stamp": "2013-08-27T14:30:10Z"    
};

var fileEipId = fs.readFileSync('./eipid.log').toString();
var eipId = fileEipId.split(',');
var fileInsId = fs.readFileSync('./instanceid.log').toString();
var insId = fileInsId.split(',');	

if (eipId.length != insId.length) {
	console.log("Error: EIP number:"+eipId.length," mismatches "+"INSTANCE number:"+insId.length);
} else {
	var body ="";
	for (i=0; i< eipId.length -1;i++){
		var newName = ("eips."+ (i+1)).toString();
		body += "&" + newName + "=" + eipId[i].toString();  	
	}
var paraQuery = querystring.stringify(myParameterDissociate) + body;
myParameterDissociate = querystring.parse(paraQuery);
console.log(myParameterDissociate);
command2Qc.command2Qc(myParameterDissociate,method,uri,function(resObj){

        });
 }
}


if (false) {
// start instance 
var myParameterStart = {
    "count":1,
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"StartInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
var fileInsId = fs.readFileSync('./instanceid.log').toString();
var insId = fileInsId.split(',');
for (i=0; i< insId.length -1;i++){
		var newName = ("instances."+ (i+1)).toString();
		body += "&" + newName + "=" + insId[i].toString();  	
	}
var paraQuery = querystring.stringify(myParameterStart) + body;
myParameterStart = querystring.parse(paraQuery);
console.log(myParameterStart);

command2Qc.command2Qc(myParameterStart,method,uri,function(resObj){
	
});
}

if (false) {
// stop instance 
var myParameterStop = {
    "count":1,
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"StopInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
var fileInsId = fs.readFileSync('./instanceid.log').toString();
var insId = fileInsId.split(',');
for (i=0; i< insId.length -1;i++){
		var newName = ("instances."+ (i+1)).toString();
		body += "&" + newName + "=" + insId[i].toString();  	
	}
var paraQuery = querystring.stringify(myParameterStop) + body;
myParameterStop = querystring.parse(paraQuery);
console.log(myParameterStop);

command2Qc.command2Qc(myParameterStop,method,uri,function(resObj){
	
});
}

if (false) {
// restart instance 
var myParameterRestart = {
    "count":1,
    "zone":"pek2",
    "signature_version":1,                     
    "signature_method":"HmacSHA256",              
    "version":1,                              
    "access_key_id":access_key_id,   
    "action":"RestartInstances",            
    "time_stamp":"2013-08-27T14:30:10Z"	     
};
var fileInsId = fs.readFileSync('./instanceid.log').toString();
var insId = fileInsId.split(',');
for (i=0; i< insId.length -1;i++){
		var newName = ("instances."+ (i+1)).toString();
		body += "&" + newName + "=" + insId[i].toString();  	
	}
var paraQuery = querystring.stringify(myParameterRestart) + body;
myParameterRestart = querystring.parse(paraQuery);
console.log(myParameterRestart);

command2Qc.command2Qc(myParameterRestart,method,uri,function(resObj){
	
});
}



