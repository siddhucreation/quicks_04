import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, Image, 
  TouchableOpacity, StatusBar, Dimensions, Modal, FlatList, Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const BRAND_COLOR = '#ef0357';
const { width } = Dimensions.get('window');

const CATEGORY_LIST = [
  { id: '0', name: 'All', icon: 'apps', color: '#fff0f4', iconColor: BRAND_COLOR },
  { id: '1', name: 'Navratri', icon: 'firework', color: '#fff3e0', iconColor: '#f57c00' },
  { id: '2', name: 'Groceries', icon: 'basket', color: '#e3f2fd', iconColor: '#1976d2' },
  { id: '3', name: 'Vegetables', icon: 'leaf', color: '#e8f5e9', iconColor: '#388e3c' },
  { id: '4', name: 'Food', icon: 'silverware-fork-knife', color: '#ffebee', iconColor: '#d32f2f' },
  { id: '5', name: 'Pharmacy', icon: 'medical-bag', color: '#f3e5f5', iconColor: '#7b1fa2' },
  { id: '6', name: 'Beauty', icon: 'sparkles', color: '#fce4ec', iconColor: '#c2185b' },
  { id: '7', name: 'Electronics', icon: 'cellphone-link', color: '#e8eaf6', iconColor: '#3f51b5' },
];

