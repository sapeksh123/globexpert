import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import 'api_config.dart';
import 'storage_service.dart';

class ApiClient {
  ApiClient(this._storageService);

  final StorageService _storageService;

  Future<Map<String, String>> _headers({bool authenticated = false}) async {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (authenticated) {
      final token = await _storageService.readToken();
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body, {
    bool authenticated = false,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.baseUrl}$path'),
            headers: await _headers(authenticated: authenticated),
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 20));

      return _parse(response);
    } on SocketException {
      throw Exception('Network error: unable to reach backend. Check host/port and internet connection.');
    } on TimeoutException {
      throw Exception('Request timeout. Server took too long to respond.');
    } on HttpException {
      throw Exception('HTTP error while contacting backend.');
    } on FormatException {
      throw Exception('Invalid response from backend.');
    }
  }

  Future<Map<String, dynamic>> get(String path, {bool authenticated = false}) async {
    try {
      final response = await http
          .get(
            Uri.parse('${ApiConfig.baseUrl}$path'),
            headers: await _headers(authenticated: authenticated),
          )
          .timeout(const Duration(seconds: 20));

      return _parse(response);
    } on SocketException {
      throw Exception('Network error: unable to reach backend. Check host/port and internet connection.');
    } on TimeoutException {
      throw Exception('Request timeout. Server took too long to respond.');
    } on HttpException {
      throw Exception('HTTP error while contacting backend.');
    } on FormatException {
      throw Exception('Invalid response from backend.');
    }
  }

  Map<String, dynamic> _parse(http.Response response) {
    final raw = response.body;
    Map<String, dynamic> decoded = {};

    if (raw.isNotEmpty) {
      final parsed = jsonDecode(raw);
      if (parsed is Map<String, dynamic>) {
        decoded = parsed;
      }
    }

    if (response.statusCode >= 400) {
      throw Exception(decoded['message']?.toString() ?? 'API request failed');
    }

    if (decoded.isNotEmpty && decoded['success'] == false) {
      throw Exception(decoded['message']?.toString() ?? 'API request failed');
    }

    return decoded;
  }
}
