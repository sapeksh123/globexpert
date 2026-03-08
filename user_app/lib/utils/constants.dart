class AppConstants {
  static const String appName = 'Globexpert';
  static const String appVersion = '1.0.0';

  static const int defaultTimeout = 20;
  static const int toastDurationSuccess = 3;
  static const int toastDurationError = 4;

  static const double defaultPadding = 16.0;
  static const double defaultBorderRadius = 8.0;

  static const int minPasswordLength = 6;
  static const int minNameLength = 2;
  static const int minRegisterPasswordLength = 8;

  static const String defaultUserAddress = 'Default user address';

  static const Map<String, String> httpHeaders = {
    'Content-Type': 'application/json',
  };
}

class AppRoutes {
  static const String login = '/login';
  static const String home = '/home';
  static const String catalog = '/catalog';
  static const String cart = '/cart';
  static const String orders = '/orders';
  static const String profile = '/profile';
}

class AppStrings {
  static const String catalogTitle = 'Catalog';
  static const String cartTitle = 'Cart';
  static const String ordersTitle = 'Orders';
  static const String profileTitle = 'Profile';

  static const String noOrdersFound = 'No orders yet';
  static const String noCatalogFound = 'No catalog items found';
  static const String emptyCart = 'Your cart is empty';

  static const String loginSuccessful = 'Login successful';
  static const String registrationSuccessful = 'Registration successful';
  static const String loggedOut = 'Logged out';

  static const String orderPlacedSuccess = 'Order placed successfully';
  static const String itemAddedToCart = 'added to cart';

  static const String networkError = 'Network error: unable to reach backend. Check host/port and internet connection.';
  static const String requestTimeout = 'Request timeout. Server took too long to respond.';
  static const String invalidResponse = 'Invalid response from backend.';
}
