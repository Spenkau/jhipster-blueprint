package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Example;
import com.mycompany.myapp.repository.ExampleRepository;
import com.mycompany.myapp.service.ExampleService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Example}.
 */
@RestController
@RequestMapping("/api/examples")
public class ExampleResource {

    private final Logger log = LoggerFactory.getLogger(ExampleResource.class);

    private static final String ENTITY_NAME = "example";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExampleService exampleService;

    private final ExampleRepository exampleRepository;

    public ExampleResource(ExampleService exampleService, ExampleRepository exampleRepository) {
        this.exampleService = exampleService;
        this.exampleRepository = exampleRepository;
    }

    /**
     * {@code POST  /examples} : Create a new example.
     *
     * @param example the example to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new example, or with status {@code 400 (Bad Request)} if the example has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Example> createExample(@RequestBody Example example) throws URISyntaxException {
        log.debug("REST request to save Example : {}", example);
        if (example.getId() != null) {
            throw new BadRequestAlertException("A new example cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Example result = exampleService.save(example);
        return ResponseEntity
            .created(new URI("/api/examples/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /examples/:id} : Updates an existing example.
     *
     * @param id the id of the example to save.
     * @param example the example to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated example,
     * or with status {@code 400 (Bad Request)} if the example is not valid,
     * or with status {@code 500 (Internal Server Error)} if the example couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Example> updateExample(@PathVariable(value = "id", required = false) final Long id, @RequestBody Example example)
        throws URISyntaxException {
        log.debug("REST request to update Example : {}, {}", id, example);
        if (example.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, example.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Example result = exampleService.update(example);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, example.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /examples/:id} : Partial updates given fields of an existing example, field will ignore if it is null
     *
     * @param id the id of the example to save.
     * @param example the example to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated example,
     * or with status {@code 400 (Bad Request)} if the example is not valid,
     * or with status {@code 404 (Not Found)} if the example is not found,
     * or with status {@code 500 (Internal Server Error)} if the example couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Example> partialUpdateExample(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Example example
    ) throws URISyntaxException {
        log.debug("REST request to partial update Example partially : {}, {}", id, example);
        if (example.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, example.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exampleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Example> result = exampleService.partialUpdate(example);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, example.getId().toString())
        );
    }

    /**
     * {@code GET  /examples} : get all the examples.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of examples in body.
     */
    @GetMapping("")
    public List<Example> getAllExamples() {
        log.debug("REST request to get all Examples");
        return exampleService.findAll();
    }

    /**
     * {@code GET  /examples/:id} : get the "id" example.
     *
     * @param id the id of the example to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the example, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Example> getExample(@PathVariable("id") Long id) {
        log.debug("REST request to get Example : {}", id);
        Optional<Example> example = exampleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(example);
    }

    @PostMapping("/copy")
    public String copy(@RequestBody Example example) {
        log.debug("REST request to get name of copy of example");
        return exampleService.copy(example);
    }

    /**
     * {@code DELETE  /examples/:id} : delete the "id" example.
     *
     * @param id the id of the example to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExample(@PathVariable("id") Long id) {
        log.debug("REST request to delete Example : {}", id);
        exampleService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
