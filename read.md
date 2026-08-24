# Laporan Teknis & Panduan Skripsi Sistem Pendukung Keputusan (SPK) Laptop
## Judul Skripsi: "Sistem Pendukung Keputusan Pemilihan Laptop pada Customer Toko Super Komputer Menggunakan Kombinasi Metode Multi-Kriteria (ROC, Shannon Entropy, LOPCOW) dan TOPSIS Berbasis Web"

---

## 1. Informasi & Spesifikasi Proyek
* **Studi Kasus:** Toko Super Komputer (Layanan Konsultasi & Rekomendasi Pelanggan)
* **Arsitektur Sistem:** Multi-Method SPK Gateway Portal
* **3 Pilihan Kombinasi Metode Pembobotan:**
  1. **Rank Order Centroid (ROC) + TOPSIS (URL: `/roc`)**: Pembobotan preferensi ordinal kebutuhan pelanggan (Subjektif / Konsultatif).
  2. **Shannon Entropy + TOPSIS (URL: `/entropy`)**: Pembobotan objektif statistik berdasarkan derajat diversifikasi data ($E_j$).
  3. **LOPCOW + TOPSIS (URL: `/lopcow`)**: *Logarithmic Percentage Change-driven Objective Weighting* (Objektif Modern Non-Linier).
