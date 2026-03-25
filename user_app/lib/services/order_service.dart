import '../models/cart_item.dart';
import '../models/order_summary.dart';
import 'api_client.dart';

class OrderService {
  OrderService(this._apiClient);

  final ApiClient _apiClient;

  Future<void> placeOrder(List<CartItem> items, String deliveryAddress) async {
    final payload = {
      'deliveryAddress': deliveryAddress,
      'items': items
          .map(
            (item) => {
              'itemType': item.item.itemType,
              'itemId': item.item.id,
              'quantity': item.quantity,
            },
          )
          .toList(),
    };

    await _apiClient.post('/api/orders', payload, authenticated: true);
  }

  Future<List<OrderSummary>> fetchOrders() async {
    final response = await _apiClient.get('/api/orders', authenticated: true);
    final rows = response['data'] as List<dynamic>? ?? [];

    return rows
        .map((json) => OrderSummary.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
