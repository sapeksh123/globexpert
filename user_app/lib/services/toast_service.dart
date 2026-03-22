import 'package:flutter/material.dart';

class ToastService {
  static void showSuccess(BuildContext context, String message) {
    _showToast(
      context,
      message,
      Colors.green,
      Icons.check_circle,
      const Duration(seconds: 3),
    );
  }

  static void showError(BuildContext context, String message) {
    _showToast(
      context,
      message,
      Colors.red,
      Icons.error,
      const Duration(seconds: 4),
    );
  }

  static void showInfo(BuildContext context, String message) {
    _showToast(
      context,
      message,
      Colors.blue,
      Icons.info,
      const Duration(seconds: 3),
    );
  }

  static void showWarning(BuildContext context, String message) {
    _showToast(
      context,
      message,
      Colors.orange,
      Icons.warning,
      const Duration(seconds: 3),
    );
  }

  static void _showToast(
    BuildContext context,
    String message,
    Color backgroundColor,
    IconData icon,
    Duration duration,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        duration: duration,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}
