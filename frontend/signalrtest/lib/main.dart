import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: WebViewAlertExample(),
    );
  }
}

class WebViewAlertExample extends StatefulWidget {
  @override
  _WebViewAlertExampleState createState() => _WebViewAlertExampleState();
}

class _WebViewAlertExampleState extends State<WebViewAlertExample> {
  InAppWebViewController? _webViewController;
  String strUrlNotification = "assets/clickclick.html";

  Future<String> loadHtmlFromAssets(String filePath) async {
    return await Future.value("wala");
  }

  @override
  void initState() {
    super.initState();
    if (true) {
      //  String currentUri = html.window.location.href;
      String? pathname = Uri.base.path; // html.window.location.pathname;
      pathname ??= "/";
      print("path name $pathname");
      if (pathname.trim() != "/") {
        strUrlNotification = "assets/$strUrlNotification";
      }
    }
    // getSessionValue((sessionTokenkey) {
    //   setState(() {
    //     strTellerId = sessionTokenkey;
    //     print("strTellerId $strTellerId");
    //   });
    // });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('JavaScript Alert Example'),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 50,
            width: 50,
            child: FutureBuilder<String>(
              future: loadHtmlFromAssets('assets/index.html'),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.done) {
                  return InAppWebView(
                    initialFile: strUrlNotification,
          
                    initialSettings: InAppWebViewSettings(
                      isInspectable: true,
                      javaScriptEnabled: true,
                      mediaPlaybackRequiresUserGesture: false,
                      cacheEnabled: false,
                      allowsInlineMediaPlayback: true,
                      useShouldOverrideUrlLoading: false, //true,
                      disableVerticalScroll: true,
                      disableHorizontalScroll: true,
                    ),
                    
                    onReceivedServerTrustAuthRequest: (controller, challenge) async {
              return ServerTrustAuthResponse(action: ServerTrustAuthResponseAction.PROCEED);
            },
            
                    onLoadStop: (controller, url) async {
                      /* String? sessionTellerID = await SessionManager().get("tellerID");
                      await _webViewController?.evaluateJavascript(source: """
                      window.initJsValue('$sessionTellerID');
                    """); */
                      await controller.evaluateJavascript(source: """
                      window.addEventListener("ovrCustomEvent", (event) => {
                        console.log(JSON.stringify(event.detail));
                      }, false);
                    """);
                    },
                    // onConsoleMessage: (controller, consoleMessage) {
                    //   //print("hello8888 " + consoleMessage.message);
                    //   // processNotification(context, consoleMessage.message);
                    //   print("weeeee  $consoleMessage");
                    //   var jsonObject = json.decode(consoleMessage.message);
                    //   print(jsonObject);
                    //   print("ppppppppppp ${jsonObject["detail"]}");
                    //   print(jsonObject["detail"] == "ma Item");
                    // },
                    onWebViewCreated: (controller) {
                      //print("Provider.of<WebViewNotification>(context)");
                      // Provider.of<WebViewNotification>(context, listen: false).setController(controller);
          
                      _webViewController = controller;
          
                      // controller.addJavaScriptHandler(
                      //     handlerName: 'ovrHandlerEvent',
                      //     callback: (args) {
                      //       //json.encode(args[0])
                      //       // processNotification(context, json.encode(args[0]));
                      //     });
                      // Provider.of<WebViewNotification>(context, listen: false)
                      //   .setController(controller);
                    },
                  );
                }
                return Center(child: CircularProgressIndicator());
              },
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              // _webViewController?.evaluateJavascript(source: """
              //   window.getValues('wikee');
              // """);
              _webViewController?.evaluateJavascript(source: """window.startListener();""");
              
            },
            child: Text('Show JavaScript Alert'),
          ),
        ],
      ),
    );
  }
}
