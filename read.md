# Laporan Teknis & Panduan Skripsi Sistem Pendukung Keputusan (SPK) Laptop
## Judul Skripsi: "Sistem Pendukung Keputusan Pemilihan Laptop pada Customer Toko Super Komputer Menggunakan Kombinasi Metode Rank Order Centroid (ROC) dan TOPSIS Berbasis Web"

---

## 1. Informasi & Spesifikasi Proyek
* **Studi Kasus:** Toko Super Komputer (Layanan Konsultasi & Rekomendasi Pelanggan)
* **Kombinasi Metode:** 
  1. **Rank Order Centroid (ROC):** Pembobotan objektif deret harmonik untuk 10 kriteria keputusan ($m=10$) dengan penanganan *tied-rank*.
  2. **TOPSIS (Technique for Order Preference by Similarity to Ideal Solution):** Perangkingan multi-kriteria berbasis kedekatan geometris terhadap Solusi Ideal Positif ($A^+$) dan Solusi Ideal Negatif ($A^-$).
* **Database Cloud:** PostgreSQL via **Supabase Cloud** (Real-time CRUD & Persistensi Multi-Device)
* **Deployment & Hosting:** **Vercel Web Platform**
* **Repository GitHub:** `https://github.com/bambangharmoko/pemilihanlaptop-super.git`
* **Arsitektur Front-End:** Modular Static Web App (`index.html`, `style.css`, `supabase.js`, `app.js`)

---

## 2. Definisi Matriks 10 Kriteria Keputusan (C1 – C10)

| Kode | Nama Kriteria | Tipe | Satuan | Skala Nilai | Default Rank | Bobot Default ROC ($w_j$) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **C1** | Harga Beli | **Cost** | Rupiah (Rp) | Nominal Rp | 1 | **29.29%** |
| **C2** | Processor (CPU) | **Benefit** | Skor 0-100 | Benchmark Skor | 2 | **19.29%** |
| **C3** | Kapasitas RAM | **Benefit** | Gigabyte (GB) | 4 s/d 128 GB | 3 | **14.29%** |
| **C4** | Kapasitas SSD | **Benefit** | Gigabyte (GB) | 128 s/d 4096 GB | 4 | **10.96%** |
| **C5** | Kartu Grafis (GPU) | **Benefit** | Skor 0-100 | Visual/3D Skor | 5 | **8.46%** |
| **C6** | Daya Tahan Baterai | **Benefit** | Watt-Hour (Wh) | 30 s/d 120 Wh | 6 | **6.46%** |
| **C7** | Portabilitas (Berat) | **Cost** | Kilogram (Kg) | 0.8 s/d 4.5 Kg | 7 | **4.79%** |
| **C8** | Kualitas Layar | **Benefit** | Skor 0-100 | Panel & Akurasi Warna | 8 | **3.36%** |
| **C9** | Masa & Layanan Garansi | **Benefit** | Skala 1–5 | Durasi & ADP Protection | 9 | **2.11%** |
| **C10** | Kemampuan Upgrade | **Benefit** | Skala 1–5 | Fleksibilitas Slot RAM/SSD | 10 | **1.00%** |
| **TOTAL** | | | | | | **100.00%** |

### Konversi Nilai Kriteria Kualitatif:
- **C9 (Masa & Layanan Garansi):**
  - `1` = 1 Tahun Garansi Distributor
  - `2` = 1 Tahun Garansi Resmi Pabrik
  - `3` = 2 Tahun Garansi Resmi Pabrik
  - `4` = 2 Tahun Garansi Resmi + 1 Tahun ADP (*Accidental Damage Protection*)
  - `5` = 3 Tahun Garansi Resmi + ADP Lengkap
- **C10 (Kemampuan Upgrade / Upgradeability):**
  - `1` = Full On-Board / Soldered (RAM & SSD tertanam/tidak bisa di-upgrade)
  - `2` = RAM On-board + 1 Slot SSD M.2 Tambahan
  - `3` = 1 Slot RAM SODIMM Bebas + 1 Slot M.2 SSD
  - `4` = Dual Slot RAM SODIMM + 1 Slot M.2 SSD
  - `5` = Dual Slot SODIMM + Dual Slot M.2 NVMe SSD

---

## 3. Landasan Matematis & Algoritma SPK

### A. Metode Pembobotan Rank Order Centroid (ROC)
Metode ROC menentukan bobot kriteria ($w_i$) dari tingkat kepentingan ordinal rank ($i=1, 2, \dots, m$) dengan rumus deret harmonik:

$$w_i = \frac{1}{m} \sum_{k=i}^{m} \frac{1}{k}$$

Untuk $m = 10$:
- $w_1 = \frac{1}{10} \left(1 + \frac{1}{2} + \frac{1}{3} + \dots + \frac{1}{10}\right) = 0.2929 \ (29.29\%)$
- $w_2 = \frac{1}{10} \left(\frac{1}{2} + \frac{1}{3} + \dots + \frac{1}{10}\right) = 0.1929 \ (19.29\%)$
- $w_{10} = \frac{1}{10} \left(\frac{1}{10}\right) = 0.0100 \ (1.00\%)$
- $\sum_{j=1}^{10} w_j = 1.0000 \ (100\%)$

*Catatan Akademik:* Jika pengguna memberikan peringkat kembar (*tied-rank*, misal kriteria A dan B sama-sama Rank 1), sistem secara otomatis menerapkan **Average Harmonic Weight** dari rentang peringkat tersebut sehingga total bobot tetap valid $100\%$.

