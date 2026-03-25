import 'dart:convert';

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
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}$path'),
      headers: await _headers(authenticated: authenticated),
      body: jsonEncode(body),
    );

    return _parse(response);
  }

  Future<Map<String, dynamic>> get(String path, {bool authenticated = false}) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}$path'),
      headers: await _headers(authenticated: authenticated),
    );

    return _parse(response);
  }

  Map<String, dynamic> _parse(http.Response response) {
    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      throw Exception(decoded['message']?.toString() ?? 'API request failed');
    }
    return decoded;
  }
}
