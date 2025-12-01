# Matematika Solver ID

Website ini adalah aplikasi pemecah masalah matematika yang menggunakan kamera untuk memindai soal dan AI Google Gemini untuk menjawabnya.

## Tutorial Setting API Key di Vercel

Agar aplikasi ini dapat berjalan di Vercel, Anda perlu menyimpan API Key Gemini Anda dengan aman di Environment Variables.

1. **Push kode ke GitHub/GitLab:** Pastikan kode project ini sudah ada di repository Git Anda.
2. **Import ke Vercel:**
   - Buka dashboard Vercel (https://vercel.com).
   - Klik "Add New..." -> "Project".
   - Pilih repository Git Anda.
3. **Konfigurasi Environment Variable:**
   - Di halaman "Configure Project", cari bagian **Environment Variables**.
   - Masukkan Key: `API_KEY`
   - Masukkan Value: `AIzaSyAdJzHJ5hOptBYTRyv-PRv1xnvvHJuQN-Q` (Atau API Key terbaru Anda)
   - Klik tombol **Add**.
4. **Deploy:**
   - Klik tombol **Deploy**.
   - Tunggu proses build selesai.

## Catatan Penting
Aplikasi ini menyimpan riwayat pemindaian di `localStorage` browser pengguna. Gambar dikompresi agar tidak memenuhi memori browser.