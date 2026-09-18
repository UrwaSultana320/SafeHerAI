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
      <Text style={styles.footer}>SafeHer AI portfolio prototype · Not a certified public-safety service.</Text>
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
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#C9C5D8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#25223B' },
  button: { backgroundColor: '#392D62', borderRadius: 12, padding: 15, alignItems: 'center', minHeight: 48 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  dangerButton: { backgroundColor: '#B51E46' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  muted: { fontSize: 14, lineHeight: 20, color: '#706C80' },
  error: { fontSize: 15, color: '#9C1739' },
  success: { fontSize: 15, color: '#176C4A' },
  alertCard: { borderColor: '#B51E46', borderWidth: 3 },
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
