import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/features/auth/google.dart';
import 'package:area/src/features/auth/microsoft.dart';
import 'package:area/src/features/auth/discord.dart';
import 'package:area/src/features/auth/github.dart';
import 'package:area/src/features/auth/twitch.dart';

class Service {
  final String title;
  final String description;
  final String fullDescription;
  final IconData icon;
  final Color iconColor;
  final Widget Function(Function(String) onTokenReceived) createOAuthWidget;

  const Service({
    required this.title,
    required this.description,
    required this.fullDescription,
    required this.icon,
    required this.iconColor,
    required this.createOAuthWidget,
  });
}

List<Service> defaultServices(BuildContext context) => [
      Service(
        title: AppLocalizations.of(context)!.google,
        description: AppLocalizations.of(context)!.googleDesc,
        fullDescription: AppLocalizations.of(context)!.googleFullDesc,
        icon: FontAwesomeIcons.google,
        iconColor: Colors.red,
        createOAuthWidget: (onTokenReceived) => GoogleOAuthWebView(
          onTokenReceived: onTokenReceived,
        ),
      ),
      Service(
        title: AppLocalizations.of(context)!.microsoft,
        description: AppLocalizations.of(context)!.microsoftDesc,
        fullDescription: AppLocalizations.of(context)!.microsoftFullDesc,
        icon: FontAwesomeIcons.microsoft,
        iconColor: Colors.blue,
        createOAuthWidget: (onTokenReceived) => MicrosoftOAuthWebView(
          onTokenReceived: onTokenReceived,
        ),
      ),
      Service(
        title: AppLocalizations.of(context)!.discord,
        description: AppLocalizations.of(context)!.discordDesc,
        fullDescription: AppLocalizations.of(context)!.discordFullDesc,
        icon: FontAwesomeIcons.discord,
        iconColor: Colors.indigo,
        createOAuthWidget: (onTokenReceived) => DiscordOAuthWebView(
          onTokenReceived: onTokenReceived,
        ),
      ),
      Service(
        title: AppLocalizations.of(context)!.github,
        description: AppLocalizations.of(context)!.githubDesc,
        fullDescription: AppLocalizations.of(context)!.githubFullDesc,
        icon: FontAwesomeIcons.github,
        iconColor: Colors.black,
        createOAuthWidget: (onTokenReceived) => GitHubOAuthWebView(
          onTokenReceived: onTokenReceived,
        ),
      ),
      Service(
        title: AppLocalizations.of(context)!.twitch,
        description: AppLocalizations.of(context)!.twitchDesc,
        fullDescription: AppLocalizations.of(context)!.twitchFullDesc,
        icon: FontAwesomeIcons.twitch,
        iconColor: Colors.purple,
        createOAuthWidget: (onTokenReceived) => TwitchOAuthWebView(
          onTokenReceived: onTokenReceived,
        ),
      ),
    ];
