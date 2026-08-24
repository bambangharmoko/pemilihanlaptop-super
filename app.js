/**
 * APP ENGINE - Toko Super Komputer
 * Logika Aplikasi SPK 10 Kriteria (C1 - C10):
 * - Alpine.js Reactive Store
 * - Metode Pembobotan Rank Order Centroid (ROC) 10 Kriteria dengan Penanganan Tied-Rank
 * - Algoritma TOPSIS 10 Dimensi (Cost/Benefit Solusi Ideal A+/A-, Jarak Euclidean D+/D-, Skor Vi)
 * - Persistensi Pengaturan Lokal (Ranks & Filter)
 * - UI Modal, Form Validation, dan Ekspor CSV
 */

// Dataset Laptop Demo Default (Lengkap 10 Kriteria C1 - C10)
const SEED_LAPTOPS = [
  {
    nama: "Lenovo Legion 5 Slim 16IRH8",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming / Creator",
    harga: 18499000,
    cpu_score: 92,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 88,
    baterai_wh: 80,
    berat_kg: 2.30,
    layar_score: 90,
    garansi_score: 4, // 2 Thn Resmi + 1 Thn ADP
    upgrade_score: 5, // Dual SODIMM + Dual M.2 NVMe
    spesifikasi_ringkas: "Intel Core i7-13700H / RTX 4060 8GB / 16GB DDR5 / 1TB SSD / WQXGA 165Hz"
  },
  {
    nama: "Asus ROG Zephyrus G14 OLED",
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
    spesifikasi_ringkas: "Ryzen 9 8945HS / RTX 4070 / 32GB LPDDR5X / 3K OLED 120Hz 0.2ms"
  },
  {
    nama: "Apple MacBook Air M2 13-inch",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Office / Mahasiswa",
    harga: 15499000,
    cpu_score: 86,
    ram_gb: 8,
    ssd_gb: 256,
    gpu_score: 72,
    baterai_wh: 52.6,
    berat_kg: 1.24,
    layar_score: 92,
    garansi_score: 2, // 1 Thn Resmi Apple
    upgrade_score: 1, // Full On-Board / Soldered
    spesifikasi_ringkas: "Apple M2 8-core CPU / 8-core GPU / Liquid Retina Display / Fanless Silent"
  },
  {
    nama: "Acer Swift Go 14 OLED EVO",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Bisnis / Multitasking",
    harga: 12999000,
    cpu_score: 85,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 68,
    baterai_wh: 65,
    berat_kg: 1.32,
    layar_score: 94,
    garansi_score: 3, // 2 Thn Resmi
    upgrade_score: 2, // RAM On-board + 1 Slot SSD
    spesifikasi_ringkas: "Intel Core i5-13500H / Iris Xe / 16GB LPDDR5 / 2.8K 90Hz OLED 100% DCI-P3"
  },
  {
    nama: "HP Pavilion Aero 13 Ultralight",
    merek: "HP",
    status: "indent",
    kategori_penggunaan: "Mobilitas Tinggi",
    harga: 11499000,
    cpu_score: 82,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 60,
    baterai_wh: 43,
    berat_kg: 0.98,
    layar_score: 85,
    garansi_score: 3, // 2 Thn Resmi
    upgrade_score: 2, // RAM On-board + 1 Slot SSD
    spesifikasi_ringkas: "Ryzen 5 7535U / Radeon 660M / Super Ringan < 1Kg Magnesium Chassis"
  },
  {
    nama: "Axioo Hype 5 AMD Edition",
    merek: "Axioo",
    status: "ready",
    kategori_penggunaan: "Budget / Mahasiswa",
    harga: 5199000,
    cpu_score: 70,
    ram_gb: 8,
    ssd_gb: 256,
    gpu_score: 52,
    baterai_wh: 45,
    berat_kg: 1.42,
    layar_score: 75,
    garansi_score: 2, // 1 Thn Resmi
    upgrade_score: 3, // 1 Slot RAM Bebas + 1 M.2 SSD
    spesifikasi_ringkas: "Ryzen 5 5500U / 8GB Upgradable / 256GB NVMe / FHD IPS Display"
  }
];