const ITEM_BESTSELLERS = [
  { id: 'b1', name: 'Farm Fresh Eggs (12)', price: '99', tab: 'Groceries', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cb3?q=80&w=400&auto=format&fit=crop', desc: 'High quality protein rich farm eggs, cleaned and securely packaged.' },
  { id: 'b2', name: 'Wood-fired Pizza', price: '199', tab: 'Food', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400&auto=format&fit=crop', desc: 'Crispy crust pizza loaded with extra mozzarella cheese and herbs.' },
  { id: 'b3', name: 'Shimla Apples (1kg)', price: '150', tab: 'Vegetables', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?q=80&w=400&auto=format&fit=crop', desc: 'Crisp, sweet, and freshly harvested premium apples.' },
  { id: 'b6', name: 'Sabudana Khichdi', price: '149', tab: 'Navratri', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop', desc: 'Traditional fasting meal prepared with rock salt and peanuts.' },
];

const ALL_PRODUCTS = [
  { id: 'p1', name: 'Artisan Whole Wheat Bread', price: '45', tab: 'Groceries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', desc: 'Soft and healthy whole wheat bread baked fresh daily.' },
  { id: 'p3', name: 'Tandoori Paneer Tikka', price: '249', tab: 'Food', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400&auto=format&fit=crop', desc: 'Cubes of cottage cheese marinated in spices and grilled.' },
  { id: 'p5', name: 'Nashik Red Onions (1kg)', price: '40', tab: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&auto=format&fit=crop', desc: 'Fresh, pungent red onions sourced directly from Nashik farms.' },
  { id: 'p7', name: 'Special Falahari Thali', price: '299', tab: 'Navratri', image: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=400&auto=format&fit=crop', desc: 'Complete fasting thali with sendha namak preparations.' },
  { id: 'p10', name: 'Hydrating Glow Cream', price: '399', tab: 'Beauty', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop', desc: 'Deep moisturization cream for radiant, glowing skin.' },
  { id: 'p11', name: 'Pro Wireless Earbuds', price: '1299', tab: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop', desc: 'Crystal clear sound quality with deep active bass.' },
];

const NEARBY_PLACES = [
  { id: '1', name: 'Spicy Grill Restaurant', rating: '4.8', time: '25-30 mins', distance: '2.5 km', category: 'North Indian • Tandoor', type: 'Restaurant', tab: 'Food', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop' },
  { id: '2', name: 'Organic Farm Mart', rating: '4.9', time: '10-15 mins', distance: '1.2 km', category: 'Fresh Hydroponics • Organic', type: 'Store', tab: 'Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' },
  { id: '4', name: 'City Supermarket', rating: '4.6', time: '12-18 mins', distance: '1.5 km', category: 'Supermarket • Daily Needs', type: 'Store', tab: 'Groceries', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400&auto=format&fit=crop' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Main'); // 'Main' | 'Store' | 'Product'
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Categories' | 'Cart' | 'Account'
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State: Array of { product, qty }
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1); 
  const [selectedType, setSelectedType] = useState(''); 

  const getTheme = () => {
    switch (activeCategory) {
      case 'Vegetables': return { gradient: ['#66bb6a', '#388e3c', '#1b5e20'], status: '#1b5e20', iconTint: '#a5d6a7', bgTint: '#f4fbf4', watermark: 'leaf', hangingVines: true, accentColor: '#2e7d32' };
      case 'Food': return { gradient: ['#ffa726', '#fb8c00', '#e65100'], status: '#e65100', iconTint: '#ffe0b2', bgTint: '#fffaf5', watermark: 'silverware-fork-knife', hangingVines: false, accentColor: '#f57c00' };
      case 'Groceries': return { gradient: ['#29b6f6', '#039be5', '#01579b'], status: '#01579b', iconTint: '#b3e5fc', bgTint: '#f0f9ff', watermark: 'basket-outline', hangingVines: false, accentColor: '#0288d1' };
      case 'Navratri': return { gradient: ['#ffa726', '#f57c00', '#bf360c'], status: '#bf360c', iconTint: '#ffe0b2', bgTint: '#fff8f0', watermark: 'firework', hangingVines: false, accentColor: '#d84315' };
      case 'Beauty': return { gradient: ['#ba68c8', '#ab47bc', '#4a148c'], status: '#4a148c', iconTint: '#e1bee7', bgTint: '#fdf8fd', watermark: 'sparkles', hangingVines: false, accentColor: '#8e24aa' };
      case 'Electronics': return { gradient: ['#26a69a', '#00acc1', '#004d40'], status: '#004d40', iconTint: '#80cbc4', bgTint: '#f0fcfc', watermark: 'cellphone-link', hangingVines: false, accentColor: '#00897b' };
      case 'All': default: return { gradient: ['#ff4081', '#ff2b70', BRAND_COLOR], status: '#d9024e', iconTint: BRAND_COLOR, bgTint: '#fff5f8', watermark: 'shopping-outline', hangingVines: false, accentColor: BRAND_COLOR };
    }
  };
  const currentTheme = getTheme();

  // --- CART LOGIC ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const getTotalCartItems = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const getTotalCartPrice = () => cart.reduce((sum, item) => sum + (parseInt(item.product.price) * item.qty), 0);

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('Product');
  };

  const handlePlaceSelect = (place) => { 
    setModalVisible(false); 
    setSelectedStore(place);
    setCurrentScreen('Store');
  };

  // ================= SCREENS =================

  // 1. PRODUCT DETAIL PAGE (PDP)
  const renderProductScreen = () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.pdpHeader}>
          <TouchableOpacity style={styles.pdpBackBtn} onPress={() => setCurrentScreen('Main')}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.pdpHeaderTitle}>Product Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={{ uri: selectedProduct.image }} style={styles.pdpImage} />
          <View style={styles.pdpContent}>
            <Text style={styles.pdpTitle}>{selectedProduct.name}</Text>
            <Text style={styles.pdpPrice}>₹{selectedProduct.price}</Text>
            <View style={styles.pdpDivider} />
            <Text style={styles.pdpSectionTitle}>Product Description</Text>
            <Text style={styles.pdpDesc}>{selectedProduct.desc}</Text>
            <View style={styles.pdpDeliveryBadge}>
              <Ionicons name="flash" size={18} color="#24963f" />
              <Text style={styles.pdpDeliveryText}>Superfast delivery in 8 minutes to your doorstep</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.pdpBottomBar}>
          <View>
            <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>Total Price</Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#111' }}>₹{selectedProduct.price}</Text>
          </View>
          <TouchableOpacity style={styles.pdpAddBtn} onPress={() => { addToCart(selectedProduct); Alert.alert('Added to Cart', `${selectedProduct.name} added successfully!`); }}>
            <Text style={styles.pdpAddBtnText}>ADD TO CART</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  // 2. STORE PAGE
  const renderStoreScreen = () => (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.storeHero}>
        <Image source={{ uri: selectedStore.image }} style={styles.storeHeroImage} />
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={StyleSheet.absoluteFill} />
        <TouchableOpacity style={styles.storeBackButton} onPress={() => setCurrentScreen('Main')}>
          <BlurView intensity={80} tint="dark" style={styles.storeBackBlur}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
      </View>
      <View style={styles.storeInfoCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.storeTitle}>{selectedStore.name}</Text>
            <Text style={styles.storeCategoryText}>{selectedStore.category} • {selectedStore.distance}</Text>
          </View>
          <View style={styles.storeRatingBig}>
            <Text style={styles.storeRatingBigText}>{selectedStore.rating}</Text>
            <Ionicons name="star" size={12} color="#fff" />
          </View>
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <Text style={{color: '#888'}}>Full menu loads here from Supabase.</Text>
      </View>
    </View>
  );

  // 3. CART PAGE
  const renderCartScreen = () => (
    <View style={[styles.tabContainer, { backgroundColor: '#f8f9fa' }]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.simpleHeader}>
          <Text style={styles.simpleHeaderTitle}>My Cart</Text>
          <Text style={styles.simpleHeaderSub}>Instant delivery in 8 minutes</Text>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <MaterialCommunityIcons name="cart-outline" size={80} color="#ccc" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSub}>Add items from home to start your quick order.</Text>
            <TouchableOpacity style={styles.emptyCartBtn} onPress={() => setActiveTab('Home')}>
              <Text style={styles.emptyCartBtnText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
            {cart.map(item => (
              <View key={item.product.id} style={styles.cartCard}>
                <Image source={{ uri: item.product.image }} style={styles.cartItemImage} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.cartItemName} numberOfLines={1}>{item.product.name}</Text>
                  <Text style={styles.cartItemPrice}>₹{item.product.price}</Text>
                </View>
                <View style={styles.cartQtyContainer}>
                  <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={styles.cartQtyBtn}>
                    <Ionicons name="remove" size={16} color={BRAND_COLOR} />
                  </TouchableOpacity>
                  <Text style={styles.cartQtyText}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => addToCart(item.product)} style={styles.cartQtyBtn}>
                    <Ionicons name="add" size={16} color={BRAND_COLOR} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.billContainer}>
              <Text style={styles.billTitle}>Bill Details</Text>
              <View style={styles.billRow}><Text style={styles.billText}>Item Total</Text><Text style={styles.billText}>₹{getTotalCartPrice()}</Text></View>
              <View style={styles.billRow}><Text style={styles.billText}>Delivery Partner Fee</Text><Text style={styles.billText} color="#24963f">FREE</Text></View>
              <View style={styles.billRow}><Text style={styles.billText}>Handling Charge</Text><Text style={styles.billText}>₹5</Text></View>
              <View style={[styles.billRow, { borderTopWidth: 1, borderColor: '#eee', marginTop: 8, paddingTop: 8 }]}>
                <Text style={styles.billTotalText}>To Pay</Text><Text style={styles.billTotalText}>₹{getTotalCartPrice() + 5}</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      {cart.length > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={{ fontSize: 12, color: '#666', fontWeight: '600' }}>{getTotalCartItems()} Items | ₹{getTotalCartPrice() + 5}</Text>
            <Text style={{ fontSize: 15, fontWeight: '900', color: '#111' }}>Pay via Razorpay</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => Alert.alert('Razorpay Checkout', 'Launching secure gateway...')}>
            <Text style={styles.checkoutBtnText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* BOTTOM NAV */}
      <BlurView intensity={95} tint="light" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Categories')}>
          <Ionicons name="grid-outline" size={24} color="#666" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Cart')}>
          <Ionicons name="cart" size={24} color={BRAND_COLOR} />
          <Text style={[styles.navText, { color: BRAND_COLOR, fontWeight: '800' }]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Account')}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  // 4. ACCOUNT / PROFILE SECTION
  const renderAccountScreen = () => (
    <View style={[styles.tabContainer, { backgroundColor: '#f8f9fa' }]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.simpleHeader}>
          <Text style={styles.simpleHeaderTitle}>My Account</Text>
          <Text style={styles.simpleHeaderSub}>Patel Siddh Bipinbhai</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}><Ionicons name="person" size={32} color={BRAND_COLOR} /></View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.profileName}>Patel Siddh Bipinbhai</Text>
              <Text style={styles.profilePhone}>+91 98765 43210</Text>
              <Text style={styles.profileEmail}>siddh@dealshub.com</Text>
            </View>
          </View>

          <View style={styles.accountMenuBox}>
            <TouchableOpacity style={styles.accountMenuItem} onPress={() => Alert.alert('Past Orders', 'Loading order history from Supabase...')}>
              <Ionicons name="bag-handle-outline" size={22} color="#333" style={{ marginRight: 16 }} />
              <Text style={styles.accountMenuText}>Your Orders</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountMenuItem} onPress={() => Alert.alert('Saved Addresses', 'Fetching location GPS...')}>
              <Ionicons name="location-outline" size={22} color="#333" style={{ marginRight: 16 }} />
              <Text style={styles.accountMenuText}>Saved Addresses</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountMenuItem} onPress={() => Alert.alert('Wati WhatsApp OTP', 'Verified securely via Wati API.')}>
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" style={{ marginRight: 16 }} />
              <Text style={styles.accountMenuText}>WhatsApp Notifications (Wati)</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.accountMenuItem} onPress={() => Alert.alert('Logout', 'Session terminated.')}>
              <Ionicons name="log-out-outline" size={22} color="#c62828" style={{ marginRight: 16 }} />
              <Text style={[styles.accountMenuText, { color: '#c62828' }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BlurView intensity={95} tint="light" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Categories')}>
          <Ionicons name="grid-outline" size={24} color="#666" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Cart')}>
          <Ionicons name="cart-outline" size={24} color="#666" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Account')}>
          <Ionicons name="person" size={24} color={BRAND_COLOR} />
          <Text style={[styles.navText, { color: BRAND_COLOR, fontWeight: '800' }]}>Account</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  // 5. HOME SCREEN
  const renderHomeScreen = () => {
    const filteredBestsellers = activeCategory === 'All' ? ITEM_BESTSELLERS : ITEM_BESTSELLERS.filter(b => b.tab === activeCategory);
    const filteredProducts = activeCategory === 'All' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.tab === activeCategory);
    const filteredPlaces = activeCategory === 'All' ? NEARBY_PLACES : NEARBY_PLACES.filter(p => p.tab === activeCategory);

    return (
      <View style={styles.rootContainer}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: currentTheme.bgTint, overflow: 'hidden' }]} pointerEvents="none">
          <MaterialCommunityIcons name={currentTheme.watermark} size={380} color="rgba(0,0,0,0.03)" style={{ position: 'absolute', top: 120, right: -80, transform: [{ rotate: '20deg' }] }} />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <LinearGradient colors={currentTheme.gradient} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={styles.headerGradient}>
              <View style={styles.glassOrb1} />
              <View style={styles.glassOrb2} />

              <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                  <Text style={styles.deliveryBrand}>Lightning Delivery in</Text>
                  <View style={styles.timeRow}><Text style={styles.deliveryTime}>8 minutes</Text></View>
                  <View style={styles.locationRow}><Text style={styles.locationText} numberOfLines={1}>HOME - 123 Startup Street...</Text><Ionicons name="caret-down" size={14} color="#fff" /></View>
                </View>
                <View style={styles.headerRight}>
                  {/* DYNAMIC CART BADGE IN HEADER */}
                  <TouchableOpacity style={styles.walletGlass} onPress={() => setActiveTab('Cart')}>
                    <Ionicons name="cart" size={16} color="#ffd700" />
                    <Text style={styles.walletText}>{getTotalCartItems()} items</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileIcon} onPress={() => setActiveTab('Account')}><Ionicons name="person" size={20} color="#666" /></TouchableOpacity>
                </View>
              </View>
              
              <BlurView intensity={80} tint="light" style={styles.glassSearchContainer}>
                <Ionicons name="search" size={20} color="#444" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder={`Search in "${activeCategory}"`} placeholderTextColor="#666" value={searchQuery} onChangeText={setSearchQuery} />
                <View style={styles.searchDivider} />
                <Ionicons name="mic" size={20} color={currentTheme.accentColor} />
              </BlurView>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topLinksScroll}>
                {CATEGORY_LIST.map((link) => {
                  const isActive = activeCategory === link.name;
                  return (
                    <TouchableOpacity key={link.id} style={styles.topLinkItem} onPress={() => setActiveCategory(link.name)}>
                      <BlurView intensity={isActive ? 80 : 30} tint="light" style={styles.topLinkIconBox}>
                        <MaterialCommunityIcons name={link.icon} size={22} color={isActive ? "#fff" : "rgba(255,255,255,0.9)"} />
                      </BlurView>
                      <Text style={[styles.topLinkText, isActive && styles.topLinkTextActive]}>{link.name}</Text>
                      {isActive && <View style={styles.activeIndicator} />}
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </LinearGradient>

            <TouchableOpacity style={styles.imageBannerContainer} activeOpacity={0.95}>
              <Image source={{ uri: 'https://www.dealshubofficial.com/web/image/22317-854348c6/file_0000000008e0720bb1e6f3dbf3f2991c.webp' }} style={styles.imageBanner} resizeMode="cover" />
            </TouchableOpacity>

            {/* BESTSELLERS */}
            {filteredBestsellers.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Trending {activeCategory === 'All' ? 'Items' : activeCategory}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}>
                  {filteredBestsellers.map(item => (
                    <TouchableOpacity key={item.id} style={styles.glassBestsellerCard} activeOpacity={0.9} onPress={() => handleProductPress(item)}>
                      <Image source={{ uri: item.image }} style={styles.bestsellerImage} />
                      <Text style={styles.bestsellerName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.bestsellerBottom}>
                        <Text style={styles.bestsellerPrice}>₹{item.price}</Text>
                        <TouchableOpacity style={[styles.addButtonSmall, { borderColor: currentTheme.accentColor }]} onPress={() => addToCart(item)}>
                          <Text style={[styles.addButtonSmallText, { color: currentTheme.accentColor }]}>ADD</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* PRODUCTS GRID */}
            {filteredProducts.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Explore {activeCategory === 'All' ? 'Products' : activeCategory}</Text>
                <View style={styles.productGrid}>
                  {filteredProducts.map(prod => (
                    <TouchableOpacity key={prod.id} style={styles.glassProductCard} activeOpacity={0.9} onPress={() => handleProductPress(prod)}>
                      <Image source={{ uri: prod.image }} style={styles.productImage} />
                      <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                      <View style={styles.productBottom}>
                        <Text style={styles.productPrice}>₹{prod.price}</Text>
                        <TouchableOpacity style={[styles.addButtonSmall, { borderColor: currentTheme.accentColor }]} onPress={() => addToCart(prod)}>
                          <Text style={[styles.addButtonSmallText, { color: currentTheme.accentColor }]}>ADD</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* NEARBY STORES */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Nearby Stores & Restaurants</Text>
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map(place => (
                  <TouchableOpacity key={place.id} style={styles.glassStoreCard} activeOpacity={0.95} onPress={() => handlePlaceSelect(place)}>
                    <Image source={{ uri: place.image }} style={styles.zomatoHomeImage} />
                    <View style={styles.zomatoHomeInfo}>
                      <View style={styles.zomatoHomeHeader}>
                        <Text style={styles.zomatoHomeName} numberOfLines={1}>{place.name}</Text>
                        <View style={styles.zomatoRatingPill}>
                          <Text style={styles.zomatoRatingText}>{place.rating}</Text>
                          <Ionicons name="star" size={10} color="#fff" />
                        </View>
                      </View>
                      <Text style={styles.zomatoHomeCategory}>{place.category} • {place.distance}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ paddingVertical: 40, alignItems: 'center', paddingRight: 16 }}>
                  <Text style={{ color: '#888', fontWeight: '500' }}>No {activeCategory} places nearby yet.</Text>
                </View>
              )}
            </View>

          </ScrollView>
        </SafeAreaView>

        {/* BOTTOM NAV */}
        <BlurView intensity={95} tint="light" style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
            <Ionicons name="home" size={24} color={currentTheme.accentColor} />
            <Text style={[styles.navText, { color: currentTheme.accentColor, fontWeight: '800' }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Categories')}>
            <Ionicons name="grid-outline" size={24} color="#666" />
            <Text style={styles.navText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Cart')}>
            <Ionicons name="cart-outline" size={24} color="#666" />
            <Text style={styles.navText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Account')}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  };

  const renderCategoriesScreen = () => (
    <View style={[styles.tabContainer, { backgroundColor: '#fff' }]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.simpleHeader}>
          <Text style={styles.simpleHeaderTitle}>All Categories</Text>
          <Text style={styles.simpleHeaderSub}>Explore everything we deliver.</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.categoryGrid}>
            {CATEGORY_LIST.slice(1).map(cat => ( 
              <TouchableOpacity key={cat.id} style={styles.catGridCard} onPress={() => { setActiveCategory(cat.name); setActiveTab('Home'); }}>
                <View style={[styles.catIconCircle, { backgroundColor: cat.color }]}>
                  <MaterialCommunityIcons name={cat.icon} size={32} color={cat.iconColor} />
                </View>
                <Text style={styles.catGridName} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BlurView intensity={95} tint="light" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Categories')}>
          <Ionicons name="grid" size={24} color={BRAND_COLOR} />
          <Text style={[styles.navText, { color: BRAND_COLOR, fontWeight: '800' }]}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Cart')}>
          <Ionicons name="cart-outline" size={24} color="#666" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Account')}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );

  // ================= SWITCH SCREEN LOGIC =================
  if (currentScreen === 'Product' && selectedProduct) return renderProductScreen();
  if (currentScreen === 'Store' && selectedStore) return renderStoreScreen();
  if (activeTab === 'Cart') return renderCartScreen();
  if (activeTab === 'Account') return renderAccountScreen();
  if (activeTab === 'Categories') return renderCategoriesScreen();
  return renderHomeScreen();
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#fff' },
  safeArea: { flex: 1 },
  tabContainer: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  headerGradient: { paddingTop: StatusBar.currentHeight || 40, paddingBottom: 22, borderBottomLeftRadius: 36, borderBottomRightRadius: 36, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 18, elevation: 10, overflow: 'hidden' },
  
  glassOrb1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.15)', top: -60, right: -50 },
  glassOrb2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.1)', bottom: -20, left: -30 },

  headerTop: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16, zIndex: 1 },
  headerLeft: { flex: 1 },
  deliveryBrand: { color: '#fff', fontSize: 12, fontWeight: '800', opacity: 0.95, textTransform: 'uppercase', letterSpacing: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  deliveryTime: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { color: '#fff', fontSize: 13, marginRight: 4, opacity: 0.9, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  
  walletGlass: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, marginRight: 10, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  walletText: { color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  profileIcon: { backgroundColor: '#fff', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  
  glassSearchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 18, paddingHorizontal: 14, height: 54, marginBottom: 18, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.9)', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111', fontWeight: '600' },
  searchDivider: { width: 1, height: 24, backgroundColor: 'rgba(0,0,0,0.1)', marginHorizontal: 10 },
  
  topLinksScroll: { paddingHorizontal: 16 },
  topLinkItem: { alignItems: 'center', marginRight: 22 },
  topLinkIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  topLinkText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  topLinkTextActive: { color: '#fff', fontWeight: '900' },
  activeIndicator: { width: 18, height: 3.5, backgroundColor: '#fff', borderRadius: 2, marginTop: 3 },

  imageBannerContainer: { marginHorizontal: 16, marginVertical: 18, height: 145, borderRadius: 22, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 8 },
  imageBanner: { width: '100%', height: '100%' },

  sectionContainer: { paddingLeft: 16, paddingRight: 16, marginBottom: 28 },
  sectionTitle: { fontSize: 21, fontWeight: '900', color: '#111', marginBottom: 16, letterSpacing: -0.5 },

  glassBestsellerCard: { width: 140, marginRight: 16, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 22, padding: 10, borderWidth: 1.5, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  bestsellerImage: { width: '100%', height: 100, borderRadius: 16, marginBottom: 10, backgroundColor: '#f5f5f5' },
  bestsellerName: { fontSize: 13, fontWeight: '800', color: '#111', marginBottom: 4 },
  bestsellerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  bestsellerPrice: { fontSize: 14, fontWeight: '900', color: '#222' },
  
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  glassProductCard: { width: (width - 44) / 2, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 22, padding: 12, marginBottom: 16, borderWidth: 1.5, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  productImage: { width: '100%', height: 120, borderRadius: 16, marginBottom: 10, backgroundColor: '#f5f5f5' },
  productName: { fontSize: 14, fontWeight: '800', color: '#111', marginBottom: 6, height: 38 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: '900', color: '#111' },
  
  addButtonSmall: { backgroundColor: '#fff', borderColor: '#eee', borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  addButtonSmallText: { fontSize: 12, fontWeight: '900' },

  glassStoreCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 26, marginBottom: 24, borderWidth: 1.5, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6, overflow: 'hidden' },
  zomatoHomeImage: { width: '100%', height: 180, backgroundColor: '#eee' },
  zomatoHomeInfo: { padding: 18 },
  zomatoHomeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  zomatoHomeName: { fontSize: 20, fontWeight: '900', color: '#111', flex: 1, marginRight: 10, letterSpacing: -0.5 },
  zomatoHomeCategory: { fontSize: 13, color: '#555', fontWeight: '700' },
  zomatoRatingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#24963f', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  zomatoRatingText: { color: '#fff', fontWeight: '900', fontSize: 12, marginRight: 4 },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'space-around', shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 25, overflow: 'hidden' },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 11, color: '#666', marginTop: 4, fontWeight: '700' },

  simpleHeader: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: 'transparent' },
  simpleHeaderTitle: { fontSize: 28, fontWeight: '900', color: '#111', letterSpacing: -0.5 },
  simpleHeaderSub: { fontSize: 14, color: '#666', marginTop: 4, fontWeight: '500' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catGridCard: { width: (width - 48) / 3, alignItems: 'center', marginBottom: 24 },
  catIconCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  catGridName: { fontSize: 12, fontWeight: '800', color: '#333', textAlign: 'center', paddingHorizontal: 4, height: 32 },

  // PDP STYLES
  pdpHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  pdpBackBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  pdpHeaderTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  pdpImage: { width: '100%', height: 320, backgroundColor: '#f9f9f9' },
  pdpContent: { padding: 20, paddingBottom: 100 },
  pdpTitle: { fontSize: 26, fontWeight: '900', color: '#111', marginBottom: 8, letterSpacing: -0.5 },
  pdpPrice: { fontSize: 22, fontWeight: '900', color: BRAND_COLOR, marginBottom: 16 },
  pdpDivider: { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  pdpSectionTitle: { fontSize: 16, fontWeight: '800', color: '#222', marginBottom: 8 },
  pdpDesc: { fontSize: 14, color: '#555', lineHeight: 22, fontWeight: '500', marginBottom: 20 },
  pdpDeliveryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 12, borderRadius: 12 },
  pdpDeliveryText: { fontSize: 13, color: '#2e7d32', fontWeight: '700', marginLeft: 8 },
  pdpBottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 10 },
  pdpAddBtn: { backgroundColor: BRAND_COLOR, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, shadowColor: BRAND_COLOR, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  pdpAddBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  // CART STYLES
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyCartTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 8 },
  emptyCartSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  emptyCartBtn: { backgroundColor: BRAND_COLOR, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyCartBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, alignItems: 'center' },
  cartItemImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#eee', marginRight: 12 },
  cartItemName: { fontSize: 16, fontWeight: '800', color: '#222', marginBottom: 4 },
  cartItemPrice: { fontSize: 14, fontWeight: '900', color: '#555' },
  cartQtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 10, padding: 4 },
  cartQtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  cartQtyText: { marginHorizontal: 12, fontWeight: '900', fontSize: 14 },
  billContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginTop: 12, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  billTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 12 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billText: { fontSize: 13, color: '#666', fontWeight: '600' },
  billTotalText: { fontSize: 16, fontWeight: '900', color: '#111' },
  checkoutBar: { position: 'absolute', bottom: 70, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', elevation: 10 },
  checkoutBtn: { backgroundColor: BRAND_COLOR, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  // ACCOUNT STYLES
  profileCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, marginBottom: 16 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff0f4', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffccd8' },
  profileName: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 2 },
  profilePhone: { fontSize: 13, color: '#666', fontWeight: '600', marginBottom: 2 },
  profileEmail: { fontSize: 13, color: '#666', fontWeight: '500' },
  accountMenuBox: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  accountMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  accountMenuText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#222' },

  // STORE PAGE STYLES
  storeHero: { width: '100%', height: 220, position: 'relative' },
  storeHeroImage: { width: '100%', height: '100%' },
  storeBackButton: { position: 'absolute', top: StatusBar.currentHeight || 40, left: 16, zIndex: 10 },
  storeBackBlur: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  storeInfoCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: -40, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, zIndex: 2 },
  storeTitle: { fontSize: 24, fontWeight: '900', color: '#111', marginBottom: 4, letterSpacing: -0.5 },
  storeCategoryText: { fontSize: 13, color: '#666', fontWeight: '600' },
  storeRatingBig: { backgroundColor: '#24963f', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  storeRatingBigText: { color: '#fff', fontWeight: '900', fontSize: 14, marginRight: 4 },
});