import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phone: formData.phone,
    });
    setLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animatable.View animation="fadeInDown" duration={800} style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>SE</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ShopEase and start shopping</Text>
          </Animatable.View>

          {/* Form Section */}
          <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter your full name"
                left={<TextInput.Icon icon="account" iconColor="#00BFA5" />}
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                left={<TextInput.Icon icon="email" iconColor="#00BFA5" />}
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password *</Text>
              <TextInput
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholder="Enter your password"
                left={<TextInput.Icon icon="lock" iconColor="#00BFA5" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    iconColor="#7F8C8D"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholder="Confirm your password"
                left={<TextInput.Icon icon="lock-check" iconColor="#00BFA5" />}
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                left={<TextInput.Icon icon="phone" iconColor="#00BFA5" />}
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                placeholder="Enter your address"
                left={<TextInput.Icon icon="map-marker" iconColor="#00BFA5" />}
                outlineColor="#E8ECF0"
                activeOutlineColor="#00BFA5"
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <HelperText type="error" visible={true} style={styles.error}>
                  {error}
                </HelperText>
              </View>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              buttonColor="#00BFA5"
            >
              Create Account
            </Button>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.loginButtonText}
            >
              Already have an account? Sign In
            </Button>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#00BFA5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  errorContainer: {
    marginBottom: 20,
  },
  error: {
    fontSize: 14,
  },
  registerButton: {
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8ECF0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    borderColor: '#00BFA5',
  },
  loginButtonText: {
    color: '#00BFA5',
    fontWeight: '600',
  },
});