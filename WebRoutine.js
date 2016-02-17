var http = require('http');
var fs = require('fs');
var url = require('url');
//var formidable = require('formidable');
var generateXML = require('./GenerateXML.js');
var host = "127.0.0.1";
var port = 8080;
var csv = fs.readFileSync("../files/access_key_soasta.csv").toString();
var querystring = require('querystring');
var command2Qc = require('./QingcloudReq.js');
var method = "GET";
var uri = "/iaas/";
var keyString = csv.split(",")[0];
var access_key_id = keyString.substring(keyString.indexOf("'")+1,keyString.length-1);
/////////////////////////////////////////////////////////////////////////////////////
const INSTANCE_TYPE = "c2m4";
const BANDWIDTH = 10;
const OVERWRITE_FILE = true;
const PATH = "Beijing Qingcloud Loc #2";      //"QingCloud China Beijing 2";
const REGION = "pek2";
const securityGroup = "sg-u279b2do";     //"sg-ewbcbab5";
/////////////////////////////////////////////////////////////////////////////////////
var NUM =1;
var div = 1;
var mod = 1;
var body = '<html>'+                  
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
	'<style type="text/css">'+
      'img{'+
         'position:absolute;'+
         'left:600px;'+
         'top:200px;'+
         '}'+
    '</style>'+
    '</head>'+
    '<body>'+  
	'<h1>Welcome to use NodeJs Routine for Qingcloud API</h1>'+
	'<img src="http://www.soasta.com/wp-content/uploads/2015/05/cloudtest-pp-2.jpg" width="800" height="600"></div>'+
    '<form action="/upload" method="post">'+           
    '<textarea name="text" rows="4" cols="30"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
	'<form action="/create_instance" method="post">'+           
	'<input type="submit" value="Create_instance" />'+
    '</form>'+
	'<form action="/create_eip" method="post">'+           
	'<input type="submit" value="Create_eip" />'+
    '</form>'+
	'<form action="/describe_instance" method="post">'+           
	'<input type="submit" value="Describe_instance" />'+
    '</form>'+
	'<form action="/describe_eip" method="post">'+           
	'<input type="submit" value="Describe_eip" />'+
    '</form>'+
	'<form action="/associate_eip" method="post">'+           
	'<input type="submit" value="Associate_eip" />'+
    '</form>'+
	'<form action="/stop_instance" method="post">'+           
	'<input type="submit" value="Stop_instance" />'+
    '</form>'+
	'<form action="/start_instance" method="post">'+           
	'<input type="submit" value="Start_instance" />'+
    '</form>'+
	'<form action="/restart_instance" method="post">'+           
	'<input type="submit" value="Restart_instance" />'+
    '</form>'+
	'<form action="/dissociate_eip" method="post">'+           
	'<input type="submit" value="Dissociate_eip" />'+
    '</form>'+
	'<form action="/delete_instance" method="post">'+           
	'<input type="submit" value="Delete_instance" />'+
    '</form>'+
	'<form action="/delete_eip" method="post">'+           
	'<input type="submit" value="Delete_eip" />'+
    '</form>'+
	'<form action="/generate_xml" method="post">'+           
	'<input type="submit" value="Generate_xml" />'+
    '</form>'+
	'</body>'+
    '</html>';

