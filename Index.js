const NUMEIP_INSTANCES = 15;
var fs = require('fs');
var csv = fs.readFileSync("../files/access_key_soasta.csv").toString();
var querystring = require('querystring');
var command2Qc = require('./QingcloudReq.js');
var method = "GET";
var uri = "/iaas/";
var keyString = csv.split(",")[0];
var access_key_id = keyString.substring(keyString.indexOf("'")+1,keyString.length-1);

//create instances 
var div = Math.floor(NUMEIP_INSTANCES/10);
var mod = NUMEIP_INSTANCES -  div*10;
console.log(div,mod);
var waitTime1 = 30000;  //time between create and describe
var waitTime2 = 60000;  //time between create and associate 
var OVERWRITE_FILE = true;

for (i=0; i<div;i++) {
var myParameterCreate = {
    "count":10,
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
var myParameterCreate1 = {
    "count":mod,
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
command2Qc.command2Qc(myParameterCreate1,method,uri,function(resObj){
	
});

//create EIP
const BANDWIDTH = 2;
for (i=0; i<div;i++) {
var myParameterCreateEip = {
    "count":10,
	"bandwidth":BANDWIDTH,
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
var myParameterCreateEip1 = {
    "count":mod,
	"bandwidth":BANDWIDTH,
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
command2Qc.command2Qc(myParameterCreateEip1,method,uri,function(resObj){
	
});
//wait for sometime to describe instances and eip
// describe instances
setTimeout(function(){
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
},waitTime1);

//describe eip
setTimeout(function(){
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
},waitTime1);

//finally associate EIP with Instances
setTimeout(function(){
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
},waitTime2);







