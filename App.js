import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Modal, ScrollView} from 'react-native';
import ProductList from './src/ProductList';
import ProductItemView from './src/Title'


const App = () => {
  const [products, setProducts] = useState([      
  ]);

  // Calculating total price of all products
  const totalPrice = products.reduce((acc, product) => acc + (product.unitPrice * product.quantity), 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [item, setItem] = useState('');
  

  const handleAddProduct = () => {
    if (productName.trim() !== '' && productPrice.trim() !== '') {
      const newProduct = {
        id: Date.now(),
        name: productName,
        quantity: 1,
        unitPrice: parseFloat(productPrice),
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setProductName('');
      setProductPrice('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProductItemView/>
      <ProductList products={products} setProducts={setProducts}/>
      <Button style={styles.addButton} title="+   Adicionar   +" onPress={() => setModalVisible(true)} />

      {/* Modal para adicionar produto */}
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
              placeholder="Nome do Produto"
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
            />
            <TextInput
              placeholder="Preço do Produto"
              style={styles.input}
              value={productPrice}
              onChangeText={setProductPrice}
              keyboardType="numeric"
            />
            <Button title="Adicionar Produto" onPress={handleAddProduct} />
          </View>
        </View>
      </Modal>

      {/* Botão para abrir o modal */}

    <Text style={styles.totalText}>Total: R${totalPrice.toFixed(2)}</Text>
    </View>
      
    
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  productItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  addButton: {
    marginTop:200,
    alignItems: 'center',

  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
    totalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});


export default App;
