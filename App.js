import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductList from './src/ProductList';
import ProductItemView from './src/Title';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from './src/theme';

import "./app.css";

// antd components (web-only)
let AntdButton, AntdDrawer, AntdInput, AntdTypography, AntdSpace, AntdApp, AntdMessage, AntdPopconfirm, AntdDropdown;
let ConfigProvider, antdThemeObj;
if (Platform.OS === 'web') {
  const antd = require('antd');
  const antdTheme = require('antd/es/theme');
  AntdButton = antd.Button;
  AntdDrawer = antd.Drawer;
  AntdInput = antd.Input;
  AntdTypography = antd.Typography;
  AntdSpace = antd.Space;
  AntdApp = antd.App;
  AntdMessage = antd.message;
  AntdPopconfirm = antd.Popconfirm;
  AntdDropdown = antd.Dropdown;
  ConfigProvider = antd.ConfigProvider;

  antdThemeObj = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primary,
      colorSuccess: colors.success,
      colorWarning: colors.warning,
      colorError: colors.danger,
      colorInfo: colors.info,
      borderRadius: parseInt(radius.md),
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: parseInt(fontSize.md),
      colorBgContainer: colors.surface,
      colorBgLayout: colors.background,
      colorText: colors.text,
      colorTextSecondary: colors.textSecondary,
      colorBorder: colors.border,
    },
    components: {
      Button: { borderRadius: parseInt(radius.md), controlHeight: 40 },
      Table: {
        headerBg: colors.primary,
        headerColor: '#fff',
        headerBorderRadius: parseInt(radius.md),
        rowHoverBg: colors.primaryBg,
        borderColor: colors.borderSecondary,
      },
      Input: { borderRadius: parseInt(radius.md) },
    },
  };
}

// Converte vírgula para ponto e parseia como número (acessível em todo o módulo)
const parsePrice = (value) => parseFloat(value.replace(',', '.'));

// ======== DRAWER DE ADICIONAR PRODUTO (WEB) ========
const AddProductDrawerWeb = ({ visible, onClose, productName, setProductName, productPrice, setProductPrice, onAdd }) => {
  const previewPrice = productPrice.trim() ? parsePrice(productPrice) : NaN;
  return (
    <AntdDrawer
      title={<span style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>🆕 Novo Produto</span>}
      open={visible}
      onClose={onClose}
      width={400}
      destroyOnClose
      styles={{ body: { padding: '24px 24px 0' } }}
      extra={<AntdButton type="text" onClick={onClose} style={{ fontSize: 18, color: colors.textMuted }}>✕</AntdButton>}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 0', borderTop: `1px solid ${colors.borderSecondary}` }}>
          <AntdButton size="large" onClick={onClose}>Cancelar</AntdButton>
          <AntdButton type="primary" size="large" onClick={onAdd} style={{ paddingInline: 28, fontWeight: 600 }}>
            Adicionar
          </AntdButton>
        </div>
      }
    >
      <AntdSpace direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <AntdTypography.Text strong style={{ marginBottom: 6, display: 'block', fontSize: 14, color: colors.text }}>
            Nome do Produto
          </AntdTypography.Text>
          <AntdInput
            placeholder="Ex: Arroz, Feijão, Leite..."
            size="large"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onPressEnter={onAdd}
          />
        </div>

        <div>
          <AntdTypography.Text strong style={{ marginBottom: 6, display: 'block', fontSize: 14, color: colors.text }}>
            Preço Unitário (R$)
          </AntdTypography.Text>            <AntdInput
              placeholder="Ex: 19,90"
              size="large"
              prefix={<span style={{ fontWeight: 600, color: colors.textMuted }}>R$</span>}
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              onPressEnter={onAdd}
            />
            <AntdTypography.Text type="secondary" style={{ display: 'block', marginTop: 6, fontSize: 12 }}>
              Use ponto ou vírgula (ex: 1.990,50 ou 19,90)
            </AntdTypography.Text>
        </div>

        {productName.trim() && !isNaN(previewPrice) && previewPrice > 0 && (
          <div style={{ background: colors.successBg, borderRadius: 10, padding: '16px 20px', border: `1px solid ${colors.success}20` }}>
            <AntdTypography.Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ▶ Preview
            </AntdTypography.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontWeight: 600, color: colors.text, fontSize: 16 }}>{productName}</span>
              <span style={{ fontWeight: 700, color: colors.primary, fontSize: 18 }}>R$ {previewPrice.toFixed(2)}</span>
            </div>
            <AntdTypography.Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, display: 'block' }}>
              Quantidade inicial: 1 unidade
            </AntdTypography.Text>
          </div>
        )}
      </AntdSpace>
    </AntdDrawer>
  );
};

