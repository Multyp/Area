import 'package:flutter/material.dart';
import 'package:area/src/services/external_services_list.dart';
import 'package:area/src/widgets/area/services_card.dart';

/// A widget that displays a scrollable list of services.
///
/// This widget takes a list of [Service] objects and displays them as [ServiceCard]
/// widgets in a scrollable list view. The padding around the list can be customized
/// using the [padding] parameter.
class ServicesList extends StatelessWidget {
  /// The list of services to display.
  final List<Service> services;

  /// Optional padding to apply around the list.
  /// If not provided, defaults to EdgeInsets.all(16).
  final EdgeInsets? padding;

  /// Creates a [ServicesList] widget.
  ///
  /// The [services] parameter must not be null and contains the list of services
  /// to display. The [padding] parameter is optional and specifies the padding
  /// around the list.
  const ServicesList({
    super.key,
    required this.services,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: padding ?? const EdgeInsets.all(16),
      children:
          services.map((service) => ServiceCard(service: service)).toList(),
    );
  }
}
