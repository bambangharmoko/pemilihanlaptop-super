/**
 * APP_ENTROPY.JS - Toko Super Komputer
 * Sistem Pendukung Keputusan Pemilihan Laptop (10 Kriteria)
 * Kombinasi Metode Shannon Entropy (Pembobotan Objektif) & TOPSIS
 */

// Dataset Cadangan 52 Laptop Viral jika Cloud belum terisi
const DEFAULT_LAPTOPS_DATA = [
  {
    nama: "Lenovo Legion Pro 5 16IRX9",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming Heavy Duty",
    harga: 26999000,
    cpu_score: 95,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 90,
    baterai_wh: 80,
    berat_kg: 2.50,
    layar_score: 95,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-14700HX / RTX 4070 8GB / 32GB DDR5 / 16\" WQXGA 240Hz 100% DCI-P3"
  },
  {
    nama: "Lenovo LOQ 15IAX9",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Gaming Entry Budget",
    harga: 12499000,
    cpu_score: 82,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 78,
    baterai_wh: 60,
    berat_kg: 2.38,
    layar_score: 85,
    garansi_score: 3,
    upgrade_score: 4,
    spesifikasi_ringkas: "Intel Core i5-12450HX / RTX 3050 6GB / 16GB DDR5 / 15.6\" FHD 144Hz 100% sRGB"
  },
  {
    nama: "Lenovo Yoga Slim 7x Copilot+",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Ultrabook AI & Bisnis",
    harga: 23999000,
    cpu_score: 91,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 72,
    baterai_wh: 70,
    berat_kg: 1.28,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Snapdragon X Elite / 32GB LPDDR5X / 14.5\" 3K OLED 90Hz 1000 nits"
  },
  {
    nama: "Lenovo IdeaPad Slim 3 14IAH8",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Mahasiswa & Office",
    harga: 7299000,
    cpu_score: 74,
    ram_gb: 8,
    ssd_gb: 512,
    gpu_score: 45,
    baterai_wh: 47,
    berat_kg: 1.43,
    layar_score: 75,
    garansi_score: 3,
    upgrade_score: 3,
    spesifikasi_ringkas: "Intel Core i3-1215U / 8GB LPDDR5 / 512GB NVMe / 14\" FHD IPS"
  },
  {
    nama: "Lenovo ThinkPad E14 Gen 5",
    merek: "Lenovo",
    status: "ready",
    kategori_penggunaan: "Bisnis & Produktivitas",
    harga: 14899000,
    cpu_score: 86,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 60,
    baterai_wh: 57,
    berat_kg: 1.53,
    layar_score: 85,
    garansi_score: 4,
    upgrade_score: 4,
    spesifikasi_ringkas: "Intel Core i7-1355U / 16GB RAM / 512GB SSD / 14\" WUXGA IPS / Military Grade"
  },
  {
    nama: "Asus ROG Zephyrus G16 (2024)",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Gaming Premium & Desain",
    harga: 35999000,
    cpu_score: 98,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 95,
    baterai_wh: 90,
    berat_kg: 1.85,
    layar_score: 99,
    garansi_score: 4,
    upgrade_score: 3,
    spesifikasi_ringkas: "Intel Core Ultra 9 185H / RTX 4080 / 32GB LPDDR5X / 16\" 2.5K OLED 240Hz ROG Nebula"
  },
  {
    nama: "Asus TUF Gaming A15 (2024)",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Gaming Populer",
    harga: 17499000,
    cpu_score: 89,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 86,
    baterai_wh: 90,
    berat_kg: 2.20,
    layar_score: 88,
    garansi_score: 3,
    upgrade_score: 5,
    spesifikasi_ringkas: "Ryzen 7 8845HS AI / RTX 4060 8GB / 16GB DDR5 / 15.6\" FHD 144Hz 100% sRGB"
  },
  {
    nama: "Asus Zenbook 14 OLED UX3405",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Ultrabook Eksekutif",
    harga: 19999000,
    cpu_score: 90,
    ram_gb: 32,
    ssd_gb: 1024,
    gpu_score: 68,
    baterai_wh: 75,
    berat_kg: 1.20,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 7 155H / 32GB RAM / 1TB SSD / 14\" 3K OLED 120Hz 0.2ms"
  },
  {
    nama: "Asus Vivobook Go 14 E1404",
    merek: "Asus",
    status: "ready",
    kategori_penggunaan: "Mahasiswa & Belajar",
    harga: 6299000,
    cpu_score: 68,
    ram_gb: 8,
    ssd_gb: 512,
    gpu_score: 35,
    baterai_wh: 42,
    berat_kg: 1.38,
    layar_score: 72,
    garansi_score: 3,
    upgrade_score: 2,
    spesifikasi_ringkas: "Ryzen 3 7320U / 8GB LPDDR5 / 512GB NVMe / 14\" FHD 180 Lay-flat"
  },
  {
    nama: "Apple MacBook Air M3 (13-inch)",
    merek: "Apple",
    status: "ready",
    kategori_penggunaan: "Creator & Mobile Bisnis",
    harga: 18999000,
    cpu_score: 93,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 80,
    baterai_wh: 52.6,
    berat_kg: 1.24,
    layar_score: 97,
    garansi_score: 2,
    upgrade_score: 1,
    spesifikasi_ringkas: "Apple M3 Chip (8-Core CPU, 10-Core GPU) / 16GB Unified / 13.6\" Liquid Retina TrueTone"
  },
  {
    nama: "Acer Predator Helios Neo 16",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Gaming Performance",
    harga: 21999000,
    cpu_score: 94,
    ram_gb: 16,
    ssd_gb: 1024,
    gpu_score: 88,
    baterai_wh: 90,
    berat_kg: 2.60,
    layar_score: 92,
    garansi_score: 4,
    upgrade_score: 5,
    spesifikasi_ringkas: "Intel Core i7-14650HX / RTX 4060 8GB / 16GB DDR5 / 16\" WQXGA 165Hz 100% sRGB"
  },
  {
    nama: "Acer Swift Go 14 AI OLED",
    merek: "Acer",
    status: "ready",
    kategori_penggunaan: "Content Creator Ringan",
    harga: 13999000,
    cpu_score: 88,
    ram_gb: 16,
    ssd_gb: 512,
    gpu_score: 65,
    baterai_wh: 65,
    berat_kg: 1.32,
    layar_score: 98,
    garansi_score: 4,
    upgrade_score: 2,
    spesifikasi_ringkas: "Intel Core Ultra 5 125H / 16GB LPDDR5X / 14\" 2.8K OLED 90Hz 100% DCI-P3"
  }
];

