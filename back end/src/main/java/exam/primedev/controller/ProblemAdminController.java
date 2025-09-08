package exam.primedev.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import exam.primedev.dto.ProblemCreateRequest;
import exam.primedev.entity.Company;
import exam.primedev.entity.Premium;
import exam.primedev.entity.Problem;
import exam.primedev.entity.ProblemLanguage;
import exam.primedev.entity.ProblemPremium;
import exam.primedev.entity.TestCase;
import exam.primedev.entity.TestcaseDetail;
import exam.primedev.entity.tag;
import exam.primedev.repository.CompanyRepository;
import exam.primedev.repository.PremiumRepository;
import exam.primedev.repository.ProblemLanguageRepository;
import exam.primedev.repository.ProblemPremiumRepository;
import exam.primedev.repository.ProblemRepository;
import exam.primedev.repository.TagRepository;
import exam.primedev.repository.TestCaseDetailRepository;
import exam.primedev.repository.TestCaseRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/admin/problems")
public class ProblemAdminController {

    @Autowired
    private ProblemRepository problemRepo;
    @Autowired
    private TagRepository tagRepo;
    @Autowired
    private CompanyRepository companyRepo;
    @Autowired
    private PremiumRepository premiumRepo;
    @Autowired
    private ProblemPremiumRepository problemPremiumRepo;
    @Autowired
    private TestCaseRepository testcaseRepo;
    @Autowired
    private TestCaseDetailRepository testcaseDetailRepo;
    @Autowired
    private ProblemLanguageRepository problemLanguageRepo;

