import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import ProductList from './src/ProductList';
import ProductItemView from './src/Title';
import { colors } from './src/theme';

import "./app.css"

// Animação pulse mais suave, com escala menor
const pulseSoft = {
  0: { scale: 1 },
  0.5: { scale: 1.02 },
  1: { scale: 1 },
};

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Arroz', quantity: 2, unitPrice: 5.49 },
    { id: 2, name: 'Feijão', quantity: 1, unitPrice: 7.20 },
    { id: 4, name: 'Macarrão', quantity: 2, unitPrice: 5.49 },
    { id: 5, name: 'Carne 452gr', quantity: 1, unitPrice: 72.23 },
    { id: 6, name: 'Frango 1kg', quantity: 2, unitPrice: 17.49 },
    { id: 7, name: 'Pizza', quantity: 1, unitPrice: 12.20 },
    { id: 8, name: 'Pão de forma', quantity: 2, unitPrice: 5.49 },
    { id: 9, name: 'Ovo cx 30', quantity: 1, unitPrice: 20.33 },
    { id: 10, name: 'Pão de forma', quantity: 2, unitPrice: 5.49 },
    { id: 11, name: 'Ovo cx 30', quantity: 1, unitPrice: 20.33 },
    { id: 12, name: 'Pão de forma', quantity: 2, unitPrice: 5.49 },
    { id: 13, name: 'Ovo cx 30', quantity: 1, unitPrice: 20.33 },
    { id: 3, name: 'Leite', quantity: 3, unitPrice: 4.10 }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const totalPrice = products.reduce(
    (acc, product) => acc + product.unitPrice * product.quantity,
    0
  );

  const handleAddProduct = () => {
    if (productName.trim() === '' || productPrice.trim() === '') {
      alert('Preencha todos os campos.');
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price)) {
      alert('Digite um preço válido.');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: productName,
      quantity: 1,
      unitPrice: price,
    };

    setProducts(prev => [...prev, newProduct]);
    setProductName('');
    setProductPrice('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Animatable.View animation="fadeInDown" duration={800}>
          <ProductItemView />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <ProductList products={products} setProducts={setProducts} />
        </Animatable.View>

        <Animatable.Text
          animation="fadeIn"
          duration={800}
          delay={400}
          style={styles.totalText}
        >
          Total: <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
        </Animatable.Text>
      </ScrollView>

             {/* Ação flutuante com pulse suave */}
      <Animatable.View
        animation={pulseSoft}
        iterationCount="infinite"
        duration={3000}
        style={styles.footerButtonContainer}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={styles.modalCard}
          >
            <Text style={styles.modalTitle}>Novo Produto</Text>

            <TextInput
              placeholder="Nome do Produto"
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
            />

            <TextInput
              placeholder="Preço (R$)"
              style={styles.input}
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.modalButtonText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
    backgroundColor: colors.background, 
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  footerButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  totalText: {
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
