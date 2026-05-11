'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('matches', [
      // Matches for Data Entry task
      {
        id: '77777777-0000-0000-0000-000000000001',
        job_id: '55555555-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000003',
        match_score: 96.00,
        match_reasons: JSON.stringify({
          skills_match: 95,
          experience_match: 98,
          availability_match: 100,
          budget_match: 95,
          details: [
            'Excel expertise: 5/5 proficiency',
            'Data entry experience: 500K+ records processed',
            '99.9% accuracy rate',
            'Available immediately',
            'Budget within range'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for React Dashboard task
      {
        id: '77777777-0000-0000-0000-000000000002',
        job_id: '55555555-0000-0000-0000-000000000002',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        match_score: 94.50,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 95,
          availability_match: 90,
          budget_match: 95,
          details: [
            'React: 4 years experience (expert level)',
            'Experience with charting libraries',
            'Clean code practices demonstrated',
            'Git proficient',
            'Portfolio includes dashboard projects'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Transcription task
      {
        id: '77777777-0000-0000-0000-000000000003',
        job_id: '55555555-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        match_score: 98.00,
        match_reasons: JSON.stringify({
          skills_match: 100,
          experience_match: 98,
          availability_match: 100,
          budget_match: 95,
          details: [
            'Native English speaker',
            'Professional transcriptionist',
            '5 years experience',
            'Attention to detail: excellent',
            'Available for immediate start'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Video Editing task
      {
        id: '77777777-0000-0000-0000-000000000004',
        job_id: '55555555-0000-0000-0000-000000000005',
        candidate_id: '11111111-0000-0000-0000-000000000005',
        match_score: 97.00,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 100,
          availability_match: 95,
          budget_match: 95,
          details: [
            'Premiere Pro expert',
            'YouTube content experience',
            '300+ videos edited',
            'Can meet 48-hour deadline',
            'Motion graphics capabilities'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Mobile App UI task
      {
        id: '77777777-0000-0000-0000-000000000005',
        job_id: '55555555-0000-0000-0000-000000000007',
        candidate_id: '11111111-0000-0000-0000-000000000002',
        match_score: 95.50,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 95,
          availability_match: 95,
          budget_match: 92,
          details: [
            'Figma expert: 5/5 proficiency',
            'Mobile UI specialization',
            'iOS/Android guidelines knowledge',
            'Clean, modern portfolio',
            'Component-based design experience'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: false,
        created_at: new Date()
      },
      // Matches for Blog Posts task
      {
        id: '77777777-0000-0000-0000-000000000006',
        job_id: '55555555-0000-0000-0000-000000000006',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        match_score: 92.00,
        match_reasons: JSON.stringify({
          skills_match: 95,
          experience_match: 90,
          availability_match: 95,
          budget_match: 88,
          details: [
            'Native English writing',
            'SEO experience demonstrated',
            '200+ articles published',
            'Digital marketing knowledge',
            'Research skills strong'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Payment API task
      {
        id: '77777777-0000-0000-0000-000000000007',
        job_id: '55555555-0000-0000-0000-000000000019',
        candidate_id: '11111111-0000-0000-0000-000000000007',
        match_score: 96.00,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 98,
          availability_match: 90,
          budget_match: 98,
          details: [
            'Backend engineering: 8 years',
            'Payment systems experience',
            'Stripe API knowledge',
            'Security best practices',
            'PostgreSQL expert'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for WordPress Speed task
      {
        id: '77777777-0000-0000-0000-000000000008',
        job_id: '55555555-0000-0000-0000-000000000012',
        candidate_id: '11111111-0000-0000-0000-000000000017',
        match_score: 97.00,
        match_reasons: JSON.stringify({
          skills_match: 100,
          experience_match: 98,
          availability_match: 92,
          budget_match: 98,
          details: [
            'WordPress: 8 years experience',
            'WooCommerce optimization specialist',
            '200+ sites built',
            'Speed optimization focus',
            'PageSpeed best practices'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for SEO Audit task
      {
        id: '77777777-0000-0000-0000-000000000009',
        job_id: '55555555-0000-0000-0000-000000000013',
        candidate_id: '11111111-0000-0000-0000-000000000009',
        match_score: 98.00,
        match_reasons: JSON.stringify({
          skills_match: 100,
          experience_match: 95,
          availability_match: 100,
          budget_match: 95,
          details: [
            'SEO expert: 6 years',
            'Ahrefs and Semrush proficiency',
            'Technical SEO knowledge',
            'Content strategy experience',
            '200+ keywords ranked'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Translation task
      {
        id: '77777777-0000-0000-0000-000000000010',
        job_id: '55555555-0000-0000-0000-000000000014',
        candidate_id: '11111111-0000-0000-0000-000000000012',
        match_score: 99.00,
        match_reasons: JSON.stringify({
          skills_match: 100,
          experience_match: 100,
          availability_match: 98,
          budget_match: 98,
          details: [
            'Native Spanish speaker',
            'English fluency',
            '8 years translation experience',
            '1M+ words translated',
            'SEO awareness'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Social Media Calendar task
      {
        id: '77777777-0000-0000-0000-000000000011',
        job_id: '55555555-0000-0000-0000-000000000010',
        candidate_id: '11111111-0000-0000-0000-000000000014',
        match_score: 97.00,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 95,
          availability_match: 100,
          budget_match: 95,
          details: [
            'Social media: 4 years',
            '500K+ followers gained',
            'Instagram and TikTok expertise',
            'Creative content ideas',
            'Analytics understanding'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Motion Graphics task
      {
        id: '77777777-0000-0000-0000-000000000012',
        job_id: '55555555-0000-0000-0000-000000000009',
        candidate_id: '11111111-0000-0000-0000-000000000013',
        match_score: 98.00,
        match_reasons: JSON.stringify({
          skills_match: 100,
          experience_match: 95,
          availability_match: 100,
          budget_match: 98,
          details: [
            'After Effects expert',
            'Major brand experience',
            'Sound design capabilities',
            '4K rendering',
            '5 years experience'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
      // Matches for Tableau Dashboard task
      {
        id: '77777777-0000-0000-0000-000000000013',
        job_id: '55555555-0000-0000-0000-000000000018',
        candidate_id: '11111111-0000-0000-0000-000000000018',
        match_score: 95.00,
        match_reasons: JSON.stringify({
          skills_match: 98,
          experience_match: 95,
          availability_match: 90,
          budget_match: 97,
          details: [
            'Tableau proficiency',
            'Data visualization expert',
            'Financial metrics understanding',
            '6 years data analysis',
            'Clean design sense'
          ]
        }),
        is_notified_candidate: true,
        is_notified_employer: true,
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('matches', null, {});
  }
};
