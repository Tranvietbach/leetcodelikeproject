package exam.primedev.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import exam.primedev.repository.PremiumRepository;
import exam.primedev.repository.ProblemPremiumRepository;
import exam.primedev.repository.UserPremiumRepository;
import exam.primedev.repository.ProblemRepository;
import exam.primedev.repository.UserRepository;
import exam.primedev.entity.ProblemPremium;
import exam.primedev.entity.UserPremium;
import exam.primedev.dto.PremiumResponseDTO;
import exam.primedev.entity.Premium;
import exam.primedev.entity.Problem;
import exam.primedev.entity.User;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/problem-access")
public class ProblemAccessController {

    @Autowired
    private ProblemPremiumRepository problemPremiumRepository;

    @Autowired
    private UserPremiumRepository userPremiumRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PremiumRepository premiumRepository;

    @GetMapping("/check")
    public ResponseEntity<?> checkAccess(
            @RequestParam String token,
            @RequestParam Long problemId) {
        Long userId= JwtUtil.extractUserIdFromToken(token);
        Optional<Problem> problemOpt = problemRepository.findById(problemId);
        if (problemOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Problem not found");
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // 1. Kiểm tra bài toán có yêu cầu premium không
        List<ProblemPremium> requiredPremiums = problemPremiumRepository.findByProblemId(problemId);
        if (requiredPremiums.isEmpty()) {
            return ResponseEntity.ok(Map.of("access", true, "message", "Free problem"));
        }

        // 2. Lấy danh sách premium user đã mua và còn hiệu lực
        LocalDateTime now = LocalDateTime.now();
        List<UserPremium> validUserPremiums = userPremiumRepository
                .findByUserIdAndExpirationDateAfter(userId, now);

        // 3. So sánh premium yêu cầu và premium user có
        for (ProblemPremium pp : requiredPremiums) {
            for (UserPremium up : validUserPremiums) {
                if (pp.getPremium().getId().equals(up.getPremium().getId())) {
                    return ResponseEntity.ok(Map.of("access", true, "message", "Access granted via premium"));
                }
            }
        }

        return ResponseEntity.ok(Map.of("access", false, "message", "You need premium to access this problem"));
    }



    @GetMapping("/premiums")
public ResponseEntity<List<PremiumResponseDTO>> getAllPremiums(@RequestParam String token) {
    Long userId = JwtUtil.extractUserIdFromToken(token);

    List<UserPremium> userPremiums = userPremiumRepository
            .findByUserIdAndExpirationDateAfter(userId, LocalDateTime.now());

    Set<Long> boughtIds = userPremiums.stream()
            .map(up -> up.getPremium().getId())
            .collect(Collectors.toSet());

    List<Premium> allPremiums = premiumRepository.findAll();

    List<PremiumResponseDTO> result = allPremiums.stream()
    
            .map(p -> new PremiumResponseDTO(p, boughtIds.contains(p.getId())))
            .collect(Collectors.toList());

    return ResponseEntity.ok(result);
}

@PostMapping("/create-payment-intent")
public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> request) throws Exception {
    Long amount = Long.parseLong(request.get("amount").toString());
    Long userId = JwtUtil.extractUserIdFromToken(request.get("token").toString());
    Long premiumId = Long.parseLong(request.get("premiumId").toString());
    //JwtUtil.extractUserIdFromToken(token)
    PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
        .setAmount(amount)
        .setCurrency("usd")
        .build();

    PaymentIntent paymentIntent = PaymentIntent.create(params);

    // ✅ Tạo mới bản ghi UserPremium (thanh toán thành công)
    Optional<User> userOpt = userRepository.findById(userId);
    Optional<Premium> premiumOpt = premiumRepository.findById(premiumId);

    if (userOpt.isEmpty() || premiumOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user or premium ID"));
    }

    User user = userOpt.get();
    Premium premium = premiumOpt.get();

    UserPremium userPremium = new UserPremium();
    userPremium.setUser(user);
    userPremium.setPremium(premium);
    userPremium.setPurchaseDate(LocalDateTime.now());
    userPremium.setExpirationDate(LocalDateTime.now().plusDays(premium.getDurationDays()));

    userPremiumRepository.save(userPremium);

    Map<String, String> response = new HashMap<>();
    response.put("clientSecret", paymentIntent.getClientSecret());

    return ResponseEntity.ok(response);
}

    @GetMapping("/premium/{id}")
public ResponseEntity<?> getPremiumById(@PathVariable Long id) {
    Optional<Premium> premiumOpt = premiumRepository.findById(id);
    if (premiumOpt.isPresent()) {
        return ResponseEntity.ok(premiumOpt.get());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Premium not found");
    }
}
}