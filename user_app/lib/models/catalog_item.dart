class CatalogItem {
  CatalogItem({
    required this.id,
    required this.title,
    required this.category,
    required this.price,
    required this.itemType,
    this.imageUrl,
    this.stock,
  });

  final String id;
  final String title;
  final String category;
  final double price;
  final String itemType;
  final String? imageUrl;
  final int? stock;

  factory CatalogItem.fromJson(Map<String, dynamic> json, String itemType) {
    return CatalogItem(
      id: json['_id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      itemType: itemType,
      imageUrl: json['imageUrl']?.toString(),
      stock: json['stock'] is num ? (json['stock'] as num).toInt() : null,
    );
  }
}