function getEntropyInitialKriteriaList() {
  return [
    { id: 1, kode: 'C1', nama: 'Harga Beli', tipe: 'Cost', satuan: 'Rupiah', keterangan: 'Nominal harga pembelian di toko', bobot: 0.10 },
    { id: 2, kode: 'C2', nama: 'Processor (CPU)', tipe: 'Benefit', satuan: 'Skor 0-100', keterangan: 'Performa benchmark inti prosesor', bobot: 0.10 },
    { id: 3, kode: 'C3', nama: 'Kapasitas RAM', tipe: 'Benefit', satuan: 'GB', keterangan: 'Kapasitas memori RAM utama', bobot: 0.10 },
    { id: 4, kode: 'C4', nama: 'Kapasitas SSD', tipe: 'Benefit', satuan: 'GB', keterangan: 'Kapasitas penyimpanan cepat SSD', bobot: 0.10 },
    { id: 5, kode: 'C5', nama: 'Kartu Grafis (GPU)', tipe: 'Benefit', satuan: 'Skor 0-100', keterangan: 'Skor performa visual & 3D GPU', bobot: 0.10 },
    { id: 6, kode: 'C6', nama: 'Daya Baterai', tipe: 'Benefit', satuan: 'Wh', keterangan: 'Kapasitas daya baterai operasional', bobot: 0.10 },
    { id: 7, kode: 'C7', nama: 'Portabilitas (Berat)', tipe: 'Cost', satuan: 'Kg', keterangan: 'Bobot fisik mobilitas laptop', bobot: 0.10 },
    { id: 8, kode: 'C8', nama: 'Kualitas Layar', tipe: 'Benefit', satuan: 'Skor 0-100', keterangan: 'Skor panel, akurasi warna & refresh rate', bobot: 0.10 },
    { id: 9, kode: 'C9', nama: 'Layanan Garansi', tipe: 'Benefit', satuan: 'Skala 1-5', keterangan: 'Masa garansi resmi & ADP (1-5)', bobot: 0.10 },
    { id: 10, kode: 'C10', nama: 'Upgradeability', tipe: 'Benefit', satuan: 'Skala 1-5', keterangan: 'Kemudahan ekspansi slot RAM/SSD (1-5)', bobot: 0.10 }
  ];
}

