import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ConfigurationModal extends StatelessWidget {
  final String actionService;
  final String reactionService;
  final List<String> actionFields;
  final List<String> reactionFields;
  final Map<String, TextEditingController> fieldControllers;
  final TextEditingController? appletNameController;
  final VoidCallback onConfirm;

  const ConfigurationModal({
    required this.actionService,
    required this.reactionService,
    required this.actionFields,
    required this.reactionFields,
    required this.fieldControllers,
    this.appletNameController,
    required this.onConfirm,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(AppLocalizations.of(context)!.configureApplet),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (appletNameController != null) ...[
              TextField(
                controller: appletNameController!,
                decoration: InputDecoration(
                  labelText: AppLocalizations.of(context)!.appletName,
                  hintText: AppLocalizations.of(context)!.enterAppletName,
                ),
              ),
              const SizedBox(height: 16),
            ],
            _buildFieldSection(context, actionService, actionFields),
            if (reactionFields.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildFieldSection(context, reactionService, reactionFields),
            ],
          ],
        ),
      ),
      actions: [_buildActionButtons(context)],
    );
  }

  Widget _buildFieldSection(
      BuildContext context, String service, List<String> fields) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          service,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppTheme.getTextColor(context),
          ),
        ),
        const SizedBox(height: 8),
        ...fields.map((field) => Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: _buildTextField(context, field),
            )),
      ],
    );
  }

  Widget _buildTextField(BuildContext context, String field) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          field,
          style: TextStyle(
            fontSize: 14,
            color: AppTheme.getSecondaryTextColor(context),
          ),
        ),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: AppTheme.getPrimaryColor(context).withOpacity(0.1),
          ),
          child: TextField(
            controller: fieldControllers[field],
            decoration: InputDecoration(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
              hintText: AppLocalizations.of(context)!.enterValue,
              hintStyle: TextStyle(
                color: AppTheme.getSecondaryTextColor(context).withOpacity(0.5),
              ),
            ),
            style: TextStyle(
              color: AppTheme.getTextColor(context),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8.0, bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              AppLocalizations.of(context)!.cancel,
              style: TextStyle(
                color: AppTheme.getSecondaryTextColor(context),
              ),
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.getPrimaryColor(context),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () {
              onConfirm();
              Navigator.of(context).pop();
            },
            child: Text(
              AppLocalizations.of(context)!.confirm,
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
