import 'package:flutter/material.dart';
import '../services/toast_service.dart';

extension ToastExtension on BuildContext {
  void showSuccessToast(String message) => ToastService.showSuccess(this, message);
  void showErrorToast(String message) => ToastService.showError(this, message);
  void showInfoToast(String message) => ToastService.showInfo(this, message);
  void showWarningToast(String message) => ToastService.showWarning(this, message);
}
