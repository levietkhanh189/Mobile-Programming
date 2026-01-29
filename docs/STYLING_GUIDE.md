# Styling Guide: NativeWind + React Native Paper

Hướng dẫn sử dụng NativeWind (Tailwind CSS) kết hợp với React Native Paper cho ứng dụng Mobile Programming.

## 🎨 Tổng Quan

Project sử dụng 2 hệ thống styling:

1. **NativeWind** - Tailwind CSS cho React Native (utility classes)
2. **React Native Paper** - Material Design 3 components

## 📦 Cài Đặt

```bash
npm install nativewind tailwindcss react-native-reanimated
npx tailwindcss init
```

## ⚙️ Cấu Hình

### 1. `tailwind.config.js`
```js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6200EE',
        secondary: '#03DAC6',
        // ... custom colors
      },
    },
  },
}
```

### 2. `babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

### 3. Import `global.css` trong `app/_layout.tsx`
```tsx
import '../global.css';
```

## 🎯 Cách Sử Dụng

### NativeWind với Standard Components

**✅ HOẠT ĐỘNG** - Dùng `className` trên View, Text, ScrollView, etc:

```tsx
import { View, Text } from 'react-native';

function MyComponent() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-800">
        Hello NativeWind!
      </Text>
      <View className="flex-row gap-2 mt-4">
        <View className="flex-1 bg-blue-500 p-4 rounded-lg">
          <Text className="text-white">Card 1</Text>
        </View>
        <View className="flex-1 bg-purple-500 p-4 rounded-lg">
          <Text className="text-white">Card 2</Text>
        </View>
      </View>
    </View>
  );
}
```

### React Native Paper Components

**⚠️ GIỚI HẠN** - Paper components dùng props riêng, không dùng `className`:

```tsx
import { Button, TextInput, Card } from 'react-native-paper';

function PaperComponents() {
  return (
    <>
      {/* ❌ className không hoạt động đầy đủ trên Paper components */}
      <Button mode="contained" onPress={() => {}}>
        Press me
      </Button>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
      />

      <Card>
        <Card.Title title="Card Title" />
        <Card.Content>
          <Text>Card content</Text>
        </Card.Content>
      </Card>
    </>
  );
}
```

### Kết Hợp NativeWind + Paper

**✅ BEST PRACTICE** - Wrap Paper components trong View với NativeWind:

```tsx
import { View, Text } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';

function CombinedExample() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* NativeWind layout */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Login
        </Text>

        {/* Paper input với NativeWind spacing */}
        <View className="mb-4">
          <TextInput
            label="Email"
            mode="outlined"
          />
        </View>

        <View className="mb-4">
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
          />
        </View>

        {/* Paper button */}
        <Button mode="contained">
          Login
        </Button>
      </View>

      {/* NativeWind Card với Paper button */}
      <View className="bg-white rounded-lg p-4 shadow-md">
        <Text className="text-gray-700 mb-4">
          Don't have an account?
        </Text>
        <Button mode="outlined">
          Register
        </Button>
      </View>
    </View>
  );
}
```

## 🎨 Utility Classes Thường Dùng

### Layout & Spacing
```tsx
// Flexbox
className="flex-1"              // flex: 1
className="flex-row"            // flexDirection: row
className="flex-col"            // flexDirection: column
className="justify-center"      // justifyContent: center
className="items-center"        // alignItems: center
className="justify-between"     // justifyContent: space-between

// Padding & Margin
className="p-4"                 // padding: 16px
className="px-4 py-2"          // paddingX: 16, paddingY: 8
className="m-4"                 // margin: 16px
className="mt-4 mb-2"          // marginTop: 16, marginBottom: 8

// Gap (flexbox spacing)
className="gap-2"               // gap: 8px
className="gap-4"               // gap: 16px
```

### Background & Border
```tsx
className="bg-white"            // background: white
className="bg-gray-50"          // background: gray-50
className="bg-blue-500"         // background: blue-500

className="rounded-lg"          // borderRadius: 8px
className="rounded-full"        // borderRadius: 9999px

className="border border-gray-300"  // border: 1px solid gray-300
className="shadow-md"           // box shadow
```

### Typography
```tsx
className="text-sm"             // fontSize: 14px
className="text-base"           // fontSize: 16px
className="text-lg"             // fontSize: 18px
className="text-xl"             // fontSize: 20px
className="text-2xl"            // fontSize: 24px

className="font-normal"         // fontWeight: normal
className="font-medium"         // fontWeight: 500
className="font-bold"           // fontWeight: bold

className="text-gray-800"       // color: gray-800
className="text-white"          // color: white
className="text-center"         // textAlign: center
```

### Width & Height
```tsx
className="w-full"              // width: 100%
className="h-full"              // height: 100%
className="w-1/2"               // width: 50%
className="h-screen"            // height: 100vh (screen height)
```

## 📱 Responsive Design

NativeWind hỗ trợ breakpoints:

```tsx
<View className="p-4 md:p-8 lg:p-12">
  {/* padding tăng theo screen size */}
</View>

<View className="flex-col md:flex-row">
  {/* column trên mobile, row trên tablet+ */}
</View>
```

## 🎭 Dark Mode

NativeWind tự động hỗ trợ dark mode với prefix `dark:`:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Auto dark mode support!
  </Text>
</View>
```

## ⚡ Performance Tips

1. **Tránh inline styling phức tạp** - Dùng className thay vì style prop
2. **Reuse classes** - Tạo wrapper components cho patterns lặp lại
3. **Avoid over-nesting** - Giữ component tree đơn giản

## 🔧 Custom Theme Colors

Thêm màu custom trong `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#6200EE',
      'primary-dark': '#3700B3',
      secondary: '#03DAC6',
    },
  },
}
```

Sử dụng:
```tsx
<View className="bg-primary">
  <Text className="text-secondary">Custom colors!</Text>