function spkEntropyApp() {
  return {
    dbStatus: 'connecting',
    isLoading: false,
    isSaving: false,
    isInjectingDemo: false,
    modalInput: false,
    modalSql: false,
    modalMatriks: false,
    modalPanduan: false,
    isEditMode: false,
    filterStatus: 'all',
    toasts: [],
    selectedLaptopIds: [],

    customerNama: '',
    budgetMaxFilter: null,
    kategoriFilter: 'all',
    lastCalculatedAt: '',

    confirmModal: {
      show: false,
      title: '',
      message: '',
      subMessage: '',
      items: [],
      confirmText: 'Konfirmasi',
      cancelText: 'Batal',
      type: 'primary',
      action: null
    },

    kriteriaList: getEntropyInitialKriteriaList(),
    laptopsData: [],
    hasilRanking: [],
    matriksData: null,
    entropyData: null,

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
      garansi_score: 3,
      upgrade_score: 3,
      spesifikasi_ringkas: ''
    },

    async init() {
      await this.loadDataLaptops(false);
    },

    showToast(message, type = 'success') {
      const id = Date.now();
      this.toasts.push({ id, message, type });
      setTimeout(() => this.removeToast(id), 5000);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

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

    toggleSelectAll() {
      if (this.selectedLaptopIds.length === this.laptopsData.length) {
        this.selectedLaptopIds = [];
      } else {
        this.selectedLaptopIds = this.laptopsData.map(l => l.id);
      }
    },
    toggleSelectLaptop(id) {
      if (this.selectedLaptopIds.includes(id)) {
        this.selectedLaptopIds = this.selectedLaptopIds.filter(i => i !== id);
      } else {
        this.selectedLaptopIds.push(id);
      }
    },
    isSelected(id) {
      return this.selectedLaptopIds.includes(id);
    },
    deselectAll() {
      this.selectedLaptopIds = [];
    },

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

    // 1. RUMUS PEMBOBOTAN SHANNON ENTROPY (m = 10 Kriteria)
    hitungBobotEntropy(dataset) {
      const data = dataset || this.laptopsData;
      const n = data.length;
      if (n <= 1) {
        this.kriteriaList.forEach(k => k.bobot = 0.10);
        return;
      }

      const k_constant = 1 / Math.log(n);
      const keys = ['harga', 'cpu_score', 'ram_gb', 'ssd_gb', 'gpu_score', 'baterai_wh', 'berat_kg', 'layar_score', 'garansi_score', 'upgrade_score'];

      // Normalisasi Matriks Proporsi P_ij
      const sums = {};
      keys.forEach((key) => {
        const isCost = (key === 'harga' || key === 'berat_kg');
        sums[key] = data.reduce((acc, row) => {
          const val = Number(row[key]) || 0.001;
          const x = isCost ? (1 / val) : val;
          return acc + x;
        }, 0);
      });

      const matrixP = [];
      data.forEach(row => {
        const pRow = { id: row.id, nama: row.nama };
        keys.forEach(key => {
          const isCost = (key === 'harga' || key === 'berat_kg');
          const val = Number(row[key]) || 0.001;
          const x = isCost ? (1 / val) : val;
          pRow[key] = sums[key] > 0 ? (x / sums[key]) : 0;
        });
        matrixP.push(pRow);
      });

      const Ej = {};
      const dj = {};
      let total_dj = 0;

      keys.forEach(key => {
        let sum_p_ln_p = 0;
        matrixP.forEach(pRow => {
          const p = pRow[key];
          if (p > 0) {
            sum_p_ln_p += (p * Math.log(p));
          }
        });
        const e_val = -1 * k_constant * sum_p_ln_p;
        Ej[key] = Math.max(0, Math.min(1, isNaN(e_val) ? 0.99 : e_val));
        dj[key] = 1 - Ej[key];
        total_dj += dj[key];
      });

      this.entropyData = {
        matrixP,
        Ej,
        dj,
        total_dj,
        k_constant,
        n
      };

      this.kriteriaList.forEach((k, idx) => {
        const key = keys[idx];
        if (total_dj > 0) {
          k.bobot = dj[key] / total_dj;
        } else {
          k.bobot = 1 / 10;
        }
        k.entropy_E = Ej[key];
        k.entropy_d = dj[key];
      });
    },

    // 2. ALGORITMA TOPSIS 10 DIMENSI
    kalkulasiTOPSIS(isUserClick = false) {
      if (!this.laptopsData || this.laptopsData.length === 0) {
        this.hasilRanking = [];
        return;
      }

      let dataToProcess = [...this.laptopsData];
      if (this.filterStatus !== 'all') {
        dataToProcess = dataToProcess.filter(item => item.status === this.filterStatus);
      }
      if (this.budgetMaxFilter && Number(this.budgetMaxFilter) > 0) {
        const maxBudget = Number(this.budgetMaxFilter);
        dataToProcess = dataToProcess.filter(item => Number(item.harga) <= maxBudget);
      }
      if (this.kategoriFilter && this.kategoriFilter !== 'all') {
        const kat = this.kategoriFilter.toLowerCase();
        dataToProcess = dataToProcess.filter(item => {
          const itemKat = (item.kategori_penggunaan || '').toLowerCase();
          return itemKat.includes(kat);
        });
      }

      if (dataToProcess.length === 0) {
        this.hasilRanking = [];
        if (isUserClick) {
          this.showToast("Tidak ada laptop yang memenuhi kriteria filter budget / kategori!", "warning");
        }
        return;
      }

      // 1. Hitung bobot Shannon Entropy dari dataset aktif
      this.hitungBobotEntropy(dataToProcess);

      // 2. Vektor Pembagi Kuadrat Euclidean
      const pembagi = {
        c1: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.harga), 2), 0)) || 1,
        c2: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.cpu_score), 2), 0)) || 1,
        c3: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.ram_gb), 2), 0)) || 1,
        c4: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.ssd_gb), 2), 0)) || 1,
        c5: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.gpu_score), 2), 0)) || 1,
        c6: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.baterai_wh), 2), 0)) || 1,
        c7: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.berat_kg), 2), 0)) || 1,
        c8: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.layar_score), 2), 0)) || 1,
        c9: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.garansi_score || 1), 2), 0)) || 1,
        c10: Math.sqrt(dataToProcess.reduce((sum, item) => sum + Math.pow(Number(item.upgrade_score || 1), 2), 0)) || 1
      };

      const w = {};
      this.kriteriaList.forEach(k => {
        w[k.kode.toLowerCase()] = k.bobot;
      });

      // 3. Matriks Ternormalisasi R & Matriks Terbobot Y
      const matrixR = [];
      const matrixY = [];

      dataToProcess.forEach(laptop => {
        const r1 = Number(laptop.harga) / pembagi.c1;
        const r2 = Number(laptop.cpu_score) / pembagi.c2;
        const r3 = Number(laptop.ram_gb) / pembagi.c3;
        const r4 = Number(laptop.ssd_gb) / pembagi.c4;
        const r5 = Number(laptop.gpu_score) / pembagi.c5;
        const r6 = Number(laptop.baterai_wh) / pembagi.c6;
        const r7 = Number(laptop.berat_kg) / pembagi.c7;
        const r8 = Number(laptop.layar_score) / pembagi.c8;
        const r9 = Number(laptop.garansi_score || 1) / pembagi.c9;
        const r10 = Number(laptop.upgrade_score || 1) / pembagi.c10;

        matrixR.push({ id: laptop.id, nama: laptop.nama, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10 });

        matrixY.push({
          id: laptop.id,
          nama: laptop.nama,
          y1: r1 * w.c1,
          y2: r2 * w.c2,
          y3: r3 * w.c3,
          y4: r4 * w.c4,
          y5: r5 * w.c5,
          y6: r6 * w.c6,
          y7: r7 * w.c7,
          y8: r8 * w.c8,
          y9: r9 * w.c9,
          y10: r10 * w.c10
        });
      });

      // 4. Solusi Ideal Positif A+ dan Negatif A-
      const yValues = (key) => matrixY.map(row => row[key]);

      const APlus = {
        y1: Math.min(...yValues('y1')), // C1 Cost
        y2: Math.max(...yValues('y2')), // C2 Benefit
        y3: Math.max(...yValues('y3')), // C3 Benefit
        y4: Math.max(...yValues('y4')), // C4 Benefit
        y5: Math.max(...yValues('y5')), // C5 Benefit
        y6: Math.max(...yValues('y6')), // C6 Benefit
        y7: Math.min(...yValues('y7')), // C7 Cost
        y8: Math.max(...yValues('y8')), // C8 Benefit
        y9: Math.max(...yValues('y9')), // C9 Benefit
        y10: Math.max(...yValues('y10')) // C10 Benefit
      };

      const AMinus = {
        y1: Math.max(...yValues('y1')), // C1 Cost
        y2: Math.min(...yValues('y2')),
        y3: Math.min(...yValues('y3')),
        y4: Math.min(...yValues('y4')),
        y5: Math.min(...yValues('y5')),
        y6: Math.min(...yValues('y6')),
        y7: Math.max(...yValues('y7')), // C7 Cost
        y8: Math.min(...yValues('y8')),
        y9: Math.min(...yValues('y9')),
        y10: Math.min(...yValues('y10'))
      };

      // 5. Jarak Euclidean D+ & D- serta Skor Preferensi Relatif Vi
      const ranked = dataToProcess.map(laptop => {
        const yRow = matrixY.find(r => r.id === laptop.id);

        const dPlus = Math.sqrt(
          Math.pow(yRow.y1 - APlus.y1, 2) +
          Math.pow(yRow.y2 - APlus.y2, 2) +
          Math.pow(yRow.y3 - APlus.y3, 2) +
          Math.pow(yRow.y4 - APlus.y4, 2) +
          Math.pow(yRow.y5 - APlus.y5, 2) +
          Math.pow(yRow.y6 - APlus.y6, 2) +
          Math.pow(yRow.y7 - APlus.y7, 2) +
          Math.pow(yRow.y8 - APlus.y8, 2) +
          Math.pow(yRow.y9 - APlus.y9, 2) +
          Math.pow(yRow.y10 - APlus.y10, 2)
        );

        const dMinus = Math.sqrt(
          Math.pow(yRow.y1 - AMinus.y1, 2) +
          Math.pow(yRow.y2 - AMinus.y2, 2) +
          Math.pow(yRow.y3 - AMinus.y3, 2) +
          Math.pow(yRow.y4 - AMinus.y4, 2) +
          Math.pow(yRow.y5 - AMinus.y5, 2) +
          Math.pow(yRow.y6 - AMinus.y6, 2) +
          Math.pow(yRow.y7 - AMinus.y7, 2) +
          Math.pow(yRow.y8 - AMinus.y8, 2) +
          Math.pow(yRow.y9 - AMinus.y9, 2) +
          Math.pow(yRow.y10 - AMinus.y10, 2)
        );

        const denom = dPlus + dMinus;
        const skorVi = denom === 0 ? 0 : (dMinus / denom);

        return {
          ...laptop,
          dPlus,
          dMinus,
          skorVi
        };
      });

      ranked.sort((a, b) => b.skorVi - a.skorVi);
      this.hasilRanking = ranked;
      this.matriksData = { pembagi, matrixR, matrixY, APlus, AMinus };
      this.lastCalculatedAt = new Date().toLocaleTimeString('id-ID');

      if (isUserClick) {
        this.showToast(`Kalkulasi Shannon Entropy & TOPSIS berhasil! Menghasilkan ranking ${ranked.length} laptop.`, "success");
        setTimeout(() => {
          const el = document.getElementById('hasilSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },

    cetakLaporanKonsultasi() {
      window.print();
    },

    exportCSV() {
      if (this.hasilRanking.length === 0) {
        this.showToast("Belum ada data hasil ranking untuk diekspor!", "warning");
        return;
      }
      let csv = "Rank,Nama Laptop,Merek,Kategori,Status,Harga (Rp),CPU Score,RAM (GB),SSD (GB),GPU Score,Baterai (Wh),Berat (Kg),Layar Score,Garansi (1-5),Upgrade (1-5),D Plus,D Minus,Skor Vi (Preferensi)\n";
      this.hasilRanking.forEach((item, index) => {
        csv += `${index + 1},"${item.nama.replace(/"/g, '""')}","${item.merek}","${item.kategori_penggunaan || 'Umum'}","${item.status}",${item.harga},${item.cpu_score},${item.ram_gb},${item.ssd_gb},${item.gpu_score},${item.baterai_wh},${item.berat_kg},${item.layar_score},${item.garansi_score || 1},${item.upgrade_score || 1},${item.dPlus.toFixed(6)},${item.dMinus.toFixed(6)},${item.skorVi.toFixed(6)}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `SPK_Entropy_TOPSIS_SuperKomputer_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToast("File CSV hasil ranking Entropy + TOPSIS berhasil diunduh!", "success");
    },

    async loadDataLaptops(showToastNotify = false) {
      this.isLoading = true;
      if (window.SupabaseService) {
        const res = await window.SupabaseService.getLaptops();
        if (res.isTableMissing) {
          this.dbStatus = 'table_missing';
          this.modalSql = true;
          this.loadLocalFallback();
        } else if (res.error) {
          this.dbStatus = 'offline';
          this.loadLocalFallback();
        } else {
          this.dbStatus = 'online';
          if (res.data && res.data.length > 0) {
            this.laptopsData = res.data;
          } else {
            this.loadLocalFallback();
          }
          if (showToastNotify) {
            this.showToast("Data laptop tersinkronkan dengan Supabase Cloud!", "success");
          }
        }
      } else {
        this.loadLocalFallback();
      }
      this.isLoading = false;
      this.kalkulasiTOPSIS(false);
    },

    loadLocalFallback() {
      try {
        const saved = localStorage.getItem('spk_laptops_data_10');
        if (saved) {
          this.laptopsData = JSON.parse(saved);
        } else {
          this.laptopsData = [...DEFAULT_LAPTOPS_DATA];
          localStorage.setItem('spk_laptops_data_10', JSON.stringify(this.laptopsData));
        }
      } catch (e) {
        this.laptopsData = [...DEFAULT_LAPTOPS_DATA];
      }
    },

    saveLocalLaptops() {
      try {
        localStorage.setItem('spk_laptops_data_10', JSON.stringify(this.laptopsData));
      } catch (e) {
        console.warn(e);
      }
    },

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
      this.formLaptop = { ...laptop };
      this.modalInput = true;
    },

    async simpanLaptop() {
      if (!this.formLaptop.nama || !this.formLaptop.merek || !this.formLaptop.harga) {
        this.showToast("Mohon lengkapi data spesifikasi penting laptop!", "error");
        return;
      }
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
        garansi_score: Number(this.formLaptop.garansi_score || 1),
        upgrade_score: Number(this.formLaptop.upgrade_score || 1),
        spesifikasi_ringkas: this.formLaptop.spesifikasi_ringkas || ''
      };

      if (this.dbStatus === 'online' && window.SupabaseService) {
        if (this.isEditMode) {
          const res = await window.SupabaseService.updateLaptop(this.formLaptop.id, payload);
          if (!res.error) {
            this.showToast("Data laptop berhasil diperbarui di Supabase Cloud!", "success");
            await this.loadDataLaptops(false);
          } else {
            this.showToast("Gagal memperbarui di Cloud, menyimpan ke local.", "warning");
            this.simpanLocalOnly(payload);
          }
        } else {
          const res = await window.SupabaseService.insertLaptop(payload);
          if (!res.error) {
            this.showToast("Laptop baru berhasil disimpan ke Supabase Cloud!", "success");
            await this.loadDataLaptops(false);
          } else {
            this.showToast("Gagal simpan ke Cloud, menyimpan ke local.", "warning");
            this.simpanLocalOnly(payload);
          }
        }
      } else {
        this.simpanLocalOnly(payload);
      }
      this.isSaving = false;
      this.modalInput = false;
      this.kalkulasiTOPSIS(false);
    },

    simpanLocalOnly(payload) {
      if (this.isEditMode) {
        const idx = this.laptopsData.findIndex(l => l.id === this.formLaptop.id);
        if (idx !== -1) {
          this.laptopsData[idx] = { ...payload, id: this.formLaptop.id };
        }
      } else {
        const newId = Date.now();
        this.laptopsData.unshift({ ...payload, id: newId });
      }
      this.saveLocalLaptops();
      this.showToast("Data berhasil disimpan secara lokal!", "success");
    },

    hapusLaptop(id, nama) {
      this.openConfirm({
        title: "Konfirmasi Hapus Laptop",
        message: `Apakah Anda yakin ingin menghapus data "${nama}" dari database? Tindakan ini tidak dapat dibatalkan.`,
        type: 'danger',
        confirmText: 'Ya, Hapus Data',
        action: async () => {
          if (this.dbStatus === 'online' && window.SupabaseService) {
            await window.SupabaseService.deleteLaptop(id);
          }
          this.laptopsData = this.laptopsData.filter(l => l.id !== id);
          this.saveLocalLaptops();
          this.kalkulasiTOPSIS(false);
          this.showToast(`Laptop "${nama}" berhasil dihapus.`, "success");
        }
      });
    },

    hapusSelectedLaptops() {
      const count = this.selectedLaptopIds.length;
      if (count === 0) return;
      const selectedNames = this.laptopsData
        .filter(l => this.selectedLaptopIds.includes(l.id))
        .map(l => l.nama);

      this.openConfirm({
        title: `Hapus ${count} Laptop Sekaligus`,
        message: `Apakah Anda yakin ingin menghapus ${count} laptop yang dipilih dari inventaris toko?`,
        items: selectedNames,
        subMessage: 'Perhatian: Seluruh data terpilih akan dihapus permanen dari Supabase.',
        type: 'danger',
        confirmText: `Hapus ${count} Laptop`,
        action: async () => {
          const idsToDelete = [...this.selectedLaptopIds];
          if (this.dbStatus === 'online' && window.SupabaseService) {
            await window.SupabaseService.deleteMultipleLaptops(idsToDelete);
          }
          this.laptopsData = this.laptopsData.filter(l => !idsToDelete.includes(l.id));
          this.selectedLaptopIds = [];
          this.saveLocalLaptops();
          this.kalkulasiTOPSIS(false);
          this.showToast(`Berhasil menghapus ${count} laptop dari database!`, "success");
        }
      });
    },

    async seedDataContoh() {
      this.isInjectingDemo = true;
      try {
        let catalog = DEFAULT_LAPTOPS_DATA;
        try {
          const resp = await fetch('../data/laptops_catalog.json');
          if (resp.ok) {
            catalog = await resp.json();
          }
        } catch(e) {}

        const existingNames = new Set(this.laptopsData.map(l => (l.nama || '').trim().toLowerCase()));
        const availableModels = catalog.filter(l => !existingNames.has((l.nama || '').trim().toLowerCase()));

        if (availableModels.length === 0) {
          this.showToast("Semua varian laptop dalam katalog sudah ada di database toko!", "info");
          this.isInjectingDemo = false;
          return;
        }

        const batchSize = 5;
        const newBatch = availableModels.slice(0, batchSize);

        this.openConfirm({
          title: `Tambah ${newBatch.length} Stok Laptop Baru`,
          message: `Sistem akan menambahkan ${newBatch.length} model laptop viral ke database:`,
          items: newBatch.map(l => `${l.nama} (${l.merek}) - Rp ${(l.harga/1000000).toFixed(1)}jt`),
          subMessage: `Tersisa ${availableModels.length - newBatch.length} model lain di katalog master.`,
          type: 'primary',
          confirmText: `Tambahkan ${newBatch.length} Model Sekarang`,
          action: async () => {
            if (this.dbStatus === 'online' && window.SupabaseService) {
              const res = await window.SupabaseService.seedLaptops(newBatch);
              if (!res.error) {
                await this.loadDataLaptops(false);
                this.showToast(`Berhasil menambahkan ${newBatch.length} laptop baru ke Supabase!`, "success");
              } else {
                newBatch.forEach(item => this.laptopsData.unshift({ ...item, id: Date.now() + Math.random() }));
                this.saveLocalLaptops();
                this.kalkulasiTOPSIS(false);
              }
            } else {
              newBatch.forEach(item => this.laptopsData.unshift({ ...item, id: Date.now() + Math.random() }));
              this.saveLocalLaptops();
              this.kalkulasiTOPSIS(false);
              this.showToast(`Berhasil menambahkan ${newBatch.length} laptop demo secara lokal!`, "success");
            }
          }
        });
      } catch (err) {
        this.showToast("Gagal memuat data contoh: " + err.message, "error");
      }
      this.isInjectingDemo = false;
    }
  };
}

if (typeof window !== 'undefined') {
  window.spkEntropyApp = spkEntropyApp;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { spkEntropyApp };
}
