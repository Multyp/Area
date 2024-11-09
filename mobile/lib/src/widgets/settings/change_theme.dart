import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ThemeChangeView extends StatefulWidget {
  final ThemeMode currentTheme;
  final Function(ThemeMode) onThemeChanged;

  const ThemeChangeView({
    super.key,
    required this.currentTheme,
    required this.onThemeChanged,
  });

  @override
  State<ThemeChangeView> createState() => _ThemeChangeViewState();
}

class _ThemeChangeViewState extends State<ThemeChangeView> {
  late ThemeMode _selectedTheme;

  @override
  void initState() {
    super.initState();
    _selectedTheme = widget.currentTheme;
  }

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final secondaryTextColor = AppTheme.getSecondaryTextColor(context);

    return ThemedScaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.theme,
            style: TextStyle(color: textColor)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: textColor),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppLocalizations.of(context)!.chooseTheme,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 24),
                _buildThemeCard(
                  title: AppLocalizations.of(context)!.lightTheme,
                  subtitle: AppLocalizations.of(context)!.lightThemeDesc,
                  themeMode: ThemeMode.light,
                  icon: FontAwesomeIcons.sun,
                  cardColor: cardColor,
                  textColor: textColor,
                  secondaryTextColor: secondaryTextColor,
                ),
                const SizedBox(height: 16),
                _buildThemeCard(
                  title: AppLocalizations.of(context)!.darkTheme,
                  subtitle: AppLocalizations.of(context)!.darkThemeDesc,
                  themeMode: ThemeMode.dark,
                  icon: FontAwesomeIcons.moon,
                  cardColor: cardColor,
                  textColor: textColor,
                  secondaryTextColor: secondaryTextColor,
                ),
                const SizedBox(height: 16),
                _buildThemeCard(
                  title: AppLocalizations.of(context)!.systemTheme,
                  subtitle: AppLocalizations.of(context)!.systemThemeDesc,
                  themeMode: ThemeMode.system,
                  icon: FontAwesomeIcons.laptop,
                  cardColor: cardColor,
                  textColor: textColor,
                  secondaryTextColor: secondaryTextColor,
                ),
                const SizedBox(height: 24),
                Text(
                  AppLocalizations.of(context)!.themeDesc,
                  style: TextStyle(
                    fontSize: 14,
                    color: secondaryTextColor,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildThemeCard({
    required String title,
    required String subtitle,
    required ThemeMode themeMode,
    required IconData icon,
    required Color cardColor,
    required Color textColor,
    required Color secondaryTextColor,
  }) {
    return Card(
      color: cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          setState(() {
            _selectedTheme = themeMode;
          });
          widget.onThemeChanged(themeMode);
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              FaIcon(icon, color: secondaryTextColor, size: 24),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(color: textColor, fontSize: 18),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(color: secondaryTextColor, fontSize: 14),
                    ),
                  ],
                ),
              ),
              Radio<ThemeMode>(
                value: themeMode,
                groupValue: _selectedTheme,
                onChanged: (ThemeMode? value) {
                  if (value != null) {
                    setState(() {
                      _selectedTheme = value;
                    });
                    widget.onThemeChanged(value);
                  }
                },
                activeColor: Theme.of(context).colorScheme.secondary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
