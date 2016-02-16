//generate the LG xml import list file
var fs = require('fs');
var PATH = "Beijing Qingcloud Loc #2";      //"QingCloud China Beijing 2";
var REGION = "pek2";
var securityGroup = "sg-u279b2do";     //"sg-ewbcbab5";

//generateXML(PATH, REGION, securityGroup);
exports.generateXML = generateXML;

function generateXML(PATH, REGION, securityGroup){
var instanceId = "";
var eip = "";
var instanceIdArr = fs.readFileSync("./instanceid.log").toString().split(",");
var eipArr = fs.readFileSync("./eipaddr.log").toString().split(",");
var startData = "<?xml version='1.0' encoding='UTF-8'?>\n" +
"<rp:ObjectSet xmlns:rp=\"http://www.soasta.com/services/repository\">\n";
var endData = "</rp:ObjectSet>";
var startMonData = 
'<?xml version=\'1.0\' encoding=\'UTF-8\'?>' +
'<rp:ObjectSet xmlns:rp="http://www.soasta.com/services/repository">' +
  '<Object type="target" schemaVersion="8138" name="twMonServer" path="/">' +
    '<Body>'+
      '<Target xmlns="http://www.soasta.com/services/repository">'+
        '<MonitorDefinition>'+
          '<Hosts>\n';
var endMonData = 
'</Hosts>'+
          '<Machines>'+
            '<Machine>'+
              '<ID>1</ID>'+
              '<Name>null</Name>'+
              '<Port>22</Port>'+
              '<UserName>root</UserName>'+
              '<Password e="true">h1RVr1y4m/tO9DPk9AI4dw==</Password>'+
              '<OperatingSystem>RedHatEnterpriseLinux</OperatingSystem>'+
            '</Machine>'+
          '</Machines>'+
        '</MonitorDefinition>'+
      '</Target>'+
    '</Body>'+
    '<BinaryData />'+
    '<Description></Description>'+
    '<Attributes>'+
      '<Attribute name="type">'+
        '<Value>monitor</Value>'+
      '</Attribute>'+
      '<Attribute name="resultsServiceID">'+
        '<Value>95305</Value>'+
      '</Attribute>'+
      '<Attribute name="longitude">'+
        '<Value null="true" />'+
      '</Attribute>'+
      '<Attribute name="latitude">'+
        '<Value null="true" />'+
      '</Attribute>'+
    '</Attributes>'+
  '</Object>'+
'</rp:ObjectSet>';

fs.writeFileSync("./LG.xml",startData);
fs.writeFileSync("./twMonServer.xml",startMonData);

for (i=0; i< instanceIdArr.length-1; i++) {
instanceId = instanceIdArr[i];
eip = eipArr[i];
console.log("id:",instanceId+"  "+"eip:"+eip);
var mainData = "<Object type=\"server\" schemaVersion=\"8138\" name=\""+"twLG"+ (i+1) +"\" path=\"" +PATH+ "\">\n<Body>\n<Server xmlns=\"http://www.soasta.com/services/repository\">\n<Options />\n<Maestro>\n<Settings>\n<Setting name=\"Pool.MaxWorkerCount\" value=\"8192\" />\n<Setting name=\"RSClient.DistributeAmongResultServers\" value=\"true\" />\n<Setting name=\"ServerType\" value=\"Load\" />\n</Settings>\n<Contact url=\"http://" + instanceId + ":8080/concerto/services/hessian/Maestro\" urlOutsideLocation=\"http://" + eip + ":8080/concerto/services/hessian/Maestro\" />\n</Maestro>\n<Monitor>\n<Settings>\n<Setting name=\"ServerType\" value=\"Slave\" />\n</Settings>\n<Contact url=\"http://" + instanceId+ ":8080/concerto/services/hessian/MonitorService\" urlOutsideLocation=\"http://" + eip + ":8080/concerto/services/hessian/MonitorService\" />\n</Monitor>\n<CloudProviderAccountRef>cparef</CloudProviderAccountRef>\n<CloudInfo>\n<Provider>QINGCLOUD</Provider>\n<ServerClassName>QingCloud Test Server (Large)</ServerClassName>\n<Region>"+ REGION+ "</Region>\n<VendorID>i-f9kxa98l</VendorID>\n<SecurityGroup>" + securityGroup +"</SecurityGroup>\n<PublicHostName>"+ eip +"</PublicHostName>\n</CloudInfo>\n</Server>\n</Body>\n<BinaryData />\n<Description></Description>\n<Attributes>\n<Attribute name=\"hostName\">\n<Value>" +instanceId+ "</Value>\n</Attribute>\n<Attribute name=\"address\">\n<Value null=\"true\" />\n</Attribute>\n<Attribute name=\"state\">\n<Value>RUNNING</Value>\n</Attribute>\n<Attribute name=\"cloudServerStatisticsId\">\n<Value>0c13c1a2-a4b6-45ff-b52d-82cd2a8a5ac9</Value>\n</Attribute>\n<Attribute name=\"cloudServer\">\n<Value>true</Value>\n</Attribute>\n<Attribute name=\"authKey\">\n<Value>UUgp+cJFW+NbFeo0SOExlokJWE6tIMppgshTLUksNew1WoNZWo5v/g==</Value>\n</Attribute>\n</Attributes>\n</Object>\n";
var monData = '<Host>' + eip + '</Host>\n';
fs.appendFileSync("./LG.xml",mainData);
fs.appendFileSync("./twMonServer.xml",monData);
}
  
fs.appendFileSync("./LG.xml",endData);
console.log("LG file write completed!!!");
fs.appendFileSync("./twMonServer.xml",endMonData);
console.log("Monitor file write completed!!!");
}



/*
var monData = 
'<?xml version=\'1.0\' encoding=\'UTF-8\'?>' +
'<rp:ObjectSet xmlns:rp="http://www.soasta.com/services/repository">' +
  '<Object type="target" schemaVersion="8138" name="twMonServer" path="/">' +
    '<Body>'+
      '<Target xmlns="http://www.soasta.com/services/repository">'+
        '<MonitorDefinition>'+
          '<Hosts>'+
            '<Host>124.42.118.207</Host>'+
            '<Host>124.42.118.72</Host>'+
            '<Host>124.42.118.46</Host>'+
          '</Hosts>'+
          '<Machines>'+
            '<Machine>'+
              '<ID>1</ID>'+
              '<Name>null</Name>'+
              '<Port>22</Port>'+
              '<UserName>root</UserName>'+
              '<Password e="true">h1RVr1y4m/tO9DPk9AI4dw==</Password>'+
              '<OperatingSystem>RedHatEnterpriseLinux</OperatingSystem>'+
            '</Machine>'+
          '</Machines>'+
        '</MonitorDefinition>'+
      '</Target>'+
    '</Body>'+
    '<BinaryData />'+
    '<Description></Description>'+
    '<Attributes>'+
      '<Attribute name="type">'+
        '<Value>monitor</Value>'+
      '</Attribute>'+
      '<Attribute name="resultsServiceID">'+
        '<Value>95305</Value>'+
      '</Attribute>'+
      '<Attribute name="longitude">'+
        '<Value null="true" />'+
      '</Attribute>'+
      '<Attribute name="latitude">'+
        '<Value null="true" />'+
      '</Attribute>'+
    '</Attributes>'+
  '</Object>'+
'</rp:ObjectSet>';
*/
