import 'package:area/app_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// The main application widget.
///
/// This widget manages the application's state, including theme and locale changes,
/// system UI appearance, and sets up the routing for the app. It handles both light
/// and dark themes, multiple languages, and maintains user preferences across sessions.
class MyApp extends StatefulWidget {
  final Map<String, String?> credentials; // User credentials
  final ThemeMode initialThemeMode; // Initial theme mode
  final Locale initialLocale; // Initial locale

  const MyApp({
    super.key,
    required this.credentials,
    required this.initialThemeMode,
    required this.initialLocale,
  });

  @override
  MyAppState createState() => MyAppState();
}

/// The state for [MyApp].
///
/// Manages the application's theme and locale state, handles system UI updates,
/// and persists user preferences. It provides methods to change the theme and
/// language settings while maintaining consistency across the entire application.
class MyAppState extends State<MyApp> {
  late ThemeMode _themeMode; // Current theme mode
  late Locale _locale; // Current locale

  @override
  void initState() {
    super.initState();
    _themeMode = widget.initialThemeMode; // Initialize theme mode
    _locale = widget.initialLocale; // Initialize locale
    _updateSystemUI(); // Initialize system UI appearance
  }

  /// Updates the system UI elements to match the current theme.
  ///
  /// This method adjusts the status bar and navigation bar appearance
  /// based on the current theme mode and system brightness settings.
  void _updateSystemUI() {
    final isDark = _themeMode == ThemeMode.dark ||
        (_themeMode == ThemeMode.system &&
            View.of(context).platformDispatcher.platformBrightness ==
                Brightness.dark);

    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
      systemNavigationBarColor: isDark ? Colors.black : Colors.white,
      systemNavigationBarIconBrightness:
          isDark ? Brightness.light : Brightness.dark,
    ));
  }

  /// Changes the application theme and saves the setting in shared preferences.
  ///
  /// Updates both the app theme and system UI appearance, then persists the
  /// selection to device storage for future app launches.
  void _changeTheme(ThemeMode themeMode) async {
    setState(() {
      _themeMode = themeMode; // Update theme mode
    });
    _updateSystemUI();

    // Save the selected theme mode in shared preferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('themeMode', themeMode.toString().split('.').last);
  }

  /// Changes the application language and saves the setting in shared preferences.
  ///
  /// Updates the app locale and persists the selection to device storage
  /// for future app launches.
  void _changeLanguage(String languageCode) async {
    setState(() {
      _locale = Locale(languageCode); // Update locale
    });

    // Save the selected language code in shared preferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('languageCode', languageCode);
  }

  @override
  Widget build(BuildContext context) {
    return AppWidget(
      themeMode: _themeMode,
      locale: _locale,
      credentials: widget.credentials,
      onThemeChanged: _changeTheme,
      onLanguageChanged: _changeLanguage,
    );
  }
}
