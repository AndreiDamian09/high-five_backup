'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employers', [
      {
        id: '22222222-0000-0000-0000-000000000001',
        user_id: '20000000-0000-0000-0000-000000000001',
        company_name: 'TechRetail Inc.',
        company_description: 'E-commerce company looking for skilled contributors to help with data entry, product management, and technical tasks. We post regular tasks with competitive pay.',
        industry: 'IT & Software',
        company_size: '51-200',
        website_url: 'https://techretail.com',
        headquarters_city: 'San Francisco',
        headquarters_country: 'USA',
        founded_year: 2019,
        contact_phone: '+1-555-0123',
        contact_email: 'tasks@techretail.com',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-0000-0000-0000-000000000002',
        user_id: '20000000-0000-0000-0000-000000000002',
        company_name: 'StartupX',
        company_description: 'Fast-growing tech startup needing help with development, research, and content creation. We value quality work and fast turnaround.',
        industry: 'IT & Software',
        company_size: '11-50',
        website_url: 'https://startupx.io',
        headquarters_city: 'Austin',
        headquarters_country: 'USA',
        founded_year: 2022,
        contact_phone: '+1-555-0456',
        contact_email: 'projects@startupx.io',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-0000-0000-0000-000000000003',
        user_id: '20000000-0000-0000-0000-000000000003',
        company_name: 'Content Creators Co.',
        company_description: 'Media production company seeking talented contributors for transcription, video editing, content writing, and social media management tasks.',
        industry: 'Design & Creativitate',
        company_size: '11-50',
        website_url: 'https://contentcreators.co',
        headquarters_city: 'Los Angeles',
        headquarters_country: 'USA',
        founded_year: 2020,
        contact_phone: '+1-555-0789',
        contact_email: 'work@contentcreators.co',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-0000-0000-0000-000000000004',
        user_id: '20000000-0000-0000-0000-000000000004',
        company_name: 'Digital Agency Pro',
        company_description: 'Full-service digital agency looking for freelancers to collaborate on web design, development, SEO, and marketing tasks.',
        industry: 'Vânzări & Marketing',
        company_size: '11-50',
        website_url: 'https://digitalagency.com',
        headquarters_city: 'New York',
        headquarters_country: 'USA',
        founded_year: 2018,
        contact_phone: '+1-555-0321',
        contact_email: 'hire@digitalagency.com',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-0000-0000-0000-000000000005',
        user_id: '20000000-0000-0000-0000-000000000005',
        company_name: 'EcommGrowth',
        company_description: 'E-commerce consulting firm helping online stores scale. We need freelancers for Shopify development, product listings, and marketing automation.',
        industry: 'Vânzări & Marketing',
        company_size: '11-50',
        website_url: 'https://ecommgrowth.com',
        headquarters_city: 'Chicago',
        headquarters_country: 'USA',
        founded_year: 2021,
        contact_phone: '+1-555-0654',
        contact_email: 'team@ecommgrowth.com',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-0000-0000-0000-000000000006',
        user_id: '20000000-0000-0000-0000-000000000006',
        company_name: 'FinTech Solutions',
        company_description: 'Financial technology company seeking contributors for data analysis, API development, and security audits.',
        industry: 'Financiar & Contabilitate',
        company_size: '51-200',
        website_url: 'https://fintech.io',
        headquarters_city: 'Boston',
        headquarters_country: 'USA',
        founded_year: 2017,
        contact_phone: '+1-555-0987',
        contact_email: 'projects@fintech.io',
        is_verified_company: true,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employers', null, {});
  }
};
