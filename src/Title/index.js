import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

const ProductItemView = () => (
  <View style={styles.productItem}>
    <View style={styles.productTitle}>
      <Text style={styles.title}>Lista de Produtos</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  productItem: {
    marginTop: 24,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTitle: {
    width: '92%',
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default ProductItemView;
