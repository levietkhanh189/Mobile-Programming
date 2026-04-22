// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.down': 'keyboard-arrow-down',
  'person.circle.fill': 'account-circle',
  'person.fill': 'person',
  'cart.fill': 'shopping-cart',
  'cart.badge.plus': 'add-shopping-cart',
  'magnifyingglass': 'search',
  'list.bullet.rectangle.fill': 'receipt-long',
  'list.bullet': 'list',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'star.fill': 'star',
  'star': 'star-border',
  'plus': 'add',
  'minus': 'remove',
  'trash.fill': 'delete',
  'trash': 'delete-outline',
  'xmark': 'close',
  'checkmark': 'check',
  'gear': 'settings',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'square.and.arrow.up': 'share',
  'arrow.right.square': 'logout',
  'pencil': 'edit',
  'location.fill': 'location-on',
  'location': 'location-on',
  'creditcard.fill': 'credit-card',
  'creditcard': 'credit-card',
  'bag.fill': 'shopping-bag',
  'bag': 'shopping-bag',
  'tag.fill': 'local-offer',
  'tag': 'local-offer',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Fallback to a visible placeholder if an SF Symbol name has no Material mapping yet,
  // so missing mappings are obvious on Android instead of rendering blank.
  const materialName = MAPPING[name] ?? 'help-outline';
  return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
