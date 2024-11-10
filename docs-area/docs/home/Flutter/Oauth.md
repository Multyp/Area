# OAuth System

## Overview

This document provides an overview of the OAuth system implemented in the Flutter mobile app, which includes authentication via GitHub, Microsoft, and Discord. This system allows users to log in securely using their existing accounts from these platforms.

### Features

- **Multiple OAuth Providers**: Support for GitHub, Microsoft, and Discord.
- **Secure Token Exchange**: Authorization codes are exchanged for access tokens securely.
- **User-Friendly UI**: Clean and responsive login interface with animations.

## Architecture

The OAuth system consists of the following components:

1. **Login View**: The main interface for user authentication.
2. **OAuth WebViews**: Separate views for handling OAuth login flows for each provider.
3. **Storage Service**: Manages local storage of user credentials and tokens.

## Installation

To use the OAuth system, ensure you have the required dependencies in your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.3
  webview_flutter: ^3.0.4
  font_awesome_flutter: ^10.2.0
  google_fonts: ^2.1.0
```

## Implementation Details

### 1. Login View

The `LoginView` is responsible for rendering the login interface, including fields for email and password as well as buttons for OAuth login.

```dart
class LoginView extends StatefulWidget {
  static const routeName = '/login';

  const LoginView({super.key});

  @override
  LoginViewState createState() => LoginViewState();
}
```

#### Key Methods

- **_login**: Validates the form, saves credentials, and navigates to the next screen.
- **_buildLoginButton**: Creates a styled button for different login methods.

### 2. OAuth WebViews

Each provider has its own WebView implementation. Below is an example for Discord.

#### Discord OAuth WebView

```dart
class DiscordOAuthWebView extends StatefulWidget {
  final Function(String) onTokenReceived;

  const DiscordOAuthWebView({super.key, required this.onTokenReceived});
}
```

**Initialization Logic**:

- Constructs the authorization URL with necessary query parameters.
- Uses `WebViewController` to handle user navigation and capture the authorization code.

```dart
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
```

### Key Methods

- **getAuthorizationUrl**: Constructs the OAuth URL needed for user authorization.

```dart title="discord.dart"
String getAuthorizationUrl() {
    const baseUrl = 'https://discord.com/oauth2/authorize';
    final queryParams = {
      'response_type': 'code', // Indicates that the response will include an authorization code
      'client_id': clientId, // Your application's client ID
      'scope': 'identify guilds bot', // Permissions required
      'bot': 'true', // Indicating the application is a bot
      'guild_select': 'true', // Optionally select a guild
      'permissions': '2048', // Required permissions for the bot
    };
    return Uri.parse(baseUrl).replace(queryParameters: queryParams).toString();
}
```

- **exchangeCodeForToken**: Sends the authorization code to the backend to obtain an access token.

```dart title="discord.dart"
Future<void> exchangeCodeForToken(String code) async {
    final response = await http.get(
      Uri.parse(
          'https://rooters-area.com/api/oauth/discord/callback?mobile=true&code=$code'),
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
        print('Got access token: $accessToken');

        // Close the WebView and return to the previous screen.
        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        // Handle the error response from the backend, if token exchange fails.
        print('Failed to get access token: ${responseData['message']}');
      }
    } else {
      // Log the HTTP error status for debugging purposes.
      print('Failed to get access token: ${response.statusCode}');
    }
}
```

### 3. Storage Service

The `StorageService` class manages the secure storage of user credentials and tokens. This allows the app to retain user sessions and improve user experience.

```dart
class StorageService {
  Future<void> saveCredentials(String email, String password) async {
    // Save credentials securely (implementation needed)
  }
}
```

## Security Considerations

- Ensure that all OAuth communication happens over HTTPS.
- Store sensitive information, like tokens, securely using Flutter's secure storage mechanisms.
- Regularly update dependencies to mitigate security vulnerabilities.

## Usage Example

To integrate the login view, use the following code in your main app file:

```dart
void main() {
  runApp(MaterialApp(
    title: 'OAuth Demo',
    home: LoginView(),
  ));
}
```

## Conclusion

This OAuth system provides a flexible and secure way for users to log in to your Flutter mobile app using existing accounts from GitHub, Microsoft, and Discord. By leveraging the `WebView` component and maintaining a clean architecture, the app ensures a seamless user experience while adhering to best practices in security.