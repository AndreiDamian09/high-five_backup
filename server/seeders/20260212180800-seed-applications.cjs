'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('applications', [
      // Alex Thompson applies to React Dashboard task
      {
        id: '66666666-0000-0000-0000-000000000001',
        job_id: '55555555-0000-0000-0000-000000000002',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        cover_letter: 'Hi,\n\nI\'m very interested in building this React dashboard component. I have 4 years of experience with React and have built similar analytics dashboards before. I can deliver clean, documented code within your timeline.\n\nBest,\nAlex',
        cv_snapshot: 'Alex Thompson - Full Stack Developer. 4 years experience. Skills: React, JavaScript, TypeScript, Node.js, charting libraries.',
        status: 'reviewed',
        match_score: 94.50,
        employer_notes: 'Strong React background, relevant portfolio projects.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Alex Thompson applies to Python scraping task
      {
        id: '66666666-0000-0000-0000-000000000002',
        job_id: '55555555-0000-0000-0000-000000000004',
        candidate_id: '11111111-0000-0000-0000-000000000001',
        cover_letter: 'Hello,\n\nI can create this Python scraping script for you. I have experience with BeautifulSoup and Selenium, and I understand how to handle rate limiting and pagination properly.\n\nBest,\nAlex',
        cv_snapshot: 'Alex Thompson - Full Stack Developer. 4 years experience. Skills: Python, JavaScript, web scraping, API development.',
        status: 'pending',
        match_score: 85.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Mihai Petrov applies to Data Entry task
      {
        id: '66666666-0000-0000-0000-000000000003',
        job_id: '55555555-0000-0000-0000-000000000001',
        candidate_id: '11111111-0000-0000-0000-000000000003',
        cover_letter: 'Hi,\n\nI\'m a data specialist with a 99.9% accuracy rate. I\'ve processed over 500K records and can easily handle your 500 product entries. I\'m detail-oriented and can meet tight deadlines.\n\nBest,\nMihai',
        cv_snapshot: 'Mihai Petrov - Data Entry Specialist. Skills: Excel, Google Sheets, Data Entry, attention to detail. 4.8 rating.',
        status: 'accepted',
        match_score: 96.00,
        employer_notes: 'Perfect fit for data entry. High accuracy rate.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Ana Rodriguez applies to Transcription task
      {
        id: '66666666-0000-0000-0000-000000000004',
        job_id: '55555555-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        cover_letter: 'Hello,\n\nI\'m a professional transcriptionist with 5 years of experience. Native English speaker with excellent attention to detail. I can deliver accurate transcripts with timestamps within your deadline.\n\nBest,\nAna',
        cv_snapshot: 'Ana Rodriguez - Content Writer & Transcriptionist. 5 years experience. 200+ articles, transcription specialist.',
        status: 'accepted',
        match_score: 98.00,
        employer_notes: 'Exactly what we need. Native speaker with transcription experience.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Ana Rodriguez applies to Blog Posts task
      {
        id: '66666666-0000-0000-0000-000000000005',
        job_id: '55555555-0000-0000-0000-000000000006',
        candidate_id: '11111111-0000-0000-0000-000000000004',
        cover_letter: 'Hi,\n\nI\'d love to write these SEO blog posts. I have extensive experience with digital marketing content and understand SEO best practices.\n\nBest,\nAna',
        cv_snapshot: 'Ana Rodriguez - Content Writer. 5 years experience. SEO, blog posts, marketing copy.',
        status: 'reviewed',
        match_score: 92.00,
        employer_notes: 'Great writing samples. Strong SEO knowledge.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Elena Martinez applies to Mobile App UI task
      {
        id: '66666666-0000-0000-0000-000000000006',
        job_id: '55555555-0000-0000-0000-000000000007',
        candidate_id: '11111111-0000-0000-0000-000000000002',
        cover_letter: 'Hello,\n\nI\'m excited about this mobile app UI project. I specialize in clean, modern mobile interfaces and have extensive Figma experience. My portfolio includes several fitness and health apps.\n\nBest,\nElena',
        cv_snapshot: 'Elena Martinez - UI/UX Designer. 6 years experience. Figma expert, mobile UI, 100+ designs delivered.',
        status: 'pending',
        match_score: 95.50,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Dan Williams applies to Video Editing task
      {
        id: '66666666-0000-0000-0000-000000000007',
        job_id: '55555555-0000-0000-0000-000000000005',
        candidate_id: '11111111-0000-0000-0000-000000000005',
        cover_letter: 'Hi,\n\nI can edit this YouTube video with a 48-hour turnaround. I have 7 years of experience and have edited 300+ videos. I understand YouTube pacing and engagement techniques.\n\nBest,\nDan',
        cv_snapshot: 'Dan Williams - Video Editor. 7 years experience. Premiere Pro, After Effects, 300+ videos edited.',
        status: 'accepted',
        match_score: 97.00,
        employer_notes: 'Perfect portfolio. Fast turnaround confirmed.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sarah Chen applies to API Integration task
      {
        id: '66666666-0000-0000-0000-000000000008',
        job_id: '55555555-0000-0000-0000-000000000003',
        candidate_id: '11111111-0000-0000-0000-000000000006',
        cover_letter: 'Hi,\n\nI have extensive experience with API integrations and have worked with Shopify API before. I can handle webhooks and real-time sync.\n\nBest,\nSarah',
        cv_snapshot: 'Sarah Chen - Mobile Developer. React Native, Firebase, REST APIs.',
        status: 'pending',
        match_score: 88.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      // James Miller applies to Payment API task
      {
        id: '66666666-0000-0000-0000-000000000009',
        job_id: '55555555-0000-0000-0000-000000000019',
        candidate_id: '11111111-0000-0000-0000-000000000007',
        cover_letter: 'Hello,\n\nI have 8 years of backend experience with payment systems. I have worked with Stripe extensively and understand security best practices.\n\nBest,\nJames',
        cv_snapshot: 'James Miller - Backend Engineer. Python, Java, PostgreSQL, AWS, Stripe.',
        status: 'reviewed',
        match_score: 96.00,
        employer_notes: 'Excellent backend experience. Stripe knowledge is a plus.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Kevin Park applies to SEO Audit task
      {
        id: '66666666-0000-0000-0000-000000000010',
        job_id: '55555555-0000-0000-0000-000000000013',
        candidate_id: '11111111-0000-0000-0000-000000000009',
        cover_letter: 'Hi,\n\nI specialize in SEO audits and have helped 200+ websites improve their rankings. I use Ahrefs and Semrush for comprehensive analysis.\n\nBest,\nKevin',
        cv_snapshot: 'Kevin Park - SEO Expert. 6 years experience. Technical SEO, content strategy.',
        status: 'accepted',
        match_score: 98.00,
        employer_notes: 'Perfect match for this audit.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Nina Volkov applies to Translation task
      {
        id: '66666666-0000-0000-0000-000000000011',
        job_id: '55555555-0000-0000-0000-000000000014',
        candidate_id: '11111111-0000-0000-0000-000000000012',
        cover_letter: 'Hello,\n\nI am a professional translator fluent in English and Spanish. I have 8 years of experience and can handle SEO-friendly translations.\n\nBest,\nNina',
        cv_snapshot: 'Nina Volkov - Translator. English, Spanish, French, Russian. 1M+ words translated.',
        status: 'accepted',
        match_score: 99.00,
        employer_notes: 'Native-level bilingual. Perfect for this task.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Tom Anderson applies to WordPress Speed task
      {
        id: '66666666-0000-0000-0000-000000000012',
        job_id: '55555555-0000-0000-0000-000000000012',
        candidate_id: '11111111-0000-0000-0000-000000000017',
        cover_letter: 'Hi,\n\nI specialize in WordPress optimization. I have built 200+ sites and can definitely achieve 80+ PageSpeed with WooCommerce.\n\nBest,\nTom',
        cv_snapshot: 'Tom Anderson - WordPress Developer. PHP, WooCommerce, speed optimization.',
        status: 'reviewed',
        match_score: 97.00,
        employer_notes: 'Exactly the expertise we need.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Julia Bennett applies to Tableau Dashboard task
      {
        id: '66666666-0000-0000-0000-000000000013',
        job_id: '55555555-0000-0000-0000-000000000018',
        candidate_id: '11111111-0000-0000-0000-000000000018',
        cover_letter: 'Hello,\n\nI am a data analyst with extensive Tableau experience. I can create beautiful, insightful dashboards for financial data.\n\nBest,\nJulia',
        cv_snapshot: 'Julia Bennett - Data Analyst. Tableau, Power BI, Python, SQL.',
        status: 'pending',
        match_score: 95.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Ryan Taylor applies to Security Audit task
      {
        id: '66666666-0000-0000-0000-000000000014',
        job_id: '55555555-0000-0000-0000-000000000020',
        candidate_id: '11111111-0000-0000-0000-000000000015',
        cover_letter: 'Hi,\n\nWith 10 years of full-stack experience, I understand common vulnerabilities and security best practices. I can provide a thorough audit.\n\nBest,\nRyan',
        cv_snapshot: 'Ryan Taylor - Senior Full Stack. React, Node.js, AWS, security.',
        status: 'pending',
        match_score: 89.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Emma Wilson applies to Social Media task
      {
        id: '66666666-0000-0000-0000-000000000015',
        job_id: '55555555-0000-0000-0000-000000000010',
        candidate_id: '11111111-0000-0000-0000-000000000014',
        cover_letter: 'Hello,\n\nI would love to create this content calendar! I have grown accounts to 500K+ followers and understand what content works.\n\nBest,\nEmma',
        cv_snapshot: 'Emma Wilson - Social Media Manager. Instagram, TikTok, content creation.',
        status: 'accepted',
        match_score: 97.00,
        employer_notes: 'Great portfolio and track record.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Chris Lee applies to Motion Graphics task
      {
        id: '66666666-0000-0000-0000-000000000016',
        job_id: '55555555-0000-0000-0000-000000000009',
        candidate_id: '11111111-0000-0000-0000-000000000013',
        cover_letter: 'Hi,\n\nI create motion graphics for major brands like Nike and Spotify. I can deliver a stunning 4K intro with sound design.\n\nBest,\nChris',
        cv_snapshot: 'Chris Lee - Motion Graphics Designer. After Effects, Cinema 4D, Blender.',
        status: 'accepted',
        match_score: 98.00,
        employer_notes: 'Impressive portfolio. Perfect for this project.',
        reviewed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sofia Garcia applies to Product Photography task
      {
        id: '66666666-0000-0000-0000-000000000017',
        job_id: '55555555-0000-0000-0000-000000000016',
        candidate_id: '11111111-0000-0000-0000-000000000016',
        cover_letter: 'Hello,\n\nI can edit these product photos professionally. I am expert in background removal and color correction.\n\nBest,\nSofia',
        cv_snapshot: 'Sofia Garcia - Digital Illustrator. Photoshop, Illustrator, product editing.',
        status: 'pending',
        match_score: 91.00,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('applications', null, {});
  }
};
