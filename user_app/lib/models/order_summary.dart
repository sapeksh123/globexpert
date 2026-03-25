class OrderSummary {
  OrderSummary({required this.id, required this.status, required this.subtotal, required this.createdAt});

  final String id;
  final String status;
  final double subtotal;
  final DateTime createdAt;

  factory OrderSummary.fromJson(Map<String, dynamic> json) {
    return OrderSummary(
      id: json['_id']?.toString() ?? '',
      status: json['status']?.toString() ?? 'CONFIRMED',
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0,
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}
