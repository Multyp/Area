import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: const AppBarTheme(
      color: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.black),
      titleTextStyle: TextStyle(
          color: Colors.black, fontSize: 20, fontWeight: FontWeight.bold),
    ),
    cardTheme: CardTheme(
      color: Colors.grey[200],
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(color: Colors.black),
      bodyMedium: TextStyle(color: Colors.black87),
    ),
    iconTheme: const IconThemeData(color: Colors.black54),
    colorScheme: ColorScheme.light(
      secondary: Colors.blue[700]!,
    ),
    extensions: const [
      AppColors(returnButtonColor: Colors.blue),
    ],
  );

  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor: Colors.black.withOpacity(0.6),
    appBarTheme: const AppBarTheme(
      color: Colors.transparent,
      elevation: 0,
      iconTheme: IconThemeData(color: Colors.white),
      titleTextStyle: TextStyle(
          color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
    ),
    cardTheme: CardTheme(
      color: Colors.grey[850]?.withOpacity(0.7),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(color: Colors.white),
      bodyMedium: TextStyle(color: Colors.white70),
    ),
    iconTheme: const IconThemeData(color: Colors.white70),
    colorScheme: ColorScheme.dark(
      secondary: Colors.blue[400]!,
    ),
    extensions: const [
      AppColors(returnButtonColor: Colors.blue),
    ],
  );

  static ThemeData getThemeFromMode(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return lightTheme;
      case ThemeMode.dark:
        return darkTheme;
      case ThemeMode.system:
        return PlatformDispatcher.instance.platformBrightness == Brightness.dark
            ? darkTheme
            : lightTheme;
    }
  }

  static bool isDarkMode(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark;
  }

  static Color getBackgroundColor(BuildContext context) {
    return isDarkMode(context) ? Colors.black : Colors.white;
  }

  static Color getCardColor(BuildContext context) {
    return isDarkMode(context) ? Colors.grey[850]! : Colors.grey[200]!;
  }

  static Color getTextColor(BuildContext context) {
    return isDarkMode(context) ? Colors.white : Colors.black;
  }

  static Color getBtnTextColor(BuildContext context) {
    return isDarkMode(context) ? Colors.white : Colors.black;
  }

  static Color getSecondaryTextColor(BuildContext context) {
    return isDarkMode(context) ? Colors.white70 : Colors.black54;
  }

  static Color getReturnButtonColor(BuildContext context) {
    return Theme.of(context).extension<AppColors>()?.returnButtonColor ??
        Colors.blue;
  }

  static Color getBorderColor(BuildContext context) {
    return isDarkMode(context) ? Colors.grey[800]! : Colors.grey[300]!;
  }

  static Color getPrimaryColor(BuildContext context) {
    return isDarkMode(context) ? Colors.blue[400]! : Colors.blue[700]!;
  }
}

class AppColors extends ThemeExtension<AppColors> {
  final Color returnButtonColor;

  const AppColors({required this.returnButtonColor});

  @override
  ThemeExtension<AppColors> copyWith({Color? returnButtonColor}) {
    return AppColors(
      returnButtonColor: returnButtonColor ?? this.returnButtonColor,
    );
  }

  @override
  ThemeExtension<AppColors> lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) {
      return this;
    }
    return AppColors(
      returnButtonColor:
          Color.lerp(returnButtonColor, other.returnButtonColor, t)!,
    );
  }
}
