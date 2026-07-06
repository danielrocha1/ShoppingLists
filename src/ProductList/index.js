import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal as RNModal,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

// antd components (apenas web)
let AntdTable, AntdModal, AntdButton, AntdInputNumber, AntdSpace, AntdTag, AntdTypography, AntdTooltip;
if (Platform.OS === 'web') {
  const antd = require('antd');
  AntdTable = antd.Table;
  AntdModal = antd.Modal;
  AntdButton = antd.Button;
  AntdInputNumber = antd.InputNumber;
  AntdSpace = antd.Space;
  AntdTag = antd.Tag;
  AntdTypography = antd.Typography;
  AntdTooltip = antd.Tooltip;
}

// ======== FUNÇÃO DE COMPARAÇÃO DE PREÇOS ========
function findBestPrice(productName, excludeListId, allLists) {
  const matches = [];
  const normalized = productName.toLowerCase().trim();

  allLists.forEach(list => {
    if (list.id === excludeListId) return;
    const product = list.products.find(p =>
      p.name.toLowerCase().trim() === normalized
    );
    if (product) {
      matches.push({
        listId: list.id,
        listName: list.name,
        price: product.unitPrice,
      });
    }
  });

  if (matches.length === 0) return null;

  const best = matches.reduce((min, m) => m.price < min.price ? m : min, matches[0]);
  const sorted = [...matches].sort((a, b) => a.price - b.price);

  return { best, all: sorted };
}