    @GetMapping
    public ResponseEntity<?> getAllProblems(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            List<Problem> problems = problemRepo.findAll();

            // Lọc chỉ lấy problem active == true
            List<Problem> activeProblems = problems.stream()
                    .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                    .toList();

            List<ProblemCreateRequest> response = new ArrayList<>();

            for (Problem p : activeProblems) {
                ProblemCreateRequest dto = new ProblemCreateRequest();
                dto.setId(p.getId());
                dto.setTitle(p.getTitle());
                dto.setSlug(p.getSlug());
                dto.setDescription(p.getDescription());
                dto.setHint(p.getHint());
                dto.setDifficulty(p.getDifficulty());
                dto.setIsActive(p.getIsActive());
                dto.setAvailablecode(p.getAvailablecode());

                // Tags
                List<ProblemCreateRequest.IdNameDTO> tagList = p.getTags().stream()
                        .map(tag -> new ProblemCreateRequest.IdNameDTO(
                                tag.getId().longValue(),
                                tag.getName()))
                        .toList();
                dto.setTagIds(tagList);

                // Companies
                List<ProblemCreateRequest.IdNameDTO> companyList = p.getCompanies().stream()
                        .map(company -> new ProblemCreateRequest.IdNameDTO(
                                company.getId().longValue(),
                                company.getName()))
                        .toList();
                dto.setCompanyIds(companyList);

                // Premiums
                List<ProblemCreateRequest.IdNameDTO> premiumList = p.getProblemPremiums().stream()
                        .map(pp -> new ProblemCreateRequest.IdNameDTO(
                                pp.getPremium().getId(),
                                pp.getPremium().getName()))
                        .toList();
                dto.setPremiumIds(premiumList);

                // Testcases
                List<ProblemCreateRequest.TestcaseDTO> testcaseDTOs = p.getTestcases().stream()
                        .map(tc -> {
                            ProblemCreateRequest.TestcaseDTO tcDTO = new ProblemCreateRequest.TestcaseDTO();
                            tcDTO.setExpectedOutput(tc.getExpectedOutput());
                            tcDTO.setIsPublic(tc.getIsPublic());

                            List<ProblemCreateRequest.TestcaseDetailDTO> detailDTOs = tc.getDetails().stream()
                                    .map(d -> {
                                        ProblemCreateRequest.TestcaseDetailDTO dDTO = new ProblemCreateRequest.TestcaseDetailDTO();
                                        dDTO.setVariableName(d.getVariableName());
                                        dDTO.setVariableValue(d.getVariableValue());
                                        dDTO.setTypeInput(d.getTypeInput());
                                        return dDTO;
                                    })
                                    .toList();
                            tcDTO.setDetails(detailDTOs);

                            return tcDTO;
                        })
                        .toList();
                dto.setTestcases(testcaseDTOs);

                // Lấy ProblemLanguage theo problemId
                List<ProblemLanguage> plList = problemLanguageRepo.findByProblemId(p.getId());

                // Gán code theo languageId
                for (ProblemLanguage pl : plList) {
                    switch (pl.getLanguageId()) {
                        case 1: // JS
                            dto.setProblemLanguageJs(pl.getcodeStart());
                            break;
                        case 2: // Java
                            dto.setProblemLanguageJa(pl.getcodeStart());
                            break;
                        case 3: // Python
                            dto.setProblemLanguagePy(pl.getcodeStart());
                            break;
                    }
                }

                response.add(dto);
            }

            return ResponseEntity.ok(Map.of(
                    "count", response.size(),
                    "data", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProblem(
            @RequestHeader("Authorization") String token,
            @RequestBody ProblemCreateRequest req) {

        try {
            // Kiểm tra token
            if (!validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token không hợp lệ hoặc đã hết hạn"));
            }

            // Tạo problem mới
            Problem problem = new Problem();
            problem.setTitle(req.getTitle());
            problem.setSlug(req.getSlug());
            problem.setDescription(req.getDescription());
            problem.setHint(req.getHint());
            problem.setDifficulty(req.getDifficulty());
            problem.setIsActive(req.getIsActive());
            problem.setAvailablecode(req.getAvailablecode());
            problem.setCreatedAt(LocalDateTime.now());
            problem.setUpdatedAt(LocalDateTime.now());

            // saveProblemLanguage(problem.getId(), 1, req.getProblemLanguageJs()); // JS id=1
            // saveProblemLanguage(problem.getId(), 2, req.getProblemLanguageJa()); // Java id=2
            // saveProblemLanguage(problem.getId(), 3, req.getProblemLanguagePy()); // Python id=3

            // Liên kết Tags
            if (req.getTagIds() != null && !req.getTagIds().isEmpty()) {
                List<Long> tagIdList = req.getTagIds().stream()
                        .map(ProblemCreateRequest.IdNameDTO::getId)
                        .toList();
                Set<tag> tags = new HashSet<>(tagRepo.findAllById(tagIdList));
                problem.setTags(tags);
            }

            // Liên kết Companies
            if (req.getCompanyIds() != null && !req.getCompanyIds().isEmpty()) {
                List<Integer> companyIdList = req.getCompanyIds().stream()
                        .map(dto -> dto.getId().intValue())
                        .toList();

                // Lấy các company từ DB
                Set<Company> companies = new HashSet<>(companyRepo.findAllById(companyIdList));

                // Lưu problem trước để có ID
                problem = problemRepo.save(problem);

                // Thêm problem vào mỗi company
                for (Company c : companies) {
                    c.getProblems().add(problem);
                }

                // Gán lại companies cho problem (tùy chọn nhưng tốt)
                problem.setCompanies(companies);

                // Lưu các company để cập nhật bảng join
                companyRepo.saveAll(companies);
            }

            // Lưu problem để có ID
            problem = problemRepo.save(problem);
            saveProblemLanguage(problem.getId(), 1, req.getProblemLanguageJs()); // JS id=1
            saveProblemLanguage(problem.getId(), 2, req.getProblemLanguageJa()); // Java id=2
            saveProblemLanguage(problem.getId(), 3, req.getProblemLanguagePy()); // Python id=3
            // Liên kết Premiums
            if (req.getPremiumIds() != null && !req.getPremiumIds().isEmpty()) {
                List<Long> premiumIdList = req.getPremiumIds().stream()
                        .map(ProblemCreateRequest.IdNameDTO::getId)
                        .toList();
                List<Premium> premiums = premiumRepo.findAllById(premiumIdList);
                for (Premium premium : premiums) {
                    ProblemPremium pp = new ProblemPremium();
                    pp.setProblem(problem);
                    pp.setPremium(premium);
                    problemPremiumRepo.save(pp);
                }
            }

            // Thêm Testcases & Details
            if (req.getTestcases() != null && !req.getTestcases().isEmpty()) {
                for (ProblemCreateRequest.TestcaseDTO tcDto : req.getTestcases()) {
                    TestCase tc = new TestCase();
                    tc.setProblem(problem);
                    tc.setExpectedOutput(tcDto.getExpectedOutput());
                    tc.setIsPublic(tcDto.getIsPublic() != null ? tcDto.getIsPublic() : false);
                    tc = testcaseRepo.save(tc);

                    if (tcDto.getDetails() != null && !tcDto.getDetails().isEmpty()) {
                        for (ProblemCreateRequest.TestcaseDetailDTO dDto : tcDto.getDetails()) {
                            TestcaseDetail detail = new TestcaseDetail();
                            detail.setTestcase(tc);
                            detail.setVariableName(dDto.getVariableName());
                            detail.setVariableValue(dDto.getVariableValue());
                            detail.setTypeInput(dDto.getTypeInput());
                            testcaseDetailRepo.save(detail);
                        }
                    }
                }
            }

            return ResponseEntity.ok(Map.of(
                    "message", "Tạo Problem thành công",
                    "problemId", problem.getId()));

        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi chi tiết
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi server khi tạo problem", "error", e.getMessage()));
        }
    }

    private void saveProblemLanguage(Long problemId, Integer languageId, String codeStart) {
        if (codeStart == null)
            return;

        ProblemLanguage pl = new ProblemLanguage();
        pl.setProblemId(problemId);
        pl.setLanguageId(languageId);
        pl.setcodeStart(codeStart);
        problemLanguageRepo.save(pl);
    }

    @Transactional
    @PutMapping("/problems/{id}")
    public ResponseEntity<?> updateProblem(
            @PathVariable Long id,
            @RequestBody ProblemCreateRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            Problem problem = problemRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Problem not found"));

            // ==== Gán lại các trường cơ bản ====
            problem.setTitle(request.getTitle());
            problem.setSlug(request.getSlug());
            problem.setDescription(request.getDescription());
            problem.setHint(request.getHint());
            problem.setDifficulty(request.getDifficulty());
            problem.setIsActive(request.getIsActive());
            problem.setAvailablecode(request.getAvailablecode());
            problemLanguageRepo.deleteByProblemId(problem.getId());

            // Tạo mới 3 bản ghi ProblemLanguage
            saveProblemLanguage(problem.getId(), 1, request.getProblemLanguageJs());
            saveProblemLanguage(problem.getId(), 2, request.getProblemLanguageJa());
            saveProblemLanguage(problem.getId(), 3, request.getProblemLanguagePy());
            // ==== Xử lý Tags ====
            problem.getTags().clear();
            if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
                List<Long> tagIdList = request.getTagIds().stream()
                        .map(ProblemCreateRequest.IdNameDTO::getId)
                        .toList();
                List<tag> tags = tagRepo.findAllById(tagIdList);
                problem.getTags().addAll(tags);
            }

            // ==== Xử lý Companies ====
            problem.getCompanies().clear();
            if (request.getCompanyIds() != null && !request.getCompanyIds().isEmpty()) {
                List<Integer> companyIdList = request.getCompanyIds().stream()
                        .map(dto -> dto.getId().intValue())
                        .toList();

                // Lấy các company từ DB
                Set<Company> companies = new HashSet<>(companyRepo.findAllById(companyIdList));

                // Lưu problem trước để có ID
                problem = problemRepo.save(problem);

                // Thêm problem vào mỗi company
                for (Company c : companies) {
                    c.getProblems().add(problem);
                }

                // Gán lại companies cho problem (tùy chọn nhưng tốt)
                problem.setCompanies(companies);

                // Lưu các company để cập nhật bảng join
                companyRepo.saveAll(companies);
            }
            // ==== Xử lý Premiums ====
            problem.getProblemPremiums().clear();
            if (request.getPremiumIds() != null && !request.getPremiumIds().isEmpty()) {
                List<Long> premiumIdList = request.getPremiumIds().stream()
                        .map(ProblemCreateRequest.IdNameDTO::getId)
                        .toList();
                List<Premium> premiums = premiumRepo.findAllById(premiumIdList);
                for (Premium premium : premiums) {
                    ProblemPremium pp = new ProblemPremium();
                    pp.setProblem(problem);
                    pp.setPremium(premium);
                    problem.getProblemPremiums().add(pp);
                }
            }

            // ==== Xử lý Testcases ====
            problem.getTestcases().clear();
            if (request.getTestcases() != null && !request.getTestcases().isEmpty()) {
                for (ProblemCreateRequest.TestcaseDTO tcDto : request.getTestcases()) {
                    TestCase testcase = new TestCase();
                    testcase.setExpectedOutput(tcDto.getExpectedOutput());
                    testcase.setIsPublic(tcDto.getIsPublic());
                    testcase.setProblem(problem);

                    // details
                    if (tcDto.getDetails() != null && !tcDto.getDetails().isEmpty()) {
                        for (ProblemCreateRequest.TestcaseDetailDTO dtDto : tcDto.getDetails()) {
                            TestcaseDetail detail = new TestcaseDetail();
                            detail.setVariableName(dtDto.getVariableName());
                            detail.setVariableValue(dtDto.getVariableValue());
                            detail.setTypeInput(dtDto.getTypeInput());
                            detail.setTestcase(testcase);
                            testcase.getDetails().add(detail);
                        }
                    }

                    problem.getTestcases().add(testcase);
                }
            }

            problemRepo.save(problem);

            return ResponseEntity.ok(Map.of("message", "Problem updated successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/problems/{id}/deactivate")
    public ResponseEntity<?> deactivateProblem(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        try {
            // Validate token (giả sử bạn có hàm này)
            validateToken(token);
            Problem problem = problemRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Problem không tồn tại"));

            problem.setIsActive(false); // set active thành false
            problemRepo.save(problem);

            return ResponseEntity.ok(Map.of("message", "Problem đã được deactivate thành công"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

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

}
