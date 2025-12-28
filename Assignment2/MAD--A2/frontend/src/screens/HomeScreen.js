import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Searchbar,
  Card,
  Text,
  Chip,
  ActivityIndicator,
  Button,
  Snackbar,
  IconButton,
  Badge,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const { addToCart, getCartCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      showSnackbar('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    const result = await addToCart(productId, 1);
    if (result.success) {
      showSnackbar('Added to cart successfully!');
    } else {
      showSnackbar(result.message || 'Failed to add to cart');
    }
  };

  const showSnackbar = (message) => {
    setSnackbar({ visible: true, message });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProduct = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 50} duration={400} style={styles.productCardWrapper}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      >
        <Card style={styles.productCard} elevation={3}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            {item.stock < 5 && item.stock > 0 && (
              <View style={styles.badgeContainer}>
                <View style={styles.lowStockBadge}>
                  <Text style={styles.badgeText}>Only {item.stock}</Text>
                </View>
              </View>
            )}
            {item.stock === 0 && (
              <View style={styles.outOfStockOverlay}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
            <TouchableOpacity style={styles.wishlistBtn}>
              <MaterialCommunityIcons name="heart-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Card.Content style={styles.cardContent}>
            <View style={styles.categoryRow}>
              <Chip 
                mode="flat" 
                compact 
                style={styles.categoryChip}
                textStyle={styles.categoryChipText}
              >
                {item.category}
              </Chip>
            </View>
            
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={12} color="#FFC107" />
                <Text style={styles.rating}>{item.rating ? item.rating.toFixed(1) : '0.0'}</Text>
              </View>
              <Text style={styles.reviewCount}>({item.reviews?.length || 0})</Text>
            </View>
            
            <View style={styles.priceSection}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              {item.stock > 0 && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item._id);
                  }}
                  style={styles.cartBtn}
                >
                  <MaterialCommunityIcons name="cart-plus" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>
              {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0] || 'User'}!` : 'Welcome!'}
            </Text>
            <Text style={styles.appTitle}>ShopEase</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Badge style={styles.iconBadge}>3</Badge>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              {getCartCount() > 0 && (
                <Badge style={styles.iconBadge}>{getCartCount()}</Badge>
              )}
              <MaterialCommunityIcons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Searchbar
            placeholder="Search for products..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#00BFA5"
            elevation={3}
          />
        </View>
      </View>

      {/* Promotional Banner */}
      <View style={styles.bannerSection}>
        <Card style={styles.bannerCard}>
          <Card.Content style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Flash Sale!</Text>
              <Text style={styles.bannerSubtitle}>Up to 50% OFF</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerRight}>
              <MaterialCommunityIcons name="flash" size={40} color="#FF6B6B" />
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryItem,
                selectedCategory === item && styles.categoryItemActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <View style={[
                styles.categoryIconWrapper,
                selectedCategory === item && styles.categoryIconWrapperActive
              ]}>
                <MaterialCommunityIcons 
                  name={item === 'All' ? 'apps' : 
                        item === 'Electronics' ? 'laptop' :
                        item === 'Clothing' ? 'tshirt-crew' :
                        item === 'Home & Garden' ? 'home' :
                        item === 'Sports' ? 'soccer' :
                        item === 'Books' ? 'book' :
                        item === 'Toys' ? 'toy-brick' :
                        item === 'Beauty' ? 'face-woman' : 'food'}
                  size={22} 
                  color={selectedCategory === item ? '#00BFA5' : '#7F8C8D'} 
                />
              </View>
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Section */}
      <View style={styles.productsWrapper}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>
            {selectedCategory === 'All' ? 'Featured Products' : selectedCategory}
          </Text>
          <Text style={styles.productCount}>
            {filteredProducts.length} items
          </Text>
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#00BFA5']}
              tintColor="#00BFA5"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="package-variant" size={60} color="#7F8C8D" />
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={2500}
        action={{
          label: 'View Cart',
          onPress: () => navigation.navigate('Cart'),
        }}
        style={styles.snackbar}
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
    marginTop: 16,
    fontSize: 15,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  
  // Header Section
  headerSection: {
    backgroundColor: '#00BFA5',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#E0F7F6',
    fontWeight: '500',
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    position: 'relative',
    padding: 4,
  },
  iconBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    fontSize: 10,
    minWidth: 18,
    height: 18,
  },
  
  // Search Section
  searchWrapper: {
    marginTop: -10,
  },
  searchBar: {
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#fff',
    height: 50,
  },
  
  // Banner Section
  bannerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    elevation: 4,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '700',
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  bannerRight: {
    paddingLeft: 20,
  },
  
  // Categories Section
  categoriesWrapper: {
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 4,
    width: 70,
  },
  categoryItemActive: {
    // Active state styling
  },
  categoryIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryIconWrapperActive: {
    backgroundColor: '#E0F7F6',
  },
  categoryText: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#00BFA5',
    fontWeight: '700',
  },
  
  // Products Section
  productsWrapper: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  productCount: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  
  // Product Grid
  productList: {
    padding: 12,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCardWrapper: {
    width: CARD_WIDTH,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F8F9FA',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  lowStockBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  categoryRow: {
    marginBottom: 6,
  },
  categoryChip: {
    backgroundColor: '#E0F7F6',
    height: 20,
  },
  categoryChipText: {
    fontSize: 9,
    color: '#00BFA5',
    fontWeight: '700',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 6,
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  rating: {
    fontSize: 11,
    color: '#FFC107',
    fontWeight: '700',
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  cartBtn: {
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  
  // Snackbar
  snackbar: {
    backgroundColor: '#2D3436',
  },
});