import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EnablePrebuiltAppletView extends StatefulWidget {
  final String appletName;
  final String actionService;
  final String reactionService;

  const EnablePrebuiltAppletView({
    super.key,
    required this.appletName,
    required this.actionService,
    required this.reactionService,
  });

  @override
  EnablePrebuiltAppletViewState createState() =>
      EnablePrebuiltAppletViewState();
}

class EnablePrebuiltAppletViewState extends State<EnablePrebuiltAppletView> {
  final Map<String, TextEditingController> _fieldControllers = {};
  bool _isLoading = false;
  final StorageService storageService = StorageService();
  bool _isEnabled = false;
  List<String> _requiredFields = [];
  List<String> _missingConnections = [];

  @override
  void initState() {
    super.initState();
    _fetchAppletInfo();
    _checkMissingConnections();
  }

  Future<void> _fetchAppletInfo() async {
    String? token = await storageService.getToken();
    if (token == null || token.isEmpty) return;

    try {
      var statusResponse = await http.post(
        Uri.parse('https://rooters-area.com/api/applets/${widget.appletName}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'token': token,
        }),
      );

      if (statusResponse.statusCode == 200) {
        var statusData = jsonDecode(statusResponse.body);
        setState(() {
          _isEnabled = statusData['isEnabled'] ?? false;
        });
      }

      var response = await http.get(
        Uri.parse('https://rooters-area.com/api/explore'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);

        final appletData = (data['data'] as List).firstWhere(
          (item) =>
              item['type'] == 'applet' && item['name'] == widget.appletName,
          orElse: () => null,
        );

        if (appletData != null) {
          final actionService = (data['data'] as List).firstWhere(
            (item) =>
                item['type'] == 'service' &&
                item['name'] == appletData['action']['serviceName'],
            orElse: () => null,
          );

          final reactionService = (data['data'] as List).firstWhere(
            (item) =>
                item['type'] == 'service' &&
                item['name'] == appletData['reaction']['serviceName'],
            orElse: () => null,
          );

          final actionFields = actionService?['actions']?.firstWhere(
                (action) => action['name'] == appletData['action']['name'],
                orElse: () => {'required_fields': []},
              )['required_fields'] as List? ??
              [];

          final reactionFields = reactionService?['reactions']?.firstWhere(
                (reaction) =>
                    reaction['name'] == appletData['reaction']['name'],
                orElse: () => {'required_fields': []},
              )['required_fields'] as List? ??
              [];

          setState(() {
            _requiredFields = [
              ...List<String>.from(actionFields),
              ...List<String>.from(reactionFields),
            ];

            for (var field in _requiredFields) {
              _fieldControllers[field] = TextEditingController();
            }
          });
        }
      }
    } catch (error) {
      if (kDebugMode) {
        print('Error fetching applet info: $error');
      }
    }
  }

  Future<void> _checkMissingConnections() async {
    String? token = await storageService.getToken();
    if (token == null) return;

    try {
      var response = await http.post(
        Uri.parse('https://rooters-area.com/api/connections/${widget.appletName}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'token': token,
        }),
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        setState(() {
          _missingConnections =
              List<String>.from(data['missingConnections'] ?? []);
        });
      }
    } catch (error) {
      if (kDebugMode) {
        print('Error checking missing connections: $error');
      }
    }
  }

  Future<void> _enableApplet() async {
    Map<String, String> fieldValues = {};
    for (var entry in _fieldControllers.entries) {
      if (entry.value.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.allFieldsRequired),
            backgroundColor: AppTheme.getCardColor(context),
          ),
        );
        return;
      }
      fieldValues[entry.key] = entry.value.text;
    }

    setState(() => _isLoading = true);

    try {
      String? token = await storageService.getToken();
      if (token == null) throw Exception('No token found');

      var response = await http.post(
        Uri.parse(
            'https://rooters-area.com/api/applets/${widget.appletName}/enable'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'token': token,
          ...fieldValues,
        }),
      );

      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(AppLocalizations.of(context)!.appletEnabled),
              backgroundColor: AppTheme.getCardColor(context),
            ),
          );
          Navigator.pop(context);
        }
      } else {
        throw Exception('Failed to enable applet');
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.appletEnableFailed),
            backgroundColor: AppTheme.getCardColor(context),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _disableApplet() async {
    setState(() => _isLoading = true);

    try {
      String? token = await storageService.getToken();
      if (token == null) throw Exception('No token found');

      var response = await http.post(
        Uri.parse(
            'https://rooters-area.com/api/applets/${widget.appletName}/disable'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'token': token,
        }),
      );

      if (response.statusCode == 200) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(AppLocalizations.of(context)!.appletDisabled),
              backgroundColor: AppTheme.getCardColor(context),
            ),
          );
          Navigator.pop(context);
        }
      } else {
        throw Exception('Failed to disable applet');
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.appletDisableFailed),
            backgroundColor: AppTheme.getCardColor(context),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  void dispose() {
    for (var controller in _fieldControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      appBar: AppBar(
        title: Text(
          AppLocalizations.of(context)!.enableApplet,
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
                                FontAwesomeIcons.puzzlePiece,
                                color: AppTheme.getPrimaryColor(context),
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                widget.appletName,
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
                          '${widget.actionService} → ${widget.reactionService}',
                          style: TextStyle(
                            color: AppTheme.getSecondaryTextColor(context),
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                if (_missingConnections.isNotEmpty)
                  Card(
                    color: Colors.red.withOpacity(0.1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            AppLocalizations.of(context)!.missingConnections,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.red,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            AppLocalizations.of(context)!.pleaseConnect,
                            style: TextStyle(
                              color: AppTheme.getTextColor(context),
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            _missingConnections.join(", "),
                            style: TextStyle(
                              color: AppTheme.getTextColor(context),
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                else ...[
                  // Only show configuration options if there are no missing connections
                  if (!_isEnabled) ...[
                    ..._fieldControllers.entries.map((entry) => Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: TextField(
                            controller: entry.value,
                            decoration: InputDecoration(
                              labelText: entry.key,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              filled: true,
                              fillColor: AppTheme.getCardColor(context),
                            ),
                          ),
                        )),
                    const SizedBox(height: 24),
                  ],
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _isLoading
                          ? null
                          : (_isEnabled ? _disableApplet : _enableApplet),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isEnabled
                            ? Colors.red
                            : AppTheme.getPrimaryColor(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : Text(
                              _isEnabled
                                  ? AppLocalizations.of(context)!.disableApplet
                                  : AppLocalizations.of(context)!.enableApplet,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
