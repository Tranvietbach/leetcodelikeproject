package exam.primedev.controller;

import exam.primedev.entity.Company;
import exam.primedev.entity.Language;
import exam.primedev.entity.Problem;
import exam.primedev.repository.CompanyRepository;
import exam.primedev.repository.LanguageRepository;
import exam.primedev.repository.ProblemRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/company")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepo;

    @Autowired
    private ProblemRepository problemRepo;


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

    // GET tất cả company, trả kèm danh sách problems (id + title)
    @GetMapping
    public ResponseEntity<?> getAllCompanies(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            List<Company> companies = companyRepo.findAll();

            List<Map<String, Object>> res = new ArrayList<>();
            for (Company c : companies) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId());
                map.put("name", c.getName());
                map.put("description", c.getDescription());
                map.put("createdAt", c.getCreatedAt());
                map.put("updatedAt", c.getUpdatedAt());

                List<Map<String, Object>> problems = c.getProblems().stream()
                    .map(p -> Map.of(
                        "id", (Object) p.getId(),
                        "title", (Object) p.getTitle()
                    ))
                    .collect(Collectors.toList());

                map.put("problems", problems);
                res.add(map);
            }

            return ResponseEntity.ok(res);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // GET danh sách problems chỉ id và title (dùng cho dropdown/tag frontend)
    @GetMapping("/problems")
    public ResponseEntity<?> getProblemsSimple(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            List<Problem> problems = problemRepo.findAll();

            List<Map<String, Object>> res = problems.stream()
                    .map(p -> Map.of("id", (Object) p.getId(), "title", (Object) p.getTitle()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(res);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // CREATE company
    @PostMapping
    public ResponseEntity<?> createCompany(
            @RequestHeader("Authorization") String token,
            @RequestBody CompanyCreateRequest req) {
        try {
            validateToken(token);

            Company company = new Company();
            company.setName(req.getName());
            company.setDescription(req.getDescription());
            company.setCreatedAt(LocalDateTime.now());
            company.setUpdatedAt(LocalDateTime.now());

            if (req.getProblemIds() != null && !req.getProblemIds().isEmpty()) {
                List<Long> longIds = req.getProblemIds().stream()
                        .map(Integer::longValue)
                        .collect(Collectors.toList());
                Set<Problem> problems = new HashSet<>(problemRepo.findAllById(longIds));
                company.setProblems(problems);
            }

            companyRepo.save(company);

            return ResponseEntity.ok(Map.of("message", "Tạo Company thành công", "id", company.getId()));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // UPDATE company
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token,
            @RequestBody CompanyCreateRequest req) {
        try {
            validateToken(token);

            Company company = companyRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Company không tồn tại"));

            company.setName(req.getName());
            company.setDescription(req.getDescription());
            company.setUpdatedAt(LocalDateTime.now());

            company.getProblems().clear();
            if (req.getProblemIds() != null && !req.getProblemIds().isEmpty()) {
                List<Long> longIds = req.getProblemIds().stream()
                        .map(Integer::longValue)
                        .collect(Collectors.toList());
                Set<Problem> problems = new HashSet<>(problemRepo.findAllById(longIds));
                company.setProblems(problems);
            }

            companyRepo.save(company);

            return ResponseEntity.ok(Map.of("message", "Cập nhật Company thành công"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE company
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            companyRepo.deleteById(id);

            return ResponseEntity.ok(Map.of("message", "Xóa Company thành công"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    // DTO class dùng cho tạo/cập nhật company
    public static class CompanyCreateRequest {
        private String name;
        private String description;
        private List<Integer> problemIds;

        public CompanyCreateRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public List<Integer> getProblemIds() { return problemIds; }
        public void setProblemIds(List<Integer> problemIds) { this.problemIds = problemIds; }
    }
}
