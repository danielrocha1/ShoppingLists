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
              <Text style={styles.priceText}>R$ {product.unitPrice.toFixed(2)}</Text>
            </TouchableOpacity>,
            <Text style={styles.totalPriceText}>
              R$ {(product.quantity * product.unitPrice).toFixed(2)}
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

  const totalPrice = products.reduce(
    (acc, product) => acc + product.unitPrice * product.quantity,
    0
  );

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
    setNewUnitPrice(unitPrice.toString());
    setModalVisible(true);
  };

  const handleUpdateUnitPrice = () => {
    if (selectedProductId && newUnitPrice.trim() !== '') {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === selectedProductId
            ? { ...product, unitPrice: parseFloat(newUnitPrice) }
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
              placeholder="Novo preço"
              style={styles.input}
              keyboardType="numeric"
              value={newUnitPrice}
              onChangeText={setNewUnitPrice}
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
  container: { backgroundColor: '#fff', borderRadius: 8, overflowY : 'hidden' },
  tableHeader: { backgroundColor: '#007AFF', paddingVertical: 10 },
  headerText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  tableBody: { paddingVertical: 5 },
  productRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 8,
    paddingVertical: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  cell: { fontSize: 14, textAlign: 'center', color: '#333' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonIncrement: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 5
  },
  buttonDecrement: {
    backgroundColor: '#E53935',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 5
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  priceButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center'
  },
  priceText: { color: '#007AFF', fontWeight: 'bold', textAlign: 'center' },
  totalPriceText: { fontWeight: 'bold', color: '#000', textAlign: 'center' },
  scrollView: { maxHeight: 370 },
  totalContainer: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  totalText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333'
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#007AFF'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    elevation: 5
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 15
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelButtonText: { color: '#007AFF', fontSize: 16 }
});

export default ProductList;
