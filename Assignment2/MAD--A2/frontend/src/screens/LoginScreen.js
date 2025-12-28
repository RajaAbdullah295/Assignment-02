import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
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
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to ShopEase</Text>
          </Animatable.View>

          {/* Form Section */}
          <Animatable.View animation="fadeInUp" duration={800} style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
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
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
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

            <View style={styles.forgotPasswordContainer}>
              <Button
                mode="text"
                onPress={() => {}}
                labelStyle={styles.forgotPasswordText}
              >
                Forgot Password?
              </Button>
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
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              buttonColor="#00BFA5"
            >
              Sign In
            </Button>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.signupButtonText}
            >
              Create New Account
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 32,
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
    marginBottom: 20,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#00BFA5',
    fontWeight: '600',
  },
  errorContainer: {
    marginBottom: 20,
  },
  error: {
    fontSize: 14,
  },
  loginButton: {
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
  signupButton: {
    borderRadius: 12,
    borderColor: '#00BFA5',
  },
  signupButtonText: {
    color: '#00BFA5',
    fontWeight: '600',
  },
});