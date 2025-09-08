package exam.primedev.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS config
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }

    // Static resource mapping (serve images from wwwroot/avatars/)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL /avatars/** to the folder ./wwwroot/avatars/
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:./wwwroot/avatars/");
    }
}
