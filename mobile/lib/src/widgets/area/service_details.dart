import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:area/src/services/external_services_list.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

/// A widget that displays detailed information about a service.
///
/// This view shows comprehensive information about a specific service, including:
/// * The service icon and title in a prominent header
/// * A detailed description of the service functionality
/// * A connect button to initiate service integration
///
/// The view uses [ThemedScaffold] to maintain consistent theming and includes
/// responsive styling that adapts to the current theme mode.
///
/// Example usage:
/// ```dart
/// ServiceDetailsView(
///   service: Service(
///     title: 'Gmail',
///     description: 'Email service by Google',
///     icon: FontAwesomeIcons.google,
///     // ... other service properties
///   ),
/// )
/// ```
class ServiceDetailsView extends StatefulWidget {
  /// The service object containing all the details to be displayed.
  ///
  /// This includes the service's:
  /// * title
  /// * description
  /// * icon
  /// * icon color
  /// * and other service-specific properties
  final Service service;

  /// Creates a [ServiceDetailsView] widget.
  ///
  /// Requires a [service] parameter that contains all the necessary information
  /// about the service to be displayed.
  ///
  /// The [service] parameter must not be null.
  const ServiceDetailsView({
    super.key,
    required this.service,
  });

  @override
  State<ServiceDetailsView> createState() => _ServiceDetailsViewState();
}

class _ServiceDetailsViewState extends State<ServiceDetailsView> {
  bool _isConnected = false;
  bool _loading = true;
  final StorageService _storageService = StorageService();

  @override
  void initState() {
    super.initState();
    _checkConnectionStatus();
  }

  Future<void> _checkConnectionStatus() async {
    try {
      String? token = await _storageService.getToken();

      if (token != null) {
        final response = await http.post(
          Uri.parse('https://myarea.tech/api/connections'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'token': token}),
        );

        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          final connections = data['result']['connections'] as List;
          setState(() {
            _isConnected = connections.any(
              (connection) =>
                  connection['serviceName'] ==
                  widget.service.title.toLowerCase(),
            );
            _loading = false;
          });
        }
      }
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      appBar: AppBar(
        title: Text(
          widget.service.title,
          style: TextStyle(color: AppTheme.getTextColor(context)),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: AppTheme.getTextColor(context)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Card(
                  color: AppTheme.getCardColor(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.getPrimaryColor(context)
                                    .withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: FaIcon(
                                widget.service.icon,
                                color: widget.service.iconColor,
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                widget.service.title,
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.getTextColor(context),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          widget.service.fullDescription,
                          style: TextStyle(
                            color: AppTheme.getSecondaryTextColor(context),
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Connect Button
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: _loading
                              ? Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(12),
                                    color: AppTheme.getCardColor(context)
                                        .withOpacity(0.5),
                                  ),
                                  child: Center(
                                    child: SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                          AppTheme.getPrimaryColor(context),
                                        ),
                                      ),
                                    ),
                                  ),
                                )
                              : ElevatedButton(
                                  onPressed: _isConnected
                                      ? null
                                      : () {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => widget
                                                  .service
                                                  .createOAuthWidget((token) {
                                                _checkConnectionStatus();
                                              }),
                                            ),
                                          );
                                        },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: _isConnected
                                        ? Colors.green[500]
                                        : AppTheme.getPrimaryColor(context),
                                    foregroundColor: Colors.white,
                                    disabledBackgroundColor:
                                        _isConnected ? Colors.green[500] : null,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    elevation: 2,
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        _isConnected
                                            ? AppLocalizations.of(context)!
                                                .connected
                                            : AppLocalizations.of(context)!
                                                .connect,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Icon(
                                        _isConnected
                                            ? Icons.check_circle_outline
                                            : Icons.add_circle_outline,
                                        size: 16,
                                      ),
                                    ],
                                  ),
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
                /*
                // Privacy Notice
                const SizedBox(height: 16),
                Card(
                  color: AppTheme.getCardColor(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Icon(
                          Icons.privacy_tip,
                          color: AppTheme.getSecondaryTextColor(context),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            AppLocalizations.of(context)!.privacyNotice,
                            style: TextStyle(
                              color: AppTheme.getSecondaryTextColor(context),
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                */
              ],
            ),
          ),
        ),
      ),
    );
  }
}
