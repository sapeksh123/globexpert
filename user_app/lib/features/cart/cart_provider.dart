import 'package:flutter/material.dart';

import '../../models/cart_item.dart';
import '../../models/catalog_item.dart';
import '../../services/order_service.dart';

class CartProvider extends ChangeNotifier {
  CartProvider(this._orderService);

  final OrderService _orderService;

  bool _isOrdering = false;
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);
  bool get isOrdering => _isOrdering;

  double get total => _items.fold(0, (sum, row) => sum + row.lineTotal);

  void addItem(CatalogItem catalogItem) {
    final index = _items.indexWhere((row) => row.item.id == catalogItem.id && row.item.itemType == catalogItem.itemType);
    if (index >= 0) {
      _items[index].quantity += 1;
    } else {
      _items.add(CartItem(item: catalogItem));
    }
    notifyListeners();
  }

  void removeItem(CartItem item) {
    _items.remove(item);
    notifyListeners();
  }

  Future<void> placeOrder(String deliveryAddress) async {
    if (_items.isEmpty) {
      throw Exception('Cart is empty');
    }

    _isOrdering = true;
    notifyListeners();

    try {
      await _orderService.placeOrder(_items, deliveryAddress);
      _items.clear();
    } finally {
      _isOrdering = false;
      notifyListeners();
    }
  }
}
