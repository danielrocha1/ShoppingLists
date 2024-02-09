import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Row } from 'react-native-table-component';
import styles from '../styles';

const TableBody = ({ products, handleDecrement, handleIncrement, handleUnitPriceClick }) => (
  <View style={styles.tableBody}>
    {products.map(product => (
      <Row
        key={product.id}
        data={[
          product.name,
          <View style={styles.quantityContainer}>
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

export default TableBody;
