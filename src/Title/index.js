import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductItemView = () => (
  <View style={styles.productItem}>
    <View style={styles.productTitle}>
      <Text style={styles.title}>Lista de Produtos</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  productItem: {
    backgroundColor: '#941C1C',
    marginTop:20,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    height: '30%',
    alignItems: 'center', // Centraliza horizontalmente
    justifyContent: 'center', // Centraliza verticalmente
  },
  productTitle: {
    width: '90%',
    padding:10,
    borderRadius:20,
    backgroundColor: '#CD2727',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    
    color: 'white',
    textAlign: 'center', // Alinha o texto no centro horizontalmente
  },
});

export default ProductItemView;
