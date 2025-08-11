import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme';

// Utilidades de moeda (BRL)
const formatCurrencyBR = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
  const parts = value.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalPart = parts[1];
  return `R$ ${integerPart},${decimalPart}`;
};

const formatCurrencyInput = (text) => {
  const digits = (text || '').replace(/\D/g, '');
  if (digits.length === 0) return '';
  const intPart = digits.slice(0, -2) || '0';
  const cents = digits.slice(-2).padStart(2, '0');
  const intFormatted = intPart
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${intFormatted},${cents}`;
};

const parseCurrencyInputToNumber = (text) => {
  const digits = (text || '').replace(/\D/g, '');
  if (!digits) return NaN;
  return Number(digits) / 100;
};

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Row
      data={['Nome', 'Qtd', 'Preço Unit.', 'Total']}
      textStyle={styles.headerText}
    />
  </View>
);

const TableBody = ({ products, handleDecrement, handleIncrement, handleUnitPriceClick }) => (
  <View style={styles.tableBody}>
    {products.map((product, index) => (
      <Animatable.View
        key={product.id}
        animation="fadeInUp"
        duration={500}
        delay={index * 100}
        style={styles.productRow}
      >
        <Row
          data={[
            product.name,
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleDecrement(product.id)}
                style={styles.buttonDecrement}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleIncrement(product.id)}
                style={styles.buttonIncrement}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>,
            <TouchableOpacity
              onPress={() => handleUnitPriceClick(product.id, product.unitPrice)}
              style={styles.priceButton}
            >
              <Text style={styles.priceText}>{formatCurrencyBR(product.unitPrice)}</Text>
            </TouchableOpacity>,
            <Text style={styles.totalPriceText}>
              {formatCurrencyBR(product.quantity * product.unitPrice)}
            </Text>
          ]}
          textStyle={styles.cell}
        />
      </Animatable.View>
    ))}
  </View>
);

const ProductList = ({ products, setProducts }) => {
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleIncrement = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecrement = (productId) => {
    setProducts(prevProducts =>
      prevProducts
        .map(product =>
          product.id === productId && product.quantity > 0
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter(product => product.quantity !== 0)
    );
  };

  const handleUnitPriceClick = (productId, unitPrice) => {
    setSelectedProductId(productId);
    setNewUnitPrice(formatCurrencyInput(String(Math.round(unitPrice * 100))));
    setModalVisible(true);
  };

  const handleUpdateUnitPrice = () => {
    if (selectedProductId && newUnitPrice.trim() !== '') {
      const parsed = parseCurrencyInputToNumber(newUnitPrice);
      if (isNaN(parsed)) return;
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === selectedProductId
            ? { ...product, unitPrice: parsed }
            : product
        )
      );
      setNewUnitPrice('');
      setSelectedProductId(null);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TableHeader />
      <ScrollView style={styles.scrollView}>
        <TableBody
          products={products}
          handleDecrement={handleDecrement}
          handleIncrement={handleIncrement}
          handleUnitPriceClick={handleUnitPriceClick}
        />

        {/* Total mais para baixo */}
      
      </ScrollView>

      {/* Modal para atualizar preço */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={400} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Atualizar Preço</Text>
            <TextInput
              placeholder="Novo preço (R$ 0,00)"
              style={styles.input}
              keyboardType="numeric"
              value={newUnitPrice}
              onChangeText={(t) => setNewUnitPrice(formatCurrencyInput(t))}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateUnitPrice}>
              <Text style={styles.modalButtonText}>Salvar</Text>
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
  container: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  tableHeader: { backgroundColor: colors.primary, paddingVertical: 12 },
  headerText: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center', letterSpacing: 0.3 },
  tableBody: { paddingVertical: 6 },
  productRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 6,
    marginHorizontal: 10,
    paddingVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  cell: { fontSize: 14, textAlign: 'center', color: '#374151' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  buttonIncrement: {
    backgroundColor: colors.success,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 6
  },
  buttonDecrement: {
    backgroundColor: colors.danger,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 6
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  quantityText: { fontSize: 18, fontWeight: '800', color: '#1F2937', minWidth: 28, textAlign: 'center' },
  priceButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center'
  },
  priceText: { color: colors.primary, fontWeight: '700', textAlign: 'center' },
  totalPriceText: { fontWeight: '700', color: '#111827', textAlign: 'center' },
  scrollView: { maxHeight: 420 },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderColor: '#E5E7EB'
  },
  totalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280'
  },
  totalValue: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.primary
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 16,
    width: '86%',
    elevation: 6
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14, textAlign: 'center', color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#F9FAFB'
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  modalButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelButtonText: { color: colors.primary, fontSize: 16, fontWeight: '600' }
});

export default ProductList;
