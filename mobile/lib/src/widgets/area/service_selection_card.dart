import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ServiceSelectionCard extends StatelessWidget {
  final String title;
  final String? selectedService;
  final String? selectedAction;
  final List<String> availableServices;
  final List<String> availableActions;
  final Function(String?) onServiceChanged;
  final Function(String?) onActionChanged;
  final String actionLabel;

  const ServiceSelectionCard({
    super.key,
    required this.title,
    required this.selectedService,
    required this.selectedAction,
    required this.availableServices,
    required this.availableActions,
    required this.onServiceChanged,
    required this.onActionChanged,
    required this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: AppTheme.getCardColor(context),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.getTextColor(context),
              ),
            ),
            const SizedBox(height: 16),
            _buildDropdown(
              context: context,
              hint: AppLocalizations.of(context)!.selectService,
              value: selectedService,
              items: availableServices,
              onChanged: onServiceChanged,
            ),
            if (selectedService != null) ...[
              const SizedBox(height: 16),
              _buildDropdown(
                context: context,
                hint: actionLabel,
                value: selectedAction,
                items: availableActions,
                onChanged: onActionChanged,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required BuildContext context,
    required String hint,
    required String? value,
    required List<String> items,
    required Function(String?) onChanged,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: AppTheme.getPrimaryColor(context).withOpacity(0.1),
      ),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        ),
        isExpanded: true,
        hint: Text(
          hint,
          style: TextStyle(color: AppTheme.getSecondaryTextColor(context)),
        ),
        value: value,
        onChanged: onChanged,
        items: items.map((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(item),
          );
        }).toList(),
      ),
    );
  }
}
