import 'package:area/src/views/area/area_view.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/views/profile/profile_view.dart';
import 'package:area/src/views/settings/settings_view.dart';
import 'package:area/src/widgets/layout/bottom_bar.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class HomePage extends StatefulWidget {
  final Function(ThemeMode) onThemeChanged;
  final ThemeMode currentTheme;
  final Function(String) onLanguageChanged;
  final Locale currentLocale;

  const HomePage({
    super.key,
    required this.onThemeChanged,
    required this.currentTheme,
    required this.onLanguageChanged,
    required this.currentLocale,
  });

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      body: _buildContent(),
      bottomNavigationBar: CustomBottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildContent() {
    switch (_currentIndex) {
      case 0:
        return _buildHomeContent();
      case 1:
        return _buildAreaContent();
      case 2:
        return _buildProfileContent();
      case 3:
        return _buildSettingsContent();
      default:
        return _buildHomeContent();
    }
  }

  Widget _buildHomeContent() {
    return Stack(
      fit: StackFit.expand,
      children: [
        SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  const SizedBox(height: 20),
                  Center(
                    child: SvgPicture.asset(
                      'assets/images/logo.svg',
                      height: 100,
                      width: 100,
                      color: AppTheme.getPrimaryColor(context),
                    ),
                  ),
                  const SizedBox(height: 40),
                  Center(
                    child: Column(
                      children: [
                        Text(
                          AppLocalizations.of(context)!.welcomeTo,
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w300,
                            color: AppTheme.getTextColor(context),
                          ),
                        ),
                        Text(
                          'AREA',
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.getTextColor(context),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  _buildFeatureCard(
                    context,
                    AppLocalizations.of(context)!.connectServices,
                    AppLocalizations.of(context)!.connectServicesDesc,
                    FontAwesomeIcons.plugCirclePlus,
                  ),
                  const SizedBox(height: 16),
                  _buildFeatureCard(
                    context,
                    AppLocalizations.of(context)!.createAutomations,
                    AppLocalizations.of(context)!.createAutomationsDesc,
                    FontAwesomeIcons.wandMagicSparkles,
                  ),
                  const SizedBox(height: 16),
                  _buildFeatureCard(
                    context,
                    AppLocalizations.of(context)!.monitorActivity,
                    AppLocalizations.of(context)!.monitorActivityDesc,
                    FontAwesomeIcons.chartLine,
                  ),
                  const SizedBox(height: 24),
                  _buildGetStartedSection(context),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureCard(
      BuildContext context, String title, String description, IconData icon) {
    return Card(
      color: AppTheme.getCardColor(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.getPrimaryColor(context).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: FaIcon(
                    icon,
                    color: AppTheme.getPrimaryColor(context),
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.getTextColor(context),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              description,
              style: TextStyle(
                fontSize: 16,
                color: AppTheme.getSecondaryTextColor(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGetStartedSection(BuildContext context) {
    return Card(
      color: AppTheme.getPrimaryColor(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              AppLocalizations.of(context)!.readyToGetStarted,
              style: GoogleFonts.poppins(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              AppLocalizations.of(context)!.readyToGetStartedDesc,
              style: GoogleFonts.poppins(
                fontSize: 16,
                color: Colors.white.withOpacity(0.9),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _currentIndex = 1;
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: AppTheme.getPrimaryColor(context),
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    AppLocalizations.of(context)!.discoverMore,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const FaIcon(
                    FontAwesomeIcons.arrowRight,
                    size: 16,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAreaContent() {
    return const AreaContent();
  }

  Widget _buildProfileContent() {
    return const ProfileView();
  }

  Widget _buildSettingsContent() {
    return SettingsView(
      currentTheme: widget.currentTheme,
      onThemeChanged: widget.onThemeChanged,
      currentLocale: widget.currentLocale,
      onLanguageChanged: widget.onLanguageChanged,
    );
  }
}
