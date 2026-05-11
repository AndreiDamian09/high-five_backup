'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('education', [
      // Alex Thompson
      {
        id: '44444444-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        institution_name: 'University of Washington',
        degree: 'BS',
        field_of_study: 'Computer Science',
        start_date: '2016-09-01',
        end_date: '2020-06-01',
        is_current: false,
        grade: '3.8',
        description: 'Focus on software engineering and web development.',
        created_at: new Date()
      },
      
      // Elena Martinez
      {
        id: '44444444-0000-0000-0000-000000000002',
        candidate_id: '11111111-0000-0000-0000-000000000002',
        institution_name: 'Rhode Island School of Design',
        degree: 'BFA',
        field_of_study: 'Graphic Design',
        start_date: '2014-09-01',
        end_date: '2018-05-01',
        is_current: false,
        grade: '3.9',
        description: 'Visual communication, branding, and digital design.',
        created_at: new Date()
      },
      
      // Mihai Petrov
      {
        id: '44444444-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000003',
        institution_name: 'Northwestern University',
        degree: 'BA',
        field_of_study: 'Business Analytics',
        start_date: '2019-09-01',
        end_date: '2023-05-01',
        is_current: false,
        grade: '3.7',
        description: 'Data analysis, statistics, and business intelligence.',
        created_at: new Date()
      },
      
      // Ana Rodriguez
      {
        id: '44444444-0000-0000-0000-000000000004',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        institution_name: 'University of Colorado',
        degree: 'BA',
        field_of_study: 'English Literature',
        start_date: '2015-09-01',
        end_date: '2019-05-01',
        is_current: false,
        grade: '3.8',
        description: 'Creative writing and journalism.',
        created_at: new Date()
      },
      
      // Dan Williams
      {
        id: '44444444-0000-0000-0000-000000000005',
        candidate_id: '11111111-0000-0000-0000-000000000005',
        institution_name: 'Portland State University',
        degree: 'BA',
        field_of_study: 'Film Production',
        start_date: '2013-09-01',
        end_date: '2017-05-01',
        is_current: false,
        grade: '3.6',
        description: 'Video production and editing.',
        created_at: new Date()
      },

      // Sarah Chen
      {
        id: '44444444-0000-0000-0000-000000000006',
        candidate_id: '11111111-0000-0000-0000-000000000006',
        institution_name: 'Stanford University',
        degree: 'BS',
        field_of_study: 'Computer Engineering',
        start_date: '2015-09-01',
        end_date: '2019-06-01',
        is_current: false,
        grade: '3.9',
        description: 'Mobile development and software engineering.',
        created_at: new Date()
      },

      // James Miller
      {
        id: '44444444-0000-0000-0000-000000000007',
        candidate_id: '11111111-0000-0000-0000-000000000007',
        institution_name: 'UT Austin',
        degree: 'MS',
        field_of_study: 'Computer Science',
        start_date: '2016-09-01',
        end_date: '2018-05-01',
        is_current: false,
        grade: '3.8',
        description: 'Distributed systems and databases.',
        created_at: new Date()
      },

      // Maria Santos
      {
        id: '44444444-0000-0000-0000-000000000008',
        candidate_id: '11111111-0000-0000-0000-000000000008',
        institution_name: 'UCLA',
        degree: 'BA',
        field_of_study: 'Marketing',
        start_date: '2016-09-01',
        end_date: '2020-06-01',
        is_current: false,
        grade: '3.7',
        description: 'Digital marketing and brand strategy.',
        created_at: new Date()
      },

      // Kevin Park
      {
        id: '44444444-0000-0000-0000-000000000009',
        candidate_id: '11111111-0000-0000-0000-000000000009',
        institution_name: 'NYU',
        degree: 'BS',
        field_of_study: 'Marketing',
        start_date: '2014-09-01',
        end_date: '2018-05-01',
        is_current: false,
        grade: '3.6',
        description: 'Digital marketing and analytics.',
        created_at: new Date()
      },

      // Lisa Johnson
      {
        id: '44444444-0000-0000-0000-000000000010',
        candidate_id: '11111111-0000-0000-0000-000000000010',
        institution_name: 'Boston University',
        degree: 'BS',
        field_of_study: 'Information Technology',
        start_date: '2015-09-01',
        end_date: '2019-05-01',
        is_current: false,
        grade: '3.7',
        description: 'Software testing and quality assurance.',
        created_at: new Date()
      },

      // Andrei Popescu
      {
        id: '44444444-0000-0000-0000-000000000011',
        candidate_id: '11111111-0000-0000-0000-000000000011',
        institution_name: 'Arizona State University',
        degree: 'BS',
        field_of_study: 'Computer Science',
        start_date: '2013-09-01',
        end_date: '2017-05-01',
        is_current: false,
        grade: '3.8',
        description: 'Systems administration and cloud computing.',
        created_at: new Date()
      },

      // Nina Volkov
      {
        id: '44444444-0000-0000-0000-000000000012',
        candidate_id: '11111111-0000-0000-0000-000000000012',
        institution_name: 'University of Miami',
        degree: 'MA',
        field_of_study: 'Translation Studies',
        start_date: '2014-09-01',
        end_date: '2016-05-01',
        is_current: false,
        grade: '3.9',
        description: 'Professional translation and interpretation.',
        created_at: new Date()
      },

      // Chris Lee
      {
        id: '44444444-0000-0000-0000-000000000013',
        candidate_id: '11111111-0000-0000-0000-000000000013',
        institution_name: 'SCAD',
        degree: 'BFA',
        field_of_study: 'Animation',
        start_date: '2015-09-01',
        end_date: '2019-05-01',
        is_current: false,
        grade: '3.7',
        description: 'Motion graphics and visual effects.',
        created_at: new Date()
      },

      // Emma Wilson
      {
        id: '44444444-0000-0000-0000-000000000014',
        candidate_id: '11111111-0000-0000-0000-000000000014',
        institution_name: 'Vanderbilt University',
        degree: 'BS',
        field_of_study: 'Communications',
        start_date: '2017-09-01',
        end_date: '2021-05-01',
        is_current: false,
        grade: '3.6',
        description: 'Social media and digital marketing.',
        created_at: new Date()
      },

      // Ryan Taylor
      {
        id: '44444444-0000-0000-0000-000000000015',
        candidate_id: '11111111-0000-0000-0000-000000000015',
        institution_name: 'SMU',
        degree: 'MS',
        field_of_study: 'Software Engineering',
        start_date: '2012-09-01',
        end_date: '2014-05-01',
        is_current: false,
        grade: '3.9',
        description: 'Systems architecture and leadership.',
        created_at: new Date()
      },

      // Sofia Garcia
      {
        id: '44444444-0000-0000-0000-000000000016',
        candidate_id: '11111111-0000-0000-0000-000000000016',
        institution_name: 'ArtCenter College of Design',
        degree: 'BFA',
        field_of_study: 'Illustration',
        start_date: '2015-09-01',
        end_date: '2019-05-01',
        is_current: false,
        grade: '3.8',
        description: 'Digital illustration and character design.',
        created_at: new Date()
      },

      // Tom Anderson
      {
        id: '44444444-0000-0000-0000-000000000017',
        candidate_id: '11111111-0000-0000-0000-000000000017',
        institution_name: 'University of Minnesota',
        degree: 'BS',
        field_of_study: 'Web Development',
        start_date: '2012-09-01',
        end_date: '2016-05-01',
        is_current: false,
        grade: '3.5',
        description: 'Web technologies and e-commerce.',
        created_at: new Date()
      },

      // Julia Bennett
      {
        id: '44444444-0000-0000-0000-000000000018',
        candidate_id: '11111111-0000-0000-0000-000000000018',
        institution_name: 'University of Michigan',
        degree: 'MS',
        field_of_study: 'Data Science',
        start_date: '2016-09-01',
        end_date: '2018-05-01',
        is_current: false,
        grade: '3.9',
        description: 'Data analysis and visualization.',
        created_at: new Date()
      },

      // Marcus Brown
      {
        id: '44444444-0000-0000-0000-000000000019',
        candidate_id: '11111111-0000-0000-0000-000000000019',
        institution_name: 'Temple University',
        degree: 'BA',
        field_of_study: 'Audio Production',
        start_date: '2011-09-01',
        end_date: '2015-05-01',
        is_current: false,
        grade: '3.6',
        description: 'Recording, mixing, and mastering.',
        created_at: new Date()
      },

      // Olivia Davis
      {
        id: '44444444-0000-0000-0000-000000000020',
        candidate_id: '11111111-0000-0000-0000-000000000020',
        institution_name: 'University of Washington',
        degree: 'MS',
        field_of_study: 'Human-Computer Interaction',
        start_date: '2018-09-01',
        end_date: '2020-05-01',
        is_current: false,
        grade: '3.8',
        description: 'User research and usability testing.',
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('education', null, {});
  }
};
