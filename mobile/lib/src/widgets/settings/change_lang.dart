import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class LanguageChangeView extends StatefulWidget {
  final String currentLanguage;
  final Function(String) onLanguageChanged;

  const LanguageChangeView({
    super.key,
    required this.currentLanguage,
    required this.onLanguageChanged,
  });

  @override
  State<LanguageChangeView> createState() => _LanguageChangeViewState();
}

class _LanguageChangeViewState extends State<LanguageChangeView> {
  late String _selectedLanguage;

  @override
  void initState() {
    super.initState();
    _selectedLanguage = widget.currentLanguage;
  }

  Widget _buildFlagIcon(String countryCode, Color color) {
    return Container(
      width: 30,
      height: 30,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: SvgPicture.asset(
        'assets/icon/lang/$countryCode.svg',
        fit: BoxFit.cover,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final secondaryTextColor = AppTheme.getSecondaryTextColor(context);

    return ThemedScaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.language,
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
                  AppLocalizations.of(context)!.chooseLanguage,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 24),
                _buildLanguageCard(
                  title: AppLocalizations.of(context)!.english,
                  subtitle: AppLocalizations.of(context)!.defaultLanguage,
                  languageCode: 'en',
                  cardColor: cardColor,
                  textColor: textColor,
                  secondaryTextColor: secondaryTextColor,
                ),
                const SizedBox(height: 16),
                _buildLanguageCard(
                  title: AppLocalizations.of(context)!.french,
                  subtitle: AppLocalizations.of(context)!.frenchLanguage,
                  languageCode: 'fr',
                  cardColor: cardColor,
                  textColor: textColor,
                  secondaryTextColor: secondaryTextColor,
                ),
                const SizedBox(height: 24),
                Text(
                  AppLocalizations.of(context)!.languageDescription,
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

  Widget _buildLanguageCard({
    required String title,
    required String subtitle,
    required String languageCode,
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
            _selectedLanguage = languageCode;
          });
          widget.onLanguageChanged(languageCode);
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              _buildFlagIcon(languageCode, secondaryTextColor),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: textColor,
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(color: secondaryTextColor, fontSize: 14),
                    ),
                  ],
                ),
              ),
              Radio<String>(
                value: languageCode,
                groupValue: _selectedLanguage,
                onChanged: (String? value) {
                  if (value != null) {
                    setState(() {
                      _selectedLanguage = value;
                    });
                    widget.onLanguageChanged(value);
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
