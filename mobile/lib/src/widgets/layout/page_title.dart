import 'package:flutter/material.dart';
import 'package:area/src/theme/app_theme.dart';

class PageTitle extends StatelessWidget {
  final String title;
  final bool showBackButton;
  final VoidCallback? onBackPressed;

  const PageTitle({
    super.key,
    required this.title,
    this.showBackButton = false,
    this.onBackPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 12,
      ),
      margin: EdgeInsets.zero,
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: AppTheme.getBorderColor(context),
            width: 1.5,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          if (showBackButton)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: onBackPressed ?? () => Navigator.pop(context),
              ),
            ),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: showBackButton ? 26 : 32,
                fontWeight: FontWeight.bold,
                color: AppTheme.getTextColor(context),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
