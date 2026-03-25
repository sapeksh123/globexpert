import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'features/auth/auth_provider.dart';
import 'features/auth/login_screen.dart';
import 'features/cart/cart_provider.dart';
import 'features/catalog/catalog_provider.dart';
import 'features/home_shell.dart';
import 'features/orders/orders_provider.dart';
import 'services/api_client.dart';
import 'services/auth_service.dart';
import 'services/catalog_service.dart';
import 'services/order_service.dart';
import 'services/storage_service.dart';
import 'widgets/loading_view.dart';

void main() {
  final storageService = StorageService();
  final apiClient = ApiClient(storageService);
  final authService = AuthService(apiClient);
  final catalogService = CatalogService(apiClient);
  final orderService = OrderService(apiClient);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(authService, storageService)),
        ChangeNotifierProvider(create: (_) => CatalogProvider(catalogService)),
        ChangeNotifierProvider(create: (_) => CartProvider(orderService)),
        ChangeNotifierProvider(create: (_) => OrdersProvider(orderService)),
      ],
      child: const GlobexpertApp(),
    ),
  );
}

class GlobexpertApp extends StatefulWidget {
  const GlobexpertApp({super.key});

  @override
  State<GlobexpertApp> createState() => _GlobexpertAppState();
}

class _GlobexpertAppState extends State<GlobexpertApp> {
  bool _bootstrapped = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_bootstrapped) return;
    _bootstrapped = true;
    context.read<AuthProvider>().restoreSession();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return MaterialApp(
      title: 'Globexpert User',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: auth.isAuthenticated ? const HomeShell() : auth.isLoading ? const LoadingView() : const LoginScreen(),
    );
  }
}
