import 'package:flutter/material.dart';

import '../../services/auth_service.dart';
import '../../services/storage_service.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider(this._authService, this._storageService);

  final AuthService _authService;
  final StorageService _storageService;

  bool _isLoading = false;
  bool _isAuthenticated = false;
  String _name = '';
  String _role = 'USER';

  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String get name => _name;

  Future<void> restoreSession() async {
    final token = await _storageService.readToken();
    if (token == null || token.isEmpty) {
      _isAuthenticated = false;
      notifyListeners();
      return;
    }

    try {
      final response = await _authService.me();
      final user = response['data'] as Map<String, dynamic>? ?? {};
      _name = user['name']?.toString() ?? '';
      _role = user['role']?.toString() ?? 'USER';
      _isAuthenticated = true;
    } catch (_) {
      await _storageService.clearToken();
      _isAuthenticated = false;
    }

    notifyListeners();
  }

  Future<void> login({required String email, required String password}) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _authService.login(email, password);
      final data = response['data'] as Map<String, dynamic>? ?? {};
      final token = data['token']?.toString() ?? '';
      final user = data['user'] as Map<String, dynamic>? ?? {};

      if (token.isEmpty) {
        throw Exception('Token missing from login response');
      }

      await _storageService.saveToken(token);
      _name = user['name']?.toString() ?? '';
      _role = user['role']?.toString() ?? 'USER';
      _isAuthenticated = true;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({required String name, required String email, required String password}) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.register(name: name, email: email, password: password);
      await login(email: email, password: password);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _storageService.clearToken();
    _isAuthenticated = false;
    _name = '';
    _role = 'USER';
    notifyListeners();
  }
}
