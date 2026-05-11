'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      // Admin
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@taskmatching.com',
        password_hash: hashedPassword,
        role: 'admin',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Contributors (people who complete tasks) - 20 total
      {
        id: '10000000-0000-0000-0000-000000000001',
        email: 'alex.web@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000002',
        email: 'elena.design@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000003',
        email: 'mihai.data@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000004',
        email: 'ana.content@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000005',
        email: 'dan.video@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000006',
        email: 'sarah.mobile@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000007',
        email: 'james.backend@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000008',
        email: 'maria.copywrite@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000009',
        email: 'kevin.seo@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000010',
        email: 'lisa.qa@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000011',
        email: 'andrei.devops@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000012',
        email: 'nina.translator@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000013',
        email: 'chris.motion@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000014',
        email: 'emma.social@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000015',
        email: 'ryan.fullstack@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000016',
        email: 'sofia.illustration@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000017',
        email: 'tom.wordpress@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000018',
        email: 'julia.data@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000019',
        email: 'marcus.audio@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '10000000-0000-0000-0000-000000000020',
        email: 'olivia.uxresearch@email.com',
        password_hash: hashedPassword,
        role: 'candidate',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Requesters (people who post tasks) - 6 total
      {
        id: '20000000-0000-0000-0000-000000000001',
        email: 'tasks@techretail.com',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '20000000-0000-0000-0000-000000000002',
        email: 'projects@startupx.io',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '20000000-0000-0000-0000-000000000003',
        email: 'work@contentcreators.co',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '20000000-0000-0000-0000-000000000004',
        email: 'hire@digitalagency.com',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '20000000-0000-0000-0000-000000000005',
        email: 'team@ecommgrowth.com',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '20000000-0000-0000-0000-000000000006',
        email: 'projects@fintech.io',
        password_hash: hashedPassword,
        role: 'employer',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
