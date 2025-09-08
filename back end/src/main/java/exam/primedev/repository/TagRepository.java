package exam.primedev.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.tag;

public interface TagRepository extends JpaRepository<tag, Long> {
        List<tag> findByNameContainingIgnoreCase(String name);

}