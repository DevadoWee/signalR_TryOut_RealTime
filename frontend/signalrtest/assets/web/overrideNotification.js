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
    const retryTimes = [5000];//5 sec
    const realTimeEvtConnection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: context => {
          const index = context.previousRetryCount < retryTimes.length ? context.previousRetryCount : retryTimes.length - 1;
          return retryTimes[index];
        }
    })
    .withUrl(strPushNotificationUrl.concat("/", strHub), {
        // skipNegotiation: true,  // skipNegotiation as we specify WebSockets
        // transport: signalR.HttpTransportType.WebSockets  // force WebSocket transport
      }) // Enable detailed logging
    .build();

    //ReceiveMessage
    realTimeEvtConnection.on("ReceiveMessage", (message) => {
        console.log("Message from server:" + message);
    });

    //connection.invoke("ReceiveMessage", "Hello from the client!")

    realTimeEvtConnection.start()
        .then(() => {
            console.log("Connected to HUB");
            booConnectedToHub = true;
            statusMessage = 'active';
        })
        .catch((err) => {
            console.error("Failed to connect to HUB. Retrying in 5 seconds...", err);
            booConnectedToHub = false;
            statusMessage = 'inactive';
        });

    // Handle disconnection
    realTimeEvtConnection.onclose(() => {
        console.log("Disconnected from HUB");
        booConnectedToHub = false;
    
        // Start the reconnection process
        setTimeout(startConnectionWithRetry, 5000);
    });

    // Handle the reconnecting event
    realTimeEvtConnection.onreconnecting(() => {
        console.log("Reconnecting...");
        statusMessage = 'inactive';
    });

    // Handle the reconnected event
    realTimeEvtConnection.onreconnected(() => {
        console.log("Reconnected to HUB");
        statusMessage = 'active';
    });
}