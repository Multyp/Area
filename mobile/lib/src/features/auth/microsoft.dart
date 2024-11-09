import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:webview_flutter/webview_flutter.dart';

class MicrosoftOAuthWebView extends StatefulWidget {
  final Function(String) onTokenReceived;

  const MicrosoftOAuthWebView({super.key, required this.onTokenReceived});

  @override
  MicrosoftOAuthWebViewState createState() => MicrosoftOAuthWebViewState();
}

class MicrosoftOAuthWebViewState extends State<MicrosoftOAuthWebView> {
  late final WebViewController _controller;
  final storageService = StorageService();

  @override
  void initState() {
    super.initState();

    final authorizationUrl = getAuthorizationUrl();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.contains('code=')) {
              final uri = Uri.parse(request.url);
              final code = uri.queryParameters['code'];
              if (code != null) {
                exchangeCodeForToken(code);
                return NavigationDecision.prevent;
              }
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(authorizationUrl));
  }

  /// Constructs the Microsoft OAuth authorization URL.
  ///
  /// This URL prompts the user to log in to Microsoft and authorize the app.
  String getAuthorizationUrl() {
    final String? clientId = dotenv.env['MICROSOFT_CLIENT_ID'];
    final String? tenantId = dotenv.env['MICROSOFT_TENANT_ID'];
    final baseUrl =
        'https://login.microsoftonline.com/$tenantId/oauth2/v2.0/authorize';
    final queryParams = {
      'client_id': clientId!,
      'response_type': 'code',
      'scope': 'https://graph.microsoft.com/.default offline_access',
      'response_mode': 'query',
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
  }

  /// Exchanges the authorization code for an access token via the backend API.
  ///
  /// The backend API handles the actual token exchange, keeping the `client_secret` secure.
  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    String? token = await storageService.getToken();

    final response = await http.get(
      Uri.parse('$apiBaseUrl/oauth/microsoft/callback?mobile=true&code=$code')
          .replace(queryParameters: {
        'mobile': 'true',
        'code': code,
        if (token != null) 'token': token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      if (responseData['success']) {
        final accessToken = responseData['token'];
        widget.onTokenReceived(accessToken);
        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        // TODO : Handle failed to login
      }
    } else {
      // TODO : Handle failed to login
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Microsoft OAuth')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
