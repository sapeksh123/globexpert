import 'package:flutter/material.dart';

import '../../models/order_summary.dart';
import '../../services/order_service.dart';

class OrdersProvider extends ChangeNotifier {
  OrdersProvider(this._orderService);

  final OrderService _orderService;

  bool _isLoading = false;
  String _errorMessage = '';
  List<OrderSummary> _orders = [];

  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;
  List<OrderSummary> get orders => List.unmodifiable(_orders);

  Future<void> loadOrders() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      _orders = await _orderService.fetchOrders();
    } catch (error) {
      _errorMessage = error.toString().replaceFirst('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
