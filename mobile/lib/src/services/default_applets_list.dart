import 'package:area/src/features/applets/enable_applet.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

typedef AppletConfigMethod = Future<void> Function(BuildContext context);

class Applet {
  final String title;
  final String description;
  final IconData icon;
  final Color iconColor;
  final AppletConfigMethod configureMethod;

  Applet({
    required this.title,
    required this.description,
    required this.icon,
    required this.iconColor,
    required this.configureMethod,
  });
}

List<Applet> getDefaultApplets(BuildContext context) => [
      Applet(
        title: AppLocalizations.of(context)!.gmailToDiscordNotification,
        description:
            AppLocalizations.of(context)!.gmailToDiscordNotificationDesc,
        icon: FontAwesomeIcons.envelope,
        iconColor: Colors.red,
        configureMethod: (context) async {
          await Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => const EnableAppletView(),
            ),
          );
        },
      ),
    ];