* **Database Cloud:** PostgreSQL via **Supabase Cloud** (Real-time CRUD & Persistensi Multi-Device)
* **Deployment & Hosting:** **Vercel Web Platform** (`https://pemilihanlaptop-superkomputer.vercel.app`)
* **Repository GitHub:** `https://github.com/bambangharmoko/pemilihanlaptop-super.git`
* **Arsitektur Front-End:** Modular Directory Architecture:
  - Root Portal: [`index.html`](file:///c:/beng/PemilihanLaptop/index.html), [`style.css`](file:///c:/beng/PemilihanLaptop/style.css), [`supabase.js`](file:///c:/beng/PemilihanLaptop/supabase.js)
  - Modul ROC: [`roc/index.html`](file:///c:/beng/PemilihanLaptop/roc/index.html), [`roc/app.js`](file:///c:/beng/PemilihanLaptop/roc/app.js)
  - Modul Entropy: [`entropy/index.html`](file:///c:/beng/PemilihanLaptop/entropy/index.html), [`entropy/app.js`](file:///c:/beng/PemilihanLaptop/entropy/app.js)
  - Modul LOPCOW: [`lopcow/index.html`](file:///c:/beng/PemilihanLaptop/lopcow/index.html), [`lopcow/app.js`](file:///c:/beng/PemilihanLaptop/lopcow/app.js)

---

## 2. Struktur Direktori & Rute Halaman Web (Vercel Routing)

| URL Endpoint | Direktori & File | Modul Logika | Deskripsi Halaman |
| :--- | :--- | :--- | :--- |
| **`/`** | `index.html` | - | **Gateway Portal / Hub Utama:** Halaman muka pemilihan metode pembobotan SPK & komparasi teori. |
| **`/roc`** | `roc/index.html` | `roc/app.js` | **SPK ROC + TOPSIS:** Pembobotan subjektif rank 1-10 dengan preset kebutuhan customer & cetak lembar rekomendasi resmi. |
| **`/entropy`** | `entropy/index.html` | `entropy/app.js` | **SPK Shannon Entropy + TOPSIS:** Pembobotan objektif dispersi informasi data tanpa bias subjektif. |
| **`/lopcow`** | `lopcow/index.html` | `lopcow/app.js` | **SPK LOPCOW + TOPSIS:** Pembobotan objektif modern deviasi persentase kuadrat logaritmik ($LP_{ij}, V_j$). |

---

## 3. Definisi Matriks 10 Kriteria Keputusan (C1 – C10)

| Kode | Nama Kriteria | Tipe | Satuan | Skala Nilai | Default Rank (ROC) | Bobot Default ROC ($w_j$) |
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

## 4. Landasan Matematis 3 Metode Pembobotan

### A. Metode Rank Order Centroid (ROC)
Mengonversi pemeringkatan ordinal ($R_1 \dots R_m$) menjadi bobot kuantitatif:

$$w_i = \frac{1}{m} \sum_{k=i}^{m} \frac{1}{k} \quad \text{dimana } \sum_{i=1}^{m} w_i = 1$$

---

### B. Metode Shannon Entropy (Pembobotan Objektif Statistik)
1. **Normalisasi Proporsi Matriks ($P_{ij}$):**
   $$P_{ij} = \frac{x_{ij}}{\sum_{k=1}^n x_{kj}}$$
   *(Untuk kriteria Cost $C_1$ dan $C_7$, nilai dibalik $\hat{x}_{ij} = \frac{1}{x_{ij}}$ sebelum diproporsikan).*
2. **Nilai Entropi Kriteria ($E_j$):**
   $$E_j = -k \sum_{i=1}^n P_{ij} \ln(P_{ij}) \quad \text{dimana } k = \frac{1}{\ln(n)}$$
3. **Derajat Diversifikasi ($d_j$):**
   $$d_j = 1 - E_j$$
4. **Bobot Entropi Akhir ($w_j$):**
   $$w_j = \frac{d_j}{\sum_{k=1}^{10} d_k}$$

---

### C. Metode LOPCOW (Logarithmic Percentage Change-driven Objective Weighting)
1. **Normalisasi Min-Max ($r_{ij}$):**
   - Benefit: $r_{ij} = \frac{x_{ij} - x_j^{\min}}{x_j^{\max} - x_j^{\min}}$
   - Cost: $r_{ij} = \frac{x_j^{\max} - x_{ij}}{x_j^{\max} - x_j^{\min}}$
2. **Rata-rata Nilai Normalisasi ($\bar{r}_j$):**
   $$\bar{r}_j = \frac{1}{n} \sum_{i=1}^n r_{ij}$$
3. **Deviasi Persentase Kuadrat Logaritmik ($LP_{ij}$):**
   $$LP_{ij} = \left[ \ln\left( \frac{r_{ij} + \sigma}{\bar{r}_j + \sigma} \right) \right]^2 \quad (\sigma = 0.01)$$
4. **Variansi Kriteria ($V_j$):**
   $$V_j = \frac{1}{n} \sum_{i=1}^n LP_{ij}$$
5. **Bobot LOPCOW Akhir ($w_j$):**
   $$w_j = \frac{V_j}{\sum_{k=1}^{10} V_k}$$

---

## 5. Algoritma Perankingan TOPSIS (10 Dimensi)

1. **Matriks Keputusan ($X_{n \times 10}$):** Menampung data alternatif laptop.
2. **Normalisasi Vektor Euclidean Matriks ($R$):**
   $$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{k=1}^n x_{kj}^2}}$$
3. **Matriks Ternormalisasi Terbobot ($Y$):**
   $$y_{ij} = w_j \cdot r_{ij} \quad (w_j \text{ berasal dari ROC, Entropy, atau LOPCOW})$$
4. **Solusi Ideal Positif ($A^+$) & Solusi Ideal Negatif ($A^-$):**
   - Cost ($C_1, C_7$): $y_j^+ = \min(y_{ij})$, $y_j^- = \max(y_{ij})$
   - Benefit ($C_2 \dots C_6, C_8 \dots C_{10}$): $y_j^+ = \max(y_{ij})$, $y_j^- = \min(y_{ij})$
5. **Jarak Euclidean Alternatif ($D_i^+$ dan $D_i^-$):**
   $$D_i^+ = \sqrt{\sum_{j=1}^{10} (y_{ij} - y_j^+)^2}, \quad D_i^- = \sqrt{\sum_{j=1}^{10} (y_{ij} - y_j^-)^2}$$
6. **Nilai Preferensi Kedekatan Relatif ($V_i$):**
   $$V_i = \frac{D_i^-}{D_i^+ + D_i^-} \quad (0 \le V_i \le 1)$$
   *Alternatif dengan $V_i$ tertinggi menempati peringkat #1 rekomendasi terbaik.*
