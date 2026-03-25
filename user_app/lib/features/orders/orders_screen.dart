import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'orders_provider.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  Color _statusColor(String status) {
    switch (status) {
      case 'DELIVERED':
        return Colors.green;
      case 'PROCESSING':
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }

  int _statusStep(String status) {
    switch (status) {
      case 'DELIVERED':
        return 3;
      case 'PROCESSING':
        return 2;
      default:
        return 1;
    }
  }

  Widget _timelineDot(bool active, Color color) {
    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: active ? color : Colors.grey.shade300,
        shape: BoxShape.circle,
      ),
    );
  }

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

    if (provider.errorMessage.isNotEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                provider.errorMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.redAccent),
              ),
              const SizedBox(height: 12),
              FilledButton.tonal(
                onPressed: () => context.read<OrdersProvider>().loadOrders(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    if (provider.orders.isEmpty) {
      return const Center(child: Text('No orders yet'));
    }

    return ListView.builder(
      itemCount: provider.orders.length,
      itemBuilder: (context, index) {
        final order = provider.orders[index];
        final color = _statusColor(order.status);
        final step = _statusStep(order.status);

        return Card(
          child: ListTile(
            title: Text(order.id),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 6),
                Wrap(
                  spacing: 8,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Chip(
                      backgroundColor: color.withValues(alpha: 0.12),
                      label: Text(order.status, style: TextStyle(color: color)),
                    ),
                    Text('Placed: ${order.createdAt.toIso8601String().substring(0, 10)}'),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _timelineDot(step >= 1, color),
                    Expanded(child: Container(height: 2, color: step >= 2 ? color : Colors.grey.shade300)),
                    _timelineDot(step >= 2, color),
                    Expanded(child: Container(height: 2, color: step >= 3 ? color : Colors.grey.shade300)),
                    _timelineDot(step >= 3, color),
                  ],
                ),
                const SizedBox(height: 4),
                const Text('Confirmed  •  Processing  •  Delivered'),
              ],
            ),
            trailing: Text('Rs. ${order.subtotal.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w600)),
          ),
        );
      },
    );
  }
}
