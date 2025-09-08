package exam.primedev.controller;

import exam.primedev.entity.Company;
import exam.primedev.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/companies")
@CrossOrigin(origins = "*")
public class CompaniesController {

    @Autowired
    private CompanyRepository companyRepository;

    // ==================== COMPANY MANAGEMENT ====================

    // Get all companies
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return ResponseEntity.ok(companies);
    }

    // Get company by ID
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Integer id) {
        Optional<Company> company = companyRepository.findById(id);
        return company.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new company
    @PostMapping
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
    }

    // Update company
    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Integer id, @RequestBody Company companyDetails) {
        Optional<Company> companyOpt = companyRepository.findById(id);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Company company = companyOpt.get();
        company.setName(companyDetails.getName());
        company.setDescription(companyDetails.getDescription());

        Company updatedCompany = companyRepository.save(company);
        return ResponseEntity.ok(updatedCompany);
    }

    // Delete company
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Integer id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        companyRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Search companies by name
    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam String name) {
        // You might want to add a search method to CompanyRepository
        List<Company> companies = companyRepository.findAll();
        List<Company> filteredCompanies = companies.stream()
                .filter(company -> company.getName().toLowerCase().contains(name.toLowerCase()))
                .toList();
        return ResponseEntity.ok(filteredCompanies);
    }

    // Bulk operations for companies
    @PostMapping("/bulk-delete")
public ResponseEntity<?> bulkDeleteCompanies(@RequestBody List<Integer> companyIds) {
        for (Integer id : companyIds) {
            if (companyRepository.existsById(id)) {
                companyRepository.deleteById(id);
            }
        }
        return ResponseEntity.ok().build();
    }
}