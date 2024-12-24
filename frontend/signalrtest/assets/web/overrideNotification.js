var realTimeEvtConnection;
var objListenerProxy = null;
var booConnectedToHub = false;
var strPushNotificationUrl = "";
var strUserLoginId = "";
var strBranchCode="";

var statusMessage = "";

function callJS(value) {
    alert(value);
}

function startListener(){
    console.log("startListener");
    strPushNotificationUrl = "https://localhost:63204";
    strHub = "chat-hub";

    initConnectionRT();
}

function stopListener(){
    document.location.reload();
}

$(document).ready(function () {
});

function initConnectionRT() {

    console.log(strPushNotificationUrl);
    //constructOverrideAlertSound();

    // jQuery.getScript('jquery.signalR-6.0.11.js', function () {

    //booOverrideWithTCP = false;
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(strPushNotificationUrl.concat("/", strHub), {
        // skipNegotiation: true,  // skipNegotiation as we specify WebSockets
        // transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
      }) // Enable detailed logging
    .build();

connection.start()
    .then(() => console.log("Connected to SignalR"))
    .catch(err => console.error("SignalR error:", err));

    
    realTimeEvtConnection.start().done(function () {
        statusMessage = 'active';

        booConnectedToHub = true;
        //alert("connected")
        
        console.log("Connected to HUB");
        objListenerProxy.invoke("connect", strUserLoginId);

    });


    realTimeEvtConnection.disconnected(function () {
        console.log("Disconnected fom HUB");


        booConnectedToHub = false;

        setTimeout(function () {
            realTimeEvtConnection.start().done(function () {
                console.log("Connected to HUB");
                booConnectedToHub = true;
                objListenerProxy.invoke("connect", strUserLoginId);

            });
        }, 5000); // Restart connection after 5 seconds.

        //reconnect
        //objListenerProxy.invoke("connect", strUserLoginId);
    });

    realTimeEvtConnection.reconnecting(function () {
        console.log("reconnecting")
        
        statusMessage = 'inactive';
    
    });

    realTimeEvtConnection.reconnected(function () {
        console.log("reconnected")

        statusMessage = 'active';
    
        objListenerProxy.invoke("connect", strUserLoginId);
    });

}