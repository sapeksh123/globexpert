import 'package:flutter/material.dart';

import '../../models/catalog_item.dart';
import '../../services/catalog_service.dart';

class CatalogProvider extends ChangeNotifier {
  CatalogProvider(this._catalogService);

  final CatalogService _catalogService;

  bool _isLoading = false;
  String _query = '';
  String _errorMessage = '';
  List<CatalogItem> _items = [];

  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  List<CatalogItem> get filteredItems {
    if (_query.isEmpty) {
      return _items;
    }

    return _items
        .where((item) => item.title.toLowerCase().contains(_query.toLowerCase()))
        .toList();
  }

  Future<void> loadCatalog() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _items = await _catalogService.getCatalog();
    } catch (error) {
      _errorMessage = error.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setQuery(String query) {
    _query = query;
    notifyListeners();
  }
}
