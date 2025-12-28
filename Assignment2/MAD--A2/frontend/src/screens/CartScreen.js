import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  ActivityIndicator,
  IconButton,
  Divider,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartScreen({ navigation }) {
  const { cartItems, loading, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please login to view your cart</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          style={styles.loginButton}
        >
          Login
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animatable.Text animation="fadeIn" style={styles.emptyText}>
          Your cart is empty
        </Animatable.Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        >
          Start Shopping
        </Button>
      </View>
    );
  }

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(cartItemId);
    } else {
      await updateCartItem(cartItemId, newQuantity);
    }
  };

  const renderCartItem = ({ item, index }) => {
    const product = item.product_id;
    if (!product) return null;

    return (
      <Animatable.View animation="fadeInUp" delay={index * 100} duration={600}>
        <Card style={styles.cartCard}>
          <Card.Content>
            <View style={styles.cartItemContainer}>
              <Image source={{ uri: product.image_url }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                
                <View style={styles.quantityContainer}>
                  <IconButton
                    icon="minus"
                    size={20}
                    onPress={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                  />
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= product.stock}
                  />
                </View>
              </View>

              <View style={styles.rightSection}>
                <IconButton
                  icon="delete"
                  iconColor="red"
                  size={24}
                  onPress={() => removeFromCart(item._id)}
                />
                <Text style={styles.itemTotal}>
                  ${(product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>
    );
  };

  const total = getCartTotal();

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.bottomContainer}>
        <Divider />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
          icon="arrow-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          Proceed to Checkout
        </Button>
      </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  emptyText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 20,
    fontWeight: '500',
  },
  shopButton: {
    marginTop: 10,
    borderRadius: 12,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
  },
  listContainer: {
    padding: 16,
  },
  cartCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2D3436',
  },
  productPrice: {
    fontSize: 15,
    color: '#00BFA5',
    marginBottom: 8,
    fontWeight: '700',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#2D3436',
  },
  rightSection: {
    alignItems: 'center',
  },
  itemTotal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 20,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  checkoutButton: {
    paddingVertical: 10,
    backgroundColor: '#00BFA5',
    borderRadius: 12,
  },
});

