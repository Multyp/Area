import 'package:area/src/widgets/layout/page_title.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:area/src/widgets/area/service_selection_card.dart';
import 'package:area/src/widgets/area/configuration_modal.dart';

class CreateAreaView extends StatefulWidget {
  const CreateAreaView({super.key});

  @override
  CreateAreaViewState createState() => CreateAreaViewState();
}

class CreateAreaViewState extends State<CreateAreaView> {
  // Add state variables for selected services/actions
  String? selectedActionService;
  String? selectedAction;
  String? selectedReactionService;
  String? selectedReaction;

  // Add state variables for API data
  dynamic _apiData;
  bool _loading = true;
  final StorageService _storageService = StorageService();

  // Add these state variables
  final Map<String, TextEditingController> _fieldControllers = {};

  // Add loading state for creation
  bool _isCreating = false;

  // Add applet name controller
  final TextEditingController _appletNameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchServices();
  }

  Future<void> _fetchServices() async {
    try {
      String? token = await _storageService.getToken();

      if (token != null) {
        final response = await http.get(
          Uri.parse('https://myarea.tech/api/explore'),
          headers: {'Content-Type': 'application/json'},
        );

        if (kDebugMode) {
          print(response.body);
        }

        if (response.statusCode == 200) {
          setState(() {
            _apiData = json.decode(response.body);
            _loading = false;
          });
        } else {
          setState(() {
            _apiData = 'Failed to load data';
            _loading = false;
          });
        }
      }
    } catch (e) {
      setState(() {
        _apiData = 'Error fetching data';
        _loading = false;
      });
    }
  }

  // Add these helper methods to process the API data
  List<String> get availableServices {
    if (_apiData == null || _apiData['data'] is! List) return [];

    return _apiData['data']
        .where((item) => item['type'] == 'service')
        .map<String>((item) => item['name'].toString())
        .toList();
  }

  List<String> getActionsForService(String serviceName) {
    if (_apiData == null || (_apiData['data'] is! List)) return [];

    final service = _apiData['data'].firstWhere(
      (item) => item['type'] == 'service' && item['name'] == serviceName,
      orElse: () => null,
    );

    if (service == null || service['actions'] is! List) return [];
    return service['actions']
        .map<String>((action) => action['name'].toString())
        .toList();
  }

  List<String> getReactionsForService(String serviceName) {
    if (_apiData == null || (_apiData['data'] is! List)) return [];

    final service = _apiData['data'].firstWhere(
      (item) => item['type'] == 'service' && item['name'] == serviceName,
      orElse: () => null,
    );

    if (service == null || service['reactions'] is! List) return [];
    return service['reactions']
        .map<String>((reaction) => reaction['name'].toString())
        .toList();
  }

  // Add this method to get required fields for a service and action/reaction
  List<String> getRequiredFields(
      String serviceName, String actionName, bool isAction) {
    if (_apiData == null || (_apiData['data'] is! List)) return [];

    final service = _apiData['data'].firstWhere(
      (item) => item['type'] == 'service' && item['name'] == serviceName,
      orElse: () => null,
    );

    if (service == null) return [];

    final List items = isAction ? service['actions'] : service['reactions'];
    final item = items.firstWhere(
      (item) => item['name'] == actionName,
      orElse: () => null,
    );

    if (item == null || (item['required_fields'] is! List)) return [];
    return List<String>.from(item['required_fields']);
  }

  // Add this method to show the modal
  void _showConfigurationModal() {
    // Get required fields for both action and reaction
    final actionFields = getRequiredFields(
      selectedActionService!,
      selectedAction!,
      true,
    );
    final reactionFields = getRequiredFields(
      selectedReactionService!,
      selectedReaction!,
      false,
    );

    // Initialize controllers for all fields
    _fieldControllers.clear();
    for (var field in [...actionFields, ...reactionFields]) {
      _fieldControllers[field] = TextEditingController();
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return ConfigurationModal(
          actionService: selectedActionService!,
          reactionService: selectedReactionService!,
          actionFields: actionFields,
          reactionFields: reactionFields,
          fieldControllers: _fieldControllers,
          appletNameController: _appletNameController,
          onConfirm: () async {
            if (_appletNameController.text.trim().isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content:
                        Text(AppLocalizations.of(context)!.appletNameRequired)),
              );
              return;
            }

            final Map<String, String> configData = {};
            _fieldControllers.forEach((key, controller) {
              configData[key] = controller.text;
            });

            await _createApplet(configData); // Wait for creation to complete
          },
        );
      },
    );
  }

  // Add method to create applet
  Future<void> _createApplet(Map<String, String> configData) async {
    setState(() => _isCreating = true);

    try {
      String? token = await _storageService.getToken();

      if (token == null) throw Exception('No token found');

      final response = await http.post(
        Uri.parse('https://myarea.tech/api/create_custom_applet'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'token': token,
          'name': _appletNameController.text.trim(),
          'action': {
            'service_name': selectedActionService,
            'name': selectedAction,
          },
          'reaction': {
            'service_name': selectedReactionService,
            'name': selectedReaction,
            'fields': configData,
          },
        }),
      );

      if (response.statusCode == 201) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text(AppLocalizations.of(context)!.appletCreated)),
          );
        }
      } else {
        throw Exception('Failed to create applet');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(AppLocalizations.of(context)!.errorCreatingApplet)),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isCreating = false);
      }
    }
  }

  @override
  void dispose() {
    _appletNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            PageTitle(
              title: AppLocalizations.of(context)!.createApplet,
              showBackButton: true,
            ),
            Card(
              margin: const EdgeInsets.all(16.0),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              color: AppTheme.getCardColor(context),
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
                          child: Icon(
                            Icons.info_outline,
                            color: AppTheme.getPrimaryColor(context),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            AppLocalizations.of(context)!.areaExplanationTitle,
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
                      AppLocalizations.of(context)!.areaExplanationContent,
                      style: TextStyle(
                        color: AppTheme.getSecondaryTextColor(context),
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (_loading)
              const Expanded(
                child: Center(child: CircularProgressIndicator()),
              )
            else
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      ServiceSelectionCard(
                        title: AppLocalizations.of(context)!.selectAction,
                        selectedService: selectedActionService,
                        selectedAction: selectedAction,
                        availableServices: availableServices,
                        availableActions: selectedActionService != null
                            ? getActionsForService(selectedActionService!)
                            : [],
                        onServiceChanged: (value) => setState(() {
                          selectedActionService = value;
                          selectedAction = null;
                        }),
                        onActionChanged: (value) =>
                            setState(() => selectedAction = value),
                        actionLabel:
                            AppLocalizations.of(context)!.selectTrigger,
                      ),
                      const SizedBox(height: 16),
                      ServiceSelectionCard(
                        title: AppLocalizations.of(context)!.selectReaction,
                        selectedService: selectedReactionService,
                        selectedAction: selectedReaction,
                        availableServices: availableServices,
                        availableActions: selectedReactionService != null
                            ? getReactionsForService(selectedReactionService!)
                            : [],
                        onServiceChanged: (value) => setState(() {
                          selectedReactionService = value;
                          selectedReaction = null;
                        }),
                        onActionChanged: (value) =>
                            setState(() => selectedReaction = value),
                        actionLabel: AppLocalizations.of(context)!.selectAction,
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            _buildBottomButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomButtons() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          Expanded(
            child: TextButton(
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => Navigator.pop(context),
              child: Text(
                AppLocalizations.of(context)!.cancel,
                style: TextStyle(
                  color: AppTheme.getSecondaryTextColor(context),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: AppTheme.getPrimaryColor(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: _isCreating ||
                      !(selectedAction != null && selectedReaction != null)
                  ? null
                  : _showConfigurationModal,
              child: _isCreating
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white),
                    )
                  : Text(
                      AppLocalizations.of(context)!.confirm,
                      style: const TextStyle(color: Colors.white),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
