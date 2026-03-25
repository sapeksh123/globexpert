import '../models/catalog_item.dart';
import 'api_client.dart';

class CatalogService {
  CatalogService(this._apiClient);

  final ApiClient _apiClient;

  Future<List<CatalogItem>> getCatalog() async {
    final productsResponse = await _apiClient.get('/api/products');
    final servicesResponse = await _apiClient.get('/api/services');

    final products = (productsResponse['data'] as List<dynamic>? ?? [])
        .map((json) => CatalogItem.fromJson(json as Map<String, dynamic>, 'PRODUCT'))
        .toList();

    final services = (servicesResponse['data'] as List<dynamic>? ?? [])
        .map((json) => CatalogItem.fromJson(json as Map<String, dynamic>, 'SERVICE'))
        .toList();

    return [...products, ...services];
  }
}
