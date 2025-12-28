import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  Divider,
  Chip,
  Card,
  Snackbar,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error('Fetch product error:', error);
      showSnackbar('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    const result = await addToCart(productId, quantity);
    if (result.success) {
      showSnackbar('Added to cart successfully!');
    } else {
      showSnackbar(result.message || 'Failed to add to cart');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ visible: true, message });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animatable.View animation="fadeIn" duration={800}>
          <Image source={{ uri: product.image_url }} style={styles.image} />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.categoryRow}>
            <Chip mode="outlined" style={styles.categoryChip}>
              {product.category}
            </Chip>
            <Text style={styles.rating}>⭐ {product.rating || 0} / 5</Text>
          </View>

          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          
          <Text style={styles.stock}>
            {product.stock > 0 ? `In Stock: ${product.stock} available` : 'Out of Stock'}
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Divider style={styles.divider} />

          {product.reviews && product.reviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Reviews ({product.reviews.length})</Text>
              {product.reviews.map((review, index) => (
                <Card key={index} style={styles.reviewCard}>
                  <Card.Content>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUser}>{review.user}</Text>
                      <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </Card.Content>
                </Card>
              ))}
              <Divider style={styles.divider} />
            </>
          )}

          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityButtons}>
              <Button
                mode="outlined"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                compact
              >
                -
              </Button>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button
                mode="outlined"
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                compact
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addButton}
          disabled={product.stock === 0}
          icon="cart-plus"
        >
          Add to Cart
        </Button>
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        action={{
          label: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  image: {
    width: width,
    height: width,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3436',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F7F6',
  },
  rating: {
    fontSize: 16,
    color: '#FFC107',
    fontWeight: '700',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00BFA5',
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E8ECF0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2D3436',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2D3436',
  },
  reviewCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewUser: {
    fontWeight: 'bold',
    color: '#2D3436',
  },
  reviewRating: {
    fontSize: 14,
    color: '#FFC107',
  },
  reviewComment: {
    color: '#7F8C8D',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 80,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    color: '#2D3436',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  addButton: {
    paddingVertical: 10,
    backgroundColor: '#00BFA5',
    borderRadius: 12,
  },
});

