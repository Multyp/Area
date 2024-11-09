import 'package:area/src/widgets/area/service_details.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:area/src/services/external_services_list.dart';

/// A card widget that displays information about a service.
///
/// This widget creates a card with the service's icon, title, and description.
/// It also provides navigation to a detailed view of the service when tapped.
class ServiceCard extends StatelessWidget {
  /// The service to display information about.
  final Service service;

  /// Creates a [ServiceCard].
  ///
  /// The [service] parameter must not be null and contains the service information
  /// to be displayed in the card.
  const ServiceCard({
    super.key,
    required this.service,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      color: AppTheme.getCardColor(context),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.getPrimaryColor(context).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: FaIcon(
            service.icon,
            color: service.iconColor,
          ),
        ),
        title: Text(
          service.title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppTheme.getTextColor(context),
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            service.description,
            style: TextStyle(
              color: AppTheme.getSecondaryTextColor(context),
            ),
          ),
        ),
        trailing: IconButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ServiceDetailsView(service: service),
              ),
            );
          },
          icon: Icon(
            Icons.arrow_forward_ios,
            color: AppTheme.getSecondaryTextColor(context),
          ),
        ),
      ),
    );
  }
}
