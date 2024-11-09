import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class EnableAppletView extends StatefulWidget {
  const EnableAppletView({super.key});

  @override
  EnableAppletViewState createState() => EnableAppletViewState();
}

class EnableAppletViewState extends State<EnableAppletView> {
  final _webhookController = TextEditingController();
  bool _isLoading = false;
  final storageService = StorageService();
  bool _isEnabled = false; // Add this line

  Future<void> _fetchAppletInfo() async {
    String? token = await storageService.getToken();
    if (token == null || token.isEmpty) return;

    try {
      final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
      var response = await http.post(
        Uri.parse('$apiBaseUrl/applets/gmail_notify_discord'),
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
          _isEnabled = data['isEnabled'] ?? false;
          if (kDebugMode) {
            print('isEnabled: $_isEnabled');
          }
        });
      }
    } catch (error) {
      // Handle error silently
    }
  }

  Future<void> _enableApplet() async {
    String webhookUrl = _webhookController.text;
    String? token = await storageService.getToken();

    if (token == null || token.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppLocalizations.of(context)!.noTokenFound),
          backgroundColor: AppTheme.getCardColor(context),
        ),
      );
      return;
    }

    if (webhookUrl.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppLocalizations.of(context)!.enterDiscordWebhook),
          backgroundColor: AppTheme.getCardColor(context),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final String? apiBaseUrl = dotenv.env['API_BASE_URL'];
      var response = await http.post(
        Uri.parse('$apiBaseUrl/applets/gmail_notify_discord/enable'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'token': token,
          'webhook_url': webhookUrl,
        }),
      );

      if (response.statusCode == 200) {
        var responseData = jsonDecode(response.body);
        if (kDebugMode) {
          print('API response: $responseData');
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(AppLocalizations.of(context)!.appletEnabled),
              backgroundColor: AppTheme.getCardColor(context),
            ),
          );
        }
      } else {
        if (kDebugMode) {
          print('Failed to enable applet: ${response.statusCode}');
        }
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(AppLocalizations.of(context)!.appletEnableFailed),
              backgroundColor: AppTheme.getCardColor(context),
            ),
          );
        }
      }
    } catch (error) {
      if (kDebugMode) {
        print('Error during API call: $error');
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.errorOccurred),
            backgroundColor: AppTheme.getCardColor(context),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchAppletInfo();
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
                // Feature description card
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
                                FontAwesomeIcons.envelope,
                                color: AppTheme.getPrimaryColor(context),
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                AppLocalizations.of(context)!
                                    .gmailToDiscordNotificationTitle,
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
                          AppLocalizations.of(context)!
                              .gmailToDiscordNotificationFullDesc,
                          style: TextStyle(
                            color: AppTheme.getSecondaryTextColor(context),
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Configuration card
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
                                FontAwesomeIcons.discord,
                                color: AppTheme.getPrimaryColor(context),
                                size: 24,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                AppLocalizations.of(context)!.discordWebhookUrl,
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.getTextColor(context),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        TextField(
                          controller: _webhookController,
                          style:
                              TextStyle(color: AppTheme.getTextColor(context)),
                          decoration: InputDecoration(
                            hintText: AppLocalizations.of(context)!
                                .enterDiscordWebhook,
                            hintStyle: TextStyle(
                              color: AppTheme.getSecondaryTextColor(context),
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: AppTheme.getSecondaryTextColor(context),
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                color: AppTheme.getSecondaryTextColor(context),
                              ),
                            ),
                            filled: true,
                            fillColor: AppTheme.getBackgroundColor(context),
                          ),
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: (_isLoading || _isEnabled)
                                ? null
                                : _enableApplet,
                            style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  AppTheme.getPrimaryColor(context),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 2,
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
                                        ? AppLocalizations.of(context)!
                                            .appletEnabled
                                        : AppLocalizations.of(context)!
                                            .enableApplet,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
