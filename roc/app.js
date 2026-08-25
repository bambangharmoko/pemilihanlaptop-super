/**
 * APP ENGINE - Toko Super Komputer
 * Sistem Pendukung Keputusan (SPK) Pemilihan Laptop pada Customer Toko Super Komputer
 * Berbasis Web Menggunakan Kombinasi Metode Rank Order Centroid (ROC) & TOPSIS (10 Kriteria)
 * 
 * Implementasi Metodologi:
 * 1. Metode ROC (Rank Order Centroid) untuk Pembobotan Objektif Prioritas 10 Kriteria:
 *    w_i = (1/m) * SUM_{k=i}^m (1/k) dengan penanganan tied-rank (harmonic weight averaging).
 * 2. Metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution):
 *    - Matriks Keputusan X (n x m)
 *    - Matriks Ternormalisasi R (Vector Euclidean Normalization: r_ij = x_ij / sqrt(SUM x_kj^2))
 *    - Matriks Ternormalisasi Terbobot Y (y_ij = w_j * r_ij)
 *    - Solusi Ideal Positif (A+) & Solusi Ideal Negatif (A-) untuk Kriteria Benefit vs Cost
 *    - Jarak Separasi Euclidean Positif (D+) & Negatif (D-)
 *    - Nilai Preferensi / Kedekatan Relatif (Vi = D- / (D+ + D-))
 * 3. Fitur Konsultasi Customer Toko Super Komputer:
 *    - Preset Profil Kebutuhan Konsumen (Mahasiswa, Gaming, Content Creator, Bisnis, Upgradability)
 *    - Saringan Filter Budget Maksimal & Kategori Penggunaan
 *    - Cetak Lembar Hasil Rekomendasi Konsultasi Resmi (Print/PDF)
 *    - Transparansi Matematis Lengkap (Vektor Pembagi, Matriks R, Matriks Y, A+, A-, D+, D-, Vi)
 */

