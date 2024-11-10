---
title: "Locales system"
---

# Flutter Localization Documentation

## Overview
The application implements a robust internationalization (i18n) system using Flutter's built-in localization features. Currently, the app supports English (en) and French (fr) languages, with the infrastructure in place to easily add more languages.

## Implementation Structure

### 1. Locale Configuration
The app's localization is primarily configured in the main application file:

```dart title="lib/main.dart"
  @override
  Widget build(BuildContext context) {
    // Build the MaterialApp with localized support and theme management
    return MaterialApp(
      title: 'Area',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light, // Light theme
      ),
      darkTheme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.dark, // Dark theme
      ),
      themeMode: _themeMode, // Set theme mode
      locale: _locale, // Set locale
      supportedLocales: const [
        Locale('en', 'US'), // English
        Locale('fr', 'FR'), // French
        // Add more locales as needed in the future
      ],
      localizationsDelegates: const [
        AppLocalizations.delegate, // Add this line
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      localeResolutionCallback: (locale, supportedLocales) {
        // Resolve the appropriate locale
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },
      initialRoute: widget.credentials['email'] != null
```


### 2. Localization Files
The app uses ARB (Application Resource Bundle) files to store translations:

- **English Translations**: `app_en.arb`
- **French Translations**: `app_fr.arb`

These files follow a structured format:
```json title="app_en.arb"
{
  "@@locale": "en",
  "key": "Translation text",
  "@key": {
    "description": "Description for translators"
  }
}
```

### 3. Generated Localizations
Flutter automatically generates the `AppLocalizations` class from the ARB files. To access translations in the code:

```dart
AppLocalizations.of(context)!.someTranslationKey
```

## Usage Examples

### 1. Text Widgets
```dart title="lib/main.dart"
Text(
  AppLocalizations.of(context)!.welcomeTo,
  style: TextStyle(fontSize: 28),
)
```

### 2. Dynamic Language Switching
The app supports runtime language switching through the settings menu:

```dart title="lib/src/views/settings/change_lang.dart"
  Widget _buildLanguageCard({
    required String title,
    required String subtitle,
    required String languageCode,
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
            _selectedLanguage = languageCode;
          });
          widget.onLanguageChanged(languageCode);
        },
      ),
    );
  }
```


## Language Selection Flow

1. **Default Language**
   - The app defaults to English ('en') if no language preference is stored
   - User's language preference is persisted using SharedPreferences

2. **Language Change Process**
   ```dart title="lib/src/views/settings/change_lang.dart"
   void _changeLanguage(String languageCode) async {
     setState(() {
       _locale = Locale(languageCode);
     });
     final prefs = await SharedPreferences.getInstance();
     await prefs.setString('languageCode', languageCode);
   }
   ```

3. **Supported Locales**
   The app currently supports:
   - English (en_US)
   - French (fr_FR)

## Adding New Languages

To add a new language:

1. Create a new ARB file: `app_<language_code>.arb`
2. Add translations for all existing keys
3. Update the supported locales list:
```dart title="lib/main.dart"
supportedLocales: const [
  Locale('en', 'US'),
  Locale('fr', 'FR'),
  Locale('new_lang', 'COUNTRY_CODE'),
]
```

## Locale Resolution

The app includes a locale resolution callback that determines which locale to use:

```dart title="lib/main.dart"
      localeResolutionCallback: (locale, supportedLocales) {
        // Resolve the appropriate locale
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },
```


## Best Practices

1. **Key Organization**
   - Use descriptive keys that reflect the content
   - Group related translations together
   - Include descriptions for translators

2. **Context Awareness**
   - Always provide context in the description field
   - Consider text length variations across languages

3. **Placeholder Usage**
   For dynamic content, use placeholders:
```json title="app_en.arb"
{
  "loginFailed": "Login failed: {error}",
  "@loginFailed": {
    "description": "Login error message",
    "placeholders": {
      "error": {
        "type": "String"
      }
    }
  }
}
```

## Error Handling

The localization system includes fallback mechanisms:
- If a translation is missing, it falls back to English
- If the requested locale isn't supported, it uses the first supported locale

## Testing Considerations

When testing localization:
1. Verify all strings are externalized
2. Test text rendering in different languages
3. Check for proper fallback behavior
4. Verify dynamic language switching
5. Test text overflow and layout issues

This implementation provides a scalable and maintainable approach to managing multiple languages in the application, with room for future expansion and improvements.
