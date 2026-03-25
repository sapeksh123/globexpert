
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Centralized API Configuration
/// Toggle between local and production backend.
class ApiConfig {
  /// Toggle backend from build flags:
  /// --dart-define=GE_USE_PRODUCTION=true
  static const bool useProduction = bool.fromEnvironment(
    'GE_USE_PRODUCTION',
    defaultValue: false,
  );

  /// Production API host (without /api suffix).
  static const String _productionBaseUrl = String.fromEnvironment(
    'GE_PROD_BASE_URL',
    defaultValue: 'https://globexpert.onrender.com',
  );

  /// Your computer's local WiFi IP. Update if it changes.
  /// Find it with: ipconfig (Windows) or ifconfig / ip addr (Mac/Linux).
  static const String _localHost = String.fromEnvironment(
    'GE_LOCAL_HOST',
    defaultValue: '10.0.2.2',
  );

  static const String _localPort = String.fromEnvironment(
    'GE_LOCAL_PORT',
    defaultValue: '5000',
  );

  static String get baseUrl {
    if (useProduction) {
      return _productionBaseUrl;
    }

    if (kIsWeb) {
      const webLocalUrl = String.fromEnvironment(
        'GE_WEB_LOCAL_URL',
        defaultValue: 'http://localhost:5000',
      );
      return webLocalUrl;
    }

    try {
      if (Platform.isAndroid) {
        return 'http://$_localHost:$_localPort';
      }
      return 'http://localhost:$_localPort';
    } catch (_) {
      return 'http://$_localHost:$_localPort';
    }
  }

  // ---------------------------------------------------------------------------
  // Endpoints
  // ---------------------------------------------------------------------------
  static String get authUrl => '$baseUrl/api/auth';
  static String get usersUrl => '$baseUrl/api/users';
  static String get sellersUrl => '$baseUrl/api/sellers';
  static String get productsUrl => '$baseUrl/api/products';
  static String get servicesUrl => '$baseUrl/api/services';
  static String get ordersUrl => '$baseUrl/api/orders';
}
