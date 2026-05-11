'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('skills', [
      // IT & Programming
      { name: 'JavaScript', category: 'programming', created_at: new Date() },
      { name: 'TypeScript', category: 'programming', created_at: new Date() },
      { name: 'Python', category: 'programming', created_at: new Date() },
      { name: 'Java', category: 'programming', created_at: new Date() },
      { name: 'C#', category: 'programming', created_at: new Date() },
      { name: 'C++', category: 'programming', created_at: new Date() },
      { name: 'PHP', category: 'programming', created_at: new Date() },
      { name: 'Go', category: 'programming', created_at: new Date() },
      { name: 'Ruby', category: 'programming', created_at: new Date() },
      { name: 'Rust', category: 'programming', created_at: new Date() },
      
      // Frameworks & Libraries
      { name: 'React', category: 'framework', created_at: new Date() },
      { name: 'Node.js', category: 'framework', created_at: new Date() },
      { name: 'Angular', category: 'framework', created_at: new Date() },
      { name: 'Vue.js', category: 'framework', created_at: new Date() },
      { name: 'Django', category: 'framework', created_at: new Date() },
      { name: 'Flask', category: 'framework', created_at: new Date() },
      { name: 'Spring Boot', category: 'framework', created_at: new Date() },
      { name: '.NET', category: 'framework', created_at: new Date() },
      { name: 'Laravel', category: 'framework', created_at: new Date() },
      { name: 'Express.js', category: 'framework', created_at: new Date() },
      
      // Databases
      { name: 'MongoDB', category: 'database', created_at: new Date() },
      { name: 'PostgreSQL', category: 'database', created_at: new Date() },
      { name: 'MySQL', category: 'database', created_at: new Date() },
      { name: 'Redis', category: 'database', created_at: new Date() },
      { name: 'Oracle', category: 'database', created_at: new Date() },
      { name: 'SQL Server', category: 'database', created_at: new Date() },
      { name: 'Elasticsearch', category: 'database', created_at: new Date() },
      
      // DevOps & Tools
      { name: 'Docker', category: 'tool', created_at: new Date() },
      { name: 'Kubernetes', category: 'tool', created_at: new Date() },
      { name: 'Git', category: 'tool', created_at: new Date() },
      { name: 'Jenkins', category: 'tool', created_at: new Date() },
      { name: 'GitLab CI/CD', category: 'tool', created_at: new Date() },
      { name: 'GitHub Actions', category: 'tool', created_at: new Date() },
      { name: 'Terraform', category: 'tool', created_at: new Date() },
      { name: 'Ansible', category: 'tool', created_at: new Date() },
      
      // Cloud
      { name: 'AWS', category: 'cloud', created_at: new Date() },
      { name: 'Azure', category: 'cloud', created_at: new Date() },
      { name: 'Google Cloud', category: 'cloud', created_at: new Date() },
      { name: 'Heroku', category: 'cloud', created_at: new Date() },
      
      // Testing
      { name: 'Jest', category: 'testing', created_at: new Date() },
      { name: 'Mocha', category: 'testing', created_at: new Date() },
      { name: 'Selenium', category: 'testing', created_at: new Date() },
      { name: 'Cypress', category: 'testing', created_at: new Date() },
      { name: 'JUnit', category: 'testing', created_at: new Date() },
      { name: 'PyTest', category: 'testing', created_at: new Date() },
      { name: 'Manual Testing', category: 'testing', created_at: new Date() },
      
      // Project Management
      { name: 'Jira', category: 'tool', created_at: new Date() },
      { name: 'Trello', category: 'tool', created_at: new Date() },
      { name: 'Asana', category: 'tool', created_at: new Date() },
      { name: 'Monday.com', category: 'tool', created_at: new Date() },
      
      // Office & Business
      { name: 'Microsoft Office', category: 'tool', created_at: new Date() },
      { name: 'Excel', category: 'tool', created_at: new Date() },
      { name: 'PowerPoint', category: 'tool', created_at: new Date() },
      { name: 'Word', category: 'tool', created_at: new Date() },
      { name: 'Google Workspace', category: 'tool', created_at: new Date() },
      
      // ERP & Business Software
      { name: 'SAP', category: 'erp', created_at: new Date() },
      { name: 'Oracle ERP', category: 'erp', created_at: new Date() },
      { name: 'SAGA C', category: 'accounting', created_at: new Date() },
      { name: 'WizOne', category: 'accounting', created_at: new Date() },
      
      // Design
      { name: 'AutoCAD', category: 'design', created_at: new Date() },
      { name: 'Adobe Photoshop', category: 'design', created_at: new Date() },
      { name: 'Adobe Illustrator', category: 'design', created_at: new Date() },
      { name: 'Figma', category: 'design', created_at: new Date() },
      { name: 'Sketch', category: 'design', created_at: new Date() },
      { name: 'Canva', category: 'design', created_at: new Date() },
      { name: 'Adobe XD', category: 'design', created_at: new Date() },
      
      // Soft Skills
      { name: 'Comunicare', category: 'soft-skill', created_at: new Date() },
      { name: 'Leadership', category: 'soft-skill', created_at: new Date() },
      { name: 'Negociere', category: 'soft-skill', created_at: new Date() },
      { name: 'Lucru în echipă', category: 'soft-skill', created_at: new Date() },
      { name: 'Creativitate', category: 'soft-skill', created_at: new Date() },
      { name: 'Organizare', category: 'soft-skill', created_at: new Date() },
      { name: 'Rezolvare probleme', category: 'soft-skill', created_at: new Date() },
      { name: 'Gândire critică', category: 'soft-skill', created_at: new Date() },
      { name: 'Time Management', category: 'soft-skill', created_at: new Date() },
      { name: 'Adaptabilitate', category: 'soft-skill', created_at: new Date() },
      
      // Languages
      { name: 'Limba Engleză', category: 'language', created_at: new Date() },
      { name: 'Limba Franceză', category: 'language', created_at: new Date() },
      { name: 'Limba Germană', category: 'language', created_at: new Date() },
      { name: 'Limba Spaniolă', category: 'language', created_at: new Date() },
      { name: 'Limba Italiană', category: 'language', created_at: new Date() },
      
      // Finance & Accounting
      { name: 'Contabilitate', category: 'finance', created_at: new Date() },
      { name: 'Audit', category: 'finance', created_at: new Date() },
      { name: 'Analiză financiară', category: 'finance', created_at: new Date() },
      { name: 'Fiscalitate', category: 'finance', created_at: new Date() },
      { name: 'Bugetare', category: 'finance', created_at: new Date() },
      
      // HR
      { name: 'Recrutare', category: 'hr', created_at: new Date() },
      { name: 'Salarizare', category: 'hr', created_at: new Date() },
      { name: 'Revisal', category: 'hr', created_at: new Date() },
      { name: 'Legislație muncii', category: 'hr', created_at: new Date() },
      
      // Legal
      { name: 'Drept Comercial', category: 'legal', created_at: new Date() },
      { name: 'Drept Civil', category: 'legal', created_at: new Date() },
      { name: 'Drept Penal', category: 'legal', created_at: new Date() },
      { name: 'Drept Administrativ', category: 'legal', created_at: new Date() },
      
      // Licenses & Certifications
      { name: 'Permis B', category: 'license', created_at: new Date() },
      { name: 'Permis C', category: 'license', created_at: new Date() },
      { name: 'Permis C+E', category: 'license', created_at: new Date() },
      { name: 'Permis D', category: 'license', created_at: new Date() },
      { name: 'HACCP', category: 'certification', created_at: new Date() },
      { name: 'Atestat Pază', category: 'certification', created_at: new Date() },
      { name: 'PMP', category: 'certification', created_at: new Date() },
      { name: 'Scrum Master', category: 'certification', created_at: new Date() },
      
      // Sales & Marketing
      { name: 'Vânzări B2B', category: 'sales', created_at: new Date() },
      { name: 'Vânzări B2C', category: 'sales', created_at: new Date() },
      { name: 'Marketing Digital', category: 'marketing', created_at: new Date() },
      { name: 'SEO', category: 'marketing', created_at: new Date() },
      { name: 'Google Ads', category: 'marketing', created_at: new Date() },
      { name: 'Facebook Ads', category: 'marketing', created_at: new Date() },
      { name: 'Content Marketing', category: 'marketing', created_at: new Date() },
      { name: 'Social Media', category: 'marketing', created_at: new Date() },
    ], { ignoreDuplicates: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('skills', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE skills_id_seq RESTART WITH 1');
  }
};
