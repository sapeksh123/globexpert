import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../cart/cart_provider.dart';
import 'catalog_provider.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CatalogProvider>().loadCatalog();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CatalogProvider>();

    return Column(
      children: [
        TextField(
          onChanged: provider.setQuery,
          decoration: const InputDecoration(
            prefixIcon: Icon(Icons.search),
            hintText: 'Search products and services',
          ),
        ),
        const SizedBox(height: 12),
        Expanded(
          child: provider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : ListView.separated(
                  itemCount: provider.filteredItems.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = provider.filteredItems[index];
                    return Card(
                      child: ListTile(
                        title: Text(item.title),
                        subtitle: Text('${item.category} • ${item.itemType}'),
                        trailing: FilledButton.tonal(
                          onPressed: () {
                            context.read<CartProvider>().addItem(item);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('${item.title} added to cart')),
                            );
                          },
                          child: Text('\$${item.price.toStringAsFixed(2)}'),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
