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

test('Home SOS opens the emergency SOS route', async () => {
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
      node.props.accessibilityLabel === 'Open emergency SOS',
  )[0];
  await ReactTestRenderer.act(() => button.props.onPress());
  expect(navigate).toHaveBeenCalledWith('SOS');
  await ReactTestRenderer.act(() => tree.unmount());
});

test('Home exposes every foundation destination', async () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });
  const routes = [
    'SOS',
    'Emergency Contacts',
    'Safety Tools',
    'AI Detection',
    'Sensor Collection',
    'Emergency History',
    'Profile',
    'Settings',
  ];
  for (const route of routes) {
    const button = tree.root.findAll(
      node =>
        typeof node.props.onPress === 'function' &&
        node.props.accessibilityLabel ===
          (route === 'SOS' ? 'Open emergency SOS' : route),
    )[0];
    expect(button).toBeDefined();
    await ReactTestRenderer.act(() => button.props.onPress());
    const navigation = tree.root.findByType(HomeScreen).props.navigation;
    expect(navigation.getState().routes.at(-1).name).toBe(route);
    await ReactTestRenderer.act(() => navigation.goBack());
  }
  await ReactTestRenderer.act(() => tree.unmount());
});
