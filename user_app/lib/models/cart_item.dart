import 'catalog_item.dart';

class CartItem {
  CartItem({required this.item, this.quantity = 1});

  final CatalogItem item;
  int quantity;

  double get lineTotal => item.price * quantity;
}
