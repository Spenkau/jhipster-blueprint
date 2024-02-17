package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Example;
import com.mycompany.myapp.repository.ExampleRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Example}.
 */
@Service
@Transactional
public class ExampleService {

    private final Logger log = LoggerFactory.getLogger(ExampleService.class);

    private final ExampleRepository exampleRepository;

    public ExampleService(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    /**
     * Save a example.
     *
     * @param example the entity to save.
     * @return the persisted entity.
     */
    public Example save(Example example) {
        log.debug("Request to save Example : {}", example);
        return exampleRepository.save(example);
    }

    /**
     * Copy a example.
     *
     * @param example the entity to copy.
     * @return the name of entity.
     */
    public String copy(Example example) {
        log.debug("Request to copy Example : {}", example);

        Long id = example.getId();

        Optional<Example> result = exampleRepository.findById(id);

        return result.map(Example::getName).orElse(null);
        // OR:
        //        return example.getName();
    }

    /**
     * Update a example.
     *
     * @param example the entity to save.
     * @return the persisted entity.
     */
    public Example update(Example example) {
        log.debug("Request to update Example : {}", example);
        return exampleRepository.save(example);
    }

    /**
     * Partially update a example.
     *
     * @param example the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Example> partialUpdate(Example example) {
        log.debug("Request to partially update Example : {}", example);

        return exampleRepository
            .findById(example.getId())
            .map(existingExample -> {
                if (example.getName() != null) {
                    existingExample.setName(example.getName());
                }
                if (example.getSlug() != null) {
                    existingExample.setSlug(example.getSlug());
                }

                return existingExample;
            })
            .map(exampleRepository::save);
    }

    /**
     * Get all the examples.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Example> findAll() {
        log.debug("Request to get all Examples");
        return exampleRepository.findAll();
    }

    /**
     * Get one example by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Example> findOne(Long id) {
        log.debug("Request to get Example : {}", id);
        return exampleRepository.findById(id);
    }

    /**
     * Delete the example by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Example : {}", id);
        exampleRepository.deleteById(id);
    }
}
