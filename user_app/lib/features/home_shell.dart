import 'package:flutter/material.dart';

import 'cart/cart_screen.dart';
import 'catalog/catalog_screen.dart';
import 'orders/orders_screen.dart';
import 'profile/profile_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  final _pages = const [
    CatalogScreen(),
    CartScreen(),
    OrdersScreen(),
    ProfileScreen(),
  ];

  final _titles = const ['Catalog', 'Cart', 'Orders', 'Profile'];

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final isWide = width >= 900;

    return Scaffold(
      appBar: AppBar(title: Text(_titles[_index])),
      body: isWide
          ? Row(
              children: [
                NavigationRail(
                  selectedIndex: _index,
                  onDestinationSelected: (value) => setState(() => _index = value),
                  labelType: NavigationRailLabelType.all,
                  destinations: const [
                    NavigationRailDestination(icon: Icon(Icons.storefront), label: Text('Catalog')),
                    NavigationRailDestination(icon: Icon(Icons.shopping_cart), label: Text('Cart')),
                    NavigationRailDestination(icon: Icon(Icons.local_shipping), label: Text('Orders')),
                    NavigationRailDestination(icon: Icon(Icons.person), label: Text('Profile')),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: _pages[_index],
                  ),
                ),
              ],
            )
          : Padding(
              padding: const EdgeInsets.all(12),
              child: _pages[_index],
            ),
      bottomNavigationBar: isWide
          ? null
          : NavigationBar(
              selectedIndex: _index,
              onDestinationSelected: (value) => setState(() => _index = value),
              destinations: const [
                NavigationDestination(icon: Icon(Icons.storefront), label: 'Catalog'),
                NavigationDestination(icon: Icon(Icons.shopping_cart), label: 'Cart'),
                NavigationDestination(icon: Icon(Icons.local_shipping), label: 'Orders'),
                NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
              ],
            ),
    );
  }
}
