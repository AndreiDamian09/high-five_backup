'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      // Notifications for Alex Thompson
      {
        id: '88888888-0000-0000-0000-000000000001',
        user_id: '10000000-0000-0000-0000-000000000001',
        type: 'new_match',
        title: 'New task match!',
        message: 'Your profile matches 94% with "Build Simple React Dashboard Component" by TechRetail Inc.',
        data: JSON.stringify({ job_id: '55555555-0000-0000-0000-000000000002', match_score: 94.50 }),
        is_read: true,
        created_at: new Date(Date.now() - 86400000)
      },
      {
        id: '88888888-0000-0000-0000-000000000002',
        user_id: '10000000-0000-0000-0000-000000000001',
        type: 'application_update',
        title: 'Application reviewed',
        message: 'TechRetail Inc. has reviewed your application for the React Dashboard task.',
        data: JSON.stringify({ application_id: '66666666-0000-0000-0000-000000000001' }),
        is_read: false,
        created_at: new Date()
      },
      
      // Notifications for Mihai Petrov
      {
        id: '88888888-0000-0000-0000-000000000003',
        user_id: '10000000-0000-0000-0000-000000000003',
        type: 'new_match',
        title: 'Excellent match!',
        message: 'You have a 96% match with "Data Entry for E-commerce Product Catalog" by TechRetail Inc.!',
        data: JSON.stringify({ job_id: '55555555-0000-0000-0000-000000000001', match_score: 96.00 }),
        is_read: true,
        created_at: new Date(Date.now() - 172800000)
      },
      {
        id: '88888888-0000-0000-0000-000000000004',
        user_id: '10000000-0000-0000-0000-000000000003',
        type: 'application_update',
        title: 'Congratulations! Task assigned',
        message: 'TechRetail Inc. has accepted your application for the Data Entry task. Check your messages.',
        data: JSON.stringify({ application_id: '66666666-0000-0000-0000-000000000003', status: 'accepted' }),
        is_read: false,
        created_at: new Date()
      },
      
      // Notifications for Ana Rodriguez
      {
        id: '88888888-0000-0000-0000-000000000005',
        user_id: '10000000-0000-0000-0000-000000000004',
        type: 'new_match',
        title: 'Perfect match found!',
        message: 'Your profile matches 98% with "Transcribe 2-Hour Podcast Episode" by StartupX.',
        data: JSON.stringify({ job_id: '55555555-0000-0000-0000-000000000003', match_score: 98.00 }),
        is_read: true,
        created_at: new Date(Date.now() - 86400000)
      },
      {
        id: '88888888-0000-0000-0000-000000000006',
        user_id: '10000000-0000-0000-0000-000000000004',
        type: 'application_update',
        title: 'Task assigned!',
        message: 'You\'ve been selected for the Transcription task. The requester will send details shortly.',
        data: JSON.stringify({ application_id: '66666666-0000-0000-0000-000000000004', status: 'accepted' }),
        is_read: false,
        created_at: new Date()
      },
      
      // Notifications for Requesters
      {
        id: '88888888-0000-0000-0000-000000000007',
        user_id: '20000000-0000-0000-0000-000000000001',
        type: 'new_application',
        title: 'New application!',
        message: 'Alex Thompson has applied for your "Build Simple React Dashboard Component" task.',
        data: JSON.stringify({ application_id: '66666666-0000-0000-0000-000000000001', candidate_id: '11111111-0000-0000-0000-000000000001' }),
        is_read: true,
        created_at: new Date(Date.now() - 86400000)
      },
      {
        id: '88888888-0000-0000-0000-000000000008',
        user_id: '20000000-0000-0000-0000-000000000002',
        type: 'new_application',
        title: 'New application!',
        message: 'Ana Rodriguez has applied for your "Transcribe 2-Hour Podcast Episode" task.',
        data: JSON.stringify({ application_id: '66666666-0000-0000-0000-000000000004', candidate_id: '11111111-0000-0000-0000-000000000004' }),
        is_read: true,
        created_at: new Date(Date.now() - 172800000)
      },
      {
        id: '88888888-0000-0000-0000-000000000009',
        user_id: '20000000-0000-0000-0000-000000000003',
        type: 'new_match',
        title: 'Matching contributor found!',
        message: 'Dan Williams has a 97% match for your "Edit 10-Minute YouTube Video" task.',
        data: JSON.stringify({ match_id: '77777777-0000-0000-0000-000000000004', candidate_id: '11111111-0000-0000-0000-000000000005' }),
        is_read: false,
        created_at: new Date()
      },
      
      // Admin notifications
      {
        id: '88888888-0000-0000-0000-000000000010',
        user_id: '00000000-0000-0000-0000-000000000001',
        type: 'system',
        title: 'Daily report',
        message: 'Today: 5 new users, 7 applications, 6 matches generated.',
        data: JSON.stringify({ new_users: 5, applications: 7, matches: 6 }),
        is_read: false,
        created_at: new Date()
      },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
