import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Avatar, ActivityIndicator, Snackbar, Searchbar, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { storageService } from '../services/storage';
import { authService, userService, productService, User, Product } from '../services/api';

const CATEGORIES = ['All', 'RPG', 'Action', 'Adventure', 'Strategy'];

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    loadUserData();
    fetchProducts();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await storageService.getToken();
      const cachedUser = await storageService.getUser();

      if (!token || !cachedUser) {
        router.replace('/login');
        return;
      }

      setUser(cachedUser);

      try {
        const response = await authService.getUserProfile();
        if (response.user) {
          setUser(response.user);
          await storageService.saveUser(response.user);
        }
      } catch (apiError: any) {
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          await storageService.clearAuthData();
          router.replace('/login');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (search = searchQuery, category = selectedCategory) => {
    setLoadingProducts(true);
    try {
      const response = await productService.getProducts(search, category);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Lỗi tải sản phẩm' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchProducts(query, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchProducts(searchQuery, category);
  };

  const handleLogout = async () => {
    try {
      await storageService.clearAuthData();
      setSnackbar({ visible: true, message: 'Đăng xuất thành công!' });
      setTimeout(() => router.replace('/login'), 1000);
    } catch (error) {
      setSnackbar({ visible: true, message: 'Có lỗi xảy ra khi đăng xuất' });
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <Card style={styles.productCard} onPress={() => router.push(`/product/${item.id}`)}>
      <Card.Cover source={{ uri: item.image }} style={styles.productImage} />
      <Card.Content style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar.Text
              size={40}
              label={user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
            />
          </TouchableOpacity>
          <View style={styles.headerUserInfo}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.userNameText}>{user?.fullName || 'User'}</Text>
          </View>
          <Button icon="logout" onPress={handleLogout} labelStyle={{ color: '#666' }}>Logout</Button>
        </View>

        <Searchbar
          placeholder="Tìm game..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {CATEGORIES.map(cat => (
            <Chip
              key={cat}
              selected={selectedCategory === cat}
              onPress={() => handleCategorySelect(cat)}
              style={styles.categoryChip}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loadingProducts ? (
        <View style={styles.loadingProductsContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
          }
        />
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#888',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBar: {
    marginBottom: 12,
    backgroundColor: '#F0F2F5',
    elevation: 0,
    borderRadius: 8,
  },
  categoryList: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#F0F2F5',
  },
  productList: {
    padding: 12,
  },
  productCard: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 3,
  },
  productImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productContent: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6200ee',
  },
  loadingProductsContainer: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
});