</View>
```

## 🪟 Glassmorphism Design System

App authentication screens sử dụng **glassmorphism** design với frosted glass effects.

### Components

#### 1. GradientBackground
Full-screen gradient background cho auth screens:

```tsx
import { GradientBackground } from '@/components/ui/gradient-background';

function LoginScreen() {
  return (
    <GradientBackground>
      {/* Your content */}
    </GradientBackground>
  );
}
```

**Features:**
- Gradient colors: Indigo → Purple → Lavender
- SafeAreaView wrapper (tùy chọn)
- Custom colors support

#### 2. GlassCard
Frosted glass card container với blur effect:

```tsx
import { GlassCard } from '@/components/ui/glass-card';

<GlassCard intensity={15}>
  {/* Card content */}
</GlassCard>
```

**Features:**
- **iOS:** BlurView với configurable intensity
- **Android:** Semi-transparent white fallback với shadow
- Border: 1.5px rgba(255, 255, 255, 0.4)
- Shadow for depth

#### 3. GlassTextInput
Paper TextInput wrapper với glass theme:

```tsx
import { GlassTextInput } from '@/components/ui/glass-text-input';

<GlassTextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={errors.email}
  icon="email-outline"
  secureTextEntry={false}
  showToggle={false}
/>
```

**Features:**
- White text on glass background
- Error handling với HelperText
- Password toggle (eye icon)
- Left icon support
- Min height 48px (touch target compliance)

#### 4. AnimatedButton
Pressable button với scale animation:

```tsx
import { AnimatedButton } from '@/components/ui/animated-button';

<AnimatedButton
  variant="cta"
  title="Login"
  onPress={handleLogin}
  loading={loading}
  disabled={false}
/>
```

**Variants:**
- `primary` - Indigo background (#4F46E5)
- `cta` - Orange background (#F97316)
- `outline` - Transparent với indigo border
- `text` - No background, light purple text

**Features:**
- Spring animation (scale 0.97 on press)
- Loading state với ActivityIndicator
- Min height 48px
- Shadow on primary/cta

#### 5. StepIndicator
Multi-step progress indicator:

```tsx
import { StepIndicator } from '@/components/ui/step-indicator';

<StepIndicator
  totalSteps={3}
  currentStep={1}
  labels={['Email', 'Verify', 'Password']}
/>
```

**Features:**
- Animated dots với spring effect
- Active dot: Orange (#F97316)
- Completed dot: Indigo (#4F46E5)
- Pending dot: Semi-transparent white
- Optional step labels

### Color System

Theme colors defined in `constants/theme-colors.ts`:

```tsx
import { GLASS_COLORS } from '@/constants/theme-colors';

// Usage
style={{ color: GLASS_COLORS.primary }}
```

**Color Palette:**
```js
{
  primary: '#4F46E5',        // Indigo
  primaryLight: '#818CF8',   // Light purple
  primaryDark: '#3730A3',    // Dark indigo
  cta: '#F97316',            // Orange
  background: '#EEF2FF',     // Light lavender
  text: '#1E1B4B',           // Dark indigo
  textSecondary: '#6366F1',  // Medium indigo
  surface: 'rgba(255, 255, 255, 0.25)',
  surfaceBorder: 'rgba(255, 255, 255, 0.4)',
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
}
```

### Typography

Custom fonts loaded via `expo-font`:
- **Headings:** Poppins (Bold, SemiBold, Medium)
- **Body:** Open Sans (Regular, SemiBold)

```tsx
<Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-4xl">
  Welcome Back
</Text>

<Text style={{ fontFamily: 'OpenSans_400Regular' }} className="text-base">
  Sign in to continue
</Text>
```

### Platform-Specific Behavior

**iOS:**
- BlurView cho glass effect
- Smooth backdrop blur (10-20px)

**Android:**
- Semi-transparent white fallback
- Shadow elevation cho depth
- No performance issues

### When to Use Glassmorphism

**✅ Use for:**
- Authentication screens (Login, Register, ForgotPassword)
- Onboarding flows
- Modal overlays
- Premium features

**❌ Don't use for:**
- List items / table rows (performance)
- Main app screens with complex scrolling
- Forms with many inputs (use standard Paper)

### Example: Complete Auth Screen

```tsx
import { GradientBackground } from '@/components/ui/gradient-background';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassTextInput } from '@/components/ui/glass-text-input';
import { AnimatedButton } from '@/components/ui/animated-button';
import { StatusBar } from 'expo-status-bar';

function LoginScreen() {
  return (
    <GradientBackground>
      <StatusBar style="light" />
      <ScrollView className="px-6" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="items-center mb-8">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-4xl text-white">
            Welcome Back
          </Text>
        </View>

        <GlassCard>
          <GlassTextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            icon="email-outline"
          />

          <GlassTextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            showToggle
            icon="lock-outline"
          />

          <AnimatedButton
            variant="cta"
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />
        </GlassCard>
      </ScrollView>
    </GradientBackground>
  );
}
```

## 📚 Resources

- [NativeWind Docs](https://www.nativewind.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)

## 🐛 Troubleshooting

**Classes không hoạt động?**
1. Kiểm tra `global.css` đã import trong `app/_layout.tsx`
2. Restart Metro bundler: `npm start -- --clear`
3. Check `tailwind.config.js` content paths

**TypeScript errors với className?**
- Tạo file `nativewind-env.d.ts` với: `/// <reference types="nativewind/types" />`

**Paper components không nhận className?**
- Wrap trong View với className thay vì style trực tiếp Paper component
