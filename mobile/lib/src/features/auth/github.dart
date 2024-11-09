import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// A WebView widget to handle GitHub OAuth authorization flow.
///
/// This widget opens a WebView to allow the user to authorize the app to access
/// their GitHub account. Upon receiving the authorization code from GitHub,
/// the app exchanges the code for an access token via a backend API. The access
/// token is then passed back to the parent widget through a callback.
class GitHubOAuthWebView extends StatefulWidget {
  /// Callback to notify the parent widget when an access token is received.
  final Function(String) onTokenReceived;

  /// Constructor for [GitHubOAuthWebView].
  ///
  /// Requires [onTokenReceived] callback to handle the token once it is
  /// received.
  const GitHubOAuthWebView({super.key, required this.onTokenReceived});

  @override
  GitHubOAuthWebViewState createState() => GitHubOAuthWebViewState();
}

class GitHubOAuthWebViewState extends State<GitHubOAuthWebView> {
  /// WebView controller to manage navigation within the WebView.
  late final WebViewController _controller;
  final storageService = StorageService();

  /// GitHub client ID for OAuth.
  final String? clientId = dotenv.env['CLIENT_ID_GITHUB'];

  @override
  void initState() {
    super.initState();

    // Build the GitHub OAuth authorization URL.
    final authorizationUrl = getAuthorizationUrl();

    // Initialize the WebView controller with the necessary settings.
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            // Check if the URL contains the authorization code.
            if (request.url.contains('code=')) {
              final uri = Uri.parse(request.url);
              final code = uri.queryParameters['code'];
              if (code != null) {
                // Exchange the code for an access token via the backend API.
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

  /// Constructs the GitHub OAuth authorization URL.
  ///
  /// This URL prompts the user to log in to GitHub and authorize the app to
  /// access their data. The `client_id` and `scope` are provided as query
  /// parameters.
  ///
  /// Returns a complete GitHub OAuth authorization URL as a [String].
  String getAuthorizationUrl() {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    final queryParams = {
      'client_id': clientId,
      'scope': 'repo user', // Scopes required for the app
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
  }

  /// Exchanges the GitHub OAuth authorization code for an access token.
  ///
  /// This method makes a request to the backend API, which exchanges the
  /// authorization code for a GitHub access token. Once the token is received,
  /// it is passed back to the parent widget via the [onTokenReceived] callback.
  ///
  /// [code] - The authorization code provided by GitHub.
  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    String? token = await storageService.getToken();

    final response = await http.get(
        Uri.parse('$apiBaseUrl/oauth/github/callback')
            .replace(queryParameters: {
          'mobile': 'true',
          'code': code,
          if (token != null) 'token': token,
        }),
        headers: {
          'Content-Type': 'application/json',
        });
    if (response.statusCode == 200) {
      // Decode the backend API response.
      final responseData = jsonDecode(response.body);
      if (responseData['success']) {
        // Extract the access token from the response.
        final accessToken = responseData['token'];
        widget.onTokenReceived(accessToken);

        // If the widget is still mounted, close the WebView.
        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        // Handle failure in receiving the token.
        // TODO : Handle failed to login
      }
    } else {
      // Handle HTTP error.
      // TODO : Handle failed to login
    }
  }

  /// Builds the WebView widget for the GitHub OAuth flow.
  ///
  /// Displays a WebView that allows the user to log in to GitHub and authorize
  /// the app. The WebView listens for a navigation request containing an
  /// authorization code.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GitHub OAuth')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
