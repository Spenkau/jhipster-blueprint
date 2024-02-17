package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Example;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Example entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExampleRepository extends JpaRepository<Example, Long> {}
