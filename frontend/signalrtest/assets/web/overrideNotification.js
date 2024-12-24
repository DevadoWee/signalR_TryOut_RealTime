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
    strPushNotificationUrl = "https://localhost:63204/chat-hub";

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

    // jQuery.getScript('jquery.signalR-2.4.2.js', function () {

    //booOverrideWithTCP = false;
    realTimeEvtConnection = $.hubConnection(strPushNotificationUrl);

    objListenerProxy = realTimeEvtConnection.createHubProxy('chat-hub');

    
    realTimeEvtConnection.start().done(function () {
        statusMessage = 'active';

        booConnectedToHub = true;
        //alert("connected")
        
        onsole.log("Connected to HUB");
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