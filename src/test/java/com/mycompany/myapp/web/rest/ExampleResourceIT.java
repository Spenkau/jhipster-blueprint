package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Example;
import com.mycompany.myapp.repository.ExampleRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExampleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExampleResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SLUG = "AAAAAAAAAA";
    private static final String UPDATED_SLUG = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/examples";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExampleRepository exampleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExampleMockMvc;

    private Example example;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Example createEntity(EntityManager em) {
        Example example = new Example().name(DEFAULT_NAME).slug(DEFAULT_SLUG);
        return example;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Example createUpdatedEntity(EntityManager em) {
        Example example = new Example().name(UPDATED_NAME).slug(UPDATED_SLUG);
        return example;
    }

    @BeforeEach
    public void initTest() {
        example = createEntity(em);
    }

    @Test
    @Transactional
    void createExample() throws Exception {
        int databaseSizeBeforeCreate = exampleRepository.findAll().size();
        // Create the Example
        restExampleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(example)))
            .andExpect(status().isCreated());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeCreate + 1);
        Example testExample = exampleList.get(exampleList.size() - 1);
        assertThat(testExample.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testExample.getSlug()).isEqualTo(DEFAULT_SLUG);
    }

    @Test
    @Transactional
    void createExampleWithExistingId() throws Exception {
        // Create the Example with an existing ID
        example.setId(1L);

        int databaseSizeBeforeCreate = exampleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExampleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(example)))
            .andExpect(status().isBadRequest());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExamples() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        // Get all the exampleList
        restExampleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(example.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].slug").value(hasItem(DEFAULT_SLUG)));
    }

    @Test
    @Transactional
    void getExample() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        // Get the example
        restExampleMockMvc
            .perform(get(ENTITY_API_URL_ID, example.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(example.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.slug").value(DEFAULT_SLUG));
    }

    @Test
    @Transactional
    void getNonExistingExample() throws Exception {
        // Get the example
        restExampleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExample() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();

        // Update the example
        Example updatedExample = exampleRepository.findById(example.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedExample are not directly saved in db
        em.detach(updatedExample);
        updatedExample.name(UPDATED_NAME).slug(UPDATED_SLUG);

        restExampleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExample.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExample))
            )
            .andExpect(status().isOk());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
        Example testExample = exampleList.get(exampleList.size() - 1);
        assertThat(testExample.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExample.getSlug()).isEqualTo(UPDATED_SLUG);
    }

    @Test
    @Transactional
    void putNonExistingExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, example.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(example))
            )
            .andExpect(status().isBadRequest());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(example))
            )
            .andExpect(status().isBadRequest());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(example)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExampleWithPatch() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();

        // Update the example using partial update
        Example partialUpdatedExample = new Example();
        partialUpdatedExample.setId(example.getId());

        partialUpdatedExample.slug(UPDATED_SLUG);

        restExampleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExample.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExample))
            )
            .andExpect(status().isOk());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
        Example testExample = exampleList.get(exampleList.size() - 1);
        assertThat(testExample.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testExample.getSlug()).isEqualTo(UPDATED_SLUG);
    }

    @Test
    @Transactional
    void fullUpdateExampleWithPatch() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();

        // Update the example using partial update
        Example partialUpdatedExample = new Example();
        partialUpdatedExample.setId(example.getId());

        partialUpdatedExample.name(UPDATED_NAME).slug(UPDATED_SLUG);

        restExampleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExample.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExample))
            )
            .andExpect(status().isOk());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
        Example testExample = exampleList.get(exampleList.size() - 1);
        assertThat(testExample.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testExample.getSlug()).isEqualTo(UPDATED_SLUG);
    }

    @Test
    @Transactional
    void patchNonExistingExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, example.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(example))
            )
            .andExpect(status().isBadRequest());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(example))
            )
            .andExpect(status().isBadRequest());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExample() throws Exception {
        int databaseSizeBeforeUpdate = exampleRepository.findAll().size();
        example.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExampleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(example)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Example in the database
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExample() throws Exception {
        // Initialize the database
        exampleRepository.saveAndFlush(example);

        int databaseSizeBeforeDelete = exampleRepository.findAll().size();

        // Delete the example
        restExampleMockMvc
            .perform(delete(ENTITY_API_URL_ID, example.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Example> exampleList = exampleRepository.findAll();
        assertThat(exampleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
