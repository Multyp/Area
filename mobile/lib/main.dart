import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:area/app.dart';

/// Entry point of the Area application.
///
/// This function initializes essential services and configurations before launching the app:
///
/// * Ensures Flutter bindings are initialized
/// * Loads environment variables from .env file
/// * Retrieves stored user credentials via [StorageService]
/// * Loads saved theme and language preferences from [SharedPreferences]
/// * Creates and runs the root [MyApp] widget with the loaded configurations
///
/// The app starts with either saved preferences or defaults to:
/// * System theme mode if no theme preference is saved
/// * English language if no language preference is saved
///
/// This setup ensures a consistent user experience across app launches by preserving
/// user preferences and authentication state.
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');

  final storageService = StorageService();
  final credentials = await storageService.getCredentials();

  final prefs = await SharedPreferences.getInstance();
  final savedThemeMode = prefs.getString('themeMode') ?? 'system';
  final savedLanguage = prefs.getString('languageCode') ?? 'en';

  runApp(MyApp(
    credentials: credentials,
    initialThemeMode: ThemeMode.values.firstWhere(
      (e) => e.toString() == 'ThemeMode.$savedThemeMode',
      orElse: () => ThemeMode.system,
    ),
    initialLocale: Locale(savedLanguage),
  ));
}
