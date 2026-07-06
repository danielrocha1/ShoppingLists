import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Modal, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

let AntdTitle, AntdButton, AntdDrawer, AntdTypography;
if (Platform.OS === 'web') {
  const antd = require('antd');
  AntdTitle = antd.Typography.Title;
  AntdButton = antd.Button;
  AntdDrawer = antd.Drawer;
  AntdTypography = antd.Typography;
}

const SCREEN_WIDTH = Platform.OS === 'web' ? 400 : Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.8, 340);

const ProductItemView = ({ 
  itemCount = 0, 
  currentListName = 'Lista de Compras',
  lists = [],
  activeListId = null,
  onSwitchList = () => {},
  onCreateList = () => {},
}) => {
  const countLabel = itemCount === 1 ? '1 item' : `${itemCount} itens`;

  // ======== VERSÃO WEB: Drawer antd da esquerda ========
  if (Platform.OS === 'web') {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
      <div style={stylesWeb.productItem}>
        <div className="app-title" style={stylesWeb.productTitle}>
          <div style={stylesWeb.titleRow}>
            <AntdButton
              type="text"
              onClick={() => setDrawerOpen(true)}
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 22,
                padding: '2px 6px',
                height: 'auto',
                lineHeight: 1,
                borderRadius: 6,
                marginRight: 4,
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              ☰
            </AntdButton>
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
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              ellipsis
            >
              🛒 {currentListName}
            </AntdTitle>
          </div>
          {itemCount > 0 && (
            <div style={stylesWeb.countBadge}>
              {countLabel}
            </div>
          )}
        </div>

        <AntdDrawer
          title={
            <span style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>
              📋 Minhas Listas
            </span>
          }
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={DRAWER_WIDTH}
          styles={{
            body: { padding: '16px 0' },
          }}
          extra={
            <AntdButton type="text" onClick={() => setDrawerOpen(false)} style={{ fontSize: 16, color: colors.textMuted }}>
              ✕
            </AntdButton>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {lists.map(l => (
                <div
                  key={l.id}
                  onClick={() => {
                    onSwitchList(l.id);
                    setDrawerOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    cursor: 'pointer',
                    backgroundColor: l.id === activeListId ? colors.primaryBg : 'transparent',
                    borderLeft: l.id === activeListId ? `3px solid ${colors.primary}` : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (l.id !== activeListId) e.currentTarget.style.backgroundColor = colors.subtle;
                  }}
                  onMouseLeave={(e) => {
                    if (l.id !== activeListId) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{
                    fontSize: 15,
                    fontWeight: l.id === activeListId ? 700 : 400,
                    color: l.id === activeListId ? colors.primary : colors.text,
                  }}>
                    {l.id === activeListId ? '✅ ' : '📋 '}{l.name}
                  </span>
                  <span style={{ fontSize: 12, color: colors.textMuted }}>
                    {l.products?.length || 0} itens
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: `1px solid ${colors.borderSecondary}`,
              padding: '12px 20px',
            }}>
              <AntdButton
                type="primary"
                block
                onClick={() => {
                  setDrawerOpen(false);
                  onCreateList();
                }}
                style={{ fontWeight: 600 }}
              >
                ➕ Nova lista
              </AntdButton>
            </div>
          </div>
        </AntdDrawer>
      </div>
    );
  }

  // ======== VERSÃO NATIVA: Drawer animado da esquerda ========
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <View style={styles.productItem}>
        <View style={styles.productTitle}>
          <View style={styles.titleRow}>
            <TouchableOpacity
              onPress={() => setDrawerOpen(true)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>
              🛒 {currentListName}
            </Text>
          </View>
          {itemCount > 0 && (
            <Text style={styles.countText}>{countLabel}</Text>
          )}
        </View>
      </View>

      <Modal
        transparent
        visible={drawerOpen}
        onRequestClose={closeDrawer}
      >
        <View style={styles.drawerContainer}>
          {/* Overlay escuro */}
          <Animated.View
            style={[styles.drawerOverlay, { opacity: fadeAnim }]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeDrawer}
            />
          </Animated.View>

          {/* Drawer propriamente dito */}
          <Animated.View
            style={[
              styles.drawerContent,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderTitle}>📋 Minhas Listas</Text>
              <TouchableOpacity onPress={closeDrawer} style={styles.drawerCloseBtn}>
                <Text style={styles.drawerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.drawerDivider} />

            {/* Lista de estabelecimentos */}
            <ScrollView style={styles.drawerList} showsVerticalScrollIndicator={false}>
              {lists.map(l => (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.drawerItem,
                    l.id === activeListId && styles.drawerItemActive,
                  ]}
                  onPress={() => {
                    onSwitchList(l.id);
                    closeDrawer();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.drawerItemText,
                      l.id === activeListId && styles.drawerItemTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {l.id === activeListId ? '✅ ' : '📋 '}{l.name}
                  </Text>
                  <Text style={styles.drawerItemCount}>
                    {l.products?.length || 0} itens
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Botão Nova Lista */}
            <View style={styles.drawerFooter}>
              <View style={styles.drawerFooterDivider} />
              <TouchableOpacity
                style={styles.drawerNewListButton}
                onPress={() => {
                  closeDrawer();
                  onCreateList();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.drawerNewListText}>➕ Nova lista</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
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
    padding: '14px 16px',
    borderRadius: 12,
    background: colors.primary,
    border: `1px solid ${colors.primaryHover}`,
    boxSizing: 'border-box',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  countBadge: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.3,
    marginTop: 6,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  menuButton: {
    padding: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
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
    flex: 1,
  },
  // Drawer styles (native)
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.surface,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  drawerHeaderTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  drawerCloseBtn: {
    padding: spacing.xs,
  },
  drawerCloseText: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: colors.borderSecondary,
    marginBottom: spacing.sm,
  },
  drawerList: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: 2,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  drawerItemActive: {
    backgroundColor: colors.primaryBg,
    borderLeftColor: colors.primary,
  },
  drawerItemText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: fontWeight.medium,
    flex: 1,
    marginRight: spacing.sm,
  },
  drawerItemTextActive: {
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  drawerItemCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    flexShrink: 0,
  },
  drawerFooter: {
    paddingBottom: Platform.OS === 'android' ? 20 : 30,
  },
  drawerFooterDivider: {
    height: 1,
    backgroundColor: colors.borderSecondary,
    marginHorizontal: spacing.lg,
  },
  drawerNewListButton: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  drawerNewListText: {
    fontSize: fontSize.lg,
    color: '#fff',
    fontWeight: fontWeight.semibold,
  },
});

export default ProductItemView;
