import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import styles from '../styles';

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Row
      data={['Nome', 'Quantidade', 'Preço Unitário', 'Preço Total']}
      textStyle={{  fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',}}
    />
  </View>
);

const TableBody = ({ products, handleDecrement, handleIncrement, handleUnitPriceClick }) => (
  <View style={styles.tableBody}>
    {products.map(product => (
      <Row
        key={product.id}
        data={[
          product.name,
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleDecrement(product.id)} style={styles.buttonDecrement}>
              <Text style={styles.buttonDecrementText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{product.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrement(product.id)} style={styles.buttonIncrement}>
              <Text style={styles.buttonIncrementText}>+</Text>
            </TouchableOpacity>
          </View>,
          <TouchableOpacity onPress={() => handleUnitPriceClick(product.id, product.unitPrice)} style={styles.button}>
            <Text style={styles.buttonText}>R${product.unitPrice}</Text>
          </TouchableOpacity>,
          `R$${product.quantity * product.unitPrice}`,
        ]}
        textStyle={styles.cell}
      />
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
        product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
      )
    );
  };

  const handleDecrement = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId && product.quantity > 0
          ? { ...product, quantity: product.quantity - 1 }
          : product
      ).filter(product => product.quantity !== 0) // Filtra os produtos para remover aqueles com quantidade zero
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
          product.id === selectedProductId ? { ...product, unitPrice: parseFloat(newUnitPrice) } : product
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
      </ScrollView>

      {/* Modal for updating unit price */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter new unit price"
              style={styles.input}
              keyboardType="numeric"
              value={newUnitPrice}
              onChangeText={setNewUnitPrice}
            />
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateUnitPrice}>
              <Text style={styles.updateButtonText}>Atualizar Preço</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


export default ProductList;
