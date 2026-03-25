import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

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
                      trailing: Text('\$${row.lineTotal.toStringAsFixed(2)}'),
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
                Text('Total: \$${cart.total.toStringAsFixed(2)}'),
                const SizedBox(height: 10),
                FilledButton(
                  onPressed: cart.isOrdering || cart.items.isEmpty
                      ? null
                      : () async {
                          try {
                            await cart.placeOrder('Default user address');
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Order placed successfully')),
                            );
                          } catch (error) {
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context)
                                .showSnackBar(SnackBar(content: Text(error.toString())));
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
