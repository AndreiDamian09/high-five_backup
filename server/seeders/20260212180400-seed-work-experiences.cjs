'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('work_experiences', [
      // Alex Thompson - Full Stack Developer
      {
        id: '33333333-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        job_title: 'Freelance Full Stack Developer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2023-01-01',
        end_date: null,
        is_current: true,
        description: 'Completing freelance tasks for various clients. Web development, API integration, and custom software solutions. 50+ projects completed with 4.9 average rating.',
        created_at: new Date()
      },
      {
        id: '33333333-0000-0000-0000-000000000002',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        job_title: 'Junior Developer',
        company_name: 'TechCorp Inc',
        location: 'Seattle',
        start_date: '2020-06-01',
        end_date: '2022-12-31',
        is_current: false,
        description: 'Developed and maintained web applications using React and Node.js. Collaborated with design team on new features.',
        created_at: new Date()
      },
      
      // Elena Martinez - UI/UX Designer
      {
        id: '33333333-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000002',
        job_title: 'Freelance Designer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2021-01-01',
        end_date: null,
        is_current: true,
        description: 'UI/UX design for startups and agencies. 100+ designs delivered. Specializing in e-commerce and SaaS interfaces.',
        created_at: new Date()
      },
      
      // Mihai Petrov - Data Specialist
      {
        id: '33333333-0000-0000-0000-000000000004',
        candidate_id: '11111111-0000-0000-0000-000000000003',
        job_title: 'Freelance Data Specialist',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2024-01-01',
        end_date: null,
        is_current: true,
        description: 'Data entry, web scraping, and analysis tasks. Processed 500K+ records with 99.9% accuracy.',
        created_at: new Date()
      },

      // Ana Rodriguez - Content Writer
      {
        id: '33333333-0000-0000-0000-000000000005',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        job_title: 'Freelance Content Writer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-01-01',
        end_date: null,
        is_current: true,
        description: 'Writing blog posts, articles, and marketing copy. 200+ articles published.',
        created_at: new Date()
      },

      // Dan Williams - Video Editor
      {
        id: '33333333-0000-0000-0000-000000000006',
        candidate_id: '11111111-0000-0000-0000-000000000005',
        job_title: 'Freelance Video Editor',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2020-01-01',
        end_date: null,
        is_current: true,
        description: 'Video editing and motion graphics for YouTube, social media, and corporate clients. 300+ videos edited.',
        created_at: new Date()
      },

      // Sarah Chen - Mobile Developer
      {
        id: '33333333-0000-0000-0000-000000000007',
        candidate_id: '11111111-0000-0000-0000-000000000006',
        job_title: 'Freelance Mobile Developer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2023-01-01',
        end_date: null,
        is_current: true,
        description: 'Building React Native and Flutter apps. 15+ apps published with 100K+ downloads.',
        created_at: new Date()
      },

      // James Miller - Backend Engineer
      {
        id: '33333333-0000-0000-0000-000000000008',
        candidate_id: '11111111-0000-0000-0000-000000000007',
        job_title: 'Senior Backend Engineer',
        company_name: 'TechStartup Austin',
        location: 'Austin',
        start_date: '2020-01-01',
        end_date: null,
        is_current: true,
        description: 'Leading backend development. Building scalable APIs handling 1M+ daily requests.',
        created_at: new Date()
      },

      // Maria Santos - Copywriter
      {
        id: '33333333-0000-0000-0000-000000000009',
        candidate_id: '11111111-0000-0000-0000-000000000008',
        job_title: 'Freelance Copywriter',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-01-01',
        end_date: null,
        is_current: true,
        description: 'Marketing copy, email campaigns, landing pages. Helped increase conversions by 40%.',
        created_at: new Date()
      },

      // Kevin Park - SEO Expert
      {
        id: '33333333-0000-0000-0000-000000000010',
        candidate_id: '11111111-0000-0000-0000-000000000009',
        job_title: 'SEO Consultant',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2021-01-01',
        end_date: null,
        is_current: true,
        description: 'Technical SEO, content strategy, link building. Ranked 200+ keywords on page 1.',
        created_at: new Date()
      },

      // Lisa Johnson - QA Engineer
      {
        id: '33333333-0000-0000-0000-000000000011',
        candidate_id: '11111111-0000-0000-0000-000000000010',
        job_title: 'Freelance QA Engineer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-06-01',
        end_date: null,
        is_current: true,
        description: 'Manual and automated testing. Found 2000+ bugs across 50 projects.',
        created_at: new Date()
      },

      // Andrei Popescu - DevOps Engineer
      {
        id: '33333333-0000-0000-0000-000000000012',
        candidate_id: '11111111-0000-0000-0000-000000000011',
        job_title: 'DevOps Consultant',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2021-01-01',
        end_date: null,
        is_current: true,
        description: 'CI/CD pipelines, cloud infrastructure, Kubernetes. Reduced deployment time by 80%.',
        created_at: new Date()
      },

      // Nina Volkov - Translator
      {
        id: '33333333-0000-0000-0000-000000000013',
        candidate_id: '11111111-0000-0000-0000-000000000012',
        job_title: 'Professional Translator',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2019-01-01',
        end_date: null,
        is_current: true,
        description: 'Legal, medical, and technical translations. 1M+ words translated.',
        created_at: new Date()
      },

      // Chris Lee - Motion Graphics
      {
        id: '33333333-0000-0000-0000-000000000014',
        candidate_id: '11111111-0000-0000-0000-000000000013',
        job_title: 'Motion Graphics Designer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-01-01',
        end_date: null,
        is_current: true,
        description: 'Creating animations for Nike, Spotify, Netflix. Expert in After Effects and Cinema 4D.',
        created_at: new Date()
      },

      // Emma Wilson - Social Media Manager
      {
        id: '33333333-0000-0000-0000-000000000015',
        candidate_id: '11111111-0000-0000-0000-000000000014',
        job_title: 'Social Media Manager',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2023-01-01',
        end_date: null,
        is_current: true,
        description: 'Content creation, community management, paid ads. 500K+ followers gained for clients.',
        created_at: new Date()
      },

      // Ryan Taylor - Senior Full Stack
      {
        id: '33333333-0000-0000-0000-000000000016',
        candidate_id: '11111111-0000-0000-0000-000000000015',
        job_title: 'Tech Lead',
        company_name: 'BigTech Corp',
        location: 'Dallas',
        start_date: '2020-01-01',
        end_date: null,
        is_current: true,
        description: 'Leading team of 10 developers. Built products used by 10M+ users.',
        created_at: new Date()
      },

      // Sofia Garcia - Illustrator
      {
        id: '33333333-0000-0000-0000-000000000017',
        candidate_id: '11111111-0000-0000-0000-000000000016',
        job_title: 'Digital Illustrator',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-01-01',
        end_date: null,
        is_current: true,
        description: 'Book illustrations, game art, brand mascots. Published in 20+ books.',
        created_at: new Date()
      },

      // Tom Anderson - WordPress Developer
      {
        id: '33333333-0000-0000-0000-000000000018',
        candidate_id: '11111111-0000-0000-0000-000000000017',
        job_title: 'WordPress Developer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2019-01-01',
        end_date: null,
        is_current: true,
        description: 'WooCommerce, speed optimization, custom themes. 200+ sites built.',
        created_at: new Date()
      },

      // Julia Bennett - Data Analyst
      {
        id: '33333333-0000-0000-0000-000000000019',
        candidate_id: '11111111-0000-0000-0000-000000000018',
        job_title: 'Data Analyst',
        company_name: 'Analytics Firm',
        location: 'Detroit',
        start_date: '2021-01-01',
        end_date: null,
        is_current: true,
        description: 'Data visualization, Tableau, Power BI. Analyzed 50TB+ of data.',
        created_at: new Date()
      },

      // Marcus Brown - Audio Engineer
      {
        id: '33333333-0000-0000-0000-000000000020',
        candidate_id: '11111111-0000-0000-0000-000000000019',
        job_title: 'Audio Engineer',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2018-01-01',
        end_date: null,
        is_current: true,
        description: 'Recording, mixing, mastering, podcast production. 1000+ hours produced.',
        created_at: new Date()
      },

      // Olivia Davis - UX Researcher
      {
        id: '33333333-0000-0000-0000-000000000021',
        candidate_id: '11111111-0000-0000-0000-000000000020',
        job_title: 'UX Researcher',
        company_name: 'Self-employed',
        location: 'Remote',
        start_date: '2022-01-01',
        end_date: null,
        is_current: true,
        description: 'User research, usability testing, surveys. Conducted 200+ user studies.',
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('work_experiences', null, {});
  }
};
