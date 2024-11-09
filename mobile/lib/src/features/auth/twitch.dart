import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// A Flutter widget that handles Twitch OAuth authorization.
class TwitchOAuthWebView extends StatefulWidget {
  /// A callback function triggered when the OAuth flow completes and an
  /// access token is received.
  final Function(String) onTokenReceived;

  const TwitchOAuthWebView({super.key, required this.onTokenReceived});

  @override
  TwitchOAuthWebViewState createState() => TwitchOAuthWebViewState();
}

class TwitchOAuthWebViewState extends State<TwitchOAuthWebView> {
  /// Controller for the WebView, used to manage the web page displayed in the widget.
  late final WebViewController _controller;
  final storageService = StorageService();

  /// The Twitch OAuth2 client ID associated with your application.
  final String? clientId = dotenv.env['TWITCH_CLIENT_ID'];

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

  /// Constructs the Twitch OAuth2 authorization URL with required parameters.
  String getAuthorizationUrl() {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    const baseUrl = 'https://id.twitch.tv/oauth2/authorize';
    final queryParams = {
      'client_id': clientId,
      'redirect_uri': '$apiBaseUrl/oauth/twitch/callback',
      'response_type': 'code',
      'scope': 'user:read:email channel:read:subscriptions',
      'force_verify': 'true',
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
  }

  /// Exchanges the authorization code for an access token.
  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    String? token = await storageService.getToken();

    final response = await http.get(
      Uri.parse('$apiBaseUrl/oauth/twitch/callback?mobile=true&code=$code')
          .replace(
        queryParameters: {
          'mobile': 'true',
          'code': code,
          if (token != null) 'token': token,
        },
      ),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (kDebugMode) {
      print('response: ${response.body}');
      print(response.toString());
      print(code);
    }

    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      if (responseData['success']) {
        final accessToken = responseData['token'];
        widget.onTokenReceived(accessToken);

        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to authenticate with Twitch')),
          );
        }
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to authenticate with Twitch')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Twitch Login')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
