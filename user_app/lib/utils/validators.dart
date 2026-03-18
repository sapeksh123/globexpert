class Validators {
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!value.contains('@') || !value.contains('.')) {
      return 'Enter a valid email address';
    }
    return null;
  }

  static String? validatePassword(String? value, {bool isRegister = false}) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (isRegister && value.length < 8) {
      return 'Password should be at least 8 characters for security';
    }
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  }

  static bool isValidEmail(String email) {
    return email.contains('@') && email.contains('.');
  }

  static bool isStrongPassword(String password) {
    return password.length >= 8 &&
           password.contains(RegExp(r'[0-9]')) &&
           password.contains(RegExp(r'[a-z]')) &&
           password.contains(RegExp(r'[A-Z]'));
  }
}
