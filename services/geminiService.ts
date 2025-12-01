import { GoogleGenAI } from "@google/genai";

// Menggunakan import.meta.env untuk Vite
// Menggunakan optional chaining (?.) dan nullish coalescing (??) agar tidak crash jika undefined
const apiKey = import.meta.env?.VITE_API_KEY ?? '';

// Initialize the client
// Kita inisialisasi di luar fungsi agar reuse instance, tapi handle error di dalam fungsi jika key kosong
const ai = new GoogleGenAI({ apiKey });

export const solveMathProblem = async (base64Image: string): Promise<{ text: string }> => {
  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan Environment Variable 'VITE_API_KEY' sudah diset di Vercel.");
  }

  // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const modelId = "gemini-2.5-flash"; // Fast and capable multimodal model
    
    const prompt = `
      Bertindaklah sebagai profesor matematika dan ahli fisika yang jenius.
      Tugasmu adalah menganalisis gambar ini.
      1. Identifikasi soal matematika atau sains yang ada di gambar. Jika ada tulisan tangan, baca dengan teliti.
      2. Jika soal berbentuk pilihan ganda (ABCD), tentukan jawaban yang benar.
      3. Berikan solusi langkah demi langkah yang lengkap, jelas, dan mudah dipahami.
      4. Gunakan Bahasa Indonesia yang formal namun mudah dimengerti.
      5. Gunakan format Markdown untuk penulisan matematika (misalnya LaTeX untuk rumus jika perlu).
      
      Struktur Jawaban:
      **Soal yang Terdeteksi:**
      [Tulis ulang soal di sini]

      **Jawaban Akhir:**
      [Jawaban Singkat / Pilihan Opsi]

      **Langkah Penyelesaian:**
      [Penjelasan detail langkah demi langkah]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return {
      text: response.text || "Maaf, saya tidak dapat menghasilkan jawaban saat ini."
    };

  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat menghubungi AI.");
  }
};