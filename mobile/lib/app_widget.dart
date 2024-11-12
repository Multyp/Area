import 'package:area/src/views/screens/screen_manager.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/views/start/languages_selection_view.dart';
import 'package:area/src/views/start/welcome_view.dart';

/// A stateless widget that serves as the root widget for the Area application.
///
/// This widget handles the application's theme configuration, localization settings,
/// and routing logic. It takes several required parameters to manage the app's state:
///
/// * [themeMode] - Controls the current theme mode (light, dark, or system)
/// * [locale] - Determines the current language/locale setting
/// * [credentials] - Contains user authentication information
/// * [onThemeChanged] - Callback function to handle theme changes
/// * [onLanguageChanged] - Callback function to handle language changes
///
/// The widget configures both light and dark themes with consistent styling,
/// supports multiple languages (English and French), and manages navigation
/// between different views based on the user's authentication status.
class AppWidget extends StatelessWidget {
  final ThemeMode themeMode;
  final Locale locale;
  final Map<String, String?> credentials;
  final Function(ThemeMode) onThemeChanged;
  final Function(String) onLanguageChanged;

  /// Creates an instance of [AppWidget].
  ///
  /// All parameters are required to properly initialize the application:
  /// * [themeMode] - The current theme mode setting
  /// * [locale] - The current locale setting
  /// * [credentials] - User authentication credentials
  /// * [onThemeChanged] - Callback for theme changes
  /// * [onLanguageChanged] - Callback for language changes
  const AppWidget({
    super.key,
    required this.themeMode,
    required this.locale,
    required this.credentials,
    required this.onThemeChanged,
    required this.onLanguageChanged,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Area',

      /// Light theme configuration with white background and blue accents
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        appBarTheme: const AppBarTheme(
          systemOverlayStyle: SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: Brightness.dark,
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          iconTheme: IconThemeData(color: Colors.black),
          titleTextStyle: TextStyle(
            color: Colors.black,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        navigationBarTheme: const NavigationBarThemeData(
          backgroundColor: Colors.white,
          indicatorColor: Colors.blue,
        ),
      ),

      /// Dark theme configuration with black background and blue accents
      darkTheme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.dark,
        appBarTheme: const AppBarTheme(
          systemOverlayStyle: SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: Brightness.light,
          ),
          backgroundColor: Colors.black,
          elevation: 0,
          iconTheme: IconThemeData(color: Colors.white),
          titleTextStyle: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        navigationBarTheme: const NavigationBarThemeData(
          backgroundColor: Colors.black,
          indicatorColor: Colors.blue,
        ),
      ),
      themeMode: themeMode,
      locale: locale,

      /// Supported locales for the application (English and French)
      supportedLocales: const [
        Locale('en', 'US'),
        Locale('fr', 'FR'),
      ],

      /// Delegates for handling localization in the app
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],

      /// Callback to resolve which locale to use based on device settings
      localeResolutionCallback: (locale, supportedLocales) {
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },

      /// Initial route based on authentication status
      initialRoute: credentials['email'] != null ? '/home' : '/language',

      /// Application routes configuration
      routes: {
        '/language': (context) => LanguageSelectionView(
              onLanguageChanged: onLanguageChanged,
            ),
        'com.area:/': (context) => const WelcomeView(),
        '/home': (context) => ScreenManager(
              onThemeChanged: onThemeChanged,
              currentTheme: themeMode,
              onLanguageChanged: onLanguageChanged,
              currentLocale: locale,
            ),
      },
    );
  }
}