// 52 KOLEKSI DATASET LAPTOP PALING HITS & VIRAL DI INDONESIA (2024 - 2026)
const LAPTOPS_MASTER_COLLECTION = [
  // --- ASUS GAMING & ULTRABOOK ---
  {
    nama: "Asus ROG Zephyrus G14 OLED GA403",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Ultrabook Gaming",
    harga: 25999000,
    cpu_score: 95,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 90,
    baterai_wh: 73,
    berat_kg: 1.50,
    layar_score: 98,
    garansi_score: 4, // 2 Thn Resmi + 1 Thn Perfect Warranty
    upgrade_score: 2, // RAM On-board + 1 Slot SSD
    spesifikasi_ringkas: "Ryzen 9 8945HS / RTX 4070 8GB / 32GB LPDDR5X / 1TB SSD / 3K OLED 120Hz 0.2ms"
  },
  {
    nama: "Asus ROG Zephyrus G16 GU605",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Pro Gaming / Studio",
    harga: 35999000,
    cpu_score: 98,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 95,
    baterai_wh: 90,
    berat_kg: 1.85,
    layar_score: 99,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 9 185H / RTX 4080 12GB / 32GB RAM / 2.5K 240Hz ROG Nebula OLED"
  },
  {
    nama: "Asus ROG Strix G16 G614J",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Esports Gaming",
    harga: 28499000,
    cpu_score: 97,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 94,
    baterai_wh: 90,
    berat_kg: 2.50,
    layar_score: 95,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i9-14900HX / RTX 4070 8GB 140W / ROG Nebula Display QHD 240Hz 3ms"
  },
  {
    nama: "Asus TUF Gaming A15 FA507UV",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Heavy Gaming / 3D",
    harga: 17499000,
    cpu_score: 90,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 88,
    baterai_wh: 90,
    berat_kg: 2.20,
    layar_score: 88,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Ryzen 7 8845HS / RTX 4060 8GB 140W / 90Wh Battery / FHD 144Hz 100% sRGB"
  },
  {
    nama: "Asus TUF Gaming F15 FX507",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Gaming Entry",
    harga: 14299000,
    cpu_score: 86,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 85,
    baterai_wh: 90,
    berat_kg: 2.20,
    layar_score: 85,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-13620H / RTX 4050 6GB 140W / 16GB DDR5 / 144Hz G-Sync"
  },
  {
    nama: "Asus Vivobook S 14 OLED M5406",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Desain / Mahasiswa",
    harga: 14299000,
    cpu_score: 91,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 78,
    baterai_wh: 75,
    berat_kg: 1.30,
    layar_score: 96,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Ryzen 7 8845HS / Radeon 780M / 16GB LPDDR5X / 3K 120Hz OLED 100% DCI-P3"
  },
  {
    nama: "Asus Zenbook 14 OLED UX3405",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Premium Ultraportable",
    harga: 20999000,
    cpu_score: 93,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 76,
    baterai_wh: 75,
    berat_kg: 1.20,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / 32GB LPDDR5X / 3K 120Hz Lumina OLED / 75Wh Battery"
  },
  {
    nama: "Asus Zenbook DUO UX8406",
    merek: "Asus",
    status: "indent",
    kategori_penggunaan: "Dual Screen Workstation",
    harga: 33999000,
    cpu_score: 97,
    ram_gb: 32,
    ssd_gb: 2048,
    gpu_score: 78,
    baterai_wh: 75,
    berat_kg: 1.65,
    layar_score: 99,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Dual 14-inch 3K OLED 120Hz Touchscreens / Intel Core Ultra 9 / 32GB / 2TB NVMe"
  },
  {
    nama: "Asus Vivobook Go 14 E1404",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Budget / Mahasiswa",
    harga: 5999000,
    cpu_score: 68,
    ram_gb: 8,
    ssd_gb: 512,
    gpu_score: 48,
    baterai_wh: 42,
    berat_kg: 1.38,
    layar_score: 75,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Ryzen 3 7320U / 8GB LPDDR5 / 512GB NVMe / FHD Anti-Glare 180 Lay-Flat"
  },
  {
    nama: "Asus Vivobook Pro 15 OLED N6506",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Content Creator",
    harga: 22499000,
    cpu_score: 92,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 89,
    baterai_wh: 75,
    berat_kg: 1.80,
    layar_score: 97,
    garansi_score: 4,
    upgrade_score: 3,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / RTX 4060 8GB / 3K 120Hz OLED / Asus DialPad"
  },

  // --- LENOVO GAMING & ULTRABOOK ---
  {
    nama: "Lenovo Legion Pro 5 16IRX9",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming / Creator",
    harga: 26999000,
    cpu_score: 96,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 92,
    baterai_wh: 80,
    berat_kg: 2.50,
    layar_score: 94,
    garansi_score: 5, // 3 Thn Resmi + 3 Thn ADP
    upgrade_score: 5, // Dual SODIMM + Dual M.2
    spesifikasi_ringkas: "Intel Core i7-14700HX / RTX 4070 8GB / 32GB DDR5 / 1TB SSD / WQXGA 240Hz 500nits"
  },
  {
    nama: "Lenovo Legion 7i 16IRX9",
    merek: "Lenovo",
    status: "indent",
    kategori_penggunaan: "Flagship Gaming",
    harga: 39999000,
    cpu_score: 99,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 96,
    baterai_wh: 99.9,
    berat_kg: 2.24,
    layar_score: 98,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i9-14900HX / RTX 4080 12GB / 32GB DDR5 / 3.2K 165Hz 100% DCI-P3"
  },
  {
    nama: "Lenovo Legion Slim 5 16AHP9",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming Slim",
    harga: 20999000,
    cpu_score: 91,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 89,
    baterai_wh: 80,
    berat_kg: 2.30,
    layar_score: 92,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Ryzen 7 8845HS / RTX 4060 8GB / 16GB DDR5 / 165Hz WQXGA 100% sRGB"
  },
  {
    nama: "Lenovo LOQ 15IAX9 Essential",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming Entry",
    harga: 12999000,
    cpu_score: 84,
    ram_gb: 12,
    ssd_gb: 512,
    gpu_score: 82,
    baterai_wh: 60,
    berat_kg: 2.38,
    layar_score: 85,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i5-12450HX / RTX 3050 6GB 95W / 12GB DDR5 / 100% sRGB 144Hz"
  },
  {
    nama: "Lenovo LOQ 15AHP9",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming Mainstream",
    harga: 16499000,
    cpu_score: 90,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 88,
    baterai_wh: 60,
    berat_kg: 2.38,
    layar_score: 88,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Ryzen 7 8845HS / RTX 4060 8GB 115W / 16GB DDR5 / 144Hz 100% sRGB G-Sync"
  },
  {
    nama: "Lenovo Yoga Slim 7i Aura Edition",
    merek: "Lenovo",
    status: "indent",
    kategori_penggunaan: "AI Ultrabook Next-Gen",
    harga: 23999000,
    cpu_score: 94,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 78,
    baterai_wh: 70,
    berat_kg: 1.46,
    layar_score: 97,
    garansi_score: 5,
    upgrade_score: 1,
    spesifikasi_ringkas: "Intel Core Ultra 7 258V Lunar Lake / 32GB LPDDR5X / 2.8K 120Hz OLED 100% DCI-P3"
  },
  {
    nama: "Lenovo Yoga Pro 9i 16",
    merek: "Lenovo",
    status: "indent",
    kategori_penggunaan: "Studio Creator Pro",
    harga: 32999000,
    cpu_score: 97,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 92,
    baterai_wh: 84,
    berat_kg: 2.18,
    layar_score: 99,
    garansi_score: 5,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 9 185H / RTX 4070 / 32GB / Mini-LED 3.2K 165Hz 1200nits"
  },
  {
    nama: "Lenovo Yoga Slim 7 Carbon 13",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Carbon Featherlight",
    harga: 16499000,
    cpu_score: 87,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 66,
    baterai_wh: 50,
    berat_kg: 0.96,
    layar_score: 94,
    garansi_score: 5,
    upgrade_score: 1,
    spesifikasi_ringkas: "Ryzen 7 5800U / Carbon Fiber & Magnesium / 2.5K QHD+ 90Hz 100% sRGB / 960g"
  },
  {
    nama: "Lenovo IdeaPad Slim 3 14IAH8",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Office / Multitasking",
    harga: 8299000,
    cpu_score: 80,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 58,
    baterai_wh: 47,
    berat_kg: 1.37,
    layar_score: 79,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core i5-12450H / 16GB LPDDR5 / 512GB NVMe / FHD IPS Display"
  },
  {
    nama: "Lenovo ThinkPad E14 Gen 5",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Business Durability",
    harga: 13999000,
    cpu_score: 85,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 65,
    baterai_wh: 57,
    berat_kg: 1.43,
    layar_score: 86,
    garansi_score: 4,
    upgrade_score: 3,
    spesifikasi_ringkas: "Ryzen 7 7730U / MIL-STD-810H Tested / TrackPoint / WUXGA 100% sRGB"
  },

  // --- APPLE MACBOOK SERIES ---
  {
    nama: "Apple MacBook Air M3 13-inch",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Office / Mahasiswa",
    harga: 17999000,
    cpu_score: 90,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 76,
    baterai_wh: 52.6,
    berat_kg: 1.24,
    layar_score: 93,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M3 8-core CPU / 10-core GPU / Liquid Retina Display / Fanless Silent"
  },
  {
    nama: "Apple MacBook Air M3 15-inch",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Produktivitas Luas",
    harga: 21999000,
    cpu_score: 90,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 76,
    baterai_wh: 66.5,
    berat_kg: 1.51,
    layar_score: 94,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M3 8-core / 10-core GPU / 15.3-inch Liquid Retina 500 nits / 6-Speaker"
  },
  {
    nama: "Apple MacBook Pro 14 M3 Pro",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Pro Creator / Studio",
    harga: 31999000,
    cpu_score: 96,
    ram_gb: 18,
    ssd_gb: 512,
    gpu_score: 92,
    baterai_wh: 70,
    berat_kg: 1.61,
    layar_score: 99,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M3 Pro 11-core / 14-core GPU / Liquid Retina XDR 120Hz ProMotion"
  },
  {
    nama: "Apple MacBook Pro 16 M3 Max",
    merek: "Apple",
    status: "indent",
    kategori_penggunaan: "Ultimate Workstation",
    harga: 59999000,
    cpu_score: 99,
    ram_gb: 48,
    ssd_gb: 1024,
    gpu_score: 98,
    baterai_wh: 99.6,
    berat_kg: 2.16,
    layar_score: 99,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M3 Max 16-core / 40-core GPU / 48GB Unified / 16.2 Liquid Retina XDR"
  },
  {
    nama: "Apple MacBook Air M2 13-inch",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Budget iOS Ecosystem",
    harga: 14999000,
    cpu_score: 86,
    ram_gb: 8,
    ssd_gb: 256,
    gpu_score: 72,
    baterai_wh: 52.6,
    berat_kg: 1.24,
    layar_score: 92,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M2 8-core CPU / 8-core GPU / Midnight Blue / MagSafe 3 Charging"
  },

  // --- ACER PREDATOR & SWIFT ---
  {
    nama: "Acer Predator Helios Neo 16 PHN16",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "High-End Gaming",
    harga: 22999000,
    cpu_score: 94,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 90,
    baterai_wh: 90,
    berat_kg: 2.60,
    layar_score: 94,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-14650HX / RTX 4060 8GB / Liquid Metal Cooling / WQXGA 165Hz 500nits"
  },
  {
    nama: "Acer Predator Helios 18 PH18",
    merek: "Acer",
    status: "indent",
    kategori_penggunaan: "Desktop Replacement",
    harga: 44999000,
    cpu_score: 99,
    ram_gb: 32,
    ssd_gb: 2048,
    gpu_score: 97,
    baterai_wh: 90,
    berat_kg: 3.25,
    layar_score: 98,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i9-14900HX / RTX 4080 12GB / Mini-LED 18-inch 250Hz WQXGA"
  },
  {
    nama: "Acer Nitro V 15 ANV15",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Gaming Budget Populer",
    harga: 12499000,
    cpu_score: 83,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 84,
    baterai_wh: 57,
    berat_kg: 2.10,
    layar_score: 82,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i5-13420H / RTX 4050 6GB / 16GB DDR5 / 144Hz FHD IPS"
  },
  {
    nama: "Acer Nitro V 16 ANV16",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Gaming 16-Inch",
    harga: 16999000,
    cpu_score: 90,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 88,
    baterai_wh: 57,
    berat_kg: 2.45,
    layar_score: 88,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Ryzen 7 8845HS / RTX 4060 8GB / 16GB DDR5 / WUXGA 16:10 165Hz 100% sRGB"
  },
  {
    nama: "Acer Swift Go 14 OLED EVO SFG14",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Bisnis / Multitasking",
    harga: 13499000,
    cpu_score: 88,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 74,
    baterai_wh: 65,
    berat_kg: 1.32,
    layar_score: 95,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / Intel Arc / 16GB LPDDR5X / 2.8K 90Hz OLED 100% DCI-P3"
  },
  {
    nama: "Acer Aspire 5 Slim A514-56",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Mahasiswa / Multitasking",
    harga: 8799000,
    cpu_score: 77,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 60,
    baterai_wh: 50,
    berat_kg: 1.48,
    layar_score: 80,
    garansi_score: 3,
    upgrade_score: 4,
    spesifikasi_ringkas: "Intel Core i5-1335U / 16GB DDR4 / 512GB NVMe / Thunderbolt 4 Support"
  },

  // --- HP OMEN, VICTUS & PAVILION ---
  {
    nama: "HP OMEN Transcend 14",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Slim OLED Gaming",
    harga: 25499000,
    cpu_score: 93,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 89,
    baterai_wh: 71,
    berat_kg: 1.63,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / RTX 4060 8GB / 2.8K 120Hz OLED 0.2ms / RGB HyperX"
  },
  {
    nama: "HP OMEN 16-wf1000",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Heavy Duty Gaming",
    harga: 27999000,
    cpu_score: 96,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 92,
    baterai_wh: 83,
    berat_kg: 2.39,
    layar_score: 94,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-14700HX / RTX 4070 8GB / 32GB DDR5 / QHD 240Hz 3ms 100% sRGB"
  },
  {
    nama: "HP Victus 15-fb1000",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Gaming Entry Budget",
    harga: 10999000,
    cpu_score: 78,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 75,
    baterai_wh: 52.5,
    berat_kg: 2.29,
    layar_score: 80,
    garansi_score: 3,
    upgrade_score: 4,
    spesifikasi_ringkas: "Ryzen 5 7535HS / RTX 2050 4GB / 16GB DDR5 / FHD IPS 144Hz"
  },
  {
    nama: "HP Victus 16-r1000",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Mid-Range Gaming",
    harga: 18999000,
    cpu_score: 92,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 89,
    baterai_wh: 70,
    berat_kg: 2.33,
    layar_score: 88,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-14700HX / RTX 4060 8GB / 16GB DDR5 / 165Hz 100% sRGB"
  },
  {
    nama: "HP Pavilion Aero 13-be2000",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Mobilitas Tinggi",
    harga: 11999000,
    cpu_score: 83,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 60,
    baterai_wh: 43,
    berat_kg: 0.97,
    layar_score: 86,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Ryzen 5 7535U / Radeon 660M / Super Ringan 970g Magnesium Chassis"
  },
  {
    nama: "HP Envy x360 14-fa0000",
    merek: "HP",
    status: "ready",
    kategori_penggunaan: "Convertible / Desain",
    harga: 16999000,
    cpu_score: 88,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 72,
    baterai_wh: 59,
    berat_kg: 1.39,
    layar_score: 96,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Ryzen 7 8840HS / 2.8K OLED Touchscreen / Stylus Pen Included / 360 Hinge"
  },

  // --- MSI TITAN, STEALTH & KATANA ---
  {
    nama: "MSI Titan 18 HX A14V",
    merek: "MSI",
    status: "indent",
    kategori_penggunaan: "Extreme Enthusiast",
    harga: 89999000,
    cpu_score: 99,
    ram_gb: 64,
    ssd_gb: 2048,
    gpu_score: 99,
    baterai_wh: 99.9,
    berat_kg: 3.60,
    layar_score: 99,
    garansi_score: 5,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i9-14900HX / RTX 4090 16GB 175W / 64GB DDR5 / 18-inch 4K 120Hz Mini-LED"
  },
  {
    nama: "MSI Stealth 16 AI Studio A1V",
    merek: "MSI",
    status: "ready",
    kategori_penggunaan: "Creator Gaming Slim",
    harga: 32999000,
    cpu_score: 97,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 92,
    baterai_wh: 99.9,
    berat_kg: 1.99,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 4,
    spesifikasi_ringkas: "Intel Core Ultra 9 185H / RTX 4070 8GB / Magnesium-Aluminum / QHD+ 240Hz OLED"
  },
  {
    nama: "MSI Katana 15 B13VFK",
    merek: "MSI",
    status: "ready",
    kategori_penggunaan: "Gaming Performance",
    harga: 16899000,
    cpu_score: 88,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 89,
    baterai_wh: 53.5,
    berat_kg: 2.25,
    layar_score: 84,
    garansi_score: 3,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-13620H / RTX 4060 8GB / 16GB DDR5 / 1TB SSD / 144Hz FHD IPS"
  },
  {
    nama: "MSI Cyborg 15 A13VEK",
    merek: "MSI",
    status: "ready",
    kategori_penggunaan: "Gaming Cyberpunk",
    harga: 14899000,
    cpu_score: 86,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 85,
    baterai_wh: 53.5,
    berat_kg: 1.98,
    layar_score: 82,
    garansi_score: 3,
    upgrade_score: 4,
    spesifikasi_ringkas: "Intel Core i7-13620H / RTX 4050 6GB / 16GB DDR5 / Translucent Cyberpunk Chassis"
  },
  {
    nama: "MSI Modern 14 C12M",
    merek: "MSI",
    status: "ready",
    kategori_penggunaan: "Mahasiswa / Casual",
    harga: 7499000,
    cpu_score: 75,
    ram_gb: 8,
    ssd_gb: 512,
    gpu_score: 54,
    baterai_wh: 39.3,
    berat_kg: 1.40,
    layar_score: 78,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core i3-1215U / 8GB DDR4 / 512GB NVMe / Ultra-Light 1.4Kg Flip-n-Share"
  },

  // --- DELL & ALIENWARE ---
  {
    nama: "Dell XPS 14 9440",
    merek: "Dell",
    status: "indent",
    kategori_penggunaan: "Executive Luxury",
    harga: 36999000,
    cpu_score: 94,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 82,
    baterai_wh: 69.5,
    berat_kg: 1.68,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 1,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / RTX 4050 / 32GB LPDDR5X / 3.2K OLED Touchscreen"
  },
  {
    nama: "Dell G15 5530 Gaming",
    merek: "Dell",
    status: "ready",
    kategori_penggunaan: "Gaming Heavy Duty",
    harga: 19499000,
    cpu_score: 91,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 89,
    baterai_wh: 86,
    berat_kg: 2.81,
    layar_score: 87,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-13650HX / RTX 4060 8GB 140W / 16GB DDR5 / FHD 165Hz sRGB"
  },
  {
    nama: "Dell Inspiron 14 5440",
    merek: "Dell",
    status: "ready",
    kategori_penggunaan: "Office / Profesional",
    harga: 12499000,
    cpu_score: 82,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 62,
    baterai_wh: 54,
    berat_kg: 1.54,
    layar_score: 84,
    garansi_score: 3,
    upgrade_score: 3,
    spesifikasi_ringkas: "Intel Core 5 120U / Intel Graphics / 16GB DDR5 / 16:10 FHD+ ComfortView"
  },

  // --- BRAND LOKAL VIRAL (ADVAN & AXIOO) ---
  {
    nama: "Advan Workplus AMD Edition",
    merek: "Advan",
    status: "ready",
    kategori_penggunaan: "Budget Produktivitas",
    harga: 6899000,
    cpu_score: 78,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 68,
    baterai_wh: 58,
    berat_kg: 1.40,
    layar_score: 82,
    garansi_score: 2,
    upgrade_score: 3,
    spesifikasi_ringkas: "Ryzen 5 6600H / Radeon 660M / 16GB LPDDR5 / Dual M.2 SSD Slot Metal Body"
  },
  {
    nama: "Advan PixelWar Gaming",
    merek: "Advan",
    status: "ready",
    kategori_penggunaan: "Gaming Budget Lokal",
    harga: 9499000,
    cpu_score: 80,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 74,
    baterai_wh: 65,
    berat_kg: 1.95,
    layar_score: 89,
    garansi_score: 2,
    upgrade_score: 4,
    spesifikasi_ringkas: "Ryzen 5 6600H / Radeon RX 6500M 4GB / 2.5K 120Hz 100% sRGB Display"
  },
  {
    nama: "Advan 360 Stylus 2-in-1",
    merek: "Advan",
    status: "ready",
    kategori_penggunaan: "Budget Convertible",
    harga: 5999000,
    cpu_score: 72,
    ram_gb: 8,
    ssd_gb: 256,
    gpu_score: 50,
    baterai_wh: 51,
    berat_kg: 1.50,
    layar_score: 82,
    garansi_score: 2,
    upgrade_score: 3,
    spesifikasi_ringkas: "Intel Core i3-1115G4 / FHD Touchscreen 360 / Metal Chassis / Stylus Active Support"
  },
  {
    nama: "Axioo Pongo 760 V2",
    merek: "Axioo",
    status: "ready",
    kategori_penggunaan: "Gaming Lokal Powerhouse",
    harga: 15499000,
    cpu_score: 89,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 89,
    baterai_wh: 54,
    berat_kg: 2.15,
    layar_score: 88,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-13620H / RTX 4060 8GB 140W / 16GB DDR5 / 144Hz 100% sRGB"
  },
  {
    nama: "Axioo Hype 5 AMD Edition",
    merek: "Axioo",
    status: "ready",
    kategori_penggunaan: "Budget / Mahasiswa",
    harga: 5299000,
    cpu_score: 70,
    ram_gb: 8,
    ssd_gb: 256,
    gpu_score: 52,
    baterai_wh: 45,
    berat_kg: 1.42,
    layar_score: 76,
    garansi_score: 2,
    upgrade_score: 3,
    spesifikasi_ringkas: "Ryzen 5 5500U / 8GB Upgradable / 256GB NVMe / FHD IPS Display"
  },
  {
    nama: "Axioo Hype 7 AMD Edition",
    merek: "Axioo",
    status: "ready",
    kategori_penggunaan: "Multitasking Terjangkau",
    harga: 6999000,
    cpu_score: 78,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 60,
    baterai_wh: 45,
    berat_kg: 1.42,
    layar_score: 78,
    garansi_score: 2,
    upgrade_score: 4,
    spesifikasi_ringkas: "Ryzen 7 5700U 8-Core / 16GB DDR4 / 512GB NVMe / Backlit Keyboard"
  },
  {
    nama: "Huawei MateBook D 14 2024",
    merek: "Huawei",
    status: "ready",
    kategori_penggunaan: "Office / Mobile",
    harga: 9999000,
    cpu_score: 80,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 64,
    baterai_wh: 56,
    berat_kg: 1.39,
    layar_score: 84,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core i5-1240P / 16GB LPDDR4X / 16:10 FullView Display / Metaline Antenna"
  }
];

