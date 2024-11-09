import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

/// A custom bottom navigation bar that displays a list of navigation items.
///
/// This widget provides a customizable bottom navigation bar with support
/// for both FontAwesome and SVG icons. It allows users to switch between
/// different sections of the application by tapping on the corresponding
/// navigation item.
class CustomBottomNavigationBar extends StatelessWidget {
  /// The index of the currently selected navigation item.
  final int currentIndex;

  /// Callback function that is called when a navigation item is tapped.
  ///
  /// The [onTap] function receives the index of the tapped item as a parameter.
  final Function(int) onTap;

  /// Creates a [CustomBottomNavigationBar].
  ///
  /// The [currentIndex] parameter must not be null and determines which
  /// navigation item is currently selected. The [onTap] function must also
  /// be provided to handle taps on the navigation items.
  const CustomBottomNavigationBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: AppTheme.getBorderColor(context),
            width: 1.5,
          ),
        ),
      ),
      child: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: onTap,
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppTheme.getBackgroundColor(context),
        selectedItemColor: AppTheme.getPrimaryColor(context),
        unselectedItemColor: AppTheme.getSecondaryTextColor(context),
        selectedFontSize: 12,
        unselectedFontSize: 12,
        iconSize: 24,
        items: [
          _buildNavItem(context, FontAwesomeIcons.house,
              AppLocalizations.of(context)!.home, 0),
          _buildSvgNavItem(context, 'assets/images/icon.svg', 'Area', 1),
          _buildNavItem(context, FontAwesomeIcons.user,
              AppLocalizations.of(context)!.profile, 2),
          _buildNavItem(context, FontAwesomeIcons.gear,
              AppLocalizations.of(context)!.settings, 3),
        ],
      ),
    );
  }

  /// Builds a standard navigation item for the bottom navigation bar.
  ///
  /// This method creates a [BottomNavigationBarItem] using a FontAwesome
  /// icon. The [context] is used to access the theme colors, while
  /// [icon] is the FontAwesome icon to display, [label] is the text
  /// displayed beneath the icon, and [index] specifies the item's index.
  BottomNavigationBarItem _buildNavItem(
      BuildContext context, IconData icon, String label, int index) {
    return BottomNavigationBarItem(
      icon: FaIcon(
        icon,
        color: currentIndex == index
            ? AppTheme.getPrimaryColor(context)
            : AppTheme.getSecondaryTextColor(context),
      ),
      label: label,
    );
  }

  /// Builds an SVG navigation item for the bottom navigation bar.
  ///
  /// This method creates a [BottomNavigationBarItem] using an SVG icon.
  /// The [context] is used to access the theme colors, while [assetName]
  /// specifies the path to the SVG asset, [label] is the text displayed
  /// beneath the icon, and [index] specifies the item's index.
  BottomNavigationBarItem _buildSvgNavItem(
      BuildContext context, String assetName, String label, int index) {
    return BottomNavigationBarItem(
      icon: SvgPicture.asset(
        assetName,
        height: 24,
        width: 24,
        color: currentIndex == index
            ? AppTheme.getPrimaryColor(context)
            : AppTheme.getSecondaryTextColor(context),
      ),
      label: label,
    );
  }
}
