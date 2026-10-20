import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function KbuTeknikDestekEkrani() {
  // 1. FORM DURUMLARI
  const [adSoyad, setAdSoyad] = useState('');
  const [bolum, setBolum] = useState('');
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  
  const [kategori, setKategori] = useState('');
  const [isletimSistemi, setIsletimSistemi] = useState('');
  const [oncelik, setOncelik] = useState('Orta');
  const [acil, setAcil] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [talepler, setTalepler] = useState([]);

  // 2. SEÇENEKLER
  const kategoriler = ['Bilgisayar', 'Ağ/İnternet', 'Yazılım', 'Laboratuvar'];
  const isletimSistemleri = ['Windows', 'MacOS', 'Ubuntu', 'Diğer'];
  const oncelikler = ['Düşük', 'Orta', 'Yüksek'];

  // 3. FORM TEMİZLEME
  const formuTemizle = () => {
    setAdSoyad('');
    setBolum('');
    setBaslik('');
    setAciklama('');
    setKategori('');
    setIsletimSistemi('');
    setOncelik('Orta');
    setAcil(false);
  };

  // 4. TALEP OLUŞTURMA
  const talepOlustur = () => {
    if (isSubmitting) return;

    if (!adSoyad.trim() || !bolum.trim() || !baslik.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen yıldızlı (*) zorunlu alanları doldurunuz.');
      return;
    }

    // ÖZGÜN DEĞİŞİKLİK (T05): Ad Soyad alanında rakam/özel karakter kontrolü
    const isimRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/;
    if (!isimRegex.test(adSoyad)) {
      Alert.alert('Geçersiz İsim', 'Ad soyad alanı sadece harflerden oluşmalıdır (Rakam kullanılamaz).');
      return;
    }

    if (aciklama.trim().length < 10) {
      Alert.alert('Geçersiz Açıklama', 'Arıza açıklaması detaylı (en az 10 karakter) olmalıdır.');
      return;
    }

    if (!kategori) {
      Alert.alert('Kategori Seçilmedi', 'Lütfen arıza kategorisini seçiniz.');
      return;
    }

    setIsSubmitting(true);

    const yeniTalep = {
      id: 'KBÜ-' + Math.floor(1000 + Math.random() * 9000), // KBÜ-1234 formatında ID
      adSoyad: adSoyad.trim(),
      bolum: bolum.trim(),
      baslik: baslik.trim(),
      aciklama: aciklama.trim(),
      kategori: kategori,
      isletimSistemi: isletimSistemi || 'Belirtilmedi',
      oncelik: oncelik,
      acil: acil,
      durum: 'Açık',
      tarih: new Date().toLocaleString('tr-TR')
    };

    setTimeout(() => {
      setTalepler([yeniTalep, ...talepler]);
      formuTemizle();
      setIsSubmitting(false);
      Alert.alert('Başarılı', 'KBÜ Bilgi İşlem talebiniz başarıyla oluşturuldu.');
    }, 600);
  };

  // 5. TALEP SİLME ONAYI
  const talepSilSorgusu = (silinecekId) => {
    Alert.alert(
      'Talebi Geri Çek',
      `${silinecekId} numaralı talebi iptal etmek istediğinize emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: () => {
            const yeniListe = talepler.filter((t) => t.id !== silinecekId);
            setTalepler(yeniListe);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Üst Kısım / Header (KBÜ Renkleri) */}
      <View style={styles.header}>
        <Text style={styles.title}>KBÜ Teknik Destek</Text>
        <Text style={styles.subtitle}>Öğrenci & Personel Arıza Bildirimi</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        
        <Text style={styles.label}>Ad Soyad *</Text>
        <TextInput style={styles.input} placeholder="Örn: İkbal Torun" value={adSoyad} onChangeText={setAdSoyad} maxLength={40} />

        <Text style={styles.label}>Fakülte / Bölüm *</Text>
        <TextInput style={styles.input} placeholder="Örn: Yazılım Mühendisliği" value={bolum} onChangeText={setBolum} maxLength={40} />

        <Text style={styles.sectionTitle}>Arıza Detayları</Text>
        
        <Text style={styles.label}>Konu Başlığı *</Text>
        <TextInput style={styles.input} placeholder="Örn: Proje derlenirken hata alıyorum" value={baslik} onChangeText={setBaslik} maxLength={50} />

        <Text style={styles.label}>Açıklama *</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Aldığınız hatayı veya sorunu detaylıca açıklayınız..." value={aciklama} onChangeText={setAciklama} multiline={true} textAlignVertical="top" maxLength={300} />

        <Text style={styles.label}>Arıza Kategorisi *</Text>
        <View style={styles.optionsContainer}>
          {kategoriler.map((item) => (
            <Pressable key={item} onPress={() => setKategori(item)} style={[styles.optionButton, kategori === item && styles.selectedOption]}>
              <Text style={[styles.optionText, kategori === item && styles.selectedOptionText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>İşletim Sistemi (Opsiyonel)</Text>
        <View style={styles.optionsContainer}>
          {isletimSistemleri.map((item) => (
            <Pressable key={item} onPress={() => setIsletimSistemi(item)} style={[styles.optionButton, isletimSistemi === item && styles.selectedOption]}>
              <Text style={[styles.optionText, isletimSistemi === item && styles.selectedOptionText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Öncelik Seviyesi</Text>
        <View style={styles.optionsContainer}>
          {oncelikler.map((item) => (
            <Pressable key={item} onPress={() => setOncelik(item)} style={[styles.optionButton, oncelik === item && styles.selectedOption]}>
              <Text style={[styles.optionText, oncelik === item && styles.selectedOptionText]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelArea}>
            <Text style={styles.switchText}>Acil Müdahale Talebi</Text>
            <Text style={styles.switchHint}>Sadece laboratuvar cihazı çökmeleri gibi kritik durumlar için.</Text>
          </View>
          <Switch value={acil} onValueChange={setAcil} trackColor={{ false: '#cbd5e1', true: '#fca5a5' }} thumbColor={acil ? '#dc2626' : '#f8fafc'} />
        </View>

        <Pressable style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} onPress={talepOlustur} disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Gönderiliyor...' : 'Talebi İlet'}
          </Text>
        </Pressable>

        <Pressable style={styles.clearButton} onPress={formuTemizle}>
          <Text style={styles.clearButtonText}>Formu Temizle</Text>
        </Pressable>

        {/* EKLENEN TALEPLER */}
        {talepler.length > 0 && (
          <View style={{marginTop: 35}}>
            <Text style={styles.sectionTitle}>Aktif Taleplerim ({talepler.length})</Text>
            {talepler.map((talep) => (
              <View key={talep.id} style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.resultTitle}>{talep.baslik}</Text>
                  <Pressable onPress={() => talepSilSorgusu(talep.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>İptal Et</Text>
                  </Pressable>
                </View>
                <Text style={styles.resultValue}>Takip No: {talep.id}</Text>
                <Text style={styles.resultValue}>Bölüm: {talep.bolum}</Text>
                <Text style={styles.resultValue}>Sistem: {talep.isletimSistemi} | Öncelik: {talep.oncelik}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>Karabük Üniversitesi Bilgi İşlem</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <KbuTeknikDestekEkrani />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { flex: 1 },
  header: { backgroundColor: '#1e3a8a', padding: 20, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#bfdbfe', marginTop: 5 },
  content: { padding: 20, paddingBottom: 45 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#0f172a', marginTop: 15, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, backgroundColor: '#ffffff', padding: 13, fontSize: 15, color: '#0f172a' },
  textArea: { minHeight: 100 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  optionButton: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#e2e8f0', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' },
  selectedOption: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  optionText: { color: '#334155', fontSize: 14, fontWeight: '500' },
  selectedOptionText: { color: '#ffffff' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, padding: 14, backgroundColor: '#ffffff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  switchLabelArea: { flex: 1, paddingRight: 10 },
  switchText: { fontSize: 15, fontWeight: '600', color: '#334155' },
  switchHint: { fontSize: 12, color: '#64748b', marginTop: 4 },
  submitButton: { backgroundColor: '#1e3a8a', padding: 16, borderRadius: 10, marginTop: 25, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: '#94a3b8' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  clearButton: { backgroundColor: '#ffffff', padding: 14, borderRadius: 10, marginTop: 10, alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1' },
  clearButtonText: { color: '#475569', fontSize: 15, fontWeight: '600' },
  resultCard: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', padding: 16, borderRadius: 12, marginTop: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#166534', flex: 1 },
  deleteButton: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  resultValue: { fontSize: 13, color: '#14532d', marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 40, fontWeight: '500' }
});