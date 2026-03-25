import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'orders_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrdersProvider>().loadOrders();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<OrdersProvider>();

    if (provider.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (provider.orders.isEmpty) {
      return const Center(child: Text('No orders yet'));
    }

    return ListView.builder(
      itemCount: provider.orders.length,
      itemBuilder: (context, index) {
        final order = provider.orders[index];
        return Card(
          child: ListTile(
            title: Text(order.id),
            subtitle: Text('Status: ${order.status}'),
            trailing: Text('\$${order.subtotal.toStringAsFixed(2)}'),
          ),
        );
      },
    );
  }
}
