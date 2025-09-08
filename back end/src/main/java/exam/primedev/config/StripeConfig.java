package exam.primedev.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @PostConstruct
    public void init() {
        String apiKey = System.getenv("STRIPE_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            // Fallback to system property if provided at runtime: -DSTRIPE_API_KEY=...
            apiKey = System.getProperty("STRIPE_API_KEY", "");
        }
        Stripe.apiKey = apiKey;
    }
}
