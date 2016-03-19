var http = require('http');
var fs = require('fs');
var url = require('url');
var zlib = require('zlib');
var zip = require('node-native-zip');
var mime = require('mime');
//var formidable = require('formidable');
var generateXML = require('./GenerateXML.js');
var host = "0.0.0.0";
var port = 8080;
var querystring = require('querystring');
var command2Qc = require('./QingcloudReq.js');
var method = "GET";
var uri = "/iaas/";
var currentDir = __dirname; 
currentDir = currentDir.substring(0,currentDir.lastIndexOf("/")) + "/files/access_key_soasta.csv";
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

var body = '<html>'+                  
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
	'<style type="text/css">'+
      'img{'+
         'position:absolute;'+
         'left:480px;'+
         'top:280px;'+
         '}'+
    '</style>'+
    '</head>'+
    '<body>'+  
	'<h1>Welcome to use NodeJs Routine for Qingcloud API</h1>'+
	'<form enctype="multipart/form-data" action="/UploadKeyCSV" method="post">'+
    '<input type="file" name ="upload" id="choosefile" /><br>'+
    '<input type="submit" value="UploadKeyCSV" id="submitBtn" />'+
    '</form><br />'+
//	'MainAccount<input type="radio" checked="checked" name="csvPath" value="../files/access_key_soasta_main.csv" />'+
//	'PeAccount<input type="radio" name="csvPath" value="../files/access_key_soasta.csv" /><br /><br />'+
	'<u1>NumInstances,Bandwidth,ZoneName,InstanceType,ImageID,ServerListLocation</u1><hr/>'+
	'<img src="http://www.soasta.com/wp-content/uploads/2015/05/cloudtest-pp-2.jpg" width="800" height="600"></div>'+
    '<form action="/upload" method="post">'+           
    '<textarea name="text" rows="2" cols="65">2,10,pek2,c4m8,img-1wbv1ydv,img-wska67bq,Beijing Qingcloud Loc #2</textarea>'+
    '<input type="submit" value="Submit" style="height:20px;width:80px" />'+
    '</form>'+
    '<form action="/create_LG" method="post">'+           
	  '<input type="submit" value="Create_lg" style="height:20px;width:120px;background:#FFC0CB" />'+
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
				 for (i in jsonObj) {
	                jsonObj[i].access_key_id = access_key_id;
                 };	
				 res.write("Credential loaded!");
				 }
				 res.end(body);
		   break;
		   
	   	   case "/upload" : 
		         //the following variables are global variables, can't use var here
             inputArr = finalTxt.split(',');
		         numOfInstances = inputArr[0];
             div50 = Math.floor(numOfInstances/50);
             mod50 = numOfInstances - div50*50;
             rsNum = (mod50 == 0)? div50:div50+1;
             	         
				     //setting default values
		         eipBandwidth = (inputArr[1] == undefined)?10:parseInt(inputArr[1]) ;
		         zoneDc = (inputArr[2] == undefined)?'pek2':inputArr[2];
		         instanceType = (inputArr[3] == undefined)?'c4m8':inputArr[3];
		         imageId = (inputArr[4] == undefined)?'img-1wbv1ydv':inputArr[4];
		         imageIdRS = (inputArr[5] == undefined)?'img-wska67bq':inputArr[5];
             path = (inputArr[6] == undefined)?'Beijing Qingcloud Loc #2':inputArr[6];		
             path = path.replace(/\+/g,' '); 
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
	   	   		 res.end(body);   	   		
	   	   break;
	   	   
	   	   case "/create_LG" : 
	   	       console.log(mod+" "+numOfInstances+" "+eipBandwidth+" "+zoneDc+" "+instanceType+" "+imageId+" "+imageIdRS+" "+path);		         
		         var modJsonInsLG = 
				         {"count":mod,
                  "image_id":imageId,
                  "instance_type":instanceType,
                  "zone":zoneDc,
                  "instance_name":"twLG",
                  "login_mode":"passwd",
                  "login_passwd":"Soasta2006",
                  "vxnets.1":"vxnet-0",
                  "signature_version":1,                     
                  "signature_method":"HmacSHA256",              
                  "version":1,                              
                  "access_key_id":access_key_id,   
                  "action":"RunInstances",            
                  "time_stamp":"2013-08-27T14:30:10Z"};
                                
	   	   		 res.write("Creating LG in progress");
	   	   		 res.end(body);
				     var myParameterCreateArr = [];   //used for Async loop 
             for (i=0; i<div;i++) {				 
					      myParameterCreateArr.push(jsonObj[pathName]);
					   }
             myParameterCreateArr.push(modJsonInsLG);
				     myParameterCreateArr.forEach(function(myParameterCreate){
                 command2Qc.command2Qc(myParameterCreate,method,uri,secret,function(resObj){         	
                    });
             }); 
             LGDone = true; 
          
	   	   break;
	   	   
	   	   case "/create_RS":
	   	      console.log("rsNum: "+rsNum);
		        if (!LGDone) {
		      	    res.write("Needs LG number to determine RS number, please go back and create some LGs 1st!");
		      	    res.end(body);
		      	 } else {
		        res.write("Creating RS in progress");
	   	   	  res.end(body);
		        var modJsonInsRS = 
				         {"count":rsNum,
                  "image_id":imageIdRS,
                  "instance_type":instanceType,
                  "zone":zoneDc,
                  "instance_name":"twRS",
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
                    });
            LGDone = false;
            }
		     break;
	   	   	 
	   	  
		   case "/create_eip" : 
		    NUM = parseInt(numOfInstances)+rsNum;	   //assuming upload will always happen before create
			  div = Math.floor(NUM/10);
        mod = NUM - div*10;        
			  console.log("Eips number: "+NUM+" "+div+" "+mod);
			  var modJsonEip =  
				   {"count":mod,
            "bandwidth":eipBandwidth,
            "billing_mode":"traffic",
            "eip_name":"twEIP",
            "zone":zoneDc,
            "signature_version":1,                     
            "signature_method":"HmacSHA256",              
            "version":1,                              
            "access_key_id":access_key_id,   
            "action":"AllocateEips",            
            "time_stamp":"2013-08-27T14:30:10Z"};
	   	   	  res.write("Creating eips in progress");
	   	   	  res.end(body);
                var myParameterCreateArr = [];   //used for Async loop
                for (i=0; i<div;i++) {
					 myParameterCreateArr.push(jsonObj[pathName]);
					}
				 myParameterCreateArr.push(modJsonEip);
				 myParameterCreateArr.forEach(function(myParameterCreate){
                 command2Qc.command2Qc(myParameterCreate,method,uri,secret,function(resObj){      	
                  });
                 });  
           		   
		   break;
		   
		   case "/describe_instance" : 
		      
	   	     res.write("describe instance =======> ");
             command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
	         var InsSetLength = resObj.instance_set.length;
	         var InsArr = [];
	         var InsArrRS = [];  // separate array for RS list
	         if (OVERWRITE_FILE) {
	         fs.writeFileSync(__dirname+'/instanceid.log',"");   //create an empty or clear the existing log
	         }
	         resObj.instance_set.forEach(function(InsObj){
	   	     if (InsObj.instance_name === "twLG" && InsObj.status === "running" ) {
	   		     InsArr.push(InsObj.instance_id);
	   	     }	  
	         if (InsObj.instance_name === "twRS" && InsObj.status === "running" ) {
	   		     InsArrRS.push(InsObj.instance_id);
	   	     }	  
	         });
	         //make sure to write LG 1st and RS last in the list
	         for (i in InsArr){fs.appendFileSync(__dirname+'/instanceid.log',InsArr[i]+',');}
	         for (i in InsArrRS){fs.appendFileSync(__dirname+'/instanceid.log',InsArrRS[i]+',');}
	         
	         console.log("InsArr:\n",InsArr,"\nInsArrRS:\n",InsArrRS); 	
           res.write("Total "+(InsArr.length + InsArrRS.length) + " instances created: "+InsArr.toString()+"###"+InsArrRS.toString());
           res.end(body);			 
           });
		   
		   break;
		   
		   case "/describe_eip" : 
		      
	   	      res.write("describe eip =======> ");
            command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
            	var eipSetLength = resObj.eip_set.length;
            	var eipArr = [];
            	if (OVERWRITE_FILE){
            	fs.writeFileSync(__dirname+'/eipid.log',""); 
            	fs.writeFileSync(__dirname+'/eipaddr.log',""); 
            	}
            	   resObj.eip_set.forEach(function(eipObj){
            		  if (eipObj.eip_name === "twEIP" && (eipObj.status === "available" || eipObj.status === "associated")) {
            			  eipArr.push(eipObj.eip_addr);
            			  fs.appendFileSync(__dirname+'/eipid.log',eipObj.eip_id+','); 
            	          fs.appendFileSync(__dirname+'/eipaddr.log',eipObj.eip_addr+','); 
            		  }	  
            	   });
            	   console.log("eipArr:\n",eipArr); 
            	   res.write("Total "+eipArr.length.toString()+ " EIPs created: "+eipArr.toString());	
				   res.end(body);
            });
		   
		   break;
		   
		   case "/associate_eip" : 
		      
	   	      res.write("associate eip");
	   	      res.end(body);
              var fileEipId = fs.readFileSync(__dirname+'/eipid.log').toString();
              var eipId = fileEipId.split(',');
              var fileInsId = fs.readFileSync(__dirname+'/instanceid.log').toString();
              var insId = fileInsId.split(',');	
              console.log(eipId + "\n" + insId);
              if (eipId.length != insId.length) {
              	console.log("Error: EIP number:"+eipId.length," mismatches "+"INSTANCE number:"+insId.length);
              } else {
              	for (i=0; i< eipId.length -1;i++){
              		console.log(i);
              		jsonObj[pathName].eip = eipId[i];
                    jsonObj[pathName].instance = insId[i];
              		command2Qc.command2Qc(jsonObj[pathName],method,uri,secret,function(resObj){
              	
                         });
              	}
               }
		   
		   break;
		   
		   case "/stop_instance" : 
		      
	   	      res.write("Stopping instances");
	   	      res.end(body);
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
              });

		     break;
		   
		   case "/start_instance" : 
		      
	   	      res.write("Starting instances");
	   	      res.end(body);
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
              });

		   break;
		   
		   case "/restart_instance" : 
		      
	   	      res.write("Restarting instances");
	   	      res.end(body);
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
              	
              });
              	   
		   break;
		   
		   case "/dissociate_eip" : 
		      
	   	      res.write("dissociate eip");
	   	      res.end(body);
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
                      });
               }
              		   
		   break;
		   
		   case "/delete_instance" :
              
	   	      res.write("delete instances");
	   	      res.end(body);
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
              });	   
		   
		   break;
		   
		   case "/delete_eip" : 
		      
	   	      res.write("delete eips");
	   	      res.end(body);
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
                      });
		   
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
		//      res.writeHeader('Content-Length', stats["size"]);
              res.writeHeader('Content-Type', mime.lookup(__dirname+"/archive.zip"));
              res.writeHeader('Content-Disposition', 'attachment; filename=archive.zip');
			  var rd = fs.createReadStream(__dirname+"/archive.zip");		  
			  rd.pipe(res);
			  
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