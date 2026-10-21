/// A governorate as the customer app shows it. Only what a city filter needs
/// lives here — no areas, no counts, nothing the server has not said.
class E7Governorate {
  const E7Governorate({required this.id, required this.nameAr});

  final int id;
  final String nameAr;

  static E7Governorate? byId(List<E7Governorate> governorates, int? id) {
    if (id == null) return null;
    for (final governorate in governorates) {
      if (governorate.id == id) return governorate;
    }
    return null;
  }
}