// Helper Definisi 10 Master Kriteria
function getInitialKriteriaList() {
  const masterKriteria = [
    { id: 1, kode: 'C1', nama: 'Harga Beli', tipe: 'Cost', satuan: 'Rupiah (Rp)', rank: 1, bobot: 0, keterangan: 'Nominal harga beli toko (makin hemat makin prioritas)' },
    { id: 2, kode: 'C2', nama: 'Processor (CPU)', tipe: 'Benefit', satuan: 'Skor 0-100', rank: 2, bobot: 0, keterangan: 'Performa komputasi inti prosesor benchmark' },
    { id: 3, kode: 'C3', nama: 'Kapasitas RAM', tipe: 'Benefit', satuan: 'Gigabyte (GB)', rank: 3, bobot: 0, keterangan: 'Memori multitasking dan rendering aplikasi' },
    { id: 4, kode: 'C4', nama: 'Kapasitas SSD', tipe: 'Benefit', satuan: 'Gigabyte (GB)', rank: 4, bobot: 0, keterangan: 'Kapasitas storage penyimpanan sistem & data' },
    { id: 5, kode: 'C5', nama: 'Kartu Grafis (GPU)', tipe: 'Benefit', satuan: 'Skor 0-100', rank: 5, bobot: 0, keterangan: 'Performa visual grafis, gaming, dan 3D rendering' },
    { id: 6, kode: 'C6', nama: 'Daya Baterai', tipe: 'Benefit', satuan: 'Watt-Hour (Wh)', rank: 6, bobot: 0, keterangan: 'Kapasitas baterai durasi operasional tanpa colokan' },
    { id: 7, kode: 'C7', nama: 'Portabilitas (Berat)', tipe: 'Cost', satuan: 'Kilogram (Kg)', rank: 7, bobot: 0, keterangan: 'Bobot fisik laptop (makin ringan makin baik)' },
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
    modalInput: false,
    modalMatriks: false,
    modalSql: false,
    copiedSql: false,
    isEditMode: false,
    isSaving: false,
    filterStatus: getInitialFilter(),
    toasts: [],
    lastCalculatedAt: null,
    hasCalculated: false,
    sqlScriptText: window.SupabaseService ? window.SupabaseService.SQL_SCHEMA : '',
    
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

      // Rekomendasi TOPSIS hanya keluar ketika user menekan tombol "Kalkulasi Rekomendasi TOPSIS".
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
      setTimeout(() => this.removeToast(id), 4500);
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

    // 1. RUMUS PEMBOBOTAN METODE ROC (Rank Order Centroid - m = 10)
    // Formula Simplex Centroid: w_j = (1 / m) * sum_{k=j}^m (1 / k)
    // Dilengkapi penanganan peringkat kembar (Tied-Rank Average Centroid) agar total bobot = 100.00%
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
      this.kriteriaList.forEach(k => {
        k.rank = Number(k.rank);
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
      this.kriteriaList.forEach((item, i) => {
        item.rank = i + 1;
      });
      this.kriteriaList = [...this.kriteriaList];
      try {
        localStorage.removeItem('spk_criteria_ranks_10');
      } catch(e) {}
      this.hitungBobotROC();
      this.saveSettings();
      this.showToast("Prioritas kriteria dikembalikan ke default (Rank 1 s/d 10). Tekan tombol 'Kalkulasi Rekomendasi TOPSIS' untuk memperbarui hasil.", "info");
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
        // Pastikan record memiliki default garansi_score dan upgrade_score jika kolom baru
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
        // Fallback simpan lokal jika Supabase offline/belum termigrasi
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

    // 5. HAPUS LAPTOP
    async hapusLaptop(id, nama) {
      if (!confirm(`Apakah Anda yakin ingin menghapus data laptop "${nama}"?`)) return;

      const res = await window.SupabaseService.deleteLaptop(id);
      if (res && !res.error) {
        this.showToast(`Laptop "${nama}" berhasil dihapus dari Supabase Cloud!`, "info");
        await this.loadDataLaptops(false);
      } else {
        this.laptopsData = this.laptopsData.filter(l => l.id !== id);
        localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
        this.showToast(`Laptop "${nama}" berhasil dihapus dari cache lokal.`, "info");
      }
    },

    // 6. SEED DEMO DATA
    async seedDataContoh() {
      if (this.laptopsData.length > 0) {
        if (!confirm("Tambahkan 6 data demo contoh lengkap 10 kriteria ke daftar laptop yang ada?")) return;
      }

      const res = await window.SupabaseService.seedLaptops(SEED_LAPTOPS);
      if (res && !res.error) {
        this.dbStatus = 'online';
        this.showToast("6 data laptop demo berhasil disimpan ke Supabase Cloud!", "success");
        await this.loadDataLaptops(false);
      } else {
        if (res?.isTableMissing) {
          this.dbStatus = 'table_missing';
          this.modalSql = true;
        }
        for (const item of SEED_LAPTOPS) {
          this.laptopsData.push({ id: Date.now() + Math.floor(Math.random()*10000), ...item });
        }
        localStorage.setItem('spk_laptops_backup_10', JSON.stringify(this.laptopsData));
        this.showToast("6 data laptop demo dimuat ke cache lokal.", "info");
      }
    },

    // 7. KOMPUTASI ALGORITMA TOPSIS 10 DIMENSI (C1 - C10)
    kalkulasiTOPSIS(scroll = true) {
      // 1. Pastikan bobot ROC dihitung dari rank 10 kriteria saat ini
      this.hitungBobotROC();

      let dataset = [...this.laptopsData];
      if (this.filterStatus !== 'all') {
        dataset = dataset.filter(l => l.status === this.filterStatus);
      }

      if (dataset.length === 0) {
        this.showToast("Tidak ada laptop pada filter ini untuk dikalkulasi.", "error");
        this.hasilRanking = [];
        this.matriksData = null;
        this.hasCalculated = false;
        return;
      }

      const bobot = {};
      this.kriteriaList.forEach(k => bobot[k.kode] = k.bobot);

      // A. Pembagi Kuadrat Euclidean 10 Kriteria (Normalization Divisors)
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
      // Kriteria Cost (C1, C7): A+ = min, A- = max
      // Kriteria Benefit (C2, C3, C4, C5, C6, C8, C9, C10): A+ = max, A- = min
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

      // Simpan data kalkulasi matriks lengkap untuk modal transparansi
      this.matriksData = {
        matrixR,
        matrixY,
        APlus,
        AMinus,
        calculatedRanks: this.kriteriaList.map(k => ({ kode: k.kode, rank: k.rank, bobot: k.bobot }))
      };

      this.hasCalculated = true;
      this.lastCalculatedAt = new Date().toLocaleTimeString('id-ID');

      if (scroll) {
        this.showToast("Kalkulasi Rekomendasi TOPSIS (10 Kriteria) berhasil dievaluasi!");
        setTimeout(() => {
          const el = document.getElementById('hasilSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },

    // 8. EKSPOR KE CSV (Lengkap 10 Kriteria)
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
