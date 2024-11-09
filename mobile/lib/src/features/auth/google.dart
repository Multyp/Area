import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// A Flutter widget that handles Google OAuth authorization.
class GoogleOAuthWebView extends StatefulWidget {
  /// A callback function triggered when the OAuth flow completes and an
  /// access token is received.
  final Function(String) onTokenReceived;

  const GoogleOAuthWebView({super.key, required this.onTokenReceived});

  @override
  GoogleOAuthWebViewState createState() => GoogleOAuthWebViewState();
}

class GoogleOAuthWebViewState extends State<GoogleOAuthWebView> {
  /// Controller for the WebView, used to manage the web page displayed in the widget.
  late final WebViewController _controller;
  final storageService = StorageService();

  /// The Google OAuth2 client ID associated with your application.
  final String? clientId = dotenv.env['GOOGLE_CLIENT_ID'];

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
      ..setUserAgent(
          'random') // Set User-Agent to 'random' to bypass security checks
      ..loadRequest(Uri.parse(authorizationUrl));
  }

  /// Constructs the Google OAuth2 authorization URL with required parameters.
  String getAuthorizationUrl() {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    final queryParams = {
      'client_id': clientId,
      'redirect_uri': '$apiBaseUrl/oauth/google/callback',
      'response_type': 'code',
      'scope': 'https://www.googleapis.com/auth/userinfo.profile '
          'https://www.googleapis.com/auth/userinfo.email '
          'https://mail.google.com/ '
          'https://www.googleapis.com/auth/gmail.readonly '
          'https://www.googleapis.com/auth/gmail.modify '
          'https://www.googleapis.com/auth/gmail.metadata',
      'access_type': 'offline',
      'prompt': 'consent',
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
  }

  /// Exchanges the authorization code for an access token.
  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    String? token = await storageService.getToken();

    final response = await http.get(
      Uri.parse('$apiBaseUrl/oauth/google/callback?mobile=true&code=$code')
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
      appBar: AppBar(
        title: const Text('Google OAuth'),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
