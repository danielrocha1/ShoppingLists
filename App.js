import React, { useState, useEffect, useCallback } from 'react';
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
let AntdButton, AntdDrawer, AntdInput, AntdTypography, AntdSpace, AntdApp, AntdMessage, AntdPopconfirm, AntdDropdown, AntdModal;
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
  AntdModal = antd.Modal;
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

// Templates de lugares para sugestionar ao criar nova lista
const LIST_TEMPLATES = [
  { icon: '🏪', name: 'Mercado' },
  { icon: '💊', name: 'Farmácia' },
  { icon: '🐾', name: 'PetShop' },
  { icon: '🥩', name: 'Açougue' },
  { icon: '🥬', name: 'Hortifruti' },
  { icon: '🥖', name: 'Padaria' },
  { icon: '🏬', name: 'Atacado' },
  { icon: '📦', name: 'Online' },
];

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
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Estado do drawer/modal de adicionar produto
  const [modalVisible, setModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Estado do modal de criar nova lista
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Lista ativa e produtos derivados
  const activeList = lists.find(l => l.id === activeListId) || null;
  const products = activeList ? activeList.products : [];

  // Wrapper para atualizar produtos da lista ativa
  const setProducts = useCallback((updater) => {
    setLists(prev => prev.map(list =>
      list.id === activeListId
        ? { ...list, products: typeof updater === 'function' ? updater(list.products) : updater }
        : list
    ));
  }, [activeListId]);

  // Carregar listas salvas ao iniciar
  useEffect(() => {
    const loadLists = async () => {
      try {
        const stored = await AsyncStorage.getItem('@shopping_lists');
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (parsed && Array.isArray(parsed.lists)) {
            setLists(parsed.lists);
            if (parsed.activeListId && parsed.lists.some(l => l.id === parsed.activeListId)) {
              setActiveListId(parsed.activeListId);
            } else if (parsed.lists.length > 0) {
              setActiveListId(parsed.lists[0].id);
            }
          }
        }
      } catch (e) {
        console.warn('Erro ao carregar listas:', e);
      } finally {
        setLoaded(true);
      }
    };
    loadLists();
  }, []);

  // Salvar listas sempre que mudar (após carregamento inicial)
  useEffect(() => {
    if (loaded) {
      const saveLists = async () => {
        try {
          await AsyncStorage.setItem('@shopping_lists', JSON.stringify({ lists, activeListId }));
        } catch (e) {
          console.warn('Erro ao salvar listas:', e);
        }
      };
      saveLists();
    }
  }, [lists, activeListId, loaded]);

  // Handlers de gerenciamento de listas
  const handleCreateList = () => {
    if (!selectedTemplate) {
      if (Platform.OS === 'web') AntdMessage?.warning('Selecione o tipo de estabelecimento.');
      else alert('Selecione o tipo de estabelecimento.');
      return;
    }
    if (newListName.trim() === '') {
      if (Platform.OS === 'web') AntdMessage?.warning('Digite o nome do estabelecimento.');
      else alert('Digite o nome do estabelecimento.');
      return;
    }
    const fullName = `${selectedTemplate.name} ${newListName.trim()}`;
    const newList = {
      id: Date.now(),
      name: fullName,
      products: [],
      createdAt: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    setNewListName('');
    setSelectedTemplate(null);
    setShowNewListModal(false);
    if (Platform.OS === 'web') AntdMessage?.success(`Lista "${fullName}" criada!`);
  };

  const handleSwitchList = (id) => {
    setActiveListId(id);
  };

  const handleDeleteList = (id) => {
    setLists(prev => {
      const filtered = prev.filter(l => l.id !== id);
      if (activeListId === id) {
        setActiveListId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

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
          <div style={stylesWeb.page} className="app-content">
            {lists.length === 0 ? (
              <div style={stylesWeb.emptyState}>
                <div style={stylesWeb.emptyIcon}>🛒</div>
                <AntdTypography.Title level={3} style={{ color: '#fff', margin: 0, textAlign: 'center' }}>
                  Minhas Listas
                </AntdTypography.Title>
                <AntdTypography.Text style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 8, display: 'block' }}>
                  Você ainda não tem nenhuma lista de compras.
                </AntdTypography.Text>
                <AntdButton
                  type="primary"
                  size="large"
                  onClick={() => setShowNewListModal(true)}
                  style={{ marginTop: 20, fontWeight: 600, paddingInline: 28 }}
                >
                  ➕ Criar primeira lista
                </AntdButton>
              </div>
            ) : (
              <div style={stylesWeb.container}>
              <ProductItemView
                itemCount={products.length}
                currentListName={activeList?.name || 'Lista de Compras'}
                lists={lists}
                activeListId={activeListId}
                onSwitchList={handleSwitchList}
                onCreateList={() => setShowNewListModal(true)}
              />

              {products.length > 0 && (
                <div style={stylesWeb.clearRow}>
                  <AntdDropdown
                    menu={{
                      items: [
                        {
                          key: 'text',
                          icon: <span style={{ fontSize: 14 }}>📄</span>,
                          label: 'Exportar como texto',
                          onClick: () => exportAsText(products, totalPrice, activeList?.name),
                        },
                        {
                          key: 'pdf',
                          icon: <span style={{ fontSize: 14 }}>📕</span>,
                          label: 'Exportar como PDF',
                          onClick: () => exportAsPdf(products, totalPrice, activeList?.name),
                        },
                      ],
                    }}
                    placement="bottomLeft"
                  >
                    <div style={{ border: '1px dashed rgba(255,255,255,0.25)', borderRadius: 6, display: 'inline-flex', transition: 'all 0.2s ease' }}>
                      <AntdButton
                        type="text"
                        size="small"
                        icon={<span style={{ fontSize: 14 }}>📥</span>}
                        style={stylesWeb.clearButton}
                      >
                        Exportar
                      </AntdButton>
                    </div>
                  </AntdDropdown>

                  <div className="clear-box" style={{ border: '1.5px dashed #ff4d4f', borderRadius: 6, padding: '2px 4px', backgroundColor: '#fff', transition: 'all 0.2s ease' }}>
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
                        style={{ ...stylesWeb.clearButton, color: '#ff4d4f' }}
                      >
                        Limpar lista
                      </AntdButton>
                    </AntdPopconfirm>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <ProductList products={products} setProducts={setProducts} lists={lists} activeListId={activeListId} />
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
            )}
          </div>

            {/* Conteúdo para impressão/PDF (fora do app-content) */}
            {activeList && products.length > 0 && (
              <div className="print-content">
                <div className="print-header">
                  <div className="print-store-icon">🛒</div>
                  <div className="print-store-name">{activeList.name}</div>
                  <p className="print-date">Lista de Compras — {new Date().toLocaleDateString('pt-BR')}</p>
                </div>

                <table className="print-table">
                  <thead>
                    <tr>
                      <th className="print-num">#</th>
                      <th className="print-name">Produto</th>
                      <th className="print-qty">Qtd</th>
                      <th className="print-price">Preço Un.</th>
                      <th className="print-subtotal">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr key={item.id}>
                        <td className="print-num">{i + 1}</td>
                        <td className="print-name">{item.name}</td>
                        <td className="print-qty">{item.quantity}</td>
                        <td className="print-price">R$ {item.unitPrice.toFixed(2)}</td>
                        <td className="print-subtotal">R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="print-summary">
                  <div>
                    <div className="print-meta">{products.length} {products.length === 1 ? 'item' : 'itens'}</div>
                  </div>
                  <div>
                    <div className="print-total-label">Total</div>
                    <div className="print-total-value">R$ {totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão flutuante */}
            {activeList && (
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
                {lists.length > 1 && (
                  <div className="delete-box" style={{ textAlign: 'center', marginTop: 8, border: '1.5px dashed #ff4d4f', borderRadius: 8, padding: '6px 16px', backgroundColor: '#fff' }}>
                    <AntdPopconfirm
                      title="Excluir lista"
                      description={`Excluir "${activeList.name}"?`}
                      onConfirm={() => handleDeleteList(activeListId)}
                      okText="Excluir"
                      cancelText="Cancelar"
                      okButtonProps={{ danger: true }}
                      placement="top"
                    >
                      <AntdButton
                        type="text"
                        size="small"
                        danger
                        icon={<span style={{ fontSize: 12 }}>🗑️</span>}
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        Excluir esta lista
                      </AntdButton>
                    </AntdPopconfirm>
                  </div>
                )}
              </div>
            )}

            {activeList && (
              <AddProductDrawerWeb
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                productName={productName}
                setProductName={setProductName}
                productPrice={productPrice}
                setProductPrice={setProductPrice}
                onAdd={handleAddProduct}
              />
            )}

            {/* Modal de Nova Lista (Web) */}
            <AntdModal
              title={<span style={{ fontSize: 18, fontWeight: 700 }}>📋 Nova Lista</span>}
              open={showNewListModal}
              onCancel={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }}
              footer={[
                <AntdButton key="cancel" onClick={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }}>
                  Cancelar
                </AntdButton>,
                <AntdButton key="create" type="primary" onClick={handleCreateList}>
                  Criar lista
                </AntdButton>,
              ]}
              destroyOnClose
            >
              <AntdSpace direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Seletor de tipo */}
                <div>
                  <AntdTypography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                    1. Selecione o tipo
                  </AntdTypography.Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {LIST_TEMPLATES.map(template => {
                      const isActive = selectedTemplate?.name === template.name;
                      return (
                        <AntdButton
                          key={template.name}
                          size="small"
                          type={isActive ? 'primary' : 'default'}
                          onClick={() => setSelectedTemplate(isActive ? null : template)}
                          style={{
                            padding: '4px 14px',
                            borderRadius: 20,
                            fontSize: 13,
                          }}
                        >
                          {template.icon} {template.name}
                        </AntdButton>
                      );
                    })}
                  </div>
                </div>

                {/* Nome do estabelecimento */}
                <div>
                  <AntdTypography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                    2. Digite o nome do estabelecimento
                  </AntdTypography.Text>
                  <AntdInput
                    className="new-list-name-input"
                    placeholder="Ex: Supermarket, Nova Vida..."
                    size="large"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onPressEnter={handleCreateList}
                  />
                </div>

                {/* Preview do nome final */}
                {selectedTemplate && newListName.trim() && (
                  <div style={{
                    background: colors.successBg,
                    borderRadius: 8,
                    padding: '10px 16px',
                    border: `1px solid ${colors.success}30`,
                  }}>
                    <AntdTypography.Text style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 2 }}>
                      Nome da lista:
                    </AntdTypography.Text>
                    <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
                      {selectedTemplate.icon} {selectedTemplate.name} {newListName.trim()}
                    </span>
                  </div>
                )}
              </AntdSpace>
            </AntdModal>
        </AntdApp>
      </ConfigProvider>
    );
  }

  // ========== VERSÃO NATIVA (iOS/Android) ==========

  // Estado vazio: nenhuma lista criada
  if (lists.length === 0 && Platform.OS !== 'web') {
    return (
      <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
        <View style={styles.emptyStateNative}>
          <Text style={styles.emptyStateIcon}>🛒</Text>
          <Text style={styles.emptyStateTitle}>Minhas Listas</Text>
          <Text style={styles.emptyStateDesc}>Você ainda não tem nenhuma lista de compras.</Text>
          <TouchableOpacity
            style={styles.createFirstListButton}
            onPress={() => setShowNewListModal(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.createFirstListText}>➕ Criar primeira lista</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={showNewListModal} animationType="fade" onRequestClose={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Nova Lista</Text>

              {/* Seletor de tipo */}
              <Text style={styles.modalStepLabel}>1. Selecione o tipo</Text>
              <View style={styles.templateChipsRow}>
                {LIST_TEMPLATES.map(template => {
                  const isActive = selectedTemplate?.name === template.name;
                  return (
                    <TouchableOpacity
                      key={template.name}
                      style={[styles.templateChip, isActive && styles.templateChipActive]}
                      onPress={() => setSelectedTemplate(isActive ? null : template)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.templateChipText, isActive && styles.templateChipTextActive]}>
                        {template.icon} {template.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Nome do estabelecimento */}
              <Text style={[styles.modalStepLabel, { marginTop: spacing.lg }]}>2. Digite o nome</Text>
              <TextInput
                placeholder="Ex: Supermarket, Nova Vida..."
                style={styles.input}
                value={newListName}
                onChangeText={setNewListName}
                placeholderTextColor={colors.textMuted}
              />

              {/* Preview */}
              {selectedTemplate && newListName.trim() && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewLabel}>Nome da lista:</Text>
                  <Text style={styles.previewText}>
                    {selectedTemplate.icon} {selectedTemplate.name} {newListName.trim()}
                  </Text>
                </View>
              )}

              <View style={[styles.modalActions, { marginTop: spacing.md }]}>
                <TouchableOpacity onPress={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleCreateList} activeOpacity={0.85}>
                  <Text style={styles.saveButtonText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ProductItemView
          itemCount={products.length}
          currentListName={activeList?.name || 'Lista de Compras'}
          lists={lists}
          activeListId={activeListId}
          onSwitchList={handleSwitchList}
          onCreateList={() => setShowNewListModal(true)}
          onDeleteList={handleDeleteList}
        />
        {activeList && products.length > 0 && (
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
        {activeList && (
          <ProductList products={products} setProducts={setProducts} lists={lists} activeListId={activeListId} />
        )}
        {activeList && products.length > 0 && (
          <Text style={styles.totalText}>
            Total: <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
          </Text>
        )}
      </ScrollView>

      {activeList && (
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
            <Text style={styles.addButtonText}>+ Adicionar Produto</Text>
          </TouchableOpacity>
          {lists.length > 1 && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Excluir lista',
                  `Excluir "${activeList.name}"? Esta ação não pode ser desfeita.`,
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Excluir',
                      style: 'destructive',
                      onPress: () => handleDeleteList(activeListId),
                    },
                  ]
                )
              }
              style={styles.deleteButtonNative}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteButtonNativeText}>🗑️ Excluir esta lista</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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

      {/* Modal de Nova Lista (Native) */}
      <Modal transparent visible={showNewListModal} animationType="fade" onRequestClose={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Lista</Text>

            {/* Seletor de tipo */}
            <Text style={styles.modalStepLabel}>1. Selecione o tipo</Text>
            <View style={styles.templateChipsRow}>
              {LIST_TEMPLATES.map(template => {
                const isActive = selectedTemplate?.name === template.name;
                return (
                  <TouchableOpacity
                    key={template.name}
                    style={[styles.templateChip, isActive && styles.templateChipActive]}
                    onPress={() => setSelectedTemplate(isActive ? null : template)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.templateChipText, isActive && styles.templateChipTextActive]}>
                      {template.icon} {template.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Nome do estabelecimento */}
            <Text style={[styles.modalStepLabel, { marginTop: spacing.lg }]}>2. Digite o nome</Text>
            <TextInput
              placeholder="Ex: Supermarket, Nova Vida..."
              style={styles.input}
              value={newListName}
              onChangeText={setNewListName}
              placeholderTextColor={colors.textMuted}
            />

            {/* Preview */}
            {selectedTemplate && newListName.trim() && (
              <View style={styles.previewBox}>
                <Text style={styles.previewLabel}>Nome da lista:</Text>
                <Text style={styles.previewText}>
                  {selectedTemplate.icon} {selectedTemplate.name} {newListName.trim()}
                </Text>
              </View>
            )}

            <View style={[styles.modalActions, { marginTop: spacing.md }]}>
              <TouchableOpacity onPress={() => { setShowNewListModal(false); setNewListName(''); setSelectedTemplate(null); }} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateList} activeOpacity={0.85}>
                <Text style={styles.saveButtonText}>Criar</Text>
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
    color: '#fff',
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
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
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
  // Estado vazio (native)
  emptyStateNative: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingTop: 80,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateDesc: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  createFirstListButton: {
    backgroundColor: '#fff',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  createFirstListText: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  deleteButtonNative: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,79,0.08)',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,77,79,0.4)',
    borderStyle: 'dashed',
  },
  deleteButtonNativeText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  templateChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateChip: {
    backgroundColor: colors.subtle,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  templateChipText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  templateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  templateChipTextActive: {
    color: '#fff',
    fontWeight: fontWeight.bold,
  },
  modalStepLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  previewBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    marginBottom: spacing.sm,
  },
  previewLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: 2,
  },
  previewText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
});

// ======== FUNÇÕES UTILITÁRIAS (NÍVEL DO MÓDULO) ========
function generateListText(items, total, storeName) {
  const date = new Date().toLocaleDateString('pt-BR');
  let text = storeName ? `🛒 ${storeName} - ${date}\n` : `🛒 Lista de Compras - ${date}\n`;
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

function exportAsText(products, totalPrice, storeName) {
  const text = generateListText(products, totalPrice, storeName);
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

function exportAsPdf(products, totalPrice, storeName) {
  // A div .print-content já está renderizada com os dados atualizados
  // Abre a janela de impressão do navegador para salvar como PDF
  window.print();
}

export default App;
