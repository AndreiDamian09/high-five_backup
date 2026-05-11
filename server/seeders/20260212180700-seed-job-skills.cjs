'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Look up skill IDs by name to avoid hardcoded ID issues
    const [skills] = await queryInterface.sequelize.query('SELECT id, name FROM skills');
    const skillMap = {};
    skills.forEach(s => { skillMap[s.name] = s.id; });

    const s = (name) => {
      if (!skillMap[name]) {
        console.warn(`Skill not found: ${name}, skipping...`);
        return null;
      }
      return skillMap[name];
    };

    const jobSkills = [
      // Task 1: Data Entry for E-commerce Product Catalog
      { job_id: '55555555-0000-0000-0000-000000000001', skill_id: s('Excel'), is_required: true, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000001', skill_id: s('Google Workspace'), is_required: false, min_proficiency: 2 },
      { job_id: '55555555-0000-0000-0000-000000000001', skill_id: s('Organizare'), is_required: true, min_proficiency: 3 },
      
      // Task 2: Build Simple React Dashboard Component
      { job_id: '55555555-0000-0000-0000-000000000002', skill_id: s('React'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000002', skill_id: s('JavaScript'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000002', skill_id: s('TypeScript'), is_required: false, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000002', skill_id: s('Git'), is_required: true, min_proficiency: 3 },
      
      // Task 3: API Integration for Inventory System
      { job_id: '55555555-0000-0000-0000-000000000003', skill_id: s('Node.js'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000003', skill_id: s('JavaScript'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000003', skill_id: s('PostgreSQL'), is_required: false, min_proficiency: 3 },
      
      // Task 4: Transcribe 2-Hour Podcast Episode
      { job_id: '55555555-0000-0000-0000-000000000004', skill_id: s('Comunicare'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000004', skill_id: s('Organizare'), is_required: true, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000004', skill_id: s('Microsoft Office'), is_required: false, min_proficiency: 3 },
      
      // Task 5: Python Script for Data Scraping
      { job_id: '55555555-0000-0000-0000-000000000005', skill_id: s('Python'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000005', skill_id: s('Git'), is_required: true, min_proficiency: 3 },
      
      // Task 6: Create Landing Page from Figma Design
      { job_id: '55555555-0000-0000-0000-000000000006', skill_id: s('JavaScript'), is_required: true, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000006', skill_id: s('Git'), is_required: false, min_proficiency: 2 },
      
      // Task 7: Edit 10-Minute YouTube Video
      { job_id: '55555555-0000-0000-0000-000000000007', skill_id: s('Creativitate'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000007', skill_id: s('Adobe Photoshop'), is_required: false, min_proficiency: 3 },
      
      // Task 8: Write 5 SEO Blog Posts
      { job_id: '55555555-0000-0000-0000-000000000008', skill_id: s('Comunicare'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000008', skill_id: s('Creativitate'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000008', skill_id: s('SEO'), is_required: true, min_proficiency: 3 },
      
      // Task 9: Create 30-Second Motion Graphics Intro
      { job_id: '55555555-0000-0000-0000-000000000009', skill_id: s('Adobe Photoshop'), is_required: false, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000009', skill_id: s('Creativitate'), is_required: true, min_proficiency: 5 },
      
      // Task 10: Social Media Content Calendar
      { job_id: '55555555-0000-0000-0000-000000000010', skill_id: s('Social Media'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000010', skill_id: s('Content Marketing'), is_required: true, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000010', skill_id: s('Creativitate'), is_required: true, min_proficiency: 3 },
      
      // Task 11: Design UI for Mobile App
      { job_id: '55555555-0000-0000-0000-000000000011', skill_id: s('Figma'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000011', skill_id: s('Adobe XD'), is_required: false, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000011', skill_id: s('Creativitate'), is_required: true, min_proficiency: 4 },
      
      // Task 12: WordPress Website Speed Optimization
      { job_id: '55555555-0000-0000-0000-000000000012', skill_id: s('PHP'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000012', skill_id: s('JavaScript'), is_required: false, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000012', skill_id: s('Rezolvare probleme'), is_required: true, min_proficiency: 4 },
      
      // Task 13: SEO Audit and Recommendations Report
      { job_id: '55555555-0000-0000-0000-000000000013', skill_id: s('SEO'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000013', skill_id: s('Marketing Digital'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000013', skill_id: s('Gândire critică'), is_required: true, min_proficiency: 4 },
      
      // Task 14: Translate Website (English to Spanish)
      { job_id: '55555555-0000-0000-0000-000000000014', skill_id: s('Limba Spaniolă'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000014', skill_id: s('Limba Engleză'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000014', skill_id: s('SEO'), is_required: false, min_proficiency: 2 },
      
      // Task 15: Shopify Store Setup and Configuration
      { job_id: '55555555-0000-0000-0000-000000000015', skill_id: s('JavaScript'), is_required: false, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000015', skill_id: s('Organizare'), is_required: true, min_proficiency: 4 },
      
      // Task 16: Product Photography Editing
      { job_id: '55555555-0000-0000-0000-000000000016', skill_id: s('Adobe Photoshop'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000016', skill_id: s('Creativitate'), is_required: true, min_proficiency: 3 },
      
      // Task 17: Email Marketing Automation Setup
      { job_id: '55555555-0000-0000-0000-000000000017', skill_id: s('Marketing Digital'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000017', skill_id: s('Comunicare'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000017', skill_id: s('Creativitate'), is_required: true, min_proficiency: 3 },
      
      // Task 18: Data Visualization Dashboard in Tableau
      { job_id: '55555555-0000-0000-0000-000000000018', skill_id: s('Excel'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000018', skill_id: s('Analiză financiară'), is_required: true, min_proficiency: 3 },
      { job_id: '55555555-0000-0000-0000-000000000018', skill_id: s('Creativitate'), is_required: false, min_proficiency: 3 },
      
      // Task 19: Build REST API for Payment Processing
      { job_id: '55555555-0000-0000-0000-000000000019', skill_id: s('Node.js'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000019', skill_id: s('Python'), is_required: false, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000019', skill_id: s('PostgreSQL'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000019', skill_id: s('AWS'), is_required: false, min_proficiency: 3 },
      
      // Task 20: Security Audit for Web Application
      { job_id: '55555555-0000-0000-0000-000000000020', skill_id: s('Python'), is_required: true, min_proficiency: 4 },
      { job_id: '55555555-0000-0000-0000-000000000020', skill_id: s('Rezolvare probleme'), is_required: true, min_proficiency: 5 },
      { job_id: '55555555-0000-0000-0000-000000000020', skill_id: s('Gândire critică'), is_required: true, min_proficiency: 5 },
    ].filter(item => item.skill_id !== null);

    if (jobSkills.length > 0) {
      await queryInterface.bulkInsert('job_skills', jobSkills, { ignoreDuplicates: true });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('job_skills', null, {});
  }
};
