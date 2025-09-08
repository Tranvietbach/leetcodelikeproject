package exam.primedev.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "your_very_long_secret_key_that_is_at_least_256_bits_long_123456";

    private static Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // ✔ Không decode base64 nữa
    }

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuer("your-app")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600 * 10000)) // 1 giờ
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public static Long extractUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
    
            // Trả về userId từ "sub"
            return Long.parseLong(claims.getSubject()); 
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ", e);
        }
        
    }

    public static String generateTokenFromUserId(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // chuyển int thành String
                .setIssuer("your-app")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 24*3600 * 1000)) // 1 giờ
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
