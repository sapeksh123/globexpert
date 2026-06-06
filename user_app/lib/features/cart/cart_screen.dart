import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../utils/toast_extension.dart';
import 'cart_provider.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();

    return Column(
      children: [
        Expanded(
          child: cart.items.isEmpty
              ? const Center(child: Text('Your cart is empty'))
              : ListView.builder(
                  itemCount: cart.items.length,
                  itemBuilder: (context, index) {
                    final row = cart.items[index];
                    return ListTile(
                      title: Text(row.item.title),
                      subtitle: Text('x${row.quantity} • ${row.item.itemType}'),
                      trailing: Wrap(
                        spacing: 8,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text('Rs. ${row.lineTotal.toStringAsFixed(2)}'),
                          IconButton(
                            icon: const Icon(Icons.delete_outline),
                            tooltip: 'Remove item',
                            onPressed: () => cart.removeItem(row),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Total: Rs. ${cart.total.toStringAsFixed(2)}'),
                const SizedBox(height: 10),
                FilledButton(
                  onPressed: cart.isOrdering || cart.items.isEmpty
                      ? null
                      : () async {
                          try {
                            await cart.placeOrder('Default user address');
                            if (!context.mounted) return;
                            context.showSuccessToast('Order placed successfully');
                          } catch (error) {
                            if (!context.mounted) return;
                            context.showErrorToast(error.toString());
                          }
                        },
                  child: Text(cart.isOrdering ? 'Placing...' : 'Place Order'),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