// Helper Definisi 10 Master Kriteria (C1 s/d C10)
function getInitialKriteriaList() {
  const masterKriteria = [
    { id: 1, kode: 'C1', nama: 'Harga Beli', tipe: 'Cost', satuan: 'Rupiah (Rp)', rank: 1, bobot: 0, keterangan: 'Nominal harga beli toko (makin hemat makin diprioritaskan)' },
    { id: 2, kode: 'C2', nama: 'Processor (CPU)', tipe: 'Benefit', satuan: 'Skor 0-100', rank: 2, bobot: 0, keterangan: 'Performa komputasi inti prosesor benchmark' },
    { id: 3, kode: 'C3', nama: 'Kapasitas RAM', tipe: 'Benefit', satuan: 'Gigabyte (GB)', rank: 3, bobot: 0, keterangan: 'Memori multitasking dan rendering aplikasi' },
    { id: 4, kode: 'C4', nama: 'Kapasitas SSD', tipe: 'Benefit', satuan: 'Gigabyte (GB)', rank: 4, bobot: 0, keterangan: 'Kapasitas storage penyimpanan sistem & data' },
    { id: 5, kode: 'C5', nama: 'Kartu Grafis (GPU)', tipe: 'Benefit', satuan: 'Skor 0-100', rank: 5, bobot: 0, keterangan: 'Performa visual grafis, gaming, dan 3D rendering' },
    { id: 6, kode: 'C6', nama: 'Daya Baterai', tipe: 'Benefit', satuan: 'Watt-Hour (Wh)', rank: 6, bobot: 0, keterangan: 'Kapasitas baterai durasi operasional tanpa colokan' },
    { id: 7, kode: 'C7', nama: 'Portabilitas (Berat)', tipe: 'Cost', satuan: 'Kilogram (Kg)', rank: 7, bobot: 0, keterangan: 'Bobot fisik laptop (makin ringan makin baik dibawa)' },
    { id: 8, kode: 'C8', nama: 'Kualitas Layar', tipe: 'Benefit', satuan: 'Skor 0-100', rank: 8, bobot: 0, keterangan: 'Kualitas panel display, akurasi warna & refresh rate' },
    { id: 9, kode: 'C9', nama: 'Masa & Layanan Garansi', tipe: 'Benefit', satuan: 'Skala 1-5', rank: 9, bobot: 0, keterangan: 'Lama garansi resmi & perlindungan kerusakan (ADP)' },
    { id: 10, kode: 'C10', nama: 'Kemampuan Upgrade', tipe: 'Benefit', satuan: 'Skala 1-5', rank: 10, bobot: 0, keterangan: 'Kemudahan & fleksibilitas ekspansi slot RAM & SSD' }
  ];

  try {
    const savedRanks = localStorage.getItem('spk_criteria_ranks_10');
    if (savedRanks) {
      const parsed = JSON.parse(savedRanks);
      if (Array.isArray(parsed)) {
        parsed.forEach(saved => {
          const target = masterKriteria.find(k => k.id === saved.id || k.kode === saved.kode);
          if (target && typeof saved.rank === 'number' && saved.rank >= 1 && saved.rank <= 10) {
            target.rank = Number(saved.rank);
          }
        });
      }
    }
  } catch(e) {
    console.warn("Gagal membaca saved ranks:", e);
  }

  return masterKriteria;
}

