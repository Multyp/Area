import 'package:flutter/material.dart';
import 'package:area/src/theme/app_theme.dart';

/// A customized scaffold widget that provides themed styling and background effects.
///
/// The [ThemedScaffold] extends the basic [Scaffold] widget to provide consistent
/// theming across the application. It automatically handles dark/light mode transitions
/// and provides a stylized background effect in dark mode.
///
/// Key features:
/// * Automatically applies the appropriate background color based on the current theme
/// * Displays a decorative background image with overlay in dark mode
/// * Supports standard scaffold features like app bar and bottom navigation
/// * Allows custom background color override
///
/// Example usage:
/// ```dart
/// ThemedScaffold(
///   appBar: AppBar(title: Text('My Screen')),
///   body: Center(child: Text('Content')),
///   bottomNavigationBar: BottomNavigationBar(...),
/// )
/// ```
class ThemedScaffold extends StatelessWidget {
  /// The primary content of the scaffold. This content will be displayed
  /// above the background and overlay layers.
  final Widget body;

  /// Optional app bar widget displayed at the top of the scaffold.
  /// Should be a widget implementing [PreferredSizeWidget], typically an [AppBar].
  final PreferredSizeWidget? appBar;

  /// Optional widget displayed at the bottom of the scaffold.
  /// Typically used for navigation bars or other persistent bottom controls.
  final Widget? bottomNavigationBar;

  /// Optional color to override the default background color.
  /// If null, uses the theme's background color from [AppTheme].
  final Color? backgroundColor;

  /// Creates a themed scaffold with the specified parameters.
  ///
  /// The [body] parameter is required and specifies the main content of the scaffold.
  /// Other parameters are optional and provide additional customization options.
  const ThemedScaffold({
    super.key,
    required this.body,
    this.appBar,
    this.bottomNavigationBar,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: AppTheme.getBackgroundColor(context),
      appBar: appBar,
      bottomNavigationBar: bottomNavigationBar,
      body: Stack(
        fit: StackFit.expand,
        children: [
          if (isDark) ...[
            Image.asset(
              "assets/images/background.jpg",
              fit: BoxFit.cover,
            ),
            Container(
              color: Colors.black.withOpacity(0.6),
            ),
          ],
          Container(
            color: isDark
                ? Colors.transparent
                : (backgroundColor ?? AppTheme.getBackgroundColor(context)),
          ),
          body,
        ],
      ),
    );
  }
}
