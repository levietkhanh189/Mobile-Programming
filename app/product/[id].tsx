import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button, ActivityIndicator, Appbar, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { productService, Product } from '../../services/api';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productService.getProductById(Number(id));
            if (response.success && response.data) {
                setProduct(response.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Chi tiết" />
                </Appbar.Header>
                <View style={styles.centerContent}>
                    <Text>Không tìm thấy sản phẩm.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={product.name} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

                <View style={styles.infoSection}>
                    <Text style={styles.category}>{product.category}</Text>
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <Button
                        mode="contained"
                        onPress={() => { }}
                        style={styles.buyButton}
                        contentStyle={styles.buyButtonContent}
                    >
                        Mua ngay
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 300,
    },
    infoSection: {
        padding: 20,
    },
    category: {
        fontSize: 14,
        color: '#6200ee',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 30,
    },
    buyButton: {
        borderRadius: 8,
    },
    buyButtonContent: {
        paddingVertical: 8,
    },
});