// Helper untuk inisialisasi filter ketersediaan tersimpan
function getInitialFilter() {
  try {
    const saved = localStorage.getItem('spk_filter_status');
    if (saved && ['all', 'ready', 'indent'].includes(saved)) {
      return saved;
    }
  } catch(e) {}
  return 'all';
}

function spkApp() {
  return {
    dbStatus: 'checking', // 'online' | 'table_missing' | 'checking'
    isLoading: false,
    isInjectingDemo: false,
    modalInput: false,
    modalMatriks: false,
    modalPanduan: false, // Modal Landasan Teori Akademik Skripsi
    modalSql: false,
    copiedSql: false,
    isEditMode: false,
    isSaving: false,
    filterStatus: getInitialFilter(),
    
    // Fitur Konsultasi Khusus Customer Toko Super Komputer
    customerNama: '',
    budgetMaxFilter: null,
    brandFilter: 'all',
    kategoriFilter: 'all',
    searchQuery: '',
    activePreset: null,

    toasts: [],
    lastCalculatedAt: null,
    hasCalculated: false,
    sqlScriptText: (typeof window !== 'undefined' && window.SupabaseService) ? window.SupabaseService.SQL_SCHEMA : '',
    
    // Fitur Seleksi Banyak Laptop (Bulk Actions)
    selectedLaptopIds: [],

    // State Modal Dialog Konfirmasi Cantik (Ganti confirm bawaan browser)
    confirmModal: {
      show: false,
      title: '',
      message: '',
      subMessage: '',
      items: [],
      confirmText: 'Konfirmasi',
      cancelText: 'Batal',
      type: 'primary', // 'primary' | 'danger' | 'warning'
      action: null
    },

    // Master 10 Kriteria Keputusan dengan data rank tersimpan
    kriteriaList: getInitialKriteriaList(),

    laptopsData: [],
    hasilRanking: [],
    matriksData: null,

    // Form Model Input Laptop (Lengkap C1 - C10)
    formLaptop: {
      id: null,
      nama: '',
      merek: '',
      status: 'ready',
      kategori_penggunaan: 'Umum',
      harga: null,
      cpu_score: null,
      ram_gb: null,
      ssd_gb: null,
      gpu_score: null,
      baterai_wh: null,
      berat_kg: null,
      layar_score: null,
      garansi_score: 3, // Default 2 Thn Resmi
      upgrade_score: 3, // Default 1 Slot RAM + 1 M.2 SSD
      spesifikasi_ringkas: ''
    },

    async init() {
      // 1. Hitung bobot ROC awal untuk 10 kriteria
      this.hitungBobotROC();

      // 2. Ambil data dari Supabase / Local Storage
      await this.loadDataLaptops(false);

      // 3. Sinkronkan otomatis 10 Master Kriteria (C1 - C10) ke tabel 'kriteria' di Supabase Cloud
      if (window.SupabaseService && window.SupabaseService.syncMasterKriteria) {
        window.SupabaseService.syncMasterKriteria(this.kriteriaList).then(res => {
          if (res && !res.error) {
            console.log("✅ 10 Master Kriteria (C1-C10) tersinkron otomatis ke tabel 'kriteria' Supabase Cloud.");
          }
        }).catch(() => {});
      }
    },

    setFilter(status) {
      this.filterStatus = status;
      this.saveSettings();
      this.kalkulasiTOPSIS(false);
    },

    saveSettings() {
      try {
        localStorage.setItem('spk_filter_status', this.filterStatus);
        const ranksToSave = this.kriteriaList.map(k => ({ id: k.id, kode: k.kode, rank: Number(k.rank) }));
        localStorage.setItem('spk_criteria_ranks_10', JSON.stringify(ranksToSave));
      } catch(e) {
        console.warn("Gagal menyimpan setting ke localStorage:", e);
      }
    },

    // Notifikasi Toast
    showToast(message, type = 'success') {
      const id = Date.now();
      this.toasts.push({ id, message, type });
      setTimeout(() => this.removeToast(id), 5500);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

    salinSqlScript() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.sqlScriptText);
      }
      this.copiedSql = true;
      this.showToast("Script SQL DDL 10 Kriteria berhasil disalin! Jalankan di SQL Editor Supabase.", "success");
      setTimeout(() => this.copiedSql = false, 3000);
    },

    // KONTROL CUSTOM MODAL KONFIRMASI MODERN
    openConfirm({ title, message, subMessage = '', items = [], confirmText = 'Konfirmasi', cancelText = 'Batal', type = 'primary', action }) {
      this.confirmModal = {
        show: true,
        title,
        message,
        subMessage,
        items,
        confirmText,
        cancelText,
        type,
        action
      };
    },
    closeConfirm() {
      this.confirmModal.show = false;
    },
    executeConfirmAction() {
      if (typeof this.confirmModal.action === 'function') {
        this.confirmModal.action();
      }
      this.closeConfirm();
    },

    // KONTROL SELEKSI BANYAK LAPTOP (BULK ACTIONS)
    toggleSelectAll() {
      if (this.selectedLaptopIds.length === this.laptopsData.length) {
        this.selectedLaptopIds = [];
      } else {
        this.selectedLaptopIds = this.laptopsData.map(l => l.id);
      }
    },
    toggleSelectLaptop(id) {
      const numericId = id;
      if (this.selectedLaptopIds.includes(numericId)) {
        this.selectedLaptopIds = this.selectedLaptopIds.filter(i => i !== numericId);
      } else {
        this.selectedLaptopIds.push(numericId);
      }
    },
    isSelected(id) {
      return this.selectedLaptopIds.includes(id);
    },
    deselectAll() {
      this.selectedLaptopIds = [];
    },

    // Helper Keterangan Garansi C9
    getGaransiLabel(score) {
      const s = Number(score);
      switch(s) {
        case 1: return '1 Thn Distributor';
        case 2: return '1 Thn Resmi';
        case 3: return '2 Thn Resmi';
        case 4: return '2 Thn Resmi + ADP';
        case 5: return '3 Thn Resmi + ADP';
        default: return `${s} Thn`;
      }
    },

    // Helper Keterangan Upgradeability C10
    getUpgradeLabel(score) {
      const s = Number(score);
      switch(s) {
        case 1: return 'Full On-Board';
        case 2: return 'RAM On-Board + 1 SSD';
        case 3: return '1 Slot RAM + 1 SSD';
        case 4: return 'Dual Slot RAM + 1 SSD';
        case 5: return 'Dual RAM + Dual M.2 SSD';
        default: return `Skor ${s}`;
      }
    },

    // Helper Smart Badges Keunggulan Laptop Khusus Pelanggan
    getKeunggulanLaptop(laptop) {
      if (!laptop) return [];
      const tags = [];
      if (Number(laptop.harga) <= 10000000) tags.push({ label: 'Hemat Budget', icon: '💰', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' });
      if (Number(laptop.cpu_score) >= 90) tags.push({ label: 'CPU Kencang', icon: '🚀', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' });
      if (Number(laptop.gpu_score) >= 85) tags.push({ label: 'Gaming & 3D Top', icon: '🎮', color: 'bg-purple-50 text-purple-700 border-purple-200' });
      if (Number(laptop.baterai_wh) >= 70) tags.push({ label: 'Baterai Awet', icon: '🔋', color: 'bg-blue-50 text-blue-700 border-blue-200' });
      if (Number(laptop.berat_kg) <= 1.45) tags.push({ label: 'Ringan & Portabel', icon: '🪶', color: 'bg-amber-50 text-amber-700 border-amber-200' });
      if (Number(laptop.layar_score) >= 92) tags.push({ label: 'Layar Akurat/OLED', icon: '✨', color: 'bg-sky-50 text-sky-700 border-sky-200' });
      if (Number(laptop.garansi_score) >= 4) tags.push({ label: 'Garansi + ADP', icon: '🛡️', color: 'bg-rose-50 text-rose-700 border-rose-200' });
      if (Number(laptop.upgrade_score) >= 4) tags.push({ label: 'Mudah Upgrade', icon: '🔧', color: 'bg-teal-50 text-teal-700 border-teal-200' });
      return tags.slice(0, 3);
    },

    // Helper Filter Pelanggan
    getAvailableBrands() {
      if (!this.laptopsData || this.laptopsData.length === 0) return [];
      const set = new Set(this.laptopsData.map(l => l.merek).filter(Boolean));
      return Array.from(set).sort();
    },
    getAvailableKategoris() {
      if (!this.laptopsData || this.laptopsData.length === 0) return [];
      const set = new Set(this.laptopsData.map(l => l.kategori_penggunaan).filter(Boolean));
      return Array.from(set).sort();
    },
    setQuickBudget(val) {
      this.budgetMaxFilter = val;
      this.kalkulasiTOPSIS(false);
    },
    setStatusFilter(s) {
      this.filterStatus = s;
      this.kalkulasiTOPSIS(false);
    },
    resetAllFilters() {
      this.budgetMaxFilter = null;
      this.brandFilter = 'all';
      this.kategoriFilter = 'all';
      this.filterStatus = 'all';
      this.searchQuery = '';
      this.kalkulasiTOPSIS(false);
      this.showToast("Semua filter pencarian telah direset.", "info");
    },

    // 1. RUMUS PEMBOBOTAN METODE ROC (Rank Order Centroid - m = 10)
    // Formula Akademik: w_i = (1/m) * SUM_{k=i}^m (1/k)
    hitungBobotROC() {
      const m = this.kriteriaList.length; // m = 10
      const sorted = [...this.kriteriaList].sort((a, b) => a.rank - b.rank);

      let currentPos = 1;
      let i = 0;
      while (i < sorted.length) {
        let j = i;
        while (j < sorted.length && sorted[j].rank === sorted[i].rank) {
          j++;
        }
        const groupCount = j - i;
        
        let groupWeightSum = 0;
        for (let p = currentPos; p < currentPos + groupCount; p++) {
          let harmonicSum = 0;
          for (let k = p; k <= m; k++) {
            harmonicSum += (1 / k);
          }
          groupWeightSum += harmonicSum / m;
        }
        const avgWeight = groupWeightSum / groupCount;

        for (let k = i; k < j; k++) {
          const target = this.kriteriaList.find(item => item.id === sorted[k].id);
          if (target) target.bobot = avgWeight;
        }

        currentPos += groupCount;
        i = j;
      }
    },

    // Handler saat pengguna mengubah rank pada dropdown kriteria
    onRankChange() {
      this.activePreset = null; // Custom user setting
      this.kriteriaList.forEach(k => {
        k.rank = Number(k.rank);
      });
      this.hitungBobotROC();
      this.saveSettings();
    },

    // APLIKASI PRESET KEBUTUHAN CUSTOMER (FITUR KHAS SPK TOKO SUPER KOMPUTER)
    applyCustomerPreset(presetKey) {
      this.activePreset = presetKey;
      let newRanks = {};

      switch(presetKey) {
        case 'mahasiswa':
          // Mahasiswa: Prioritas Harga Hemat (C1), Baterai Awet (C6), Ringan (C7), Layar Bagus (C8)
          newRanks = { C1: 1, C6: 2, C7: 3, C8: 4, C3: 5, C4: 6, C2: 7, C9: 8, C10: 9, C5: 10 };
          this.showToast("🎯 Preset 'Mahasiswa / Pelajar' diterapkan (Fokus Harga Hemat & Baterai).", "info");
          break;

        case 'gaming':
          // Gaming: Prioritas GPU (C5), CPU (C2), RAM (C3), Layar High-Hz (C8), SSD (C4)
          newRanks = { C5: 1, C2: 2, C3: 3, C8: 4, C4: 5, C6: 6, C10: 7, C9: 8, C1: 9, C7: 10 };
          this.showToast("🎯 Preset 'Gaming & 3D Rendering' diterapkan (Fokus GPU & CPU).", "info");
          break;

        case 'creator':
          // Creator: Prioritas Layar Akurasi Tinggi (C8), CPU (C2), RAM (C3), SSD (C4), GPU (C5)
          newRanks = { C8: 1, C2: 2, C3: 3, C4: 4, C5: 5, C1: 6, C6: 7, C9: 8, C7: 9, C10: 10 };
          this.showToast("🎯 Preset 'Content Creator / Desain' diterapkan (Fokus Layar OLED & CPU).", "info");
          break;

        case 'bisnis':
          // Bisnis: Prioritas Ringan (C7), Baterai (C6), Garansi ADP (C9), Harga (C1), Layar (C8)
          newRanks = { C7: 1, C6: 2, C9: 3, C1: 4, C8: 5, C3: 6, C2: 7, C4: 8, C10: 9, C5: 10 };
          this.showToast("🎯 Preset 'Bisnis & Eksekutif Mobile' diterapkan (Fokus Portabilitas & Garansi).", "info");
          break;

        case 'upgrade':
          // Investasi Jangka Panjang: Prioritas Upgradeability (C10), Garansi (C9), RAM (C3), SSD (C4)
          newRanks = { C10: 1, C9: 2, C3: 3, C4: 4, C2: 5, C1: 6, C6: 7, C8: 8, C7: 9, C5: 10 };
          this.showToast("🎯 Preset 'Investasi Jangka Panjang' diterapkan (Fokus Upgrade & Garansi).", "info");
          break;

        default:
          return;
      }

      this.kriteriaList.forEach(k => {
        if (newRanks[k.kode]) {
          k.rank = newRanks[k.kode];
        }
      });

      this.hitungBobotROC();
      this.saveSettings();
    },

    // Handler saat pengguna mengubah filter ketersediaan
    setFilter(status) {
      this.filterStatus = status;
      this.saveSettings();
    },

    resetPrioritas() {
      this.activePreset = null;
      this.kriteriaList.forEach((item, i) => {
        item.rank = i + 1;
      });
      this.kriteriaList = [...this.kriteriaList];
      try {
        localStorage.removeItem('spk_criteria_ranks_10');
      } catch(e) {}
      this.hitungBobotROC();
      this.saveSettings();
      this.showToast("Prioritas kriteria dikembalikan ke default (Rank 1 s/d 10).", "info");
    },

    // 2. MEMUAT DATA LAPTOP MELALUI SUPABASE SERVICE
    async loadDataLaptops(showFeedback = false) {
      this.isLoading = true;
      const res = await window.SupabaseService.getLaptops();

      if (res.isTableMissing) {
        this.dbStatus = 'table_missing';
        if (showFeedback) {
          this.showToast("Tabel 'laptops' belum dibuat di database Supabase! Klik setup SQL.", "warning");
          this.modalSql = true;
        }
      } else if (!res.error && res.data) {
        this.dbStatus = 'online';
        this.laptopsData = res.data.map(l => ({
          ...l,
          garansi_score: Number(l.garansi_score || 3),
          upgrade_score: Number(l.upgrade_score || 3)
        }));
        localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
        if (showFeedback) {
          this.showToast(`Berhasil tersinkron! Dimuat ${this.laptopsData.length} laptop dari Supabase Cloud.`, "success");
        }
        this.isLoading = false;
        return;
      } else {
        if (showFeedback) {
          this.showToast("Gagal mengambil data dari Supabase: " + (res.error?.message || 'Error koneksi'), "error");
        }
      }

      // Fallback Local Storage jika Supabase belum siap
      const local = localStorage.getItem('spk_laptops_backup_10') || localStorage.getItem('spk_laptops_backup');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          this.laptopsData = parsed.map(l => ({
            ...l,
            garansi_score: Number(l.garansi_score || 3),
            upgrade_score: Number(l.upgrade_score || 3)
          }));
        } catch(e) {
          this.laptopsData = [];
        }
      }
      this.isLoading = false;
    },

    // 3. KONTROL MODAL FORM INPUT LAPTOP
    bukaModalTambah() {
      this.isEditMode = false;
      this.formLaptop = {
        id: null,
        nama: '',
        merek: '',
        status: 'ready',
        kategori_penggunaan: 'Umum',
        harga: null,
        cpu_score: null,
        ram_gb: null,
        ssd_gb: null,
        gpu_score: null,
        baterai_wh: null,
        berat_kg: null,
        layar_score: null,
        garansi_score: 3,
        upgrade_score: 3,
        spesifikasi_ringkas: ''
      };
      this.modalInput = true;
    },

    bukaModalEdit(laptop) {
      this.isEditMode = true;
      this.formLaptop = {
        ...laptop,
        garansi_score: Number(laptop.garansi_score || 3),
        upgrade_score: Number(laptop.upgrade_score || 3)
      };
      this.modalInput = true;
    },

    // 4. SIMPAN DATA LAPTOP (CREATE & UPDATE DENGAN SINKRONISASI CLOUD)
    async simpanLaptop() {
      this.isSaving = true;
      const payload = {
        nama: this.formLaptop.nama,
        merek: this.formLaptop.merek,
        status: this.formLaptop.status,
        kategori_penggunaan: this.formLaptop.kategori_penggunaan || 'Umum',
        harga: Number(this.formLaptop.harga),
        cpu_score: Number(this.formLaptop.cpu_score),
        ram_gb: Number(this.formLaptop.ram_gb),
        ssd_gb: Number(this.formLaptop.ssd_gb),
        gpu_score: Number(this.formLaptop.gpu_score),
        baterai_wh: Number(this.formLaptop.baterai_wh),
        berat_kg: Number(this.formLaptop.berat_kg),
        layar_score: Number(this.formLaptop.layar_score),
        garansi_score: Number(this.formLaptop.garansi_score || 3),
        upgrade_score: Number(this.formLaptop.upgrade_score || 3),
        spesifikasi_ringkas: this.formLaptop.spesifikasi_ringkas || ''
      };

      let res;
      if (this.isEditMode && this.formLaptop.id) {
        res = await window.SupabaseService.updateLaptop(this.formLaptop.id, payload);
      } else {
        res = await window.SupabaseService.insertLaptop(payload);
      }

      if (res && res.isTableMissing) {
        this.dbStatus = 'table_missing';
        this.showToast("⚠️ Tabel Supabase belum dibuat! Jalankan script SQL agar data tersinkron ke semua device.", "warning");
        this.modalSql = true;
      }

      if (res && !res.error) {
        this.dbStatus = 'online';
        this.showToast(`✅ Data laptop "${payload.nama}" berhasil tersimpan di Supabase Cloud & tersinkron di semua device!`, "success");
        await this.loadDataLaptops(false);
      } else {
        if (this.isEditMode && this.formLaptop.id) {
          const index = this.laptopsData.findIndex(l => l.id === this.formLaptop.id);
          if (index !== -1) {
            this.laptopsData[index] = { ...this.formLaptop, ...payload };
          }
        } else {
          const newId = Date.now();
          const newItem = { id: newId, ...payload };
          this.laptopsData.unshift(newItem);
        }
        localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
        if (!res?.isTableMissing) {
          this.showToast("⚠️ Tersimpan ke cache lokal: " + (res?.error?.message || ''), "error");
        }
      }

      this.modalInput = false;
      this.isSaving = false;
    },

    // 5. HAPUS LAPTOP TUNGGAL (DENGAN CUSTOM CONFIRM MODAL CANTIK)
    hapusLaptop(id, nama) {
      this.openConfirm({
        title: 'Hapus Data Laptop',
        message: 'Apakah Anda yakin ingin menghapus data laptop ini dari database?',
        items: [nama],
        subMessage: 'Data yang dihapus dari Supabase Cloud tidak dapat dipulihkan kembali.',
        confirmText: 'Ya, Hapus Data',
        cancelText: 'Batal',
        type: 'danger',
        action: async () => {
          const res = await window.SupabaseService.deleteLaptop(id);
          if (res && !res.error) {
            this.showToast(`Laptop "${nama}" berhasil dihapus dari Supabase Cloud!`, "info");
            this.selectedLaptopIds = this.selectedLaptopIds.filter(item => item !== id);
            await this.loadDataLaptops(false);
          } else {
            this.laptopsData = this.laptopsData.filter(l => l.id !== id);
            this.selectedLaptopIds = this.selectedLaptopIds.filter(item => item !== id);
            localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
            this.showToast(`Laptop "${nama}" berhasil dihapus dari cache lokal.`, "info");
          }
        }
      });
    },

    // 6. HAPUS BANYAK LAPTOP SEKALIGUS (BULK DELETE MASSAL)
    hapusSelectedLaptops() {
      if (this.selectedLaptopIds.length === 0) return;
      const count = this.selectedLaptopIds.length;
      const selectedLaptops = this.laptopsData.filter(l => this.selectedLaptopIds.includes(l.id));
      const selectedNames = selectedLaptops.map(l => `${l.nama} (${l.merek})`);

      this.openConfirm({
        title: `Hapus ${count} Laptop Terpilih Sekaligus`,
        message: `Apakah Anda yakin ingin menghapus secara massal ${count} laptop yang dipilih?`,
        items: selectedNames,
        subMessage: `Tindakan ini akan menghapus ${count} record dari PostgreSQL Supabase Cloud secara permanen.`,
        confirmText: `Hapus ${count} Laptop`,
        cancelText: 'Batal',
        type: 'danger',
        action: async () => {
          const idsToDelete = [...this.selectedLaptopIds];
          const res = await window.SupabaseService.deleteMultipleLaptops(idsToDelete);
          if (res && !res.error) {
            this.showToast(`✅ Berhasil menghapus ${count} data laptop dari Supabase Cloud!`, "info");
            this.selectedLaptopIds = [];
            await this.loadDataLaptops(false);
          } else {
            this.laptopsData = this.laptopsData.filter(l => !idsToDelete.includes(l.id));
            this.selectedLaptopIds = [];
            localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
            this.showToast(`✅ ${count} laptop berhasil dihapus dari cache lokal.`, "info");
          }
        }
      });
    },

    // 7. FITUR INJEKSI "DEMO STOCK LAPTOP" (KELIPATAN 5 MODEL DENGAN CUSTOM CONFIRM MODAL)
    seedDataContoh() {
      this.isInjectingDemo = true;

      // 1. Dapatkan daftar nama laptop yang sudah ada di database saat ini (case-insensitive)
      const existingNames = new Set(this.laptopsData.map(l => (l.nama || '').toLowerCase().trim()));

      // 2. Filter dari 52 model laptop yang BELUM PERNAH dimasukkan
      const availableUnadded = LAPTOPS_MASTER_COLLECTION.filter(
        item => !existingNames.has(item.nama.toLowerCase().trim())
      );

      // 3. Jika semua 52 model laptop sudah ada di database
      if (availableUnadded.length === 0) {
        this.isInjectingDemo = false;
        this.showToast(`ℹ️ Seluruh ${LAPTOPS_MASTER_COLLECTION.length} model laptop hits (2 tahun terakhir) telah ada di database Anda!`, "info");
        return;
      }

      // 4. Ambil batch kelipatan 5 model baru berikutnya
      const BATCH_SIZE = 5;
      const nextBatch = availableUnadded.slice(0, BATCH_SIZE);
      const remainingAfterThis = availableUnadded.length - nextBatch.length;

      const batchItemSummaries = nextBatch.map(b => `${b.nama} • Rp ${Number(b.harga).toLocaleString('id-ID')} (${b.merek})`);

      this.openConfirm({
        title: 'Tambahkan Demo Stock Laptop',
        message: `Tersedia ${availableUnadded.length} varian laptop viral. Tambahkan ${nextBatch.length} model baru berikut ke database?`,
        items: batchItemSummaries,
        subMessage: `Setelah ditambahkan, tersisa ${remainingAfterThis} varian model baru di koleksi demo.`,
        confirmText: `+ Tambahkan ${nextBatch.length} Laptop`,
        cancelText: 'Batal',
        type: 'primary',
        action: async () => {
          const res = await window.SupabaseService.seedLaptops(nextBatch);
          if (res && !res.error) {
            this.dbStatus = 'online';
            this.showToast(`✅ Berhasil menambahkan ${nextBatch.length} laptop baru ke Supabase Cloud! (Tersisa ${remainingAfterThis} model di koleksi)`, "success");
            await this.loadDataLaptops(false);
          } else {
            if (res?.isTableMissing) {
              this.dbStatus = 'table_missing';
              this.modalSql = true;
            }
            for (const item of nextBatch) {
              this.laptopsData.push({ id: Date.now() + Math.floor(Math.random()*10000), ...item });
            }
            localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
            this.showToast(`✅ ${nextBatch.length} laptop baru dimuat ke database: ${nextBatch.map(b=>b.nama).join(', ')}.`, "info");
          }
          this.isInjectingDemo = false;
        }
      });

      this.isInjectingDemo = false;
    },

    kalkulasiTOPSIS(scroll = true) {
      // 1. Pastikan bobot ROC dihitung dari rank 10 kriteria saat ini
      this.hitungBobotROC();

      let dataset = [...this.laptopsData];

      // Filter Status Ketersediaan
      if (this.filterStatus !== 'all') {
        dataset = dataset.filter(l => l.status === this.filterStatus);
      }

      // Filter Merk / Brand Laptop
      if (this.brandFilter && this.brandFilter !== 'all') {
        dataset = dataset.filter(l => l.merek && l.merek.toLowerCase() === this.brandFilter.toLowerCase());
      }

      // Filter Kategori Penggunaan
      if (this.kategoriFilter && this.kategoriFilter !== 'all') {
        dataset = dataset.filter(l => l.kategori_penggunaan && l.kategori_penggunaan.toLowerCase() === this.kategoriFilter.toLowerCase());
      }

      // Filter Batas Maksimal Budget
      if (this.budgetMaxFilter && Number(this.budgetMaxFilter) > 0) {
        dataset = dataset.filter(l => Number(l.harga) <= Number(this.budgetMaxFilter));
      }

      // Filter Pencarian Nama / Seri / Spek
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const q = this.searchQuery.toLowerCase().trim();
        dataset = dataset.filter(l => 
          (l.nama && l.nama.toLowerCase().includes(q)) || 
          (l.merek && l.merek.toLowerCase().includes(q)) ||
          (l.spesifikasi_ringkas && l.spesifikasi_ringkas.toLowerCase().includes(q))
        );
      }

      if (dataset.length === 0) {
        this.showToast("Tidak ada laptop yang sesuai dengan kombinasi filter Anda. Coba sesuaikan budget atau pilih Semua Merk.", "warning");
        this.hasilRanking = [];
        this.matriksData = null;
        this.hasCalculated = false;
        return;
      }

      const bobot = {};
      this.kriteriaList.forEach(k => bobot[k.kode] = k.bobot);

      // A. Pembagi Kuadrat Euclidean 10 Kriteria (Normalization Divisors)
      // Rumus: Pembagi_j = sqrt( SUM_{i=1}^n (x_{ij})^2 )
      const pembagi = {
        c1: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.harga), 2), 0)) || 1,
        c2: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.cpu_score), 2), 0)) || 1,
        c3: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.ram_gb), 2), 0)) || 1,
        c4: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.ssd_gb), 2), 0)) || 1,
        c5: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.gpu_score), 2), 0)) || 1,
        c6: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.baterai_wh), 2), 0)) || 1,
        c7: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.berat_kg), 2), 0)) || 1,
        c8: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.layar_score), 2), 0)) || 1,
        c9: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.garansi_score || 3), 2), 0)) || 1,
        c10: Math.sqrt(dataset.reduce((s, d) => s + Math.pow(Number(d.upgrade_score || 3), 2), 0)) || 1,
      };

      // B. Normalisasi Matrix R 10 Kriteria: r_ij = x_ij / pembagi_j
      const matrixR = dataset.map(d => ({
        id: d.id,
        nama: d.nama,
        r1: Number(d.harga) / pembagi.c1,
        r2: Number(d.cpu_score) / pembagi.c2,
        r3: Number(d.ram_gb) / pembagi.c3,
        r4: Number(d.ssd_gb) / pembagi.c4,
        r5: Number(d.gpu_score) / pembagi.c5,
        r6: Number(d.baterai_wh) / pembagi.c6,
        r7: Number(d.berat_kg) / pembagi.c7,
        r8: Number(d.layar_score) / pembagi.c8,
        r9: Number(d.garansi_score || 3) / pembagi.c9,
        r10: Number(d.upgrade_score || 3) / pembagi.c10,
      }));

      // C. Normalisasi Terbobot (Matrix Y): y_ij = w_j * r_ij
      const matrixY = dataset.map(d => {
        const r = matrixR.find(item => item.id === d.id);
        return {
          id: d.id,
          nama: d.nama,
          y1: r.r1 * bobot.C1,
          y2: r.r2 * bobot.C2,
          y3: r.r3 * bobot.C3,
          y4: r.r4 * bobot.C4,
          y5: r.r5 * bobot.C5,
          y6: r.r6 * bobot.C6,
          y7: r.r7 * bobot.C7,
          y8: r.r8 * bobot.C8,
          y9: r.r9 * bobot.C9,
          y10: r.r10 * bobot.C10,
        };
      });

      // D. Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)
      // Kriteria Cost (C1, C7): A+ = min(y_ij), A- = max(y_ij)
      // Kriteria Benefit (C2, C3, C4, C5, C6, C8, C9, C10): A+ = max(y_ij), A- = min(y_ij)
      const APlus = {
        y1: Math.min(...matrixY.map(m => m.y1)),
        y2: Math.max(...matrixY.map(m => m.y2)),
        y3: Math.max(...matrixY.map(m => m.y3)),
        y4: Math.max(...matrixY.map(m => m.y4)),
        y5: Math.max(...matrixY.map(m => m.y5)),
        y6: Math.max(...matrixY.map(m => m.y6)),
        y7: Math.min(...matrixY.map(m => m.y7)),
        y8: Math.max(...matrixY.map(m => m.y8)),
        y9: Math.max(...matrixY.map(m => m.y9)),
        y10: Math.max(...matrixY.map(m => m.y10))
      };

      const AMinus = {
        y1: Math.max(...matrixY.map(m => m.y1)),
        y2: Math.min(...matrixY.map(m => m.y2)),
        y3: Math.min(...matrixY.map(m => m.y3)),
        y4: Math.min(...matrixY.map(m => m.y4)),
        y5: Math.min(...matrixY.map(m => m.y5)),
        y6: Math.min(...matrixY.map(m => m.y6)),
        y7: Math.max(...matrixY.map(m => m.y7)),
        y8: Math.min(...matrixY.map(m => m.y8)),
        y9: Math.min(...matrixY.map(m => m.y9)),
        y10: Math.min(...matrixY.map(m => m.y10))
      };

      // E. Jarak Euclidean 10 Dimensi (D+, D-) dan Nilai Preferensi (Vi)
      // D_i^+ = sqrt( SUM_{j=1}^{10} (y_{ij} - y_j^+)^2 )
      // D_i^- = sqrt( SUM_{j=1}^{10} (y_{ij} - y_j^-)^2 )
      // V_i = D_i^- / (D_i^+ + D_i^-)
      const hasil = dataset.map(d => {
        const y = matrixY.find(m => m.id === d.id);

        const dPlus = Math.sqrt(
          Math.pow(y.y1 - APlus.y1, 2) + Math.pow(y.y2 - APlus.y2, 2) +
          Math.pow(y.y3 - APlus.y3, 2) + Math.pow(y.y4 - APlus.y4, 2) +
          Math.pow(y.y5 - APlus.y5, 2) + Math.pow(y.y6 - APlus.y6, 2) +
          Math.pow(y.y7 - APlus.y7, 2) + Math.pow(y.y8 - APlus.y8, 2) +
          Math.pow(y.y9 - APlus.y9, 2) + Math.pow(y.y10 - APlus.y10, 2)
        );

        const dMinus = Math.sqrt(
          Math.pow(y.y1 - AMinus.y1, 2) + Math.pow(y.y2 - AMinus.y2, 2) +
          Math.pow(y.y3 - AMinus.y3, 2) + Math.pow(y.y4 - AMinus.y4, 2) +
          Math.pow(y.y5 - AMinus.y5, 2) + Math.pow(y.y6 - AMinus.y6, 2) +
          Math.pow(y.y7 - AMinus.y7, 2) + Math.pow(y.y8 - AMinus.y8, 2) +
          Math.pow(y.y9 - AMinus.y9, 2) + Math.pow(y.y10 - AMinus.y10, 2)
        );

        const skorVi = (dPlus + dMinus) === 0 ? 0 : (dMinus / (dPlus + dMinus));

        return {
          ...d,
          dPlus,
          dMinus,
          skorVi
        };
      });

      // Urutkan alternatif berdasarkan nilai Vi tertinggi (Descending)
      this.hasilRanking = hasil.sort((a, b) => b.skorVi - a.skorVi);

      // Simpan data kalkulasi matriks lengkap untuk modal transparansi matematis skripsi
      this.matriksData = {
        matrixR,
        matrixY,
        APlus,
        AMinus,
        pembagi,
        totalEvaluated: dataset.length,
        calculatedRanks: this.kriteriaList.map(k => ({ kode: k.kode, nama: k.nama, rank: k.rank, bobot: k.bobot }))
      };

      this.hasCalculated = true;
      this.lastCalculatedAt = new Date().toLocaleTimeString('id-ID');

      if (scroll) {
        this.showToast(`Kalkulasi Rekomendasi TOPSIS (10 Kriteria) berhasil dievaluasi untuk ${dataset.length} laptop!`);
        setTimeout(() => {
          const el = document.getElementById('hasilSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },

    // 9. CETAK LEMBAR KONSULTASI REKOMENDASI CUSTOMER (PRINT / PDF)
    cetakLaporanKonsultasi() {
      if (this.hasilRanking.length === 0) {
        this.kalkulasiTOPSIS(false);
      }
      setTimeout(() => {
        window.print();
      }, 200);
    },

    // 10. EKSPOR KE CSV (Lengkap 10 Kriteria)
    exportCSV() {
      if (this.hasilRanking.length === 0) return;
      
      let csv = "Rank,Nama Laptop,Merek,Status,Kategori,Harga (Rp),CPU Score,RAM (GB),SSD (GB),GPU Score,Baterai (Wh),Berat (Kg),Layar Score,Garansi Score (1-5),Upgrade Score (1-5),D Plus,D Minus,Skor Vi\n";
      
      this.hasilRanking.forEach((item, index) => {
        csv += `${index + 1},"${item.nama.replace(/"/g, '""')}","${item.merek}","${item.status}","${item.kategori_penggunaan || 'Umum'}",${item.harga},${item.cpu_score},${item.ram_gb},${item.ssd_gb},${item.gpu_score},${item.baterai_wh},${item.berat_kg},${item.layar_score},${item.garansi_score || 3},${item.upgrade_score || 3},${item.dPlus.toFixed(4)},${item.dMinus.toFixed(4)},${item.skorVi.toFixed(4)}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Hasil_Rekomendasi_Laptop_SPK_10Kriteria_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToast("Data hasil rekomendasi (10 Kriteria) berhasil diekspor ke file CSV!");
    }
  };
}

if (typeof window !== 'undefined') {
  window.spkApp = spkApp;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spkApp };
}
