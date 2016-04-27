/**************************************************************************************************************************************************************
Author: Tony Wang
Title:  WebRoutineParam.js
Description: Interactive API for Qingcloud
Revision History:
--1.2 fully funcitonal as of 04/15/2016
--1.3 Tony Fixed LG creation issue when it is 10(additional 0 count request submitted), added logonce logic for create LG/EIPchange descitbe eip as available
      ones only for now, added logics to add nameSuffix after LG/RS/EIP name to differentiate main/subaccount operations
	  added logics to avoid overwrite instance.log, eipArr.log, eipId.log when the returned list are empty
--1.4 Added DescribeJob Button to check job status, 5 seconds polling interval until all of the pending job are done
      Differentiate Server XML name by appending region for multiple locations

***************************************************************************************************************************************************************/
var http = require('http');
var fs = require('fs');
var url = require('url');
var zlib = require('zlib');
var zip = require('node-native-zip');
var mime = require('mime');
var deasync = require('deasync');
//var formidable = require('formidable');
var generateXML = require('./GenerateXML.js');
var host = "0.0.0.0";
var port = 8080;
var querystring = require('querystring');
var command2Qc = require('./QingcloudReq.js');
var method = "GET";
var uri = "/iaas/";
var currentDir = __dirname; 
var slash = (process.platform == "win32")?"\\":"/";     //detect \ on windows or / on mac/linux
currentDir = currentDir.substring(0,currentDir.lastIndexOf(slash)) + "/files/access_key_soasta placeholder.csv";
var csv = fs.readFileSync(currentDir).toString();   //read key from default locations
var access_key_id = csv.substring(csv.indexOf("id: '")+5,csv.indexOf("id: '")+25);
var secret = csv.substring(csv.indexOf("key: '")+6,csv.indexOf("key: '")+46);
/////////////////////////////////////////////////////////////////////////////////////
const OVERWRITE_FILE = true;
const securityGroup = "sg-u279b2do";     //"sg-ewbcbab5";
/////////////////////////////////////////////////////////////////////////////////////
var currentDir = __dirname + "/parameter.json";
var json = fs.readFileSync(currentDir).toString(); 
var jsonObj = JSON.parse(json);
for (i in jsonObj) {jsonObj[i].access_key_id = access_key_id;};	
var NUM,div,mod;
var path = 'Beijing Qingcloud Loc #2';   //need a initial value to not break the generate routine if upload button has not clicked before
var zoneDc = 'pek2';
var LGDone = false;
var inputTextArr = fs.readFileSync(__dirname+"/inputtext.log").toString().split(",");    //inputtext.log is to store the default input value when start the program
var numOfInstances = inputTextArr[0];
var eipBandwidth = inputTextArr[1];
var zoneDc = inputTextArr[2];
var instanceType = inputTextArr[3];
var imageId = inputTextArr[4];
var imageIdRS = inputTextArr[5];
var path = inputTextArr[6];
var rsNum = 1;
var nameSuffix ='defaultname';
var lastJob = "RunInstances";

var body = '<html>'+                  
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
	'<style type="text/css">'+
      'img{'+
         'position:absolute;'+
         'left:480px;'+
         'top:320px;'+
         '}'+
    '</style>'+
    '</head>'+
    '<body>'+  
	'<h1>Welcome to use NodeJs Routine for Qingcloud API v1.4</h1>'+
	'<form enctype="multipart/form-data" action="/UploadKeyCSV" method="post">'+
    '<input type="file" name ="upload" id="choosefile" /><br>'+
    '<input type="submit" value="UploadKeyCSV" id="submitBtn" />'+
    '</form><br />'+
//	'MainAccount<input type="radio" checked="checked" name="csvPath" value="../files/access_key_soasta_main.csv" />'+
//	'PeAccount<input type="radio" name="csvPath" value="../files/access_key_soasta.csv" /><br /><br />'+
	'<u1>NumInstances,Bandwidth,Zone,InstanceType,ImageIdLG,ImageIdRS,ServerListLocation</u1><hr/>'+
	'<img src="http://www.soasta.com/wp-content/uploads/2015/05/cloudtest-pp-2.jpg" width="800" height="600"></div>'+
    '<form action="/upload" method="post">'+           
