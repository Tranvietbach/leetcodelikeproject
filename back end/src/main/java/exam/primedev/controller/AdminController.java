package exam.primedev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import exam.primedev.entity.AdminAccount;
import exam.primedev.entity.Badge;
import exam.primedev.entity.Comment;
import exam.primedev.entity.Company;
import exam.primedev.entity.Language;
import exam.primedev.entity.Premium;
import exam.primedev.entity.tag;
import exam.primedev.repository.AdminAccountRepository;
import exam.primedev.repository.BadgeRepository;
import exam.primedev.repository.CommentRepository;
import exam.primedev.repository.CompanyRepository;
import exam.primedev.repository.LanguageRepository;
import exam.primedev.repository.PremiumRepository;
import exam.primedev.repository.TagRepository;
import io.jsonwebtoken.ExpiredJwtException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")

public class AdminController {

    @Autowired
    private AdminAccountRepository adminRepo;

    @Autowired
    private PremiumRepository premiumRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private BadgeRepository badgeRepo;
    @Autowired
    private CommentRepository commentRepo;
        @Autowired
    private LanguageRepository languageRepo;

        @GetMapping("/language")
    public ResponseEntity<?> getAllLanguages(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            List<Language> languages = languageRepo.findAll();

            return ResponseEntity.ok(languages);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/language")
    public ResponseEntity<?> createLanguage(
            @RequestHeader("Authorization") String token,
            @RequestBody Language language) {
        try {
            validateToken(token);

            // Nếu cần, validate dữ liệu ở đây
            Language saved = languageRepo.save(language);

            return ResponseEntity.ok(Map.of("message", "Tạo Language thành công", "id", saved.getId()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/language/{id}")
    public ResponseEntity<?> updateLanguage(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token,
            @RequestBody Language languageReq) {
        try {
            validateToken(token);

            Language language = languageRepo.findById(id.longValue())
                    .orElseThrow(() -> new RuntimeException("Language không tồn tại"));

            language.setName(languageReq.getName());

            languageRepo.save(language);

            return ResponseEntity.ok(Map.of("message", "Cập nhật Language thành công"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/language/{id}")
    public ResponseEntity<?> deleteLanguage(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            languageRepo.deleteById(id.longValue());

            return ResponseEntity.ok(Map.of("message", "Xóa Language thành công"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getComments(
            @RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            List<Comment> comments = commentRepo.findAll();

            List<Map<String, Object>> result = comments.stream().map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId());
                map.put("content", c.getContent());
                map.put("user", c.getUser().getUsername());
                map.put("problemId", c.getProblem().getId());
                map.put("createdAt", c.getCreatedAt());
                return map;
            }).toList();

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // Xóa comment theo id
    @DeleteMapping("/comment/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {
        try {
            validateToken(token);
            commentRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa comment"));
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Comment không tồn tại"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/badge")
    public ResponseEntity<?> getAllBadges(@RequestHeader("Authorization") String token) {
        validateToken(token);
        List<Badge> badges = badgeRepo.findAll();
        return ResponseEntity.ok(badges);
    }

    @PostMapping("/badge")
    public ResponseEntity<?> createBadge(@RequestHeader("Authorization") String token,
            @RequestBody Badge badge) {
        validateToken(token);
        Badge saved = badgeRepo.save(badge);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/badge/{id}")
    public ResponseEntity<?> updateBadge(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Badge badgeRequest) {
        validateToken(token);
        Badge badge = badgeRepo.findById(id).orElseThrow(() -> new RuntimeException("Badge không tồn tại"));
        badge.setName(badgeRequest.getName());
        badge.setDescription(badgeRequest.getDescription());
        badgeRepo.save(badge);
        return ResponseEntity.ok(badge);
    }

    @DeleteMapping("/badge/{id}")
    public ResponseEntity<?> deleteBadge(@RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        validateToken(token);
        badgeRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa badge thành công"));
    }

    // Hàm xác thực token
    private boolean validateToken(String token) {
        try {
            JwtUtil.extractUserIdFromToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token đã hết hạn");
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ");
        }
    }

    // ===== CRUD Company =====

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);
            List<Map<String, Object>> result = companyRepository.findAll()
                    .stream()
                    .map(c -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", c.getId());
                        map.put("name", c.getName());
                        return map;
                    })
                    .toList();

            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<?> getCompanyById(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        try {
            validateToken(token);
            return companyRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestHeader("Authorization") String token,
            @RequestBody Company company) {
        try {
            validateToken(token);
            company.setCreatedAt(LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(companyRepository.save(company));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<?> updateCompany(@RequestHeader("Authorization") String token,
            @PathVariable Integer id,
            @RequestBody Company updated) {
        try {
            validateToken(token);
            return companyRepository.findById(id)
                    .map(c -> {
                        c.setName(updated.getName());
                        c.setDescription(updated.getDescription());
                        return ResponseEntity.ok(companyRepository.save(c));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        try {
            validateToken(token);
            companyRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ===== CRUD Premium =====

    @GetMapping("/premiums")
    public ResponseEntity<?> getAllPremium(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);
            return ResponseEntity.ok(premiumRepository.findAll());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/premiums/{id}")
    public ResponseEntity<?> getPremiumById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            validateToken(token);
            return premiumRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/premiums")
    public ResponseEntity<?> createPremium(@RequestHeader("Authorization") String token,
            @RequestBody Premium premium) {
        try {
            validateToken(token);
            premium.setCreatedAt(LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(premiumRepository.save(premium));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/premiums/{id}")
    public ResponseEntity<?> updatePremium(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Premium updated) {
        try {
            validateToken(token);
            return premiumRepository.findById(id)
                    .map(p -> {
                        p.setName(updated.getName());
                        p.setDescription(updated.getDescription());
                        p.setPrice(updated.getPrice());
                        p.setDurationDays(updated.getDurationDays());
                        return ResponseEntity.ok(premiumRepository.save(p));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/premiums/{id}")
    public ResponseEntity<?> deletePremium(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            validateToken(token);
            premiumRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/premiums/search")
    public ResponseEntity<?> searchPremium(@RequestHeader("Authorization") String token,
            @RequestParam String name) {
        try {
            validateToken(token);
            return ResponseEntity.ok(premiumRepository.findByNameContainingIgnoreCase(name));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ===== CRUD Tag =====

    @GetMapping("/tags")
    public ResponseEntity<?> getAllTags(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);
            List<tag> tags = tagRepository.findAll();

            // Tạo danh sách map chứa id, name và index (stt)
            List<Map<String, Object>> simplifiedTags = new ArrayList<>();
            int index = 1;
            for (tag t : tags) {
                Map<String, Object> map = new HashMap<>();
                map.put("stt", index++);
                map.put("id", t.getId());
                map.put("name", t.getName());
                simplifiedTags.add(map);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("count", simplifiedTags.size());
            response.put("data", simplifiedTags);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/tags/{id}")
    public ResponseEntity<?> getTagById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            validateToken(token);
            return tagRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/tags")
    public ResponseEntity<?> createTag(@RequestHeader("Authorization") String token, @RequestBody tag tag) {
        try {
            validateToken(token);
            return ResponseEntity.status(HttpStatus.CREATED).body(tagRepository.save(tag));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/tags/{id}")
    public ResponseEntity<?> updateTag(@RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody tag updated) {
        try {
            validateToken(token);
            return tagRepository.findById(id)
                    .map(t -> {
                        t.setName(updated.getName());
                        return ResponseEntity.ok(tagRepository.save(t));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<?> deleteTag(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            validateToken(token);
            tagRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/tags/search")
    public ResponseEntity<?> searchTag(@RequestHeader("Authorization") String token,
            @RequestParam String name) {
        try {
            validateToken(token);
            return ResponseEntity.ok(tagRepository.findByNameContainingIgnoreCase(name));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ===== Login =====
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String pass = loginData.get("pass");

        AdminAccount user = adminRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!new BCryptPasswordEncoder().matches(pass, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = JwtUtil.generateTokenFromUserId(user.getId());

        return ResponseEntity.ok(Map.of("token", token));
    }
}