---

### B. Algoritma Perankingan TOPSIS (10 Dimensi)

1. **Matriks Keputusan ($X$):**
   $$X = \begin{bmatrix} x_{1,1} & x_{1,2} & \dots & x_{1,10} \\ x_{2,1} & x_{2,2} & \dots & x_{2,10} \\ \vdots & \vdots & \ddots & \vdots \\ x_{n,1} & x_{n,2} & \dots & x_{n,10} \end{bmatrix}$$

2. **Normalisasi Vektor Euclidean Matriks ($R$):**
   $$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^n x_{kj}^2}} \quad \text{untuk } i=1, \dots, n \text{ dan } j=1, \dots, 10$$

3. **Matriks Ternormalisasi Terbobot ($Y$):**
   $$y_{ij} = w_j \cdot r_{ij}$$

4. **Solusi Ideal Positif ($A^+$) & Solusi Ideal Negatif ($A^-$):**
   - **Kriteria Cost ($C_1$ Harga, $C_7$ Berat):**
     $$y_j^+ = \min_{i}(y_{ij}), \quad y_j^- = \max_{i}(y_{ij})$$
   - **Kriteria Benefit ($C_2, C_3, C_4, C_5, C_6, C_8, C_9, C_{10}$):**
     $$y_j^+ = \max_{i}(y_{ij}), \quad y_j^- = \min_{i}(y_{ij})$$

5. **Jarak Euclidean Alternatif terhadap $A^+$ dan $A^-$:**
   $$D_i^+ = \sqrt{\sum_{j=1}^{10} (y_{ij} - y_j^+)^2}$$
   $$D_i^- = \sqrt{\sum_{j=1}^{10} (y_{ij} - y_j^-)^2}$$

6. **Nilai Preferensi Kedekatan Relatif ($V_i$):**
   $$V_i = \frac{D_i^-}{D_i^+ + D_i^-} \quad (0 \le V_i \le 1)$$
   *Alternatif dengan $V_i$ terbesar adalah rekomendasi laptop terbaik (#1).*

---

## 4. Fitur Khusus Konsultasi Pelanggan Toko Super Komputer
1. **Preset Profil Kebutuhan Konsumen:**
   - 🎓 *Mahasiswa / Pelajar (Hemat)*: Mengutamakan $C_1$ Harga, $C_6$ Baterai, $C_7$ Portabilitas.
   - 🎮 *Gaming & 3D Rendering*: Mengutamakan $C_5$ GPU, $C_2$ CPU, $C_3$ RAM, $C_8$ Layar.
   - 🎨 *Content Creator & Desain*: Mengutamakan $C_8$ Kualitas Layar OLED/sRGB, $C_2$ CPU, $C_4$ SSD.
   - 💼 *Bisnis & Eksekutif Mobile*: Mengutamakan $C_7$ Portabilitas Berat, $C_6$ Baterai, $C_9$ Garansi ADP.
   - 🔧 *Investasi Jangka Panjang*: Mengutamakan $C_{10}$ Kemampuan Upgrade, $C_9$ Garansi.
2. **Filter Budget Maksimal & Kategori:**
   - Menyaring alternatif sebelum dikalkulasi TOPSIS sesuai batasan kemampuan dana pelanggan.
3. **Cetak Lembar Konsultasi Resmi Pelanggan:**
   - Format cetak profesional berkop Toko Super Komputer dengan nama pelanggan, tanggal, batasan budget, kartu rekomendasi juara 1, dan tabel ranking lengkap.
4. **Transparansi Matematis Penuh (Modal Matriks):**
   - Menampilkan Vektor Pembagi Euclidean, Matriks $R$, Matriks $Y$, Solusi $A^+/A^-$, dan Jarak Euclidean $D^+/D^-$.
5. **Ekspor Data ke CSV:**
   - Mengunduh hasil perankingan 10 kriteria ke file `.csv` untuk arsip atau lampiran penelitian skripsi.

---

## 5. Skema DDL Database Supabase (PostgreSQL)

```sql
-- 1. TABEL DATA LAPTOP (10 Kriteria Lengkap)
CREATE TABLE IF NOT EXISTS public.laptops (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    merek VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('ready', 'indent')) NOT NULL DEFAULT 'ready',
    kategori_penggunaan VARCHAR(50) DEFAULT 'Umum',
    harga NUMERIC(15, 2) NOT NULL,
    cpu_score NUMERIC(6, 2) NOT NULL,
    ram_gb INT NOT NULL,
    ssd_gb INT NOT NULL,
    gpu_score NUMERIC(6, 2) NOT NULL,
    baterai_wh NUMERIC(6, 2) NOT NULL,
    berat_kg NUMERIC(4, 2) NOT NULL,
    layar_score NUMERIC(6, 2) NOT NULL,
    garansi_score NUMERIC(4, 2) NOT NULL DEFAULT 3,
    upgrade_score NUMERIC(4, 2) NOT NULL DEFAULT 3,
    spesifikasi_ringkas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Laptops" ON public.laptops FOR SELECT USING (true);
CREATE POLICY "Public Insert Laptops" ON public.laptops FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Laptops" ON public.laptops FOR UPDATE USING (true);
CREATE POLICY "Public Delete Laptops" ON public.laptops FOR DELETE USING (true);
```
