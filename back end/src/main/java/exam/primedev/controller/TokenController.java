package exam.primedev.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import exam.primedev.dto.AvatarUploadDto;
import exam.primedev.dto.CodeRequest;
import exam.primedev.dto.CompanyDTO;
import exam.primedev.dto.CustomTestRequest;
import exam.primedev.dto.DiscussionThreadRequest;
import exam.primedev.dto.LoginRequest;
import exam.primedev.dto.PremiumDTO;
import exam.primedev.dto.ProblemDetailResponse;
import exam.primedev.dto.ProblemFilterRequest;
import exam.primedev.dto.ProblemLanguageDTO;
import exam.primedev.dto.RegisterRequest;
import exam.primedev.dto.TagDTO;
import exam.primedev.dto.TestCaseDTO;
import exam.primedev.dto.TestcaseDetailDTO;
import exam.primedev.dto.TokenRequest;
import exam.primedev.dto.TokenRequestCompany;
import exam.primedev.dto.UpdateUserProfileRequest;
import exam.primedev.entity.Badge;
import exam.primedev.entity.Company;
import exam.primedev.entity.Discuss;
import exam.primedev.entity.DiscussionThread;
import exam.primedev.entity.Event;
import exam.primedev.entity.Language;
import exam.primedev.entity.Premium;
import exam.primedev.entity.Problem;
import exam.primedev.entity.ProblemLanguage;
import exam.primedev.entity.ProblemPremium;
import exam.primedev.entity.Ranking;
import exam.primedev.entity.Submission;
import exam.primedev.entity.TestCase;
import exam.primedev.entity.TestcaseDetail;
import exam.primedev.entity.User;
import exam.primedev.entity.UserProfile;
import exam.primedev.entity.UserRole;
import exam.primedev.entity.tag;
import exam.primedev.repository.CompanyRepository;
import exam.primedev.repository.DiscussionThreadRepository;
import exam.primedev.repository.EventRepository;
import exam.primedev.repository.LanguageRepository;
import exam.primedev.repository.ProblemLanguageRepository;
import exam.primedev.repository.ProblemPremiumRepository;
import exam.primedev.repository.ProblemRepository;
import exam.primedev.repository.RankingRepository;
import exam.primedev.repository.SubmissionRepository;
import exam.primedev.repository.TagRepository;
import exam.primedev.repository.TestCaseDetailRepository;
import exam.primedev.repository.TestCaseRepository;
import exam.primedev.repository.UserProfileRepository;
import exam.primedev.repository.UserRepository;
import exam.primedev.service.AuthService;
import io.jsonwebtoken.ExpiredJwtException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")

public class TokenController {
    @Autowired
    private RankingRepository rankingRepository;
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository; // Inject UserRepository vào controller
    @Autowired
    private ProblemRepository problemRepository; // Inject UserRepository vào controller
    @Autowired
    private TestCaseRepository testCaseRepository; // Inject UserRepository vào controller
    @Autowired
    private TestCaseDetailRepository testCaseDetailRepository; // Inject UserRepository vào controller
    @Autowired
    private ProblemLanguageRepository problemLanguageRepository; // Inject UserRepository vào controller
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private DiscussionThreadRepository threadRepo;

    @Autowired
    private ProblemPremiumRepository problemPremiumRepository;

