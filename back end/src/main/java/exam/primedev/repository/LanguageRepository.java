package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import exam.primedev.entity.Language;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    // Có thể thêm custom query nếu cần
}