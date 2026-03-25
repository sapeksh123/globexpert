import 'package:flutter/material.dart';

import '../../models/order_summary.dart';
import '../../services/order_service.dart';

class OrdersProvider extends ChangeNotifier {
  OrdersProvider(this._orderService);

  final OrderService _orderService;

  bool _isLoading = false;
  List<OrderSummary> _orders = [];

  bool get isLoading => _isLoading;
  List<OrderSummary> get orders => List.unmodifiable(_orders);

  Future<void> loadOrders() async {
    _isLoading = true;
    notifyListeners();

    try {
      _orders = await _orderService.fetchOrders();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
