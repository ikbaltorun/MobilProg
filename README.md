# 🎓 KBÜ Teknik Destek Sistemi (Mobil Uygulama)

Mobil Programlama Dersi Hafta 5 Ödevi (Test Senaryosu Tasarlama ve Uygulama İyileştirme).

## 📱 Proje Hakkında
Bu proje, üniversite kampüsü içerisindeki donanımsal ve yazılımsal sorunların Bilgi İşlem birimine hızlıca iletilmesi amacıyla geliştirilmiş bir arıza talep yönetim arayüzüdür. Hafta 5 görevleri kapsamında uygulamanın hata yönetimi (error handling), asenkron durum yönetimi (state management) ve girdi doğrulamaları (validation) iyileştirilmiştir.

---

## 🧪 1. Test Senaryoları ve Sonuçları

Uygulamanın beklenmeyen kullanıcı davranışlarına karşı nasıl tepki verdiğini ölçmek için aşağıdaki testler uygulanmış ve gerekli iyileştirmeler yapılmıştır.

| Test Kodu | Kullanıcı Davranışı (Uygulanan Adımlar) | Beklenen Sonuç | Gerçekleşen Sonuç (İyileştirme Sonrası) | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **T01** | Tüm alanları doldurup "Konu Başlığı" alanını boş bırakarak kayıt oluşturma. | Kayıt engellenmeli ve kullanıcıya uyarı gösterilmeli. | "Eksik Bilgi" başlıklı uyarı penceresi çıktı ve kayıt yapılmadı. | ✅ Başarılı |
| **T02** | "Açıklama" alanına sadece boşluk (space) karakterleri girerek kaydetme. | Metin yok sayılmalı, kayıt oluşturulmamalı. | `.trim()` fonksiyonu boşlukları sildiği için karakter sınırı kuralı işledi ve "Geçersiz Açıklama" uyarısı verdi. | ✅ Başarılı |
| **T03** | "Talebi İlet" butonuna art arda çok hızlı bir şekilde (2-3 kez) basma. | Aynı talebin istemeden birden fazla kez kaydedilmesi önlenmeli. | `isSubmitting` state'i kullanılarak butona tıklandığı an buton kilitlendi (disabled) ve sadece tek kayıt oluştu. | ✅ Başarılı |
| **T04** | Aktif talepler listesinden "İptal Et" (Sil) butonuna basıp, çıkan onay penceresinde "Vazgeç" deme. | Talep listeden silinmemeli ve ekranda kalmaya devam etmeli. | `Alert.alert` butonları doğru çalıştı, "Vazgeç" seçildiğinde dizide (`array`) herhangi bir filtreleme yapılmadı ve liste korundu. | ✅ Başarılı |
| **T05 (Özgün)** | "Ad Soyad" alanına bilerek rakam ve özel karakter (Örn: `İkbal 123!`) girerek formu gönderme. | Sistem isim alanında rakam olamayacağını algılamalı ve işlemi durdurmalı. | Uygulanan Regex (`/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/`) kontrolüne takıldı ve "Geçersiz İsim" hatası gösterildi. | ✅ Başarılı |

---

## 🔄 2. Önce ve Sonra Karşılaştırması (T04 - Talep İptali İyileştirmesi)

| Soru | Öğrencinin Yanıtı |
| :--- | :--- |
| **Hangi sorun veya eksiklik tespit edildi?** | Uygulamada kayıt oluşturulduktan sonra kullanıcının fikrini değiştirip bu kaydı iptal edebileceği (silebileceği) bir mekanizma yoktu. |
| **Sorun hangi kullanıcı olayıyla ilişkiliydi?** | `onPress` etkileşimi ve state üzerindeki verilerin dinamik listelenmemesiyle ilişkiliydi. |
| **Kodda hangi değişiklikleri yaptınız?** | `sonTalep` state'i iptal edilerek yerine `talepler` adında bir dizi (`array`) state'i oluşturuldu. `Alert.alert` kullanılarak "Vazgeç" ve "İptal Et" seçenekleri sunuldu. "İptal Et" seçildiğinde `.filter()` fonksiyonu ile talep diziden çıkarılarak liste güncellendi. |
| **Değişiklikten sonra test sonucu ne oldu?** | "İptal Et" butonuna basıldığında onay ekranı çıktı. "Vazgeç" denildiğinde liste korundu, onaylandığında ise talep başarıyla silindi. |

---

## 🤖 3. Yapay Zekâ Kullanımı ve Alınan Desteğin Özeti

**Kullanılan İstem (Prompt):**
> "React Native ve Expo kullanarak geliştirdiğim uygulamada, kullanıcı 'Talebi İlet' düğmesine hızlıca iki kez bastığında aynı kayıt iki kez oluşabiliyor (T03 Senaryosu). Bu davranışın olası nedenlerini ve onPress ile state yönetimi açısından neleri incelemem gerektiğini açıkla. Önce çözüm kodunu vermeden kontrol etmem gereken noktaları belirt."

**Alınan Desteğin Özeti:**
Yapay zekâ aracı, sorunun React Native'deki `onPress` olaylarının asenkron doğasından kaynaklandığını açıkladı. Doğrudan hazır kodu vermek yerine; bir `isSubmitting` (yükleniyor) state'i oluşturmamı, butona ilk tıklandığında bu değeri `true` yapıp işlem bitene kadar butonu `disabled` duruma getirmemi önerdi. Bu yönlendirme doğrultusunda mantığı kavrayarak gerekli kod bloğunu kendim yazdım ve entegre ettim.

---

## 🛠️ 4. Yapılan Kod İyileştirmeleri ve Analiz
Test senaryolarından yola çıkılarak koda uygulanan temel müdahaleler şunlardır:
1. **Asenkron State Koruması (T03):** Çoklu tıklama nedeniyle oluşan kayıt sorunu, `isSubmitting` boolean state'i ile `Pressable` bileşeninin `disabled` prop'u birbirine bağlanarak çözüldü.
2. **Dinamik Veri Listeleme (T04):** Önceden sadece son veriyi tutan yapı değiştirildi. Veriler spread operatörü (`[yeniTalep, ...talepler]`) ile diziye eklendi ve `map()` fonksiyonuyla ekrana render edildi.
3. **Regex ile Veri Doğrulama (T05):** Yalnızca `.trim()` kontrolü yeterli görülmeyip, Ad Soyad alanının saf metin tabanlı olması için `isimRegex.test(adSoyad)` metoduyla sıkı bir doğrulama katmanı eklendi.

---

## 📸 5. Ekran Görüntüleri

<div align="center">
  <img width="350" alt="Ekran Görüntüsü 1" src="https://github.com/user-attachments/assets/b8c7af34-edde-4558-bb64-0e30f4348c8d" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img width="350" alt="Ekran Görüntüsü 2" src="https://github.com/user-attachments/assets/190ee694-8e1e-4a06-abfc-1303db91e320" />
</div>

> **Not:** Bu proje Expo ve React Native (JavaScript) kullanılarak geliştirilmiştir. Çalıştırmak için `npm install` ve `npx expo start` komutlarını kullanabilirsiniz.
