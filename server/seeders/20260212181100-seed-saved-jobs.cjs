'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('saved_jobs', [
      // Alex Thompson - saved tasks
      {
        candidate_id: '11111111-0000-0000-0000-000000000001',
        job_id: '55555555-0000-0000-0000-000000000002',
        created_at: new Date()
      },
      {
        candidate_id: '11111111-0000-0000-0000-000000000001',
        job_id: '55555555-0000-0000-0000-000000000004',
        created_at: new Date()
      },
      // Elena Martinez - saved tasks
      {
        candidate_id: '11111111-0000-0000-0000-000000000002',
        job_id: '55555555-0000-0000-0000-000000000007',
        created_at: new Date()
      },
      // Mihai Petrov - saved tasks
      {
        candidate_id: '11111111-0000-0000-0000-000000000003',
        job_id: '55555555-0000-0000-0000-000000000001',
        created_at: new Date()
      },
      // Ana Rodriguez - saved tasks
      {
        candidate_id: '11111111-0000-0000-0000-000000000004',
        job_id: '55555555-0000-0000-0000-000000000003',
        created_at: new Date()
      },
      {
        candidate_id: '11111111-0000-0000-0000-000000000004',
        job_id: '55555555-0000-0000-0000-000000000006',
        created_at: new Date()
      },
      // Dan Williams - saved tasks
      {
        candidate_id: '11111111-0000-0000-0000-000000000005',
        job_id: '55555555-0000-0000-0000-000000000005',
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('saved_jobs', null, {});
  }
};
