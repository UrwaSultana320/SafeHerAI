/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { HomeScreen } from '../src/screens/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../src/app/navigation';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('Home SOS opens only the SOS preview route', async () => {
  const navigate = jest.fn();
  const props = {
    navigation: { navigate },
    route: { key: 'home', name: 'Home' },
  } as unknown as NativeStackScreenProps<RootStackParamList, 'Home'>;
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <SafeAreaProvider>
        <HomeScreen {...props} />
      </SafeAreaProvider>,
    );
  });
  const button = tree.root.findAll(
    node =>
      node.props.accessibilityLabel === 'SOS preview. Does not send alerts',
  )[0];
  await ReactTestRenderer.act(() => button.props.onPress());
  expect(navigate).toHaveBeenCalledWith('SOS');
  await ReactTestRenderer.act(() => tree.unmount());
});
