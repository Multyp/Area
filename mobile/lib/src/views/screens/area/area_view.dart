import 'package:area/src/services/default_applets_list.dart';
import 'package:area/src/services/external_services_list.dart';
import 'package:area/src/widgets/area/services_card.dart';
import 'package:area/src/widgets/area/services_list.dart';
import 'package:area/src/widgets/layout/page_title.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/widgets/area/configuration_modal.dart';
import 'package:area/src/views/screens/area/create_area_view.dart';
import 'dart:developer' as developer;
import 'package:area/src/views/screens/area/enable_prebuilt_applet_view.dart';

class AreaContent extends StatefulWidget {
  const AreaContent({
    super.key,
  });

  @override
  State<AreaContent> createState() => _AreaContentState();
}

class _AreaContentState extends State<AreaContent>
    with TickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  late List<Service> services;
  late TabController _tabController;
  late List<Applet> applets;
  late List<Service> filteredServices;
  late List<Applet> filteredApplets;
  final StorageService _storageService = StorageService();
  bool _isLoadingApplets = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _searchController.addListener(_onSearchChanged);
    applets = [];
    filteredApplets = [];
    _fetchApplets();
  }

  Future<void> _fetchApplets() async {
    try {
      String? token = await _storageService.getToken();
      if (token == null) return;

      final response = await http.get(
        Uri.parse('https://rooters-area.com/api/explore'),
        headers: {'Content-Type': 'application/json'},
      );

      developer.log('Response: ${response.body}', name: 'AreaContent');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applets = (data['data'] as List)
              .where((item) => item['type'] == 'applet')
              .map((applet) {
            return Applet(
              title: applet['name'],
              description: applet['action']['serviceName'] +
                  ' → ' +
                  applet['reaction']['serviceName'],
              icon: Icons.extension,
              iconColor: Colors.blue,
              configureMethod: (context) async {
                // Find the services in the data
                final actionService = (data['data'] as List).firstWhere(
                  (item) =>
                      item['type'] == 'service' &&
                      item['name'] == applet['action']['serviceName'],
                  orElse: () => null,
                );

                final reactionService = (data['data'] as List).firstWhere(
                  (item) =>
                      item['type'] == 'service' &&
                      item['name'] == applet['reaction']['serviceName'],
                  orElse: () => null,
                );

                // Get the required fields from the services
                final actionFields = actionService?['actions']?.firstWhere(
                      (action) => action['name'] == applet['action']['name'],
                      orElse: () => {'required_fields': []},
                    )['required_fields'] as List? ??
                    [];

                final reactionFields =
                    reactionService?['reactions']?.firstWhere(
                          (reaction) =>
                              reaction['name'] == applet['reaction']['name'],
                          orElse: () => {'required_fields': []},
                        )['required_fields'] as List? ??
                        [];

                // Initialize controllers
                final fieldControllers = Map.fromEntries([
                  ...actionFields,
                  ...reactionFields,
                ].map((field) =>
                    MapEntry(field.toString(), TextEditingController())));

                showDialog(
                  context: context,
                  barrierDismissible:
                      false, // Prevent closing by tapping outside
                  builder: (BuildContext context) {
                    return ConfigurationModal(
                      actionService: applet['action']['serviceName'],
                      reactionService: applet['reaction']['serviceName'],
                      actionFields: List<String>.from(actionFields),
                      reactionFields: List<String>.from(reactionFields),
                      fieldControllers: fieldControllers,
                      onConfirm: () async {
                        try {
                          String? token = await _storageService.getToken();
                          if (token == null) {
                            throw Exception('No token found');
                          }

                          final Map<String, String> configData = {};
                          fieldControllers.forEach((key, controller) {
                            configData[key] = controller.text;
                          });

                          final response = await http.post(
                            Uri.parse(
                                'https://rooters-area.com/api/applets/${applet['name']}/enable'),
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer $token',
                            },
                            body: jsonEncode({
                              'token': token,
                              ...configData,
                            }),
                          );

                          if (response.statusCode == 200) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(AppLocalizations.of(context)!
                                      .appletEnabled),
                                  backgroundColor:
                                      AppTheme.getCardColor(context),
                                ),
                              );
                            }
                          } else {
                            throw Exception('Failed to enable applet');
                          }
                        } catch (error) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(AppLocalizations.of(context)!
                                    .appletEnableFailed),
                                backgroundColor: AppTheme.getCardColor(context),
                              ),
                            );
                          }
                          if (kDebugMode) {
                            print('Error enabling applet: $error');
                          }
                        }
                      },
                    );
                  },
                );
                return Future.value();
              },
            );
          }).toList();

          filteredApplets = applets;
          _isLoadingApplets = false;
        });
      }
    } catch (e) {
      if (kDebugMode) {
        print('Error fetching applets: $e');
      }
      setState(() {
        _isLoadingApplets = false;
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    services = defaultServices(context);
    filteredServices = services;
  }

  void _onSearchChanged() {
    final searchTerm = _searchController.text.toLowerCase();
    setState(() {
      filteredServices = services.where((service) {
        return service.title.toLowerCase().contains(searchTerm) ||
            service.description.toLowerCase().contains(searchTerm);
      }).toList();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Widget _buildTitle() {
    return PageTitle(title: AppLocalizations.of(context)!.discover);
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: AppLocalizations.of(context)!.search,
          prefixIcon: const Icon(Icons.search),
          filled: true,
          fillColor: AppTheme.getCardColor(context),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }

  Widget _buildAppletCard({
    required String title,
    required String description,
    required IconData icon,
    required Color iconColor,
    required AppletConfigMethod configureMethod,
  }) {
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
            icon,
            color: iconColor,
          ),
        ),
        title: Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppTheme.getTextColor(context),
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8.0),
          child: Text(
            description,
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
                builder: (context) => EnablePrebuiltAppletView(
                  appletName: title,
                  actionService: description.split(' → ')[0],
                  reactionService: description.split(' → ')[1],
                ),
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

  Widget _buildAppletsContent() {
    if (_isLoadingApplets) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: filteredApplets
          .map((applet) => _buildAppletCard(
                title: applet.title,
                description: applet.description,
                icon: applet.icon,
                iconColor: applet.iconColor,
                configureMethod: applet.configureMethod,
              ))
          .toList(),
    );
  }

  Widget _buildServicesContent() {
    return ServicesList(services: filteredServices);
  }

  Widget _buildAllContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          "Applets",
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.getTextColor(context),
          ),
        ),
        const SizedBox(height: 16),
        ...filteredApplets.map((applet) => _buildAppletCard(
              title: applet.title,
              description: applet.description,
              icon: applet.icon,
              iconColor: applet.iconColor,
              configureMethod: applet.configureMethod,
            )),
        const SizedBox(height: 24),
        Text(
          "Services",
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.getTextColor(context),
          ),
        ),
        const SizedBox(height: 16),
        ...filteredServices.map((service) => ServiceCard(service: service)),
      ],
    );
  }

  Widget _buildAreasContent() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
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
              child: Icon(
                Icons.add,
                color: AppTheme.getPrimaryColor(context),
              ),
            ),
            title: Text(
              AppLocalizations.of(context)!.createApplet,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.getTextColor(context),
              ),
            ),
            trailing: Icon(
              Icons.arrow_forward_ios,
              color: AppTheme.getSecondaryTextColor(context),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const CreateAreaView(),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildTitle(),
            const SizedBox(height: 16),
            _buildSearchBar(),
            TabBar(
              controller: _tabController,
              labelStyle: GoogleFonts.poppins(
                fontWeight: FontWeight.w600,
              ),
              labelColor: AppTheme.getPrimaryColor(context),
              unselectedLabelColor: AppTheme.getSecondaryTextColor(context),
              indicatorColor: AppTheme.getPrimaryColor(context),
              tabs: [
                Tab(text: AppLocalizations.of(context)!.all),
                Tab(text: AppLocalizations.of(context)!.applets),
                Tab(text: AppLocalizations.of(context)!.areas),
                Tab(text: AppLocalizations.of(context)!.services),
              ],
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _buildAllContent(),
                  _buildAppletsContent(),
                  _buildAreasContent(),
                  _buildServicesContent(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
