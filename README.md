# 🎨 Digital Paint Lab

Professional paint mixing simulator with industry-standard pigments.

## Proje Özeti

Digital Paint Lab, gerçek dünya boya karıştırma sürecini simüle eden bir web uygulamasıdır. Endüstri standardı pigmentler kullanarak özel duvar renkleri oluşturabilir, gerçek zamanlı önizleme görebilir ve duvar alanınıza göre ihtiyacınız olan malzemeleri hesaplayabilirsiniz.

## Özellikler

### ✅ Tamamlanan Özellikler

1. **14 Endüstri-Standardı Pigment**
   - Sarı/Turuncu: Oxide Yellow (PY42), Cadmium Yellow (PY35), Raw Sienna (PBr7)
   - Kırmızı: Flag Red (PR101), Cadmium Red (PR108), Burnt Sienna (PBr7)
   - Mavi: Prussian Blue (PB27), Ultramarine Blue (PB29), Cobalt Blue (PB28)
   - Yeşil: Oxide Green (PG17), Phthalo Green (PG7)
   - Siyah/Kahverengi: Carbon Black (PBk7), Raw Umber (PBr7), Burnt Umber (PBr7)

2. **Birim Bazlı Karıştırma**
   - Damla (1 damla = 0.05 ml)
   - Mililitre (ml)
   - Tüp (1 tüp = 20 ml)

3. **Gerçek Zamanlı Renk Önizleme**
   - Anlık renk güncellemeleri
   - Hex ve RGB kod görüntüleme
   - Yumuşak geçişli animasyonlar

4. **Duvar Görselleştirme**
   - 3 farklı duvar dokusu (Smooth, Textured, Rough)
   - 3 farklı ışık koşulu (Daylight, Warm Indoor, Cool Indoor)
   - Gerçekçi görselleştirme

5. **Tarif Kartı**
   - Eklenen tüm pigmentlerin listesi
   - Panoya kopyalama özelliği
   - Detaylı tarif formatı

6. **Kaplama Hesaplayıcı**
   - m² girişi ile otomatik hesaplama
   - 1 litre = 10 m² kaplama standardı
   - Gereken baz boya ve pigment miktarları
   - Kaç tüp pigment alınması gerektiği

7. **Kullanıcı Dostu Arayüz**
   - Modern, temiz tasarım
   - Responsive (mobil uyumlu)
   - Üç kolonlu dashboard layout
   - Kolay navigasyon

## Teknik Stack

- **Frontend**: Next.js 14+ (App Router), JavaScript, Tailwind CSS
- **Backend**: FastAPI (opsiyonel - şu anda kullanılmıyor, tüm hesaplamalar client-side)
- **State Management**: React Context API
- **Color Mixing Algorithm**: RGB tabanlı subtractive approximation

## Kurulum

### 1. Frontend Kurulumu

```bash
cd /Users/yigitakturk/Desktop/projeler/boya_yapma_ltd_sti/frontend

# Zaten yüklü, ancak tekrar yüklemek için:
# npm install

# Development server başlatma
npm run dev
```

Uygulama şu adreste çalışacak: **http://localhost:3000**

### 2. Production Build (İsteğe Bağlı)

```bash
cd frontend
npm run build
npm start
```

## Kullanım

### Adım 1: Pigment Seçimi
- Sol panelden pigment kategorilerini açın
- Bir pigment seçin
- Miktar ve birim belirtin (damla, ml veya tüp)
- "Add to Mix" butonuna tıklayın

### Adım 2: Renk Görselleştirme
- Ortadaki panelde renginizi gerçek zamanlı görün
- Hex ve RGB kodları kontrol edin
- Duvar önizlemesinde farklı dokular ve ışık koşullarını deneyin

### Adım 3: Tarif Kaydetme
- Sağ panelde tarifinizi görün
- "Copy Recipe" ile panoya kopyalayın
- İstenmeyen pigmentleri kaldırabilirsiniz

