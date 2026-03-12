enum LogLevel {
  debug,
  info,
  warning,
  error,
}

class LoggerService {
  static const String _tag = 'Globexpert';

  static void debug(String message, {String? tag, dynamic error, StackTrace? stackTrace}) {
    _log(LogLevel.debug, message, tag: tag, error: error, stackTrace: stackTrace);
  }

  static void info(String message, {String? tag}) {
    _log(LogLevel.info, message, tag: tag);
  }

  static void warning(String message, {String? tag, dynamic error}) {
    _log(LogLevel.warning, message, tag: tag, error: error);
  }

  static void error(String message, {String? tag, dynamic error, StackTrace? stackTrace}) {
    _log(LogLevel.error, message, tag: tag, error: error, stackTrace: stackTrace);
  }

  static void _log(
    LogLevel level,
    String message, {
    String? tag,
    dynamic error,
    StackTrace? stackTrace,
  }) {
    final logTag = tag ?? _tag;
    final timestamp = DateTime.now().toIso8601String();
    final levelName = level.toString().split('.').last.toUpperCase();

    final logMessage = '[$timestamp] [$levelName] [$logTag] $message';

    print(logMessage);

    if (error != null) {
      print('Error: $error');
    }

    if (stackTrace != null) {
      print('StackTrace: $stackTrace');
    }
  }
}
