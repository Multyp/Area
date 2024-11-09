import 'dart:convert';
import 'package:area/src/services/storage_service.dart';
import 'package:area/src/widgets/layout/page_title.dart';
import 'package:area/src/widgets/layout/themed_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:area/src/theme/app_theme.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:area/src/services/external_services_list.dart';

class ProfileView extends StatefulWidget {
  const ProfileView({super.key});

  @override
  ProfileViewState createState() => ProfileViewState();
}

class ProfileViewState extends State<ProfileView> {
  dynamic _apiData;
  bool _loading = true;
  final StorageService _storageService = StorageService();

  @override
  void initState() {
    super.initState();
    _fetchConnectedServices();
  }

  Future<void> _fetchConnectedServices() async {
    try {
      String? token = await _storageService.getToken();

      if (token != null) {
        final response = await http.post(
          Uri.parse('https://myarea.tech/api/connections'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'token': token}),
        );

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

  @override
  Widget build(BuildContext context) {
    return ThemedScaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 0),
                child: PageTitle(title: AppLocalizations.of(context)!.profile),
              ),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildProfileInfo(context),
                    const SizedBox(height: 16),
                    _loading
                        ? _buildSkeletonLoader(context)
                        : _buildConnectedServices(context),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSkeletonLoader(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSkeletonText(),
        const SizedBox(height: 12),
        Card(
          color: AppTheme.getCardColor(context),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: List.generate(
              4,
              (index) => _buildSkeletonServiceItem(context),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSkeletonText() {
    return const SkeletonContainer(
      width: 180,
      height: 24,
    );
  }

  Widget _buildSkeletonServiceItem(BuildContext context) {
    return const ListTile(
      leading: SkeletonContainer(
        width: 22,
        height: 22,
      ),
      title: SkeletonContainer(
        width: 120,
        height: 16,
      ),
      trailing: SkeletonContainer(
        width: 100,
        height: 36,
      ),
    );
  }

  Widget _buildProfileInfo(BuildContext context) {
    return Card(
      color: AppTheme.getCardColor(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: AppTheme.getPrimaryColor(context),
              child: const Text(
                'JD',
                style: TextStyle(fontSize: 24, color: Colors.white),
              ),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'John Doe',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.getTextColor(context),
                  ),
                ),
                Text(
                  'john.doe@example.com',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppTheme.getSecondaryTextColor(context),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConnectedServices(BuildContext context) {
    List<dynamic> connections = [];
    if (_apiData != null && _apiData is Map<String, dynamic>) {
      var result = _apiData['result'];
      if (result is Map<String, dynamic> && result['connections'] is List) {
        connections = result['connections'];
      }
    }

    List<Service> services = defaultServices(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          AppLocalizations.of(context)!.services,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.getSecondaryTextColor(context),
          ),
        ),
        const SizedBox(height: 12),
        Card(
          color: AppTheme.getCardColor(context),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: services.map((service) {
              bool isConnected = connections.any(
                (connection) =>
                    connection['serviceName'].toString().toLowerCase() ==
                    service.title.toLowerCase(),
              );
              return _buildServiceItem(context, service, isConnected);
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildServiceItem(
      BuildContext context, Service service, bool isConnected) {
    return ListTile(
      leading: FaIcon(
        service.icon,
        color: service.iconColor,
        size: 22,
      ),
      title: Text(
        service.title,
        style: TextStyle(color: AppTheme.getTextColor(context), fontSize: 16),
      ),
      trailing: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => service.createOAuthWidget((token) {
                // Handle token received
                _fetchConnectedServices(); // Refresh the list
              }),
            ),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: isConnected ? Colors.green[500] : Colors.blue[700],
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(isConnected
                ? AppLocalizations.of(context)!.connected
                : AppLocalizations.of(context)!.connect),
            const SizedBox(width: 4),
            Icon(
              isConnected
                  ? Icons.check_circle_outline
                  : Icons.add_circle_outline,
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}

class SkeletonContainer extends StatefulWidget {
  final double width;
  final double height;

  const SkeletonContainer({
    super.key,
    required this.width,
    required this.height,
  });

  @override
  State<SkeletonContainer> createState() => _SkeletonContainerState();
}

class _SkeletonContainerState extends State<SkeletonContainer>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();

    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                Colors.grey[300]!,
                Colors.grey[100]!,
                Colors.grey[300]!,
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
