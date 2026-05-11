'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('saved_candidates', [
      // TechRetail - saved contributors
      {
        employer_id: '22222222-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        notes: 'Strong React developer, perfect for our dashboard tasks. Fast and reliable.',
        created_at: new Date()
      },
      {
        employer_id: '22222222-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000003',
        notes: 'Excellent data entry specialist. High accuracy rate.',
        created_at: new Date()
      },
      // StartupX - saved contributors
      {
        employer_id: '22222222-0000-0000-0000-000000000002',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        notes: 'Professional transcriptionist. Native speaker with great attention to detail.',
        created_at: new Date()
      },
      // Content Creators - saved contributors
      {
        employer_id: '22222222-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000005',
        notes: 'Outstanding video editor. Fast turnaround and great quality.',
        created_at: new Date()
      },
      {
        employer_id: '22222222-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        notes: 'Great writer for our blog post tasks. SEO knowledge is a plus.',
        created_at: new Date()
      },
      // Digital Agency - saved contributors
      {
        employer_id: '22222222-0000-0000-0000-000000000004',
        candidate_id: '11111111-0000-0000-0000-000000000002',
        notes: 'Top-tier UI designer. Clean, modern work that clients love.',
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('saved_candidates', null, {});
  }
};