var server = http.createServer(function(req,res){
	var pathName = url.parse(req.url).pathname; 
	console.log("Pathname is:"+pathName);
	// request side 
	var postData = "";	
	req.setEncoding('utf-8');
	req.on("data",function(postDataChunk){     // monitoring the incoming request POST data chunks
		postData += postDataChunk;
	});
	req.on("end",function(){
		var finalTxt = postData.toString().substring(5);
		console.log("post text is: ",finalTxt);
		//after every request, send response
	   switch (pathName){
	   	   case "/upload" :                  
                 NUM = parseInt(finalTxt);	   //assuming upload will always happen before create
				 div = Math.floor(NUM/10);
                 mod = NUM - div*10;         console.log(NUM,div,mod);
	   	   		 res.writeHead("200",{"content-type":"text/html"});
	   	   		 res.write("Creating "+finalTxt+" LGs");
	   	   		 res.end(body);   	   		
	   	   break;
	   	   	 
	   	   case "/create_instance" : 
		         res.writeHead("200",{"content-type":"text/html"});
	   	   		 res.write("Creating instances in progress");
	   	   		 res.end(body);
				 // create instance 
                 for (i=0; i<div;i++) {
                    var myParameterCreate = {
                        "count":10,
                    //	"image_id":"img-7cqsetqo",        //vis
                        "image_id":"img-1wbv1ydv",
                    	"instance_type":INSTANCE_TYPE,
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
                    	"instance_type":INSTANCE_TYPE,
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
 
	   	   break;
		   
		   case "/create_eip" : 
			  res.writeHead("200",{"content-type":"text/html"});
	   	   	  res.write("Creating eips in progress");
	   	   	  res.end(body);
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
		   
		   break;
		   
		   case "/describe_instance" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("describe instance =======> ");
		      var myParameterDesIns = {
				  "limit":1000,
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
             res.write("Total "+InsArr.length.toString()+ " instances created: "+InsArr.toString());
             res.end(body);			 
             });
		   
		   break;
		   
		   case "/describe_eip" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("describe eip =======> ");
		      var myParameterDesEip = {
				  "limit":1000,
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
            		  if (eipObj.eip_name === "twEIP" && (eipObj.status === "available" | eipObj.status === "associated")) {
            			  eipArr.push(eipObj.eip_addr);
            			  fs.appendFileSync('./eipid.log',eipObj.eip_id+','); 
            	          fs.appendFileSync('./eipaddr.log',eipObj.eip_addr+','); 
            		  }	  
            	   });
            	   console.log("eipArr:\n",eipArr); 
            	   res.write("Total "+eipArr.length.toString()+ " EIPs created: "+eipArr.toString());	
				   res.end(body);
            });
		   
		   break;
		   
		   case "/associate_eip" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("associate eip");
	   	      res.end(body);
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
		   
		   break;
		   
		   case "/stop_instance" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("Stopping instances");
	   	      res.end(body);
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
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(myParameterStop) + bodytxt;
              myParameterStop = querystring.parse(paraQuery);
              console.log(myParameterStop);
              
              command2Qc.command2Qc(myParameterStop,method,uri,function(resObj){
              	
              });

		     break;
		   
		   case "/start_instance" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("Starting instances");
	   	      res.end(body);
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
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(myParameterStart) + bodytxt;
              myParameterStart = querystring.parse(paraQuery);
              console.log(myParameterStart);
              
              command2Qc.command2Qc(myParameterStart,method,uri,function(resObj){
              	
              });

		   break;
		   
		   case "/restart_instance" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("Restarting instances");
	   	      res.end(body);
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
			  var bodytxt = "";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(myParameterRestart) + bodytxt;
              myParameterRestart = querystring.parse(paraQuery);
              console.log(myParameterRestart);
              
              command2Qc.command2Qc(myParameterRestart,method,uri,function(resObj){
              	
              });
              	   
		   break;
		   
		   case "/dissociate_eip" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("dissociate eip");
	   	      res.end(body);
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
              	var bodytxt ="";
              	for (i=0; i< eipId.length -1;i++){
              		var newName = ("eips."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + eipId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(myParameterDissociate) + bodytxt;
              myParameterDissociate = querystring.parse(paraQuery);
              console.log(myParameterDissociate);
              command2Qc.command2Qc(myParameterDissociate,method,uri,function(resObj){
              
                      });
               }
              		   
		   break;
		   
		   case "/delete_instance" :
              res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("delete instances");
	   	      res.end(body);
              var myParameterDelIns = {
                  "count":1,
                  "zone":"pek2",
                  "signature_version":1,                     
                  "signature_method":"HmacSHA256",              
                  "version":1,                              
                  "access_key_id":access_key_id,   
                  "action":"TerminateInstances",            
                  "time_stamp":"2013-08-27T14:30:10Z"	     
              };
              var fileInsId = fs.readFileSync('./instanceid.log').toString();
              var insId = fileInsId.split(',');
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(myParameterDelIns) + bodytxt;
              myParameterDelIns = querystring.parse(paraQuery);
              console.log(myParameterDelIns);
              
              command2Qc.command2Qc(myParameterDelIns,method,uri,function(resObj){
              	
              });	   
		   
		   break;
		   
		   case "/delete_eip" : 
		      res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("delete eips");
	   	      res.end(body);
		      var myParameterRelease = {
                 "zone": "pek2",
                 "signature_version": "1",                     
                 "signature_method": "HmacSHA256",              
                 "version":"1",                              
                 "access_key_id": access_key_id,   
                 "action": "ReleaseEips",            
                 "time_stamp": "2013-08-27T14:30:10Z"    
              };

              var fileEipId = fs.readFileSync('./eipid.log').toString();
              var eipId = fileEipId.split(',');
              var fileInsId = fs.readFileSync('./instanceid.log').toString();
              var insId = fileInsId.split(',');	
              
              
              var bodytxt ="";
              for (i=0; i< eipId.length -1;i++){
              	var newName = ("eips."+ (i+1)).toString();
              	bodytxt += "&" + newName + "=" + eipId[i].toString();  	
              }
              var paraQuery = querystring.stringify(myParameterRelease) + bodytxt;
              myParameterRelease = querystring.parse(paraQuery);
              console.log(myParameterRelease);
              command2Qc.command2Qc(myParameterRelease,method,uri,function(resObj){
              
                      });
		   
		   break;
		   
		   case "/generate_xml" :
		      generateXML.generateXML(PATH, REGION, securityGroup);
              res.writeHead("200",{"content-type":"text/html"});
	   	      res.write("LG.xml and twMonServer.xml file generated");
	   	      res.end(body);	
           break;
		   
	   	   default:	
               res.writeHead("200",{"content-type":"text/html"});
			   res.write("You are hitting the default page"); 
	   		   res.write(body); 
               res.end();			
	   }
	});

});

server.listen(port,host,function(){
	console.log("Listening on ",host,":",port);
});