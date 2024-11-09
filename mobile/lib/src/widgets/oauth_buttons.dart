import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/features/auth/microsoft.dart';
import 'package:area/src/features/auth/google.dart';
import 'package:area/src/features/auth/github.dart';
import 'package:area/src/features/auth/discord.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

/// A widget that displays OAuth login buttons for various services.
///
/// This widget provides buttons for users to log in with Microsoft, Google,
/// GitHub, and Discord. Each button triggers navigation to the respective
/// OAuth login web view, and the received token is passed back to the parent
/// widget through the [onTokenReceived] callback.
class OAuthButtons extends StatelessWidget {
  /// Callback function that is called when a token is received from OAuth.
  ///
  /// The [onTokenReceived] function receives the token string as a parameter.
  final Function(String) onTokenReceived;

  /// Creates an [OAuthButtons] widget.
  ///
  /// The [onTokenReceived] parameter must not be null and is used to handle
  /// the token received after successful login through the OAuth process.
  const OAuthButtons({super.key, required this.onTokenReceived});

  /// Builds a login button with the specified icon, text, color, and onPressed callback.
  ///
  /// This method creates a styled [ElevatedButton] with an icon and label.
  /// The [icon] is displayed on the button, [text] is the button label,
  /// [color] sets the button's color, and [onPressed] is the callback invoked
  /// when the button is pressed.
  Widget _buildLoginButton(
      IconData icon, String text, Color color, VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: SizedBox(
        width: double.infinity,
        height: 60,
        child: ElevatedButton.icon(
          icon: FaIcon(icon, color: Colors.black),
          label: Text(
            text,
            style: GoogleFonts.poppins(
              color: Colors.black,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            backgroundColor: Colors.white,
          ),
          onPressed: onPressed,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    /// Builds the widget tree for the OAuth buttons.
    ///
    /// This method creates a vertical column of login buttons for Microsoft,
    /// Google, GitHub, and Discord. Each button is configured to navigate to
    /// the corresponding OAuth login view when pressed.
    return Column(
      children: [
        _buildLoginButton(
          FontAwesomeIcons.microsoft,
          AppLocalizations.of(context)!.loginWithMicrosoft,
          Colors.blue,
          () => _navigateToOAuth(
              context, MicrosoftOAuthWebView(onTokenReceived: onTokenReceived)),
        ),
        _buildLoginButton(
          FontAwesomeIcons.google,
          AppLocalizations.of(context)!.loginWithGoogle,
          Colors.blue,
          () => _navigateToOAuth(
              context, GoogleOAuthWebView(onTokenReceived: onTokenReceived)),
        ),
        _buildLoginButton(
          FontAwesomeIcons.github,
          AppLocalizations.of(context)!.loginWithGitHub,
          Colors.black87,
          () => _navigateToOAuth(
              context, GitHubOAuthWebView(onTokenReceived: onTokenReceived)),
        ),
        _buildLoginButton(
          FontAwesomeIcons.discord,
          AppLocalizations.of(context)!.loginWithDiscord,
          const Color(0xFF7289DA),
          () => _navigateToOAuth(
              context, DiscordOAuthWebView(onTokenReceived: onTokenReceived)),
        ),
      ],
    );
  }

  /// Navigates to the specified OAuth login widget.
  ///
  /// This method takes a [context] and the [oauthWidget] to navigate to.
  /// It pushes a new route onto the navigator stack with the provided
  /// OAuth widget.
  void _navigateToOAuth(BuildContext context, Widget oauthWidget) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => oauthWidget,
      ),
    );
  }
}