    @GetMapping("/check-email-status")
    public ResponseEntity<Map<String, Object>> checkEmailStatus(@RequestHeader("Authorization") String token) {
        // 1. Lấy userId từ token
        Long currentUserId = JwtUtil.extractUserIdFromToken(token);

        // 2. Lấy user từ DB
        Optional<User> userOpt = userRepository.findById(currentUserId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();

        // 3. Kiểm tra statusmail
        boolean isVerified = user.isStatusmail();

        return ResponseEntity.ok(Map.of(
                "userId", currentUserId,
                "statusmail", isVerified
        ));
    }


    // Lấy tất cả thread
    @GetMapping
    public List<DiscussionThread> getAll() {
        return threadRepo.findAll();
    }

    // Lấy thread theo ID
    @GetMapping("/Discussion/{id}")
    public Map<String, Object> getById(@PathVariable Integer id) {
        DiscussionThread thread = threadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", thread.getId());
        response.put("content", thread.getContent());
        response.put("created_at", thread.getCreatedAt());

        return response;
    }

    @GetMapping("/Discussion")
    public List<Map<String, Object>> getAllDiscussionWithUser() {
        List<DiscussionThread> threads = threadRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (DiscussionThread thread : threads) {
            Map<String, Object> map = new HashMap<>();
            map.put("threadId", thread.getId());
            map.put("title", thread.getTitle());
            map.put("content", thread.getContent());
            map.put("createdAt", thread.getCreatedAt());

            if (thread.getUser() != null) {
                map.put("userId", thread.getUser().getId());
                map.put("userName", thread.getUser().getUsername()); // hoặc .getFullName()
            }

            result.add(map);
        }

        return result;
    }

    // Tạo mới thread
    @PostMapping("/Discussion")
    public DiscussionThread create(@RequestBody DiscussionThreadRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        DiscussionThread thread = new DiscussionThread();
        thread.setTitle(request.getTitle());
        thread.setContent(request.getContent());
        thread.setUser(user);

        return threadRepo.save(thread);
    }

    // Cập nhật thread
    @PutMapping("/Discussion/{id}")
    public DiscussionThread update(@PathVariable Integer id, @RequestBody DiscussionThreadRequest request) {
        DiscussionThread thread = threadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        thread.setTitle(request.getTitle());
        thread.setContent(request.getContent());
        return threadRepo.save(thread);
    }

    // Xoá thread
    @DeleteMapping("/Discussion/{id}")
    public void delete(@PathVariable Integer id) {
        if (!threadRepo.existsById(id)) {
            throw new RuntimeException("Thread not found");
        }
        threadRepo.deleteById(id);
    }

    @GetMapping("/users/{token}")
    public ResponseEntity<?> getUserById(@PathVariable String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found with id: " + userId));
        }

        User user = optionalUser.get();
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("statusmail", user.isStatusmail());

        // UserProfile
        if (user.getUserProfile() != null) {
            Map<String, Object> profileMap = new HashMap<>();
            profileMap.put("fullName", user.getUserProfile().getFullName());
            profileMap.put("country", user.getUserProfile().getCountry());
            profileMap.put("bio", user.getUserProfile().getBio());
            profileMap.put("github", user.getUserProfile().getGithubUrl());
            profileMap.put("avatar", user.getUserProfile().getAvatarUrl());
            map.put("profile", profileMap);
        }

        // Roles
        Set<String> roles = user.getRoles().stream()
                .map(UserRole::getRoleName)
                .collect(Collectors.toSet());
        map.put("roles", roles);

        // Submissions
        List<Map<String, Object>> submissions = user.getSubmissions().stream().map(sub -> {
            Map<String, Object> subMap = new HashMap<>();
            subMap.put("problemId", sub.getProblem() != null ? sub.getProblem().getId() : null);
            subMap.put("status", sub.getStatus() != null ? sub.getStatus().name() : null);
            subMap.put("statusDetail", sub.getStatusDetail() != null ? sub.getStatusDetail().name() : null);
            subMap.put("runtime", sub.getRuntime());
            subMap.put("memory", sub.getMemory());
            subMap.put("submittedAt", sub.getSubmittedAt());
            return subMap;
        }).collect(Collectors.toList());
        map.put("submissions", submissions);

        // Progress: Solved/Total
        Set<Long> solvedProblems = user.getSubmissions().stream()
                .filter(sub -> sub.getProblem() != null)
                .map(sub -> sub.getProblem().getId())
                .collect(Collectors.toSet());

        long totalProblems = problemRepository.count(); // bạn cần autowire problemRepository

        Map<String, Object> progress = new HashMap<>();
        progress.put("solved", solvedProblems.size());
        progress.put("total", totalProblems);
        map.put("progress", progress);

        List<Map<String, Object>> badges = user.getUserBadges().stream()
                .map(userBadge -> {
                    Badge badge = userBadge.getBadge();
                    Map<String, Object> badgeMap = new HashMap<>();
                    badgeMap.put("id", badge.getId());
                    badgeMap.put("name", badge.getName());
                    badgeMap.put("description", badge.getDescription());
                    badgeMap.put("awardedAt", userBadge.getAwardedAt());
                    return badgeMap;
                }).collect(Collectors.toList());

        map.put("badges", badges);
        Optional<Ranking> optionalRanking = rankingRepository.findById(user.getId());
        if (optionalRanking.isPresent()) {
            Ranking ranking = optionalRanking.get();
            Map<String, Object> rankingMap = new HashMap<>();
            rankingMap.put("rank", ranking.getRank());
            rankingMap.put("score", ranking.getScore());
            rankingMap.put("updatedAt", ranking.getUpdatedAt());
            map.put("ranking", rankingMap);
        }

        return ResponseEntity.ok(map);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.registerUser(request);
            return ResponseEntity.ok("Đăng ký thành công");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.username)
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));

        boolean passwordMatch = new BCryptPasswordEncoder().matches(loginRequest.password, user.getPasswordHash());

        if (!passwordMatch) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Mật khẩu không đúng!");
            return ResponseEntity.badRequest().body(error);
        }

        String token = JwtUtil.generateTokenFromUserId(user.getId());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test")
    public ResponseEntity<String> test() {

        return ResponseEntity.status(200).body("Token không hợp lệ.");
    }

    @GetMapping("/problems")
    public ResponseEntity<List<Map<String, Object>>> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();
        List<Map<String, Object>> resultList = new ArrayList<>();

        for (Problem problem : problems) {
            Map<String, Object> result = new HashMap<>();
            result.put("problemId", problem.getId());
            result.put("title", problem.getTitle());
            result.put("description", problem.getDescription());
            result.put("difficulty", problem.getDifficulty());

            // Starter codes
            List<Map<String, Object>> starterCodes = new ArrayList<>();
            for (ProblemLanguage pl : problemLanguageRepository.findByProblemId(problem.getId())) {
                Map<String, Object> codeMap = new HashMap<>();
                codeMap.put("languageId", pl.getLanguageId());
                codeMap.put("starterCode", pl.getcodeStart());
                starterCodes.add(codeMap);
            }
            result.put("starterCodes", starterCodes);

            // Test cases
            List<Map<String, Object>> testCaseList = new ArrayList<>();
            for (TestCase tc : testCaseRepository.findByProblemId(problem.getId())) {
                Map<String, Object> tcMap = new HashMap<>();
                tcMap.put("testCaseId", tc.getId());
                tcMap.put("expectedOutput", tc.getExpectedOutput());
                tcMap.put("isPublic", tc.getIsPublic());

                List<Map<String, String>> detailList = new ArrayList<>();
                for (TestcaseDetail detail : testCaseDetailRepository.findByTestcase(tc)) {
                    Map<String, String> d = new HashMap<>();
                    d.put("variableName", detail.getVariableName());
                    d.put("variableValue", detail.getVariableValue());
                    detailList.add(d);
                }

                tcMap.put("details", detailList);
                testCaseList.add(tcMap);
            }
            result.put("testCases", testCaseList);

            resultList.add(result);
        }

        return ResponseEntity.ok(resultList);
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Map<String, Object>>> getAllTags() {
        List<tag> tags = tagRepository.findAll();

        // Chỉ lấy id và name, tránh trả về cả mối quan hệ với Problem
        List<Map<String, Object>> result = tags.stream().map(tag -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", tag.getId());
            map.put("name", tag.getName());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/allproblems")
    public ResponseEntity<List<ProblemDetailResponse>> getFilteredProblems(
            @RequestBody ProblemFilterRequest filter) {
        List<Problem> problems = problemRepository.findAll();

        problems = problems.stream()
                .filter(p -> {
                                if (p.getIsActive() == null || !p.getIsActive()) {
                return false;
            }
                    if (filter.getTitle() != null && !filter.getTitle().isEmpty()) {
                        if (!p.getTitle().toLowerCase().contains(filter.getTitle().toLowerCase())) {
                            return false;
                        }
                    }
                    if (filter.getStartId() != null) {
                        if (p.getId() < filter.getStartId()) {
                            return false;
                        }
                    }
                    if (filter.getEndId() != null) {
                        if (p.getId() > filter.getEndId()) {
                            return false;
                        }
                    }
                    if (filter.getDifficulty() != null) {
                        if (p.getDifficulty() < filter.getDifficulty()) {
                            return false;
                        }
                    }
                    // ✅ Lọc theo tag
                    if (filter.getTags() != null && !filter.getTags().isEmpty()) {
                        Set<Long> selectedTagIds = filter.getTags().stream()
                                .map(tagId -> tagId.longValue())
                                .collect(Collectors.toSet());
                        Set<Long> problemTagIds = p.getTags().stream()
                                .map(tag -> tag.getId())
                                .collect(Collectors.toSet());

                        // Nếu KHÔNG có bất kỳ tag nào khớp
                        if (Collections.disjoint(problemTagIds, selectedTagIds)) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());

        System.out
                .println("Filter received: title=" + filter.getTitle() + ", startId=" + filter.getStartId() + ", endId="
                        + filter.getEndId() + ", difficulty=" + filter.getDifficulty() + ", tags=" + filter.getTags());
        // Map to DTO
        List<ProblemDetailResponse> responses = problems.stream().map(problem -> {
            ProblemDetailResponse dto = new ProblemDetailResponse();
            dto.setId(problem.getId());
            dto.setTitle(problem.getTitle());
            dto.setDescription(problem.getDescription());
            dto.setDifficulty(problem.getDifficulty());

            // 1. Languages
            List<ProblemLanguage> problemLanguages = problemLanguageRepository.findByProblemId(problem.getId());
            List<ProblemLanguageDTO> langs = problemLanguages.stream().map(pl -> {
                ProblemLanguageDTO langDto = new ProblemLanguageDTO();
                langDto.setLanguageId(pl.getLanguageId());
                langDto.setCodeStart(pl.getcodeStart());
                return langDto;
            }).collect(Collectors.toList());
            dto.setLanguages(langs);

            // 2. Testcases + Inputs
            List<TestCase> testcases = testCaseRepository.findByProblemId(problem.getId());
            List<TestCaseDTO> testcaseDTOList = new ArrayList<>();
            for (TestCase tc : testcases) {
                TestCaseDTO tcDto = new TestCaseDTO();
                tcDto.setId(tc.getId());
                tcDto.setExpectedOutput(tc.getExpectedOutput());
                tcDto.setExplanation(tc.getExplanation());
                tcDto.setIsPublic(tc.getIsPublic());

                List<TestcaseDetail> details = testCaseDetailRepository.findByTestcaseId(tc.getId());
                List<TestcaseDetailDTO> detailDTOs = details.stream().map(detail -> {
                    TestcaseDetailDTO dDto = new TestcaseDetailDTO();
                    dDto.setVariableName(detail.getVariableName());
                    dDto.setVariableValue(detail.getVariableValue());
                    return dDto;
                }).collect(Collectors.toList());

                tcDto.setInputs(detailDTOs);
                testcaseDTOList.add(tcDto);
            }
            dto.setTestcases(testcaseDTOList);

            // 3. Tags
            List<TagDTO> tagDTOList = problem.getTags().stream().map(tag -> {
                TagDTO tagDTO = new TagDTO();
                tagDTO.setId(tag.getId());
                tagDTO.setName(tag.getName());
                return tagDTO;
            }).collect(Collectors.toList());
            dto.setTags(tagDTOList);

            // 4. Companies
            List<CompanyDTO> companyDTOList = problem.getCompanies().stream().map(company -> {
                CompanyDTO dtoCompany = new CompanyDTO();
                dtoCompany.setId(company.getId());
                dtoCompany.setName(company.getName());
                dtoCompany.setDescription(company.getDescription());
                return dtoCompany;
            }).collect(Collectors.toList());
            dto.setCompanies(companyDTOList);

            List<ProblemPremium> premiumLinks = problemPremiumRepository.findByProblemId(problem.getId());
            List<PremiumDTO> premiumDTOs = premiumLinks.stream().map(link -> {
                Premium premium = link.getPremium();
                PremiumDTO dtoPremium = new PremiumDTO();
                dtoPremium.setId(premium.getId());
                dtoPremium.setName(premium.getName());
                dtoPremium.setDescription(premium.getDescription());
                dtoPremium.setPrice(premium.getPrice());
                dtoPremium.setDurationDays(premium.getDurationDays());
                return dtoPremium;
            }).collect(Collectors.toList());
            dto.setPremiums(premiumDTOs);

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ProblemDetailResponse> getProblemDetails(@PathVariable Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        ProblemDetailResponse dto = new ProblemDetailResponse();
        dto.setId(problem.getId());
        dto.setTitle(problem.getTitle());
        dto.setDescription(problem.getDescription());
        dto.setDifficulty(problem.getDifficulty());
        dto.setAvailablecode(problem.getAvailablecode());
        dto.setSlug(problem.getSlug());
        dto.setHint(problem.getHint()); // Set hint if available
        // Load problem languages
        List<ProblemLanguage> problemLanguages = problemLanguageRepository.findByProblemId(id);
        List<ProblemLanguageDTO> langs = problemLanguages.stream().map(pl -> {
            ProblemLanguageDTO langDto = new ProblemLanguageDTO();
            langDto.setLanguageId(pl.getLanguageId());
            langDto.setCodeStart(pl.getcodeStart());
            return langDto;
        }).collect(Collectors.toList());
        dto.setLanguages(langs);

        // Load testcases
        List<TestCase> testcases = testCaseRepository.findByProblemId(problem.getId());
        List<TestCaseDTO> testcaseDTOList = new ArrayList<>();
        for (TestCase tc : testcases) {
            TestCaseDTO tcDto = new TestCaseDTO();
            tcDto.setId(tc.getId());
            tcDto.setExpectedOutput(tc.getExpectedOutput());
            tcDto.setExplanation(tc.getExplanation());
            tcDto.setIsPublic(tc.getIsPublic());

            List<TestcaseDetail> details = testCaseDetailRepository.findByTestcaseId(tc.getId());
            List<TestcaseDetailDTO> detailDTOs = details.stream().map(detail -> {
                TestcaseDetailDTO dDto = new TestcaseDetailDTO();
                dDto.setVariableName(detail.getVariableName());
                dDto.setVariableValue(detail.getVariableValue());
                if (detail.getTypeInput() != null) {
                    dDto.setTypeInput(detail.getTypeInput().toString());
                } else {
                    dDto.setTypeInput("0"); // Mặc định là 0 nếu không có
                }
                return dDto;
            }).collect(Collectors.toList());

            tcDto.setInputs(detailDTOs);
            testcaseDTOList.add(tcDto);
        }
        dto.setTestcases(testcaseDTOList);
        List<TagDTO> tagDTOList = problem.getTags().stream().map(tag -> {
            TagDTO tagDTO = new TagDTO();
            tagDTO.setId(tag.getId());
            tagDTO.setName(tag.getName());
            return tagDTO;
        }).collect(Collectors.toList());

        dto.setTags(tagDTOList);
        List<CompanyDTO> companyDTOList = problem.getCompanies().stream().map(company -> {
            CompanyDTO dtoCompany = new CompanyDTO();
            dtoCompany.setId(company.getId());
            dtoCompany.setName(company.getName());
            dtoCompany.setDescription(company.getDescription());
            return dtoCompany;
        }).collect(Collectors.toList());

        dto.setCompanies(companyDTOList);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/problems/{id}")
    public ResponseEntity<Map<String, Object>> getProblem(@PathVariable Long id) {
        Optional<Problem> optional = problemRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Problem problem = optional.get();

        Map<String, Object> result = new HashMap<>();
        result.put("problemId", problem.getId());
        result.put("title", problem.getTitle());
        result.put("description", problem.getDescription());
        result.put("difficulty", problem.getDifficulty());
        result.put("availablecode", problem.getAvailablecode());

        List<Map<String, Object>> starterCodes = new ArrayList<>();
        for (ProblemLanguage pl : problemLanguageRepository.findByProblemId(problem.getId())) {
            Map<String, Object> map = new HashMap<>();
            map.put("languageId", pl.getLanguageId());
            map.put("starterCode", pl.getcodeStart());
            starterCodes.add(map);
        }
        result.put("starterCodes", starterCodes); // Thay vì chỉ 1 starterCode
        List<Map<String, Object>> testCaseList = new ArrayList<>();
        for (TestCase tc : testCaseRepository.findByProblemId(problem.getId())) {
            Map<String, Object> tcMap = new HashMap<>();
            tcMap.put("testCaseId", tc.getId());
            tcMap.put("expectedOutput", tc.getExpectedOutput());
            tcMap.put("isPublic", tc.getIsPublic());

            List<Map<String, String>> detailList = new ArrayList<>();
            for (TestcaseDetail detail : testCaseDetailRepository.findByTestcase(tc)) {
                Map<String, String> d = new HashMap<>();
                d.put("variableName", detail.getVariableName());
                d.put("variableValue", detail.getVariableValue());
                if (detail.getTypeInput() != null) {
                    d.put("typeInput", detail.getTypeInput().toString());
                } else {
                    d.put("typeInput", "0"); // Mặc định là 0 nếu không có
                }
                detailList.add(d);
            }

            tcMap.put("details", detailList);
            testCaseList.add(tcMap);
        }

        result.put("testCases", testCaseList);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/runCustomTest")
    public ResponseEntity<?> runCustomTest(@RequestBody CustomTestRequest request)
            throws IOException, InterruptedException {

        if (request.getProgrammingLanguageId() != 3) {
            return ResponseEntity.badRequest().body("Only Python is supported in custom test currently.");
        }

        // Viết file code tạm thời
        Path scriptPath = Paths.get("script.py");
        Files.writeString(scriptPath, request.getCode());

        // Chuẩn bị lệnh chạy
        List<String> command = new ArrayList<>();
        command.add("python");
        command.add("runner.py");
        command.add(request.getSlug()); // Sử dụng slug để xác định problem

        for (CustomTestRequest.InputValue input : request.getInputValues()) {
            String value = input.getValue();
            int type = input.getType();

            // Quote chuỗi nếu là string, giữ nguyên nếu là số hoặc mảng
            // if (type == 1) { // String
            // command.add("\"" + value + "\"");
            // } else {
            // command.add(value); // int, arrint, arrstring
            // }
            if (value.startsWith("[") && value.endsWith("]")) {
                command.add("\"" + value + "\"");
            } else {
                command.add(value);
            }
        }

        // Chạy command
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.redirectErrorStream(true);
        Process process = pb.start();

        String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                .lines().collect(Collectors.joining("\n")).trim();

        int exitCode = process.waitFor();

        // Kết quả trả về
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("actualOutput", output);
        result.put("exitCode", exitCode);
        result.put("inputs", request.getInputValues());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/runCode")
    public ResponseEntity<?> runCode(@RequestBody CodeRequest request)
            throws IOException, InterruptedException {
        Long userId = JwtUtil.extractUserIdFromToken(request.getToken());
        // Lấy dữ liệu liên quan
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        Language language = languageRepository.findById((long) request.programmingLanguageId)
                .orElseThrow(() -> new RuntimeException("Language not found"));

        List<Map<String, Object>> results = new ArrayList<>();

        if (request.programmingLanguageId == 3) { // Python
            Path scriptPath = Paths.get("script.py");
            Files.writeString(scriptPath, request.getCode());

            boolean allPassed = true;
            long start = System.nanoTime();

            for (CodeRequest.TestCaseRequest testCaseRequest : request.getTestCases()) {
                List<String> command = new ArrayList<>();
                command.add("python");
                command.add("runner.py");
                command.add(problem.getSlug());

                for (CodeRequest.TestCaseDetailRequest detail : testCaseRequest.getDetails()) {
                    String value = detail.getVariableValue();
                    if (value.startsWith("[") && value.endsWith("]")) {
                        command.add("\"" + value + "\"");
                    } else {
                        command.add(value);
                    }
                }

                ProcessBuilder pb = new ProcessBuilder(command);
                pb.redirectErrorStream(true);

                Process process = pb.start();
                String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                        .lines().collect(Collectors.joining("\n")).trim();

                int exitCode = process.waitFor();
                String expected = testCaseRequest.getExpectedOutput();

                boolean isArray = output.startsWith("[") && expected.startsWith("[")
                        && output.endsWith("]") && expected.endsWith("]");
                boolean passed = isArray
                        ? output.replaceAll("\\s+", "").equals(expected.replaceAll("\\s+", ""))
                        : output.equals(expected);

                allPassed = allPassed && passed;

                Map<String, Object> result = new LinkedHashMap<>();
                result.put("expectedOutput", expected);
                result.put("actualOutput", output);
                result.put("pass", passed);
                result.put("exitCode", exitCode);
                result.put("details", testCaseRequest.getDetails());
                results.add(result);
            }
            if (allPassed) {
                // Lấy hoặc tạo ranking của user
                Ranking ranking = rankingRepository.findByUser(user)
                        .orElseGet(() -> {
                            Ranking r = new Ranking();
                            r.setUser(user);
                            r.setId(user.getId());
                            r.setScore(0f);
                            return r;
                        });

                // Cộng điểm theo độ khó bài
                float newScore = ranking.getScore() + problem.getDifficulty();

                ranking.setScore(newScore);
                ranking.setUpdatedAt(LocalDateTime.now());

                rankingRepository.save(ranking);
            }
            long end = System.nanoTime();
            float runtimeInMs = (end - start) / 1_000_000.0f;

            // Tạo submission dù pass hay fail
            Submission submission = new Submission();
            submission.setUser(user);
            submission.setProblem(problem);
            submission.setLanguage(language);
            submission.setCode(request.getCode());
            submission.setStatusDetail(
                    allPassed ? Submission.StatusDetail.ACCEPTED : Submission.StatusDetail.WRONG_ANSWER);
            submission.setStatus(allPassed ? Submission.Status.PASSED : Submission.Status.FAILED);
            submission.setRuntime(runtimeInMs); // ✅ runtime
            submission.setMemory(null); // ❓ nếu muốn đo RAM thì cần công cụ khác (Java không tự lấy được)
            submission.setSubmittedAt(LocalDateTime.now());

            submissionRepository.save(submission);
        } else if (request.programmingLanguageId == 1) {
            Path scriptPath = Paths.get("script.js");
            try {
                Files.writeString(scriptPath, request.getCode());
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error writing code to file.");
            }

            boolean allPassed = true;
            long start = System.nanoTime();

            for (CodeRequest.TestCaseRequest testCaseRequest : request.getTestCases()) {
                List<String> command = new ArrayList<>();
                command.add("node");
                command.add("cli.js"); // script chính của bạn
                command.add(problem.getSlug());

                for (CodeRequest.TestCaseDetailRequest detail : testCaseRequest.getDetails()) {
                    String value = detail.getVariableValue();
                    if (value.startsWith("[") && value.endsWith("]")) {
                        command.add("\"" + value + "\"");
                    } else {
                        command.add(value);
                    }
                }

                ProcessBuilder pb = new ProcessBuilder(command);
                pb.redirectErrorStream(true);
                try {
                    Process process = pb.start();
                    String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                            .lines().collect(Collectors.joining("\n")).trim();
                    int exitCode = process.waitFor();

                    String expected = testCaseRequest.getExpectedOutput();
                    boolean isArray = output.startsWith("[") && expected.startsWith("[") &&
                            output.endsWith("]") && expected.endsWith("]");
                    boolean passed = isArray
                            ? output.replaceAll("\\s+", "").equals(expected.replaceAll("\\s+", ""))
                            : output.equals(expected);

                    allPassed = allPassed && passed;

                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("expectedOutput", expected);
                    result.put("actualOutput", output);
                    result.put("pass", passed);
                    result.put("exitCode", exitCode);
                    result.put("details", testCaseRequest.getDetails());
                    results.add(result);
                } catch (IOException | InterruptedException ex) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error executing code.");
                }
            }

            if (allPassed) {
                // Lấy hoặc tạo ranking của user
                Ranking ranking = rankingRepository.findByUser(user)
                        .orElseGet(() -> {
                            Ranking r = new Ranking();
                            r.setUser(user);
                            r.setId(user.getId());
                            r.setScore(0f);
                            return r;
                        });

                // Cộng điểm theo độ khó bài
                float newScore = ranking.getScore() + problem.getDifficulty();

                ranking.setScore(newScore);
                ranking.setUpdatedAt(LocalDateTime.now());

                rankingRepository.save(ranking);
            }
            long end = System.nanoTime();
            float runtimeInMs = (end - start) / 1_000_000.0f;

            Submission submission = new Submission();
            submission.setUser(user);
            submission.setProblem(problem);
            submission.setLanguage(language);
            submission.setCode(request.getCode());
            submission.setStatusDetail(
                    allPassed ? Submission.StatusDetail.ACCEPTED : Submission.StatusDetail.WRONG_ANSWER);
            submission.setStatus(allPassed ? Submission.Status.PASSED : Submission.Status.FAILED);
            submission.setRuntime(runtimeInMs);
            submission.setMemory(null);
            submission.setSubmittedAt(LocalDateTime.now());

            submissionRepository.save(submission);
        } else if (request.programmingLanguageId == 2) {
            Path scriptPath = Paths.get("Script.java");
            try {
                Files.writeString(scriptPath, request.getCode());
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error writing code to file.");
            }

            // Compile
            ProcessBuilder compile = new ProcessBuilder("javac", "Runner.java", "Script.java");
            compile.redirectErrorStream(true);
            Process compileProcess = compile.start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(compileProcess.getInputStream()))) {
                reader.lines().forEach(System.out::println);
            }
            int compileExitCode = compileProcess.waitFor();
            if (compileExitCode != 0) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Compile failed");
            }

            boolean allPassed = true;
            long start = System.nanoTime();

            for (CodeRequest.TestCaseRequest testCaseRequest : request.getTestCases()) {
                List<String> command = new ArrayList<>();
                command.add("java");
                command.add("Runner");
                command.add("Script." + problem.getSlug());

                for (CodeRequest.TestCaseDetailRequest detail : testCaseRequest.getDetails()) {
                    String value = detail.getVariableValue();
                    if (value.startsWith("[") && value.endsWith("]")) {
                        command.add("\"" + value + "\"");
                    } else {
                        command.add(value);
                    }
                }

                ProcessBuilder pb = new ProcessBuilder(command);
                pb.redirectErrorStream(true);
                try {
                    Process process = pb.start();
                    String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                            .lines().collect(Collectors.joining("\n")).trim();
                    int exitCode = process.waitFor();

                    String expected = testCaseRequest.getExpectedOutput();
                    boolean isArray = output.startsWith("[") && expected.startsWith("[") &&
                            output.endsWith("]") && expected.endsWith("]");
                    boolean passed = isArray
                            ? output.replaceAll("\\s+", "").equals(expected.replaceAll("\\s+", ""))
                            : output.equals(expected);

                    allPassed = allPassed && passed;



                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("expectedOutput", expected);
                    result.put("actualOutput", output);
                    result.put("pass", passed);
                    result.put("exitCode", exitCode);
                    result.put("details", testCaseRequest.getDetails());
                    results.add(result);
                } catch (IOException | InterruptedException ex) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error executing code.");
                }
            }
                                if (allPassed) {
                // Lấy hoặc tạo ranking của user
                Ranking ranking = rankingRepository.findByUser(user)
                        .orElseGet(() -> {
                            Ranking r = new Ranking();
                            r.setUser(user);
                            r.setId(user.getId());
                            r.setScore(0f);
                            return r;
                        });

                // Cộng điểm theo độ khó bài
                float newScore = ranking.getScore() + problem.getDifficulty();

                ranking.setScore(newScore);
                ranking.setUpdatedAt(LocalDateTime.now());

                rankingRepository.save(ranking);
            }
            long end = System.nanoTime();
            float runtimeInMs = (end - start) / 1_000_000.0f;

            Submission submission = new Submission();
            submission.setUser(user);
            submission.setProblem(problem);
            submission.setLanguage(language);
            submission.setCode(request.getCode());
            submission.setStatusDetail(
                    allPassed ? Submission.StatusDetail.ACCEPTED : Submission.StatusDetail.WRONG_ANSWER);
            submission.setStatus(allPassed ? Submission.Status.PASSED : Submission.Status.FAILED);
            submission.setRuntime(runtimeInMs);
            submission.setMemory(null);
            submission.setSubmittedAt(LocalDateTime.now());

            submissionRepository.save(submission);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ngôn ngữ không được hỗ trợ.");
        }
        // Trả về kết quả
        return ResponseEntity.ok(results);
    }

    @PostMapping("/extract-user-id")
    public ResponseEntity<Map<String, Object>> extractUserId(@RequestParam("token") String token) {
        try {
            Long userId = JwtUtil.extractUserIdFromToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("id", userId);

            return ResponseEntity.ok(response);
        } catch (ExpiredJwtException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Token đã hết hạn");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Token không hợp lệ");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<String> getUserProfile(@RequestBody TokenRequest request) {
        String token = request.getToken();

        if (token == null || token.isBlank()) {
            return ResponseEntity.status(401).body("Token không hợp lệ.");
        }

        try {
            Long userId = JwtUtil.extractUserIdFromToken(token);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok("User found: " + user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token không hợp lệ.");
        }
    }

    @PostMapping("/progress")
    public ResponseEntity<?> getUserProgress(@RequestBody TokenRequestCompany request) {
        String token = request.getToken();
        Long companyId = request.getCompanyId(); // thêm companyId trong request

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Token không hợp lệ hoặc bị thiếu.");
        }

        if (companyId == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("companyId bị thiếu.");
        }

        Long userId = JwtUtil.extractUserIdFromToken(token);

        int solvedCount = submissionRepository.countSolvedProblemsByUserAndCompany(userId, companyId);
        int totalCount = problemRepository.countTotalProblemsByCompany(companyId);
        Map<String, Integer> response = new HashMap<>();
        response.put("solvedCount", solvedCount);
        response.put("totalCount", totalCount);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/companies")
    public List<Map<String, Object>> getCompanies() {
        return companyRepository.findAll().stream().map(company -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", company.getId());
            map.put("name", company.getName());
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping("/token")
    public String getToken(@RequestParam String username) {
        return JwtUtil.generateToken(username);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

    @GetMapping("Register")
    public ResponseEntity<?> register(@RequestParam String username) {
        String token = JwtUtil.generateToken(username);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/{id}/problems")
    public ResponseEntity<Map<String, Object>> getProblemsByCompany(@PathVariable Integer id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id " + id));

        List<Map<String, Object>> problems = company.getProblems().stream()
                .map(problem -> {
                    Map<String, Object> p = new HashMap<>();
                    p.put("id", problem.getId());
                    p.put("title", problem.getTitle());
                    p.put("difficulty", problem.getDifficulty());

                    // Lấy danh sách tên tag
                    Set<tag> tags = problem.getTags();
                    List<String> tagNames = tags.stream()
                            .map(tag::getName)
                            .collect(Collectors.toList());
                    p.put("tags", tagNames);

                    // Giả lập submit rate (%)
                    int submitRate = (int) ((problem.getId() * 37) % 100);
                    p.put("submitRate", submitRate);

                    return p;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("companyName", company.getName());
        response.put("problems", problems);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{id}")
    public ResponseEntity<Map<String, Object>> getEvent(@PathVariable Integer id) {
        Event event = eventRepository.findById(id).orElseThrow();

        Map<String, Object> data = new HashMap<>();
        data.put("id", event.getId());
        data.put("title", event.getTitle());
        data.put("startTime", event.getStartTime());
        data.put("description", event.getDescription());

        return ResponseEntity.ok(data);
    }

    // ✅ API 1: Get first 3 events
    @GetMapping("/first3")
    public ResponseEntity<List<Map<String, Object>>> getFirst3Events() {
        List<Event> events = eventRepository.findAll()
                .stream()
                .limit(3)
                .collect(Collectors.toList());

        return ResponseEntity.ok(mapEvents(events));
    }

    // ✅ API 2: Get first 2 events
    @GetMapping("/first2")
    public ResponseEntity<List<Map<String, Object>>> getFirst2Events() {
        List<Event> events = eventRepository.findAll()
                .stream()
                .limit(2)
                .collect(Collectors.toList());

        return ResponseEntity.ok(mapEvents(events));
    }

    // ✅ API 3: Get all events
    @GetMapping("/all/events")
    public ResponseEntity<List<Map<String, Object>>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(mapEvents(events));
    }

    // Helper: Convert List<Event> → List<Map>
    private List<Map<String, Object>> mapEvents(List<Event> events) {
        return events.stream().map(event -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", event.getId());
            map.put("title", event.getTitle());
            map.put("startTime", event.getStartTime());
            map.put("description", event.getDescription());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/top10/rankings")
    public ResponseEntity<List<Map<String, Object>>> getTop10() {
        List<Ranking> top10 = rankingRepository.findTopByScore(PageRequest.of(0, 10));

        List<Map<String, Object>> response = top10.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("userId", -1);
            map.put("rank", r.getRank());
            map.put("score", r.getScore());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all/rankings")
    public ResponseEntity<List<Map<String, Object>>> getAllRankings() {
        List<Ranking> rankings = rankingRepository.findAll();

        List<Map<String, Object>> response = rankings.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("userId", r.getUser().getId()); // ✅ lấy đúng userId

            // 👇 nhúng user.username vào
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("username", r.getUser().getUsername());
            map.put("user", userMap);

            map.put("rank", r.getRank());
            map.put("score", r.getScore());

            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> mapRanking(Ranking ranking) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", ranking.getId());
        map.put("userId", -1);
        map.put("rank", ranking.getRank());
        map.put("score", ranking.getScore());
        return map;
    }

    @GetMapping("/{eventId}/problems/event")
    public ResponseEntity<List<Map<String, Object>>> getProblemsByEvent(@PathVariable Integer eventId) {
        List<Map<String, Object>> result = eventRepository.findEventProblemsByEventId(eventId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/updateprofile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UpdateUserProfileRequest request) {
        Long userId;
        try {
            userId = JwtUtil.extractUserIdFromToken(request.getToken());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();

        // Kiểm tra nếu username thay đổi và bị trùng với user khác
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            Optional<User> userByUsername = userRepository.findByUsername(request.getUsername());
            if (userByUsername.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Username '" + request.getUsername() + "' is already taken");
            }
            user.setUsername(request.getUsername());
        }

        userRepository.save(user);

        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        if (request.getFullName() != null)
            profile.setFullName(request.getFullName());
        if (request.getAvatarUrl() != null)
            profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getCountry() != null)
            profile.setCountry(request.getCountry());
        if (request.getGithubUrl() != null)
            profile.setGithubUrl(request.getGithubUrl());
        if (request.getBio() != null)
            profile.setBio(request.getBio());

        userProfileRepository.save(profile);

        return ResponseEntity.ok("User profile updated successfully");
    }

    @PutMapping("/upload-avatar-json")
    public ResponseEntity<?> uploadAvatarFromJson(@RequestBody AvatarUploadDto dto) {
        String token = dto.getToken();
        String base64Image = dto.getBase64Image();
        String fileName = dto.getFileName();

        if (token == null || base64Image == null || fileName == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        Long userId;
        try {
            userId = JwtUtil.extractUserIdFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        try {
            // Giải mã base64
            String base64Data = base64Image.split(",")[1]; // bỏ data:image/png;base64,
            byte[] imageBytes = Base64.getDecoder().decode(base64Data);

            // Tạo thư mục nếu chưa có
            String uploadDir = "wwwroot/avatars/";
            File directory = new File(uploadDir);
            if (!directory.exists())
                directory.mkdirs();

            // Tạo tên file duy nhất
            String uniqueFileName = "avatar_" + userId + "_" + System.currentTimeMillis() + "_" + fileName;
            Path filePath = Paths.get(uploadDir + uniqueFileName);
            Files.write(filePath, imageBytes);

            // Cập nhật profile
            User user = userOptional.get();
            UserProfile profile = user.getUserProfile();
            if (profile == null) {
                profile = new UserProfile();
                profile.setUser(user);
            }

            profile.setAvatarUrl("http://localhost:2109/avatars/" + uniqueFileName);
            userProfileRepository.save(profile);

            return ResponseEntity.ok("Avatar uploaded successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save image");
        }
    }

}
