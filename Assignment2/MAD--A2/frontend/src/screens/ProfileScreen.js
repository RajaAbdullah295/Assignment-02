import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Avatar,
  List,
  Divider,
  ActivityIndicator,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';
import { orderAPI, profileAPI } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      setEditData({
        name: user?.name || '',
        address: user?.address || '',
        phone: user?.phone || '',
      });
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await profileAPI.updateProfile(editData);
      updateUser(response.data.user);
      setEditDialogVisible(false);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>👤</Text>
        </View>
        <Text style={styles.message}>Please login to view your profile</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          style={styles.loginButton}
          buttonColor="#00BFA5"
        >
          Sign In
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Text
            size={70}
            label={user?.name?.charAt(0).toUpperCase() || 'U'}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditDialogVisible(true)}
          >
            <Text style={styles.editButtonText}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statIcon}>📦</Text>
              <Text style={styles.statNumber}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statIcon}>💝</Text>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Account Information */}
        <Card style={styles.card}>
          <Card.Title title="Account Information" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📧 Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📱 Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Address</Text>
              <Text style={styles.infoValue}>{user?.address || 'Not provided'}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Order History */}
        <Card style={styles.card}>
          <Card.Title 
            title={`Order History (${orders.length})`} 
            titleStyle={styles.cardTitle}
            right={(props) => (
              <Button onPress={fetchOrders} loading={loading} textColor="#00BFA5">
                Refresh
              </Button>
            )}
          />
          <Card.Content>
            {loading ? (
              <ActivityIndicator size="large" color="#00BFA5" style={styles.loader} />
            ) : orders.length === 0 ? (
              <View style={styles.emptyOrders}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No orders yet</Text>
                <Text style={styles.emptySubtext}>Start shopping to see your orders here</Text>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Home')}
                  style={styles.shopButton}
                  buttonColor="#00BFA5"
                >
                  Start Shopping
                </Button>
              </View>
            ) : (
              orders.map((order) => (
                <TouchableOpacity
                  key={order._id}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order._id })}
                >
                  <View style={styles.orderItem}>
                    <View style={styles.orderLeft}>
                      <View style={styles.orderIcon}>
                        <Text style={styles.orderIconText}>📦</Text>
                      </View>
                      <View style={styles.orderDetails}>
                        <Text style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</Text>
                        <Text style={styles.orderDate}>
                          {new Date(order.order_date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderAmount}>${order.total_amount.toFixed(2)}</Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: order.status === 'delivered' ? '#E8F5E9' : '#FFF3E0' }
                      ]}>
                        <Text style={[
                          styles.statusText,
                          { color: order.status === 'delivered' ? '#4CAF50' : '#FF6B6B' }
                        ]}>
                          {order.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                </TouchableOpacity>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#FF6B6B"
          icon="logout"
        >
          Sign Out
        </Button>
      </ScrollView>

      {/* Edit Profile Dialog */}
      <Portal>
        <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={editData.name}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" iconColor="#00BFA5" />}
            />
            <TextInput
              label="Address"
              value={editData.address}
              onChangeText={(text) => setEditData({ ...editData, address: text })}
              mode="outlined"
              multiline
              numberOfLines={2}
              style={styles.input}
              left={<TextInput.Icon icon="map-marker" iconColor="#00BFA5" />}
            />
            <TextInput
              label="Phone"
              value={editData.phone}
              onChangeText={(text) => setEditData({ ...editData, phone: text })}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon icon="phone" iconColor="#00BFA5" />}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)} textColor="#7F8C8D">Cancel</Button>
            <Button onPress={handleUpdateProfile} textColor="#00BFA5">Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 50,
  },
  message: {
    fontSize: 18,
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    borderRadius: 12,
  },
  
  // Header
  header: {
    backgroundColor: '#00BFA5',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#E0F7F6',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 3,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  
  // Card Styles
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  
  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#2D3436',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    backgroundColor: '#E8ECF0',
    marginVertical: 4,
  },
  
  // Order Item
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderIconText: {
    fontSize: 20,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BFA5',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  // Empty Orders
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  shopButton: {
    borderColor: '#00BFA5',
  },
  
  // Loader
  loader: {
    marginVertical: 20,
  },
  
  // Logout Button
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  
  // Dialog
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
  },
});