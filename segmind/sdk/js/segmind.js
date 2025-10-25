/**
 * Segmind JavaScript SDK
 * Customer messaging and event tracking
 */

class Segmind {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'http://localhost:8000/api';
    this.userId = null;
    this.sessionId = this.generateSessionId();
    this.queue = [];
    this.isInitialized = false;

    // Auto-initialize
    this.init();
  }

  init() {
    console.log('🎯 Segmind SDK initialized');
    this.isInitialized = true;

    // Send any queued events
    this.flushQueue();

    // Auto-track page views
    if (typeof window !== 'undefined') {
      this.track('page_view', {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      });
    }
  }

  /**
   * Identify a user
   */
  identify(userId, traits = {}) {
    this.userId = userId;

    const payload = {
      user_id: userId,
      traits: {
        ...traits,
        identified_at: new Date().toISOString()
      },
      session_id: this.sessionId
    };

    this.sendEvent('identify', payload);
    console.log('👤 User identified:', userId);
  }

  /**
   * Track an event
   */
  track(eventName, properties = {}) {
    const payload = {
      event: eventName,
      user_id: this.userId,
      session_id: this.sessionId,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : null
      }
    };

    this.sendEvent('track', payload);
    console.log('📊 Event tracked:', eventName, properties);
  }

  /**
   * Track e-commerce events
   */
  ecommerce = {
    // Product viewed
    productViewed: (product) => {
      this.track('product_viewed', {
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        price: product.price,
        currency: product.currency || 'USD'
      });
    },

    // Added to cart
    addedToCart: (product, quantity = 1) => {
      this.track('added_to_cart', {
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        price: product.price,
        quantity: quantity,
        cart_value: product.price * quantity
      });
    },

    // Purchase completed
    purchaseCompleted: (order) => {
      this.track('purchase_completed', {
        order_id: order.id,
        total: order.total,
        currency: order.currency || 'USD',
        products: order.products || [],
        payment_method: order.payment_method
      });
    },

    // Cart abandoned
    cartAbandoned: (cartValue, products = []) => {
      this.track('cart_abandoned', {
        cart_value: cartValue,
        products: products,
        abandoned_at: new Date().toISOString()
      });
    }
  };

  /**
   * Send a message to a customer
   */
  async sendMessage(customerId, channel, content, options = {}) {
    const payload = {
      customer_id: customerId,
      channel: channel,
      content: content,
      subject: options.subject,
      scheduled_at: options.scheduledAt
    };

    try {
      const response = await fetch(`${this.baseUrl}/messaging/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('💬 Message sent:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Get customer segments
   */
  async getSegments() {
    try {
      const response = await fetch(`${this.baseUrl}/segments/`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const segments = await response.json();
      console.log('🎯 Segments loaded:', segments.length);
      return segments;
    } catch (error) {
      console.error('❌ Failed to load segments:', error);
      throw error;
    }
  }

  /**
   * Create a campaign
   */
  async createCampaign(name, segmentId, channel, content, options = {}) {
    const payload = {
      name: name,
      segment_id: segmentId,
      channel: channel,
      content: content,
      subject: options.subject,
      scheduled_at: options.scheduledAt
    };

    try {
      const response = await fetch(`${this.baseUrl}/messaging/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      const campaign = await response.json();
      console.log('📧 Campaign created:', campaign);
      return campaign;
    } catch (error) {
      console.error('❌ Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Internal methods
   */
  sendEvent(type, payload) {
    if (!this.isInitialized) {
      this.queue.push({ type, payload });
      return;
    }

    // In a real implementation, this would send to your API
    if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
      const data = JSON.stringify({ type, payload, api_key: this.apiKey });
      window.navigator.sendBeacon(`${this.baseUrl}/events`, data);
    } else {
      // Fallback to fetch
      fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ type, payload })
      }).catch(error => {
        console.warn('📡 Event sending failed:', error);
      });
    }
  }

  flushQueue() {
    while (this.queue.length > 0) {
      const { type, payload } = this.queue.shift();
      this.sendEvent(type, payload);
    }
  }

  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

// Auto-initialize if loaded via script tag
if (typeof window !== 'undefined') {
  window.Segmind = Segmind;

  // Look for API key in script tag or global config
  const scriptTag = document.querySelector('script[src*="segmind.js"]');
  if (scriptTag && scriptTag.dataset.apiKey) {
    window.segmind = new Segmind(scriptTag.dataset.apiKey);
  }
}

// Export for Node.js/module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Segmind;
}

console.log('🎯 Segmind SDK loaded successfully');

// Usage examples in comments:
/*

// Initialize
const segmind = new Segmind('your-api-key');

// Identify user
segmind.identify('user123', {
  email: 'john@example.com',
  name: 'John Doe',
  plan: 'premium'
});

// Track events
segmind.track('button_clicked', {
  button_name: 'signup',
  page: 'landing'
});

// E-commerce tracking
segmind.ecommerce.productViewed({
  id: 'prod_123',
  name: 'iPhone 15',
  category: 'Electronics',
  price: 999
});

segmind.ecommerce.addedToCart({
  id: 'prod_123',
  name: 'iPhone 15',
  price: 999
}, 1);

// Send messages
segmind.sendMessage('user123', 'sms', 'Your order is ready!');

// Create campaigns
segmind.createCampaign(
  'Welcome Series',
  'seg_new_users',
  'email',
  'Welcome to our platform!'
);

*/