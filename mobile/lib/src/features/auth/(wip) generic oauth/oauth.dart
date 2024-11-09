import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

class OAuthConfig {
  final String name;
  final String clientIdKey;
  final String baseUrl;
  final String scope;
  final Map<String, String> additionalParams;

  OAuthConfig({
    required this.name,
    required this.clientIdKey,
    required this.baseUrl,
    required this.scope,
    this.additionalParams = const {},
  });
}

class GenericOAuthWebView extends StatefulWidget {
  final OAuthConfig config;
  final Function(String) onTokenReceived;

  const GenericOAuthWebView({
    super.key,
    required this.config,
    required this.onTokenReceived,
  });

  @override
  GenericOAuthWebViewState createState() => GenericOAuthWebViewState();
}

class GenericOAuthWebViewState extends State<GenericOAuthWebView> {
  late final WebViewController _controller;

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

  String getAuthorizationUrl() {
    final String? clientId = dotenv.env[widget.config.clientIdKey];
    final baseParams = {
      'client_id': clientId!,
      'response_type': 'code',
      'scope': widget.config.scope,
    };
    final allParams = {...baseParams, ...widget.config.additionalParams};
    return Uri.parse(widget.config.baseUrl)
        .replace(queryParameters: allParams)
        .toString();
  }

  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    final response = await http.get(
      Uri.parse(
          '$apiBaseUrl/oauth/${widget.config.name.toLowerCase()}/callback?mobile=true&code=$code'),
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
        if (kDebugMode) {
          print('Login failed: ${responseData['message']}');
        }
      }
    } else {
      if (kDebugMode) {
        print('HTTP error: ${response.statusCode}');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.config.name} OAuth'),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