// ======== APP ========
const App = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Carregar produtos salvos ao iniciar
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const stored = await AsyncStorage.getItem('@shopping_products');
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar produtos:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadProducts();
  }, []);

  // Salvar produtos sempre que a lista mudar (após carregamento inicial)
  useEffect(() => {
    if (loaded) {
      const saveProducts = async () => {
        try {
          await AsyncStorage.setItem('@shopping_products', JSON.stringify(products));
        } catch (e) {
          console.warn('Erro ao salvar produtos:', e);
        }
      };
      saveProducts();
    }
  }, [products, loaded]);

  const totalPrice = products.reduce(
    (acc, product) => acc + product.unitPrice * product.quantity,
    0
  );

  const handleAddProduct = () => {
    if (productName.trim() === '' || productPrice.trim() === '') {
      if (Platform.OS === 'web') AntdMessage.warning('Preencha todos os campos.');
      else alert('Preencha todos os campos.');
      return;
    }

    const price = parsePrice(productPrice);
    if (isNaN(price) || price <= 0) {
      if (Platform.OS === 'web') AntdMessage.error('Digite um preço válido. Use ponto ou vírgula (ex: 19.90 ou 19,90).');
      else alert('Digite um preço válido. Use ponto ou vírgula (ex: 19.90 ou 19,90).');
      return;
    }

    setProducts(prev => [...prev, {
      id: Date.now(),
      name: productName,
      quantity: 1,
      unitPrice: price,
    }]);
    setProductName('');
    setProductPrice('');
    setModalVisible(false);

    if (Platform.OS === 'web') AntdMessage.success('Produto adicionado com sucesso!');
  };

  // ========== VERSÃO WEB: HTML + antd PURO ==========
  if (Platform.OS === 'web') {
    return (
      <ConfigProvider theme={antdThemeObj}>
        <AntdApp>
          <div style={stylesWeb.page}>
            <div style={stylesWeb.container}>
              <ProductItemView itemCount={products.length} />

              {products.length > 0 && (
                <div style={stylesWeb.clearRow}>
                  <AntdDropdown
                    menu={{
                      items: [
                        {
                          key: 'text',
                          icon: <span style={{ fontSize: 14 }}>📄</span>,
                          label: 'Exportar como texto',
                          onClick: () => exportAsText(products, totalPrice),
                        },
                        {
                          key: 'pdf',
                          icon: <span style={{ fontSize: 14 }}>📕</span>,
                          label: 'Exportar como PDF',
                          onClick: () => exportAsPdf(products, totalPrice),
                        },
                      ],
                    }}
                    placement="bottomLeft"
                  >
                    <AntdButton
                      type="text"
                      size="small"
                      icon={<span style={{ fontSize: 14 }}>📥</span>}
                      style={stylesWeb.clearButton}
                    >
                      Exportar
                    </AntdButton>
                  </AntdDropdown>

                  <AntdPopconfirm
                    title="Limpar lista"
                    description="Tem certeza que deseja remover todos os produtos?"
                    onConfirm={() => {
                      const backup = [...products];
                      setProducts([]);
                      const key = 'clear_undo';
                      AntdMessage.open({
                        key,
                        type: 'success',
                        content: 'Lista limpa! Clique para desfazer',
                        duration: 6,
                        onClick: () => {
                          setProducts(backup);
                          AntdMessage.destroy(key);
                        },
                      });
                    }}
                    okText="Sim, limpar"
                    cancelText="Cancelar"
                    placement="bottomRight"
                  >
                    <AntdButton
                      type="text"
                      size="small"
                      icon={<span style={{ fontSize: 14 }}>🗑️</span>}
                      style={stylesWeb.clearButton}
                    >
                      Limpar lista
                    </AntdButton>
                  </AntdPopconfirm>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <ProductList products={products} setProducts={setProducts} />
              </div>

              {products.length > 0 && (
                <div style={stylesWeb.totalCard}>
                  <AntdTypography.Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 500, display: 'block' }}>
                    Total da Lista
                  </AntdTypography.Text>
                  <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Botão flutuante */}
            <div style={stylesWeb.fab}>
              <AntdButton
                type="primary"
                size="large"
                className="fab-btn"
                onClick={() => setModalVisible(true)}
                style={stylesWeb.fabButton}
              >
                + Adicionar Produto
              </AntdButton>
            </div>

            <AddProductDrawerWeb
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              productName={productName}
              setProductName={setProductName}
              productPrice={productPrice}
              setProductPrice={setProductPrice}
              onAdd={handleAddProduct}
            />
          </div>
        </AntdApp>
      </ConfigProvider>
    );
  }

  // ========== VERSÃO NATIVA (iOS/Android) ==========
  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ProductItemView itemCount={products.length} />
        {products.length > 0 && (
          <View style={styles.clearRow}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Exportar lista',
                  'Escolha o formato:',
                  [
                    {
                      text: '📄 Texto',
                      onPress: () => {
                        const text = generateListText(products, totalPrice);
                        Share.share({ message: text, title: 'Lista de Compras' });
                      },
                    },
                    { text: 'Cancelar', style: 'cancel' },
                  ]
                )
              }
              style={styles.clearButtonNative}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>📥 Exportar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Limpar lista',
                  'Tem certeza que deseja remover todos os produtos?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Sim, limpar',
                      style: 'destructive',
                      onPress: () => {
                        const backup = [...products];
                        setProducts([]);
                        setTimeout(() => {
                          Alert.alert(
                            'Lista limpa',
                            'Deseja restaurar os produtos removidos?',
                            [
                              { text: 'Não', style: 'cancel' },
                              { text: 'Desfazer', onPress: () => setProducts(backup) },
                            ]
                          );
                        }, 400);
                      },
                    },
                  ]
                )
              }
              style={styles.clearButtonNative}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>🗑️ Limpar lista</Text>
            </TouchableOpacity>
          </View>
        )}
        <ProductList products={products} setProducts={setProducts} />
        <Text style={styles.totalText}>
          Total: <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
        </Text>
      </ScrollView>

      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="none" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo Produto</Text>
            <TextInput placeholder="Nome do Produto" style={styles.input} value={productName} onChangeText={setProductName} placeholderTextColor={colors.textMuted} />
            <TextInput placeholder="Utilize ponto ao invés de vírgula" style={styles.input} value={productPrice} onChangeText={setProductPrice} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct} activeOpacity={0.85}>
                <Text style={styles.saveButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// Estilos CSS para web (inline styles)
const stylesWeb = {
  page: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
    paddingBottom: 120,
    paddingLeft: 0,
    paddingRight: 0,
  },
  totalCard: {
    marginTop: 16,
    marginHorizontal: spacing.md,
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: '16px 24px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  clearRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: -4,
    gap: 8,
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  clearButton: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    letterSpacing: 0.3,
    padding: '4px 8px',
    borderRadius: 6,
    flex: '1 1 auto',
    minWidth: 'fit-content',
  },
  fab: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 24,
    zIndex: 1000,
    whiteSpace: 'nowrap',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  fabButton: {
    height: 52,
    paddingInline: 32,
    fontSize: 18,
    fontWeight: 600,
    borderRadius: 14,
    boxShadow: '0 4px 14px rgba(22,119,255,0.4)',
  },
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
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
    borderRadius: radius.xl,
    alignItems: 'center',
    ...shadow.floating,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  clearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md + 4,
  },
  clearButtonNative: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  clearButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  totalText: {
    fontWeight: '700',
    marginTop: spacing.xxl,
    fontSize: fontSize.lg,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
  },
  totalValue: {
    fontWeight: '700',
    fontSize: fontSize.xxl,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '88%',
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: radius.lg,
    ...shadow.elevated,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.lg,
    color: colors.text,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.subtle,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.lg,
    marginBottom: spacing.md,
    color: colors.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
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
    fontSize: fontSize.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
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
    fontWeight: '600',
  },
});

// ======== FUNÇÕES UTILITÁRIAS (NÍVEL DO MÓDULO) ========
function generateListText(items, total) {
  const date = new Date().toLocaleDateString('pt-BR');
  let text = `🛒 Lista de Compras - ${date}\n`;
  text += `${'='.repeat(35)}\n\n`;
  items.forEach((item, i) => {
    const subtotal = item.quantity * item.unitPrice;
    text += `${i + 1}. ${item.name}\n`;
    text += `   Qtd: ${item.quantity} x R$ ${item.unitPrice.toFixed(2)} = R$ ${subtotal.toFixed(2)}\n\n`;
  });
  text += `${'='.repeat(35)}\n`;
  text += `TOTAL: R$ ${total.toFixed(2)}\n`;
  text += `Itens: ${items.length}\n`;
  return text;
}

function exportAsText(products, totalPrice) {
  const text = generateListText(products, totalPrice);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lista-compras-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportAsPdf(products, totalPrice) {
  // Abre a janela de impressão do navegador para salvar como PDF
  // A página renderizada já contém a lista completa com estilos
  window.print();
}

export default App;