### Adım 4: Kaplama Hesaplama
- Duvar alanınızı m² olarak girin (örn: 50)
- Gereken baz boya ve pigment miktarlarını görün
- Kaç tüp pigment almanız gerektiğini öğrenin

## Dosya Yapısı

```
frontend/
├── app/
│   ├── components/
│   │   ├── PigmentSelector.js      # Pigment seçim paneli
│   │   ├── PigmentControl.js       # Pigment ekleme kontrolü
│   │   ├── ColorVisualizer.js      # Ana renk önizleme
│   │   ├── WallPreview.js          # Duvar doku önizleme
│   │   ├── RecipePanel.js          # Tarif kartı
│   │   └── CoverageCalculator.js   # Kaplama hesaplayıcı
│   ├── layout.js                   # Root layout
│   ├── page.js                     # Ana sayfa
│   └── globals.css                 # Global stiller
├── lib/
│   ├── pigmentData.js              # Pigment veritabanı
│   ├── colorMixing.js              # Renk karışım algoritması
│   └── paintCalculations.js       # Kaplama hesaplamaları
├── context/
│   └── PaintContext.js             # State management
└── public/
    └── textures/                   # Duvar doku görselleri
```

## Renk Karışım Algoritması

Uygulama, RGB tabanlı subtractive color mixing yaklaşımı kullanır:

1. **Birim Dönüşümü**: Tüm birimler ml'ye dönüştürülür
2. **Konsantrasyon Hesaplama**: Her pigmentin toplam boyaya oranı hesaplanır
3. **Güç Faktörü**: Her pigmentin tinting power'ı (güç) uygulanır
4. **Multiplicative Blending**: Gerçekçi boya karıştırma için multiplicative + linear interpolation
5. **Sıralı Uygulama**: Pigmentler birer birer eklenerek gerçekçi simülasyon

### Örnek:
- Beyaz baz (255, 255, 255)
- + 10ml Oxide Yellow → Açık sarı tonu
- + 2ml Prussian Blue → Yeşilimsi ton
- + 0.5ml Carbon Black → Koyu, pastel yeşil

## Birim Referansı

- **1 damla** = 0.05 ml
- **1 tüp** = 20 ml
- **1 litre** = 1000 ml
- **Kaplama**: 1 litre boya = 10 m² duvar (standart mat duvar boyası)

## Önemli Notlar

1. **Pigment Gücü**: Carbon Black gibi güçlü pigmentler çok az miktarda bile rengi önemli ölçüde değiştirir. Her pigmentin "strength" değeri var.

2. **Gerçekçilik**: RGB approximation kullanıldığı için %100 bilimsel doğruluk yok, ancak görsel olarak gerçekçi sonuçlar üretir.

3. **State**: Sayfa yenilendiğinde mix sıfırlanır. LocalStorage eklenerek kalıcılık sağlanabilir (gelecekte).

4. **Responsive**: Mobil cihazlarda kolonlar dikey olarak sıralanır.

## Gelecek Geliştirmeler (Opsiyonel)

- [ ] Tarifleri LocalStorage'a kaydetme
- [ ] URL ile tarif paylaşma
- [ ] Gerçek duvar dokusu görselleri ekleme
- [ ] PDF export özelliği
- [ ] Pantone/RAL renk eşleştirme
- [ ] FastAPI backend entegrasyonu (ileri seviye hesaplamalar için)
- [ ] User authentication ve cloud recipe storage

## Hata Giderme

### Port zaten kullanımda
```bash
# 3000 portunu kullanan process'i bul ve kapat
lsof -i :3000
kill -9 <PID>
```

### Build hataları
```bash
# node_modules ve .next'i temizle
rm -rf node_modules .next
npm install
npm run dev
```

### Component hatası
- Browser console'da detaylı hata mesajlarını kontrol edin
- File path'lerin doğru olduğundan emin olun

## Lisans

Bu proje eğitim ve demonstrasyon amaçlıdır.

## İletişim

Sorularınız için: Yiğit Aktürk

---

**Not**: Uygulama şu anda çalışıyor! Tarayıcıda **http://localhost:3000** adresine giderek test edebilirsiniz.
