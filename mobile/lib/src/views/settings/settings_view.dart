import 'package:area/src/widgets/layout/page_title.dart';
import 'package:area/src/widgets/settings/change_lang.dart';
import 'package:area/src/widgets/settings/change_password.dart';
import 'package:area/src/widgets/settings/change_theme.dart';
import 'package:area/src/widgets/settings/notification_preferences.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/views/start/welcome_view.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/widgets/settings/delete_account.dart';

class SettingsView extends StatefulWidget {
  final ThemeMode currentTheme;
  final Function(ThemeMode) onThemeChanged;
  final Locale currentLocale;
  final Function(String) onLanguageChanged;

  const SettingsView({
    super.key,
    required this.currentTheme,
    required this.onThemeChanged,
    required this.currentLocale,
    required this.onLanguageChanged,
  });

  @override
  State<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 0),
                child: PageTitle(title: AppLocalizations.of(context)!.settings),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSettingsSection(
                      AppLocalizations.of(context)!.account,
                      [
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.changePassword,
                          FontAwesomeIcons.lock,
                          () => _showChangePasswordDialog(context),
                        ),
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.notificationPreferences,
                          FontAwesomeIcons.bell,
                          () => _showNotificationPreferencesDialog(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _buildSettingsSection(
                      AppLocalizations.of(context)!.appSettings,
                      [
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.theme,
                          FontAwesomeIcons.moon,
                          () => _showThemeChangeDialog(context),
                        ),
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.language,
                          FontAwesomeIcons.language,
                          () => _showLanguageDialog(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _buildSettingsSection(
                      AppLocalizations.of(context)!.support,
                      [
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.helpCenter,
                          FontAwesomeIcons.circleQuestion,
                          _openHelpCenter,
                        ),
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.contactUs,
                          FontAwesomeIcons.envelope,
                          _openContactUs,
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _buildSettingsSection(
                      AppLocalizations.of(context)!.accountActions,
                      [
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.deleteAccount,
                          FontAwesomeIcons.userXmark,
                          () => _showDeleteAccountDialog(context),
                        ),
                        _buildSettingsItem(
                          AppLocalizations.of(context)!.logout,
                          FontAwesomeIcons.rightFromBracket,
                          () => _handleLogout(context),
                          color: Colors.red,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSettingsSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.getSecondaryTextColor(context),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          color: AppTheme.getCardColor(context),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: items,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsItem(String title, IconData icon, VoidCallback onTap,
      {Color? color}) {
    return ListTile(
      leading: FaIcon(icon,
          color: color ?? AppTheme.getSecondaryTextColor(context), size: 22),
      title: Text(
        title,
        style: TextStyle(
            color: color ?? AppTheme.getTextColor(context), fontSize: 16),
      ),
      trailing: FaIcon(FontAwesomeIcons.chevronRight,
          color: color ?? AppTheme.getSecondaryTextColor(context), size: 16),
      onTap: onTap,
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ChangePasswordView()),
    );
  }

  void _showNotificationPreferencesDialog(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => const NotificationPreferencesView()),
    );
  }

  // Navigate to Theme Change screen
  void _showThemeChangeDialog(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ThemeChangeView(
          currentTheme: widget.currentTheme,
          onThemeChanged: (ThemeMode newTheme) {
            widget.onThemeChanged(newTheme);
          },
        ),
      ),
    );
  }

  void _showLanguageDialog(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LanguageChangeView(
          currentLanguage: widget.currentLocale.languageCode,
          onLanguageChanged: widget.onLanguageChanged,
        ),
      ),
    );
  }

  Future<void> _openHelpCenter() async {
    final Uri url = Uri.parse('https://rooters-area.com/faq');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      _showErrorMessage('Could not open the help center page');
    }
  }

  Future<void> _openContactUs() async {
    final Uri url = Uri.parse('https://rooters-area.com/about/contact');
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      _showErrorMessage('Could not open the contact page');
    }
  }

  void _showErrorMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.getCardColor(context),
      ),
    );
  }

  Future<void> _handleLogout(BuildContext context) async {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => const WelcomeView(),
      ),
    );

    final storageService = StorageService();
    await storageService.logout();
  }

  void _showDeleteAccountDialog(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const DeleteAccountView(),
      ),
    );
  }
}
