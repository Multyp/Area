import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class NotificationPreferencesView extends StatelessWidget {
  const NotificationPreferencesView({super.key});

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final secondaryTextColor = AppTheme.getSecondaryTextColor(context);
    final returnButtonColor = AppTheme.getReturnButtonColor(context);

    return ThemedScaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: FaIcon(FontAwesomeIcons.arrowLeft, color: textColor),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Notification Preferences',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 24),
              Card(
                color: cardColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      FaIcon(
                        FontAwesomeIcons.bell,
                        size: 48,
                        color: secondaryTextColor,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Feature Not Available',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        AppLocalizations.of(context)!.featureNotAvailableDesc,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: secondaryTextColor,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: returnButtonColor,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                        child: Text(
                          AppLocalizations.of(context)!.returnToSettings,
                          style: const TextStyle(fontSize: 18),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
