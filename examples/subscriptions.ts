import { subscriptions } from '../generated';

// Configure the API client
subscriptions.OpenAPI.BASE = 'https://api-m.sandbox.paypal.com';
subscriptions.OpenAPI.TOKEN = 'YOUR_ACCESS_TOKEN';

// Example: Create a subscription plan
async function createPlan() {
  try {
    const planRequest = {
      product_id: 'PRODUCT_ID_HERE', // Create a product first
      name: 'Basic Subscription Plan',
      description: 'Basic subscription with monthly billing',
      billing_cycles: [{
        frequency: {
          interval_unit: 'MONTH' as const,
          interval_count: 1
        },
        tenure_type: 'REGULAR' as const,
        sequence: 1,
        total_cycles: 12,
        pricing_scheme: {
          fixed_price: {
            value: '19.99',
            currency_code: 'USD'
          }
        }
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3
      }
    };

    const response = await subscriptions.PlansService.plansCreate({
      requestBody: planRequest,
      paypalRequestId: `plan-${Date.now()}`
    });

    console.log('Subscription plan created:');
    console.log('Plan ID:', response.id);
    console.log('Status:', response.status);

    return response;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
}

// Example: Create a subscription
async function createSubscription(planId: string) {
  try {
    const subscriptionRequest = {
      plan_id: planId,
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Start tomorrow
      subscriber: {
        email_address: 'customer@example.com',
        name: {
          given_name: 'John',
          surname: 'Doe'
        }
      },
      application_context: {
        brand_name: 'Your Brand',
        return_url: 'https://example.com/return',
        cancel_url: 'https://example.com/cancel'
      }
    };

    const response = await subscriptions.SubscriptionsService.subscriptionsCreate({
      requestBody: subscriptionRequest,
      paypalRequestId: `subscription-${Date.now()}`
    });

    console.log('Subscription created:');
    console.log('Subscription ID:', response.id);
    console.log('Status:', response.status);
    console.log('Approval URL:', response.links?.find(l => l.rel === 'approve')?.href);

    return response;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

// Example: Get subscription details
async function getSubscription(subscriptionId: string) {
  try {
    const response = await subscriptions.SubscriptionsService.subscriptionsGet({
      subscriptionId
    });

    console.log('Subscription details:');
    console.log('ID:', response.id);
    console.log('Status:', response.status);
    console.log('Plan ID:', response.plan_id);
    console.log('Subscriber:', response.subscriber);

    return response;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

// Run examples (uncomment to test)
// createPlan();
// createSubscription('PLAN_ID_HERE');
// getSubscription('SUBSCRIPTION_ID_HERE');
