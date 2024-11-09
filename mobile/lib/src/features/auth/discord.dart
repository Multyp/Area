import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:webview_flutter/webview_flutter.dart';

/// A Flutter widget that handles Discord OAuth authorization.
///
/// This widget opens a WebView that allows the user to log in to their Discord
/// account and authorize the app. Once the authorization is complete and an
/// authorization code is obtained, the widget sends the code to the backend to
/// exchange it for an access token.
///
/// The access token is then passed back to the parent widget via the
/// `onTokenReceived` callback.
class DiscordOAuthWebView extends StatefulWidget {
  /// A callback function triggered when the OAuth flow completes and an
  /// access token is received.
  final Function(String) onTokenReceived;

  const DiscordOAuthWebView({super.key, required this.onTokenReceived});

  @override
  DiscordOAuthWebViewState createState() => DiscordOAuthWebViewState();
}

/// The state class for the [DiscordOAuthWebView] widget.
///
/// This class handles the WebView controller and the OAuth flow logic, including
/// navigating to the Discord authorization page and managing the token exchange process.
class DiscordOAuthWebViewState extends State<DiscordOAuthWebView> {
  /// Controller for the WebView, used to manage the web page displayed in the widget.
  late final WebViewController _controller;
  final storageService = StorageService();

  /// The Discord OAuth2 client ID associated with your application.
  final String? clientId = dotenv.env['DISCORD_CLIENT_ID'];

  @override
  void initState() {
    super.initState();

    // Generate the Discord OAuth2 authorization URL.
    final authorizationUrl = getAuthorizationUrl();

    // Initialize the WebView controller and set up navigation behavior.
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            // Detect if the navigation URL contains an authorization code.
            if (request.url.contains('code=')) {
              final uri = Uri.parse(request.url);
              final code = uri.queryParameters['code'];
              if (code != null) {
                // If a code is found, exchange it for an access token.
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

  /// Constructs the Discord OAuth2 authorization URL with required parameters.
  ///
  /// This URL will be loaded in the WebView to prompt the user to log in and
  /// authorize the app.
  ///
  /// The URL contains query parameters like `client_id`, `response_type`, `scope`,
  /// and permissions needed by the bot.
  ///
  /// Returns a full URL string to be used in the WebView.
  String getAuthorizationUrl() {
    const baseUrl = 'https://discord.com/oauth2/authorize';
    final queryParams = {
      'response_type': 'code',
      'client_id': clientId,
      'scope': 'identify guilds bot',
      'bot': 'true',
      'guild_select': 'true',
      'permissions': '2048',
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
  }

  /// Exchanges the authorization code for an access token.
  ///
  /// This method sends a GET request to the backend API to exchange the
  /// authorization code obtained from Discord for an access token.
  ///
  /// The backend is expected to handle the Discord OAuth token exchange process
  /// and respond with a JWT token or an error message.
  ///
  /// [code] The authorization code received from Discord.
  Future<void> exchangeCodeForToken(String code) async {
    final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
    String? token = await storageService.getToken();

    final response = await http.get(
      Uri.parse('$apiBaseUrl/oauth/discord/callback?mobile=true&code=$code')
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

      // Check if the token exchange was successful.
      if (responseData['success']) {
        final accessToken = responseData['token'];

        // Pass the received token back to the parent widget via the callback.
        widget.onTokenReceived(accessToken);

        // Close the WebView and return to the previous screen.
        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        // Handle the error response from the backend, if token exchange fails.
        // TODO : handle fail
      }
    } else {
      // Log the HTTP error status for debugging purposes.
      // TODO : handle fail
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Discord OAuth'),
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