//    '<textarea name="text" rows="2" cols="65">2,10,pek2,c4m8,img-1wbv1ydv,img-wska67bq,Beijing Qingcloud Loc #2</textarea>'+
    '<textarea name="text" rows="2" cols="65">'+inputTextArr[0]+','+inputTextArr[1]+','+inputTextArr[2]+','+inputTextArr[3]+','+inputTextArr[4]+','+inputTextArr[5]+','+inputTextArr[6]+'</textarea>'+
    '<input type="submit" value="Submit" style="height:20px;width:80px" />'+
    '</form>'+
    '<form action="/create_LG" method="post">'+           
	  '<input type="submit" value="Create_lg" style="height:20px;width:120px;background:#FFC0CB" >'+
    '</form>'+
	'<form action="/check_job" method="post">'+           
	  '<input type="submit" value="Check_job" style="height:40px;width:120px;position:fixed;top:310px;left:310px;background:#FFC0CB" />'+
    '</form>'+
	  '<form action="/create_RS" method="post">'+           
	  '<input type="submit" value="Create_rs" style="height:20px;width:120px;background:#FFC0CB" />'+
    '</form>'+
	'<form action="/create_eip" method="post">'+           
	'<input type="submit" value="Create_eip" style="height:20px;width:120px;background:#FFC0CB" />'+
    '</form>'+
	'<form action="/describe_instance" method="post">'+           
	'<input type="submit" value="Describe_instance" style="height:20px;width:120px;background:#CAFF70" />'+
    '</form>'+
	'<form action="/describe_eip" method="post">'+           
	'<input type="submit" value="Describe_eip" style="height:20px;width:120px;background:#CAFF70" />'+
    '</form>'+
	'<form action="/associate_eip" method="post">'+           
	'<input type="submit" value="Associate_eip" style="height:20px;width:120px;background:#EEEE00" />'+
    '</form>'+
	'<form action="/stop_instance" method="post">'+           
	'<input type="submit" value="Stop_instance" style="height:20px;width:120px;background:#EECFA1" />'+
    '</form>'+
	'<form action="/start_instance" method="post">'+           
	'<input type="submit" value="Start_instance" style="height:20px;width:120px;background:#EECFA1" />'+
    '</form>'+
	'<form action="/restart_instance" method="post">'+           
	'<input type="submit" value="Restart_instance" style="height:20px;width:120px;background:#EECFA1" />'+
    '</form>'+
	'<form action="/dissociate_eip" method="post">'+           
	'<input type="submit" value="Dissociate_eip" style="height:20px;width:120px;background:#A2B5CD" />'+
    '</form>'+
	'<form action="/delete_instance" method="post">'+           
	'<input type="submit" value="Delete_instance" style="height:20px;width:120px;background:#A2B5CD" />'+
    '</form>'+
	'<form action="/delete_eip" method="post">'+           
	'<input type="submit" value="Delete_eip" style="height:20px;width:120px;background:#A2B5CD" />'+
    '</form>'+
	'<form action="/generate_xml" method="post">'+           
	'<input type="submit" value="Generate_xml" style="height:20px;width:120px;background:#8E388E;color:#FFFFFF" />'+
    '</form>'+
	'<form action="/archive.zip" method="post">'+           
	'<input type="submit" value="Download_xml" style="height:20px;width:120px;background:#8E388E;color:#FFFFFF" />'+
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
		var finalTxt = decodeURIComponent(postData.toString().substring(5));
		console.log("post text is: ",finalTxt);
		//after every request, send response, header shared by both of the routine below
		res.writeHeader("200",{"content-type":"text/html"});   
	   switch (pathName){
		   case "/UploadKeyCSV":
		         if (finalTxt.indexOf("id: '") == -1 || finalTxt.indexOf("key: '") ==-1) {
					 res.write("Invalid CSV File, Please re-upload!");
					 res.end(body);
				 } else {
		         access_key_id = finalTxt.substring(finalTxt.indexOf("id: '")+5,finalTxt.indexOf("id: '")+25);
             secret = finalTxt.substring(finalTxt.indexOf("key: '")+6,finalTxt.indexOf("key: '")+46);
			 nameSuffix = "_"+access_key_id.substring(0,3);   //used to differentiate different LG/EIP for different user accounts for describe funtions. 
			 console.log(nameSuffix);
				 for (i in jsonObj) {
	                jsonObj[i].access_key_id = access_key_id;
					jsonObj[i].instance_name = "twLG"+nameSuffix;
					jsonObj[i].eip_name = "twEIP"+nameSuffix;
                 };	
				 res.write("Credential loaded!");
				 }
				 res.end(body);
		   break;
		   
	   	   case "/upload" : 
		         //the following variables are global variables, can't use var here
             inputArr = finalTxt.split(',');
             console.log(inputArr);
		         numOfInstances = (inputArr[0] == null || inputArr[0] == '')?parseInt(inputTextArr[0]):parseInt(inputArr[0]);
             div50 = Math.floor(numOfInstances/50);
             mod50 = numOfInstances - div50*50;
             rsNum = (mod50 == 0)? div50:div50+1;
             	         
				     //setting default values
		         eipBandwidth = (inputArr[1] == null || inputArr[1] == "")?parseInt(inputTextArr[1]):parseInt(inputArr[1]) ;
		         zoneDc = (inputArr[2] == null || inputArr[2] == "")?inputTextArr[2]:inputArr[2];
		         instanceType = (inputArr[3] == null || inputArr[3] == "")?inputTextArr[3]:inputArr[3];
		         imageId = (inputArr[4] == null || inputArr[4] == "")?inputTextArr[4]:inputArr[4];
		         imageIdRS = (inputArr[5] == null || inputArr[5] == "")?inputTextArr[5]:inputArr[5];
             path = (inputArr[6] == null || inputArr[6] == "")?inputTextArr[6]:inputArr[6];		
             path = path.replace(/\+/g,' '); 
             zoneDc = zoneDc.replace(/\+/g,' '); 
             instanceType = instanceType.replace(/\+/g,' '); 
             imageId = imageId.replace(/\+/g,' '); 
             imageIdRS = imageIdRS.replace(/\+/g,' '); 
				     console.log("path is: "+path);		 
				     jsonObj['/create_LG'].instance_type = instanceType;
				     jsonObj['/create_LG'].image_id = imageId;				 
             jsonObj['/create_eip'].bandwidth =eipBandwidth;
             for (i in jsonObj) {
					      jsonObj[i].zone = zoneDc;
             };				 
             NUM = parseInt(numOfInstances);	   //assuming upload will always happen before create
				     div = Math.floor(NUM/10);
             mod = NUM - div*10;        
				     console.log(NUM,div,mod);
	   	   		 res.write("Creating "+numOfInstances+" LGs");
				     var inputBoxStr = body.substring(body.indexOf('"65">')+5,body.lastIndexOf("</textarea>"));
				     body = body.replace(inputBoxStr,numOfInstances+","+eipBandwidth+","+zoneDc+","+instanceType+","+imageId+","+imageIdRS+","+path);
				     fs.writeFileSync(__dirname + "/inputtext.log",numOfInstances+','+eipBandwidth+','+zoneDc+','+instanceType+','+imageId+','+imageIdRS+','+path);   //every submit save for the default input text next time start the program
	   	   		 res.end(body);   	   		
	   	   break;
	   	   
	   	   case "/create_LG" : 
	   	       console.log(mod+" "+numOfInstances+" "+eipBandwidth+" "+zoneDc+" "+instanceType+" "+imageId+" "+imageIdRS+" "+path);	
	   	       var logonce = true;	         
		         var modJsonInsLG = 
				         {"count":mod,
                  "image_id":imageId,
                  "instance_type":instanceType,
                  "zone":zoneDc,
                  "instance_name":"twLG"+nameSuffix,
                  "login_mode":"passwd",
                  "login_passwd":"Soasta2006",
                  "vxnets.1":"vxnet-0",
                  "signature_version":1,                     
                  "signature_method":"HmacSHA256",              
                  "version":1,                              
                  "access_key_id":access_key_id,   
                  "action":"RunInstances",            
                  "time_stamp":"2013-08-27T14:30:10Z"};
                                
	   	   		 
				     var myParameterCreateArr = [];   //used for Async loop 
             for (i=0; i<div;i++) {				 
					      myParameterCreateArr.push(jsonObj[pathName]);
					   }
					   if (mod !== 0) {
             myParameterCreateArr.push(modJsonInsLG);
             }
				     myParameterCreateArr.forEach(function(myParameterCreate){
                 command2Qc.command2Qc(myParameterCreate,method,uri,secret,function(resObj){ 
                 	if (logonce) {
				    res.write("Creating LG in progress<br />");
                    res.write(resObj.status);	
                    res.end(body);
                    logonce = false;
                  } 				
                    });
             }); 
             LGDone = true; 
			 lastJob = "RunInstances";
	   	   break;
	   	   
	   	   case "/create_RS":
	   	      console.log("rsNum: "+rsNum);
		        if (!LGDone) {
		      	    res.write("Needs LG number to determine RS number, please go back and create some LGs 1st!");
					res.end(body);	
		      	 } else {
		        var modJsonInsRS = 
				         {"count":rsNum,
                  "image_id":imageIdRS,
                  "instance_type":instanceType,
                  "zone":zoneDc,
                  "instance_name":"twRS"+nameSuffix,
                  "login_mode":"passwd",
                  "login_passwd":"Soasta2006",
                  "vxnets.1":"vxnet-0",
                  "signature_version":1,                     
                  "signature_method":"HmacSHA256",              
                  "version":1,                              
                  "access_key_id":access_key_id,   
                  "action":"RunInstances",            
                  "time_stamp":"2013-08-27T14:30:10Z"};
		        command2Qc.command2Qc(modJsonInsRS,method,uri,secret,function(resObj){  
				    res.write("Creating RS in progress<br />");
                    res.write(resObj.status);	
                    res.end(body);						
                    });
            LGDone = false;
            }
			lastJob = "RunInstances";
		     break;
	   	   	 
	   	  
		   case "/create_eip" : 
		    NUM = parseInt(numOfInstances)+rsNum;	   //assuming upload will always happen before create
			  div = Math.floor(NUM/10);
        mod = NUM - div*10;        
			  console.log("Eips number: "+NUM+" "+div+" "+mod);
			  var logonce = true;
			  var modJsonEip =  
				   {"count":mod,
            "bandwidth":eipBandwidth,
            "billing_mode":"traffic",
            "eip_name":"twEIP"+nameSuffix,
            "zone":zoneDc,
            "signature_version":1,                     
            "signature_method":"HmacSHA256",              
            "version":1,                              
            "access_key_id":access_key_id,   
            "action":"AllocateEips",            
            "time_stamp":"2013-08-27T14:30:10Z"};
                var myParameterCreateArr = [];   //used for Async loop
                for (i=0; i<div;i++) {
					 myParameterCreateArr.push(jsonObj[pathName]);
					}
				if (mod !== 0) {
				 myParameterCreateArr.push(modJsonEip);
				}
				 myParameterCreateArr.forEach(function(myParameterCreate){
                 command2Qc.command2Qc(myParameterCreate,method,uri,secret,function(resObj){  
                 	if (logonce) { 
				    res.write("Creating eips in progress<br />");
                    res.write(resObj.status);	
                    res.end(body);	
                    logonce = false;
                  }				 
                  });
                 });  
           	 lastJob = "AllocateEips";	   
		   break;
		   
		   case "/describe_instance" : 
		      
             command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
		   res.write("describe instance =======> ");
           if ( resObj.instance_set == undefined) {
           	  res.write("API returns nothing, check your API keys!<br />");
           	} else { 
	         var InsSetLength = resObj.instance_set.length;
	         var InsArr = [];
	         var InsArrRS = [];  // separate array for RS list
	         resObj.instance_set.forEach(function(InsObj){
	   	     if (InsObj.instance_name === ("twLG"+nameSuffix) && InsObj.status === "running" ) {
	   		     InsArr.push(InsObj.instance_id);
	   	     }	  
	         if (InsObj.instance_name === ("twRS"+nameSuffix) && InsObj.status === "running" ) {
	   		     InsArrRS.push(InsObj.instance_id);
	   	     }	  
	         });
			 if (OVERWRITE_FILE && (InsArr.length>0 || InsArrRS.length>0 )) {
	         fs.writeFileSync(__dirname+'/instanceid.log',"");   //create an empty or clear the existing log
	         }
	         //make sure to write LG 1st and RS last in the list
			 if (InsArr.length>0) {
	            for (i in InsArr){fs.appendFileSync(__dirname+'/instanceid.log',InsArr[i]+',');}
			 }
			 if (InsArrRS.length>0) {
	         for (i in InsArrRS){fs.appendFileSync(__dirname+'/instanceid.log',InsArrRS[i]+',');}
			 }
	         
	         console.log("InsArr:\n",InsArr,"\nInsArrRS:\n",InsArrRS); 	
           res.write("Total "+(InsArr.length + InsArrRS.length) + " instances created: "+InsArr.toString()+"###"+InsArrRS.toString()+"<br />");
           }
		   res.write(resObj.status);	
           res.end(body);		 
           });
		   lastJob = "DescribeInstances";
		   break;
		   
		   case "/describe_eip" : 
		      
            command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
		    res.write("describe eip =======> ");
            if ( resObj.eip_set == undefined) {
           	  res.write("API returns nothing, check your API keys!<br />");
           	} else { 
            	var eipArr = [];
				var eipId = [];
            	if (OVERWRITE_FILE && resObj.eip_set.eip !== undefined){
            	fs.writeFileSync(__dirname+'/eipid.log',""); 
            	fs.writeFileSync(__dirname+'/eipaddr.log',""); 
            	}
            	resObj.eip_set.forEach(function(eipObj){
            //		  if (eipObj.eip_name === ("twEIP"+nameSuffix) && (eipObj.status === "available" || eipObj.status === "associated")) {
                 if (eipObj.eip_name === ("twEIP"+nameSuffix) && eipObj.status === "available") {
            			  eipArr.push(eipObj.eip_addr);
						  eipId.push(eipObj.eip_id);           			  
            		  }	  
            	});
				if (OVERWRITE_FILE && eipArr.length>0 && eipId.length>0){
            	   fs.writeFileSync(__dirname+'/eipid.log',""); 
            	   fs.writeFileSync(__dirname+'/eipaddr.log',""); 
            	}
				
				if (eipArr.length>0){
					for (i in eipArr) {
					   fs.appendFileSync(__dirname+'/eipaddr.log',eipArr[i]+',');	
					}
				}
				if (eipId.length>0){
					for (i in eipId) {
					   fs.appendFileSync(__dirname+'/eipid.log',eipId[i]+',');	
					}
				}
				   
            	console.log("eipArr:\n",eipArr); 
            	res.write("Total "+eipArr.length.toString()+ " EIPs created: "+eipArr.toString()+"<br />");	
            	}
				    res.write(resObj.status);	
                    res.end(body);
            });
		      lastJob = "DescribeEips";
		   break;
		   
		   case "/associate_eip" :                //need to call the request in a loop, only invoke res.end once
		      res.write("associate eip<br />");
			  var logonce = true;
              var fileEipId = fs.readFileSync(__dirname+'/eipid.log').toString();
              var eipId = fileEipId.split(',');
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');	
              console.log(eipId + "\n" + insId);
              if (eipId.length != insId.length) {
              	console.log("Error: EIP number:"+eipId.length," mismatches "+"INSTANCE number:"+insId.length);
				res.end(body);
              } else {
              	for (i=0; i< eipId.length -1;i++){
              		console.log(i);
              		jsonObj[pathName].eip = eipId[i];
                    jsonObj[pathName].instance = insId[i];
              		command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
						 if (logonce) {
						             logonce = false;
                         res.write(resObj.status);	
                         res.end(body);    						 
						 }
                         });
              	}
               }
		      lastJob = "AssociateEip";
		   break;
		   
		   case "/stop_instance" : 
		         	      
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
              var param = querystring.parse(paraQuery);           
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){  
			      res.write("Stopping instances<br />");
                  res.write(resObj.status);	
                  res.end(body);					  
              });
              lastJob = "StopInstances";
		     break;
		   
		   case "/start_instance" : 
		      
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
              var param = querystring.parse(paraQuery);           
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){  
			      res.write("Starting instances<br />");
                  res.write(resObj.status);	
                  res.end(body);				  
              });
              lastJob = "StartInstances";
		   break;
		   
		   case "/restart_instance" : 
		      
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');
			  var bodytxt = "";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
              var param = querystring.parse(paraQuery);
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){
				  res.write("Restarting instances<br />");
				  res.write(resObj.status);	
                  res.end(body);	
              	
              });
              lastJob = "RestartInstances"; 	   
		   break;
		   
		   case "/dissociate_eip" : 
		      
              var fileEipId = fs.readFileSync(__dirname+'/eipid.log').toString();
              var eipId = fileEipId.split(',');
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');	
              
              if (eipId.length != insId.length) {
              	console.log("Error: EIP number:"+eipId.length," mismatches "+"INSTANCE number:"+insId.length);
              } else {
              	var bodytxt ="";
              	for (i=0; i< eipId.length -1;i++){
              		var newName = ("eips."+ (i+1)).toString();
              		bodytxt += "&" + newName + "=" + eipId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
              var param = querystring.parse(paraQuery);
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){   
			          res.write("dissociate eip<br />");
                      res.write(resObj.status);	
                      res.end(body);				  
                      });
               }
              lastJob = "DissociateEips";    		   
		   break;
		   
		   case "/delete_instance" :
              
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');
			  var bodytxt ="";
              for (i=0; i< insId.length -1;i++){
              		var newName = ("instances."+ (i+1)).toString(); 
              		bodytxt += "&" + newName + "=" + insId[i].toString();  	
              	}
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
              var param = querystring.parse(paraQuery);              
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){   
			     res.write("delete instances<br />");
                 res.write(resObj.status);	
                 res.end(body);			  
              });	   
		      lastJob = "TerminateInstances"; 
		   break;
		   
		   case "/delete_eip" : 
		      
              var fileEipId = fs.readFileSync(__dirname+'/eipid.log').toString();
              var eipId = fileEipId.split(',');
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');	
              
              
              var bodytxt ="";
              for (i=0; i< eipId.length -1;i++){
              	var newName = ("eips."+ (i+1)).toString();   
              	bodytxt += "&" + newName + "=" + eipId[i].toString(); 
              }
              var paraQuery = querystring.stringify(jsonObj[pathName]) + bodytxt;
			  var param = querystring.parse(paraQuery); 
              command2Qc.command2Qc(param,method,uri,secret,function(resObj){  
			      res.write("delete eips<br />");
                  res.write(resObj.status);	
                  res.end(body);				  
                      });
		      lastJob = "ReleaseEips";
		   break;
		   
		   case "/generate_xml" :
		      generateXML.generateXML(path, zoneDc, securityGroup);   
			  res.write("LG.xml and twMonServer.xml file generated");
			  res.end(body);
              var archive = new zip();	
              archive.addFiles([
			  {name:"LG.xml",path:__dirname+"/LG.xml"},
			  {name:"twMonServer.xml",path:__dirname+"/twMonServer.xml"},
			  {name:"twLGMon.xml",path:__dirname+"/twLGMon.xml"}			  
			  ],function(err){
				if (err) return console.log(err);  
				var buff = archive.toBuffer();
				fs.writeFileSync(__dirname+"/archive.zip",buff);
				console.log("3 files zipped!");
			  });				  
           break;
		   
		   case "/archive.zip":
		//      const gzip = zlib.createGzip();		
	    	  var stats = fs.statSync(__dirname+"/archive.zip");  			  
		      res.writeHeader('Content-Length', stats["size"]);
              res.writeHeader('Content-Type', mime.lookup(__dirname+"/archive.zip"));
              res.writeHeader('Content-Disposition', 'attachment; filename=archive.zip');
			  var rd = fs.createReadStream(__dirname+"/archive.zip");		  
			  rd.pipe(res);
			  
		   break;
		   
		   case "/check_job":
		      var jobDone = false;
			  var isReturn = false;
			  var allDone = true;
			  jsonObj[pathName].job_action = lastJob;
			  console.log("Chcek Job...");
			  res.write("Checking Job Status: "+lastJob+"<br />");  			  
			  while (!jobDone){
				     isReturn = false;
					 allDone = true;    //every iteration reset the initial value
                     command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
                     	console.log("Polling..."); 
						resObj.job_set.forEach(function(job){
						   if(job.job_action == lastJob && job.status !== "successful"){
						      allDone = false; 
							  console.log(job.job_id+" is not done!");
						   }
						});
                        if (allDone) {
                        	jobDone = true; 	
							res.write("Job Done!!!");
							isReturn = true;  //if alldone exit right away
							res.end(body);
                        	}
						sleep(5000);      // polling need pacing or the API quota will be exceeded
						isReturn = true;  //can do next command2Qc now     						
                  	 });
                  	 while(!isReturn){
                      deasync.runLoopOnce();
                     }
					 console.log(jobDone);         	 
                  }	 
		   break;
		   
		   case "/default":
		       inputTextArr = fs.readFileSync(__dirname+"/inputtextdefault.log").toString().split(","); 
		       res.write("Loading the default input text");
		       var inputBoxStr = body.substring(body.indexOf('"65">')+5,body.lastIndexOf("</textarea>"));
				   body = body.replace(inputBoxStr,inputTextArr[0]+','+inputTextArr[1]+','+inputTextArr[2]+','+inputTextArr[3]+','+inputTextArr[4]+','+inputTextArr[5]+','+inputTextArr[6]);
		       res.write(body);
		       res.end();
		   break;
		   
	   	 default:	              
			 res.write("You are hitting the default page"); 
	   		 res.write(body); 
             res.end();			
	   }
	});

});

server.listen(port,host,function(){
	console.log("Listening on ",host,":",port);
});

function sleep(sleepTime) {
    for(var start = +new Date; +new Date - start <= sleepTime; ) {} 
}