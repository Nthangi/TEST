import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  course: 'Starter' | 'Main' | 'Dessert';
  price: number;
}

export default function App() {
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [course, setCourse] = useState<MenuItem['course']>('Starter');
  const [priceText, setPriceText] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleAddItem = () => {
    if (!dishName.trim()) { Alert.alert('Validation','Please enter the dish name.'); return; }
    if (!description.trim()) { Alert.alert('Validation','Please enter a description.'); return; }
    const price = parseFloat(priceText);
    if (isNaN(price) || price <= 0) { Alert.alert('Validation','Please enter a valid price greater than 0.'); return; }

    const newItem: MenuItem = {
      id: Date.now(),
      name: dishName.trim(),
      description: description.trim(),
      course,
      price,
    };
    setMenuItems(prev => [...prev, newItem]);
    setDishName(''); setDescription(''); setCourse('Starter'); setPriceText('');
  };

  const handleRemoveItem = (id: number) => {
    Alert.alert('Remove item', 'Remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setMenuItems(prev => prev.filter(i => i.id !== id)) },
    ]);
  };

  const totalItems = menuItems.length;
  const getAverage = (courseName: MenuItem['course']) => {
    const items = menuItems.filter(i => i.course === courseName);
    if (items.length === 0) return '-';
    const avg = items.reduce((s, it) => s + it.price, 0) / items.length;
    return avg.toFixed(2);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.desc}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.courseText}>{item.course}</Text>
        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.header}>Christoffel's Menu</Text>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Items: {totalItems}</Text>
            <Text>Average (Starters): {getAverage('Starter')}</Text>
            <Text>Average (Mains): {getAverage('Main')}</Text>
            <Text>Average (Desserts): {getAverage('Dessert')}</Text>
          </View>

          <Text style={styles.formTitle}>Add Menu Item</Text>

          <TextInput style={styles.input} placeholder="Dish Name" value={dishName} onChangeText={setDishName} />
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Description" value={description} onChangeText={setDescription} multiline />

          <Text style={{ marginBottom: 6, fontWeight: '600' }}>Select Course</Text>
          <View style={styles.pickerWrap}>
            <Picker selectedValue={course} onValueChange={(v) => setCourse(v as MenuItem['course'])}>
              <Picker.Item label="Starter" value="Starter" />
              <Picker.Item label="Main" value="Main" />
              <Picker.Item label="Dessert" value="Dessert" />
            </Picker>
          </View>

          <TextInput style={styles.input} placeholder="Price (e.g. 120.00)" value={priceText} onChangeText={setPriceText} keyboardType="numeric" />

          <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Add Dish</Text>
          </TouchableOpacity>

          <Text style={[styles.formTitle, { marginTop: 18 }]}>Menu</Text>

          {menuItems.length === 0 ? (
            <Text style={{ marginVertical: 10, color: '#666' }}>No items added yet.</Text>
          ) : (
            <FlatList data={menuItems} keyExtractor={(i) => i.id.toString()} renderItem={renderItem} scrollEnabled={false} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff8f0' },
  header: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  summary: { backgroundColor: '#f2e9e1', padding: 10, borderRadius: 8, marginBottom: 12 },
  summaryText: { fontWeight: '700', marginBottom: 6 },
  formTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#fff' },
  pickerWrap: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  addBtn: { backgroundColor: '#0a84ff', padding: 12, alignItems: 'center', borderRadius: 8, marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  dishName: { fontWeight: '800', fontSize: 16 },
  price: { fontWeight: '700', color: '#333' },
  desc: { marginTop: 6, color: '#555' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  courseText: { fontStyle: 'italic', color: '#444' },
  removeText: { color: '#d9534f', fontWeight: '700' }
});
