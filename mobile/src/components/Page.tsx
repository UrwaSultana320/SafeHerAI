import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export function Page({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        { paddingBottom: 24 + insets.bottom },
      ]}
    >
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {children}
      <Text style={styles.footer}>
        Portfolio prototype · Emergency protection is not active.
      </Text>
    </ScrollView>
  );
}
export const styles = StyleSheet.create({
  page: { padding: 24, gap: 18, flexGrow: 1, backgroundColor: '#F7F7FB' },
  title: { fontSize: 30, fontWeight: '700', color: '#25223B' },
  text: { fontSize: 16, lineHeight: 25, color: '#514E64' },
  footer: { fontSize: 13, lineHeight: 20, color: '#625F72', marginTop: 24 },
  card: {
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCD9E8',
    minHeight: 56,
  },
  label: { fontSize: 17, color: '#392D62', fontWeight: '600' },
  sos: {
    backgroundColor: '#B51E46',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  sosText: { color: '#FFFFFF', fontSize: 30, fontWeight: '800' },
  sosCaption: { color: '#FFFFFF' },
});
