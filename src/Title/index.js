import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

let AntdTitle;
if (Platform.OS === 'web') {
  const antd = require('antd');
  AntdTitle = antd.Typography.Title;
}

const ProductItemView = ({ itemCount = 0 }) => {
  const countLabel = itemCount === 1 ? '1 item' : `${itemCount} itens`;

  // Versão Web com HTML + antd puro (sem RN)
  if (Platform.OS === 'web') {
    return (
      <div style={stylesWeb.productItem}>
        <div className="app-title" style={stylesWeb.productTitle}>
          <AntdTitle
            level={2}
            style={{
              color: '#FFFFFF',
              margin: 0,
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 0.5,
              lineHeight: 1.3,
            }}
          >
            🛒 Lista de Compras
          </AntdTitle>
          {itemCount > 0 && (
            <div style={stylesWeb.countBadge}>
              {countLabel}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Versão Nativa
  return (
    <View style={styles.productItem}>
      <View style={styles.productTitle}>
        <Text style={styles.title}>🛒 Lista de Compras</Text>
        {itemCount > 0 && (
          <Text style={styles.countText}>{countLabel}</Text>
        )}
      </View>
    </View>
  );
};

const stylesWeb = {
  productItem: {
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
    paddingVertical: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTitle: {
    width: '92%',
    maxWidth: 736,
    padding: '14px 20px',
    borderRadius: 12,
    background: colors.primary,
    border: `1px solid ${colors.primaryHover}`,
    boxSizing: 'border-box',
  },
  countBadge: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.3,
    marginTop: 4,
  },
};

const styles = StyleSheet.create({
  productItem: {
    marginTop: spacing.xxl,
    borderRadius: radius.xxl,
    marginBottom: spacing.lg,
    width: '100%',
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.elevated,
  },
  productTitle: {
    width: '92%',
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryHover,
  },
  countText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxxl,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
});

export default ProductItemView;