// ======== COMPONENTE WEB (antd Table puro, sem RN) ========
const ProductListWeb = ({ products, setProducts, lists, activeListId }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [newUnitPrice, setNewUnitPrice] = useState(0);

  const handleIncrement = (productId) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, quantity: p.quantity + 1 } : p)
    );
  };

  const handleDecrement = (productId) => {
    setProducts(prev =>
      prev.map(p => p.id === productId && p.quantity > 0
        ? { ...p, quantity: p.quantity - 1 }
        : p
      ).filter(p => p.quantity !== 0)
    );
  };

  const handleEditPrice = (product) => {
    setEditingProduct(product);
    setNewUnitPrice(product.unitPrice);
  };

  const handleSavePrice = () => {
    if (editingProduct && newUnitPrice > 0) {
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? { ...p, unitPrice: newUnitPrice }
            : p
        )
      );
      setEditingProduct(null);
    }
  };

  const columns = [
    {
      title: 'Produto',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span style={{ fontWeight: 600, color: colors.text, fontSize: 14 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Qtd',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <AntdButton
            size="small"
            shape="circle"
            danger
            onClick={() => handleDecrement(record.id)}
          >
            −
          </AntdButton>
          <AntdTag color="default" style={{ fontSize: 16, fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
            {record.quantity}
          </AntdTag>
          <AntdButton
            size="small"
            shape="circle"
            type="primary"
            onClick={() => handleIncrement(record.id)}
          >
            +
          </AntdButton>
        </div>
      ),
    },
    {
      title: 'Preço Unit.',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price, record) => (
        <AntdButton
          type="link"
          size="small"
          onClick={() => handleEditPrice(record)}
          style={{ fontWeight: 600, padding: 0 }}
        >
          R$ {price.toFixed(2)}
        </AntdButton>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => (
        <span style={{ fontWeight: 700, color: colors.text }}>
          R$ {(record.quantity * record.unitPrice).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Comparar',
      key: 'compare',
      width: 110,
      render: (_, record) => {
        const comparison = findBestPrice(record.name, activeListId, lists);
        if (!comparison) return null;

        const isBest = record.unitPrice <= comparison.best.price;
        const diff = comparison.best.price - record.unitPrice;
        const isMoreExpensive = record.unitPrice > comparison.best.price;

        const tooltipContent = (
          <div>
            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>
              💰 Preços encontrados
            </div>
            {comparison.all.map(c => (
              <div key={c.listId} style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 16,
                padding: '2px 0',
                fontSize: 12,
                color: c.price === comparison.best.price ? '#52C41A' : 'inherit',
                fontWeight: c.price === comparison.best.price ? 600 : 400,
              }}>
                <span>{c.listName}</span>
                <span>R$ {c.price.toFixed(2)}</span>
              </div>
            ))}
            {isMoreExpensive && (
              <div style={{
                marginTop: 8,
                paddingTop: 6,
                borderTop: '1px solid rgba(255,255,255,0.2)',
                fontSize: 12,
                color: '#FF4D4F',
                fontWeight: 600,
              }}>
                ⬆️ R$ {Math.abs(diff).toFixed(2)} mais caro que {comparison.best.listName}
              </div>
            )}
          </div>
        );

        return (
          <AntdTooltip title={tooltipContent} color="#2d2d2d" overlayStyle={{ maxWidth: 280 }}>
            <span style={{ cursor: 'pointer' }}>
              {isBest ? (
                <AntdTag color="success" style={{ fontSize: 11, margin: 0 }}>
                  ✅ Melhor
                </AntdTag>
              ) : (
                <AntdTag color="warning" style={{ fontSize: 11, margin: 0 }}>
                  ⬆️ R$ {Math.abs(diff).toFixed(2)}
                </AntdTag>
              )}
            </span>
          </AntdTooltip>
        );
      },
    },
  ];

  const totalPrice = products.reduce(
    (acc, p) => acc + p.unitPrice * p.quantity,
    0
  );

  return (
    <div style={stylesWeb.wrapper}>
      <AntdTable
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="middle"
        bordered
        scroll={{ x: 500 }}
        locale={{ emptyText: 'Nenhum produto adicionado ainda' }}
        summary={() => (
          <AntdTable.Summary fixed>
            <AntdTable.Summary.Row>
              <AntdTable.Summary.Cell index={0} colSpan={4}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Total Geral</span>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={1}>
                <span style={{ fontWeight: 700, fontSize: 18, color: colors.primary }}>
                  R$ {totalPrice.toFixed(2)}
                </span>
              </AntdTable.Summary.Cell>
            </AntdTable.Summary.Row>
          </AntdTable.Summary>
        )}
      />

      {/* Modal de edição de preço (web) */}
      <AntdModal
        title="Editar Preço Unitário"
        open={!!editingProduct}
        onCancel={() => setEditingProduct(null)}
        footer={[
          <AntdButton key="cancel" onClick={() => setEditingProduct(null)}>
            Cancelar
          </AntdButton>,
          <AntdButton key="save" type="primary" onClick={handleSavePrice}>
            Salvar
          </AntdButton>,
        ]}
        destroyOnClose
      >
        {editingProduct && (
          <div>
            <AntdTypography.Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>
              {editingProduct.name}
            </AntdTypography.Text>
            <AntdInputNumber
              style={{ width: '100%' }}
              size="large"
              prefix="R$"
              min={0.01}
              step={0.5}
              precision={2}
              value={newUnitPrice}
              onChange={(val) => setNewUnitPrice(val || 0)}
              autoFocus
            />
          </div>
        )}
      </AntdModal>
    </div>
  );
};

// ======== COMPONENTE NATIVO (React Native) ========
const ProductListNative = ({ products, setProducts, lists, activeListId }) => {
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [compareProduct, setCompareProduct] = useState(null);
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const handleIncrement = (productId) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  const handleDecrement = (productId) => {
    setProducts(prev =>
      prev
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
      const parsed = parseFloat(newUnitPrice.replace(',', '.'));
      if (isNaN(parsed) || parsed <= 0) {
        alert('Digite um preço válido. Use ponto ou vírgula (ex: 19.90 ou 19,90).');
        return;
      }
      setProducts(prev =>
        prev.map(product =>
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

  const totalPrice = products.reduce(
    (acc, product) => acc + product.unitPrice * product.quantity,
    0
  );

  return (
    <View style={styles.nativeContainer}>
      <View style={styles.tableHeader}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.headerCellName]}>Nome</Text>
          <Text style={[styles.headerCell, styles.headerCellQty]}>Qtd</Text>
          <Text style={[styles.headerCell, styles.headerCellPrice]}>Preço Unit.</Text>
          <Text style={[styles.headerCell, styles.headerCellTotal]}>Total</Text>
        </View>
      </View>

      <ScrollView style={styles.tableBodyScroll}>
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum produto adicionado</Text>
          </View>
        ) : (
          products.map((product, index) => (
            <View
              key={product.id}
              style={[styles.productRow, { animationDelay: `${index * 60}ms` }]}
            >
              <View style={styles.productRowInner}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => handleDecrement(product.id)}
                    style={[styles.qtyButton, styles.qtyButtonMinus]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </TouchableOpacity>
                  <View style={styles.qtyValue}>
                    <Text style={styles.qtyValueText}>{product.quantity}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleIncrement(product.id)}
                    style={[styles.qtyButton, styles.qtyButtonPlus]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => handleUnitPriceClick(product.id, product.unitPrice)}
                  style={styles.priceChip}
                  activeOpacity={0.75}
                >
                  <Text style={styles.priceText}>
                    R$ {product.unitPrice.toFixed(2)}
                  </Text>
                </TouchableOpacity>

                {(() => {
                  const comparison = findBestPrice(product.name, activeListId, lists);
                  if (!comparison) return null;
                  const isBest = product.unitPrice <= comparison.best.price;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCompareProduct({ product, comparison });
                        setCompareModalVisible(true);
                      }}
                      style={[
                        styles.compareBadge,
                        { backgroundColor: isBest ? colors.successBg : colors.warningBg }
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.compareBadgeText,
                        { color: isBest ? colors.success : colors.warning }
                      ]}>
                        {isBest ? '✅' : '⬆️'}
                      </Text>
                    </TouchableOpacity>
                  );
                })()}

                <Text style={styles.totalCellText}>
                  R$ {(product.quantity * product.unitPrice).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {products.length > 0 && (
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>Total Geral</Text>
          <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
      )}

      {/* Modal de Comparação de Preços */}
      <RNModal
        animationType="fade"
        transparent
        visible={compareModalVisible}
        onRequestClose={() => setCompareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📊 Comparar Preços</Text>
            {compareProduct && (
              <>
                <Text style={styles.modalSubtitle}>
                  Produto: <Text style={{ fontWeight: 700 }}>{compareProduct.product.name}</Text>
                </Text>
                <View style={styles.compareList}>
                  {compareProduct.comparison.all.map(c => (
                    <View key={c.listId} style={styles.compareRow}>
                      <View style={styles.compareRowLeft}>
                        <Text style={[
                          styles.compareRowName,
                          c.price === compareProduct.comparison.best.price && styles.compareRowBest
                        ]}>
                          {c.listName}
                        </Text>
                        {c.price === compareProduct.comparison.best.price && (
                          <Text style={styles.compareRowBestTag}>Melhor</Text>
                        )}
                      </View>
                      <Text style={[
                        styles.compareRowPrice,
                        c.price === compareProduct.comparison.best.price && styles.compareRowPriceBest
                      ]}>
                        R$ {c.price.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
                {compareProduct.product.unitPrice > compareProduct.comparison.best.price && (
                  <View style={styles.compareEconomy}>
                    <Text style={styles.compareEconomyText}>
                      ⬆️ R$ {(compareProduct.product.unitPrice - compareProduct.comparison.best.price).toFixed(2)} mais caro que {compareProduct.comparison.best.listName}
                    </Text>
                  </View>
                )}
                {compareProduct.product.unitPrice <= compareProduct.comparison.best.price && (
                  <View style={[styles.compareEconomy, { backgroundColor: colors.successBg }]}>
                    <Text style={[styles.compareEconomyText, { color: colors.success }]}>
                      ✅ Melhor preço encontrado!
                    </Text>
                  </View>
                )}
              </>
            )}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setCompareModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>

      <RNModal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Preço</Text>
            {selectedProduct && (
              <Text style={styles.modalSubtitle}>
                Produto: <Text style={{ fontWeight: 700 }}>{selectedProduct.name}</Text>
              </Text>
            )}
            <TextInput
              placeholder="Novo preço"
              style={styles.input}
              keyboardType="numeric"
              value={newUnitPrice}
              onChangeText={setNewUnitPrice}
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setNewUnitPrice('');
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateUnitPrice}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

// ======== COMPONENTE PRINCIPAL ========
const ProductList = (props) => {
  if (Platform.OS === 'web') {
    return <ProductListWeb {...props} />;
  }
  return <ProductListNative {...props} />;
};

const stylesWeb = {
  wrapper: {
    background: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginLeft: 0,
    marginRight: 0,
  },
};

const styles = StyleSheet.create({
  nativeContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
    marginHorizontal: spacing.md,
  },
  tableHeader: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  headerCell: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  headerCellName: { flex: 2.5 },
  headerCellQty: { flex: 1.8 },
  headerCellPrice: { flex: 1.5 },
  headerCellTotal: { flex: 1.2 },
  tableBodyScroll: {
    maxHeight: 420,
    paddingHorizontal: 0,
  },
  emptyState: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
  productRow: {
    marginVertical: 4,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.card,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  productRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 2,
  },
  productName: {
    flex: 2.5,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
    paddingHorizontal: spacing.xs,
    minWidth: 60,
  },
  quantityContainer: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 28,
  },
  qtyButtonMinus: {
    backgroundColor: colors.dangerBg,
  },
  qtyButtonPlus: {
    backgroundColor: colors.successBg,
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  qtyValue: {
    minWidth: 32,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.subtle,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
  },
  qtyValueText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  priceChip: {
    flex: 1.5,
    backgroundColor: colors.primaryBg,
    borderRadius: radius.md,
    paddingHorizontal: 4,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  priceText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
    textAlign: 'center',
    flexShrink: 1,
  },
  totalCellText: {
    flex: 1.2,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    fontSize: fontSize.md,
    minWidth: 50,
  },
  compareBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  compareBadgeText: {
    fontSize: 12,
    fontWeight: fontWeight.bold,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primaryBg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSecondary,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: radius.lg,
    width: '86%',
    ...shadow.elevated,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.subtle,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    ...shadow.card,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: fontWeight.bold,
    fontSize: fontSize.lg,
  },
  cancelButton: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
  },
  compareList: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
  },
  compareRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compareRowName: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  compareRowBest: {
    fontWeight: fontWeight.bold,
    color: colors.success,
  },
  compareRowBestTag: {
    fontSize: fontSize.sm,
    color: colors.success,
    backgroundColor: colors.successBg,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    fontWeight: fontWeight.semibold,
    overflow: 'hidden',
  },
  compareRowPrice: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  compareRowPriceBest: {
    color: colors.success,
    fontWeight: fontWeight.bold,
  },
  compareEconomy: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  compareEconomyText: {
    fontSize: fontSize.md,
    color: colors.warning,
    textAlign: 'center',
    fontWeight: fontWeight.semibold,
  },
});

export default ProductList;
