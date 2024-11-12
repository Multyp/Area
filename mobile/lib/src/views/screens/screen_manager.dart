import 'package:area/src/views/screens/home/home.dart';
import 'package:flutter/material.dart';
import 'package:area/src/views/screens/area/area_view.dart';
import 'package:area/src/views/screens/profile/profile_view.dart';
import 'package:area/src/views/screens/settings/settings_view.dart';
import 'package:area/src/widgets/layout/bottom_bar.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';

class ScreenManager extends StatefulWidget {
  final Function(ThemeMode) onThemeChanged;
  final ThemeMode currentTheme;
  final Function(String) onLanguageChanged;
  final Locale currentLocale;

  const ScreenManager({
    super.key,
    required this.onThemeChanged,
    required this.currentTheme,
    required this.onLanguageChanged,
    required this.currentLocale,
  });

  @override
  ScreenManagerState createState() => ScreenManagerState();
}

class ScreenManagerState extends State<ScreenManager> {
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
        return HomePage(
          onThemeChanged: widget.onThemeChanged,
          currentTheme: widget.currentTheme,
          onLanguageChanged: widget.onLanguageChanged,
          currentLocale: widget.currentLocale,
        );
      case 1:
        return const AreaContent();
      case 2:
        return const ProfileView();
      case 3:
        return SettingsView(
          currentTheme: widget.currentTheme,
          onThemeChanged: widget.onThemeChanged,
          currentLocale: widget.currentLocale,
          onLanguageChanged: widget.onLanguageChanged,
        );
      default:
        return HomePage(
          onThemeChanged: widget.onThemeChanged,
          currentTheme: widget.currentTheme,
          onLanguageChanged: widget.onLanguageChanged,
          currentLocale: widget.currentLocale,
        );
    }
  }
}
