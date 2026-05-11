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

    const candidateSkills = [
      // Alex Thompson - Full Stack Developer
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('JavaScript'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('TypeScript'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('React'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('Node.js'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('Python'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('PostgreSQL'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000001', skill_id: s('Git'), proficiency_level: 5, years_experience: 4 },
      
      // Elena Martinez - UI/UX Designer
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Figma'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Adobe Photoshop'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Adobe Illustrator'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Adobe XD'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Sketch'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000002', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 6 },
      
      // Mihai Petrov - Data Entry Specialist
      { candidate_id: '11111111-0000-0000-0000-000000000003', skill_id: s('Excel'), proficiency_level: 5, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000003', skill_id: s('Google Workspace'), proficiency_level: 5, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000003', skill_id: s('Python'), proficiency_level: 3, years_experience: 2 },
      { candidate_id: '11111111-0000-0000-0000-000000000003', skill_id: s('PostgreSQL'), proficiency_level: 3, years_experience: 2 },
      { candidate_id: '11111111-0000-0000-0000-000000000003', skill_id: s('Organizare'), proficiency_level: 5, years_experience: 3 },
      
      // Ana Rodriguez - Content Writer
      { candidate_id: '11111111-0000-0000-0000-000000000004', skill_id: s('Comunicare'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000004', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000004', skill_id: s('Microsoft Office'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000004', skill_id: s('SEO'), proficiency_level: 4, years_experience: 3 },
      
      // Dan Williams - Video Editor
      { candidate_id: '11111111-0000-0000-0000-000000000005', skill_id: s('Adobe Photoshop'), proficiency_level: 4, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000005', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 7 },
      { candidate_id: '11111111-0000-0000-0000-000000000005', skill_id: s('Comunicare'), proficiency_level: 4, years_experience: 7 },
      
      // Sarah Chen - Mobile Developer
      { candidate_id: '11111111-0000-0000-0000-000000000006', skill_id: s('JavaScript'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000006', skill_id: s('TypeScript'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000006', skill_id: s('React'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000006', skill_id: s('Git'), proficiency_level: 5, years_experience: 4 },
      
      // James Miller - Backend Engineer
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('Python'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('Java'), proficiency_level: 5, years_experience: 7 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('Go'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('PostgreSQL'), proficiency_level: 5, years_experience: 7 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('Docker'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('Kubernetes'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000007', skill_id: s('AWS'), proficiency_level: 5, years_experience: 6 },
      
      // Maria Santos - Copywriter
      { candidate_id: '11111111-0000-0000-0000-000000000008', skill_id: s('Comunicare'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000008', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000008', skill_id: s('SEO'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000008', skill_id: s('Marketing Digital'), proficiency_level: 4, years_experience: 4 },
      
      // Kevin Park - SEO Expert
      { candidate_id: '11111111-0000-0000-0000-000000000009', skill_id: s('SEO'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000009', skill_id: s('Marketing Digital'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000009', skill_id: s('Google Ads'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000009', skill_id: s('Content Marketing'), proficiency_level: 4, years_experience: 5 },
      
      // Lisa Johnson - QA Engineer
      { candidate_id: '11111111-0000-0000-0000-000000000010', skill_id: s('Selenium'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000010', skill_id: s('Cypress'), proficiency_level: 5, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000010', skill_id: s('Manual Testing'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000010', skill_id: s('JavaScript'), proficiency_level: 3, years_experience: 3 },
      
      // Andrei Popescu - DevOps Engineer
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('AWS'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('Docker'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('Kubernetes'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('Terraform'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('Jenkins'), proficiency_level: 4, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000011', skill_id: s('GitHub Actions'), proficiency_level: 4, years_experience: 3 },
      
      // Nina Volkov - Translator
      { candidate_id: '11111111-0000-0000-0000-000000000012', skill_id: s('Limba Engleză'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000012', skill_id: s('Limba Spaniolă'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000012', skill_id: s('Limba Franceză'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000012', skill_id: s('Comunicare'), proficiency_level: 5, years_experience: 8 },
      
      // Chris Lee - Motion Graphics
      { candidate_id: '11111111-0000-0000-0000-000000000013', skill_id: s('Adobe Photoshop'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000013', skill_id: s('Adobe Illustrator'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000013', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 5 },
      
      // Emma Wilson - Social Media Manager
      { candidate_id: '11111111-0000-0000-0000-000000000014', skill_id: s('Social Media'), proficiency_level: 5, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000014', skill_id: s('Content Marketing'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000014', skill_id: s('Facebook Ads'), proficiency_level: 4, years_experience: 3 },
      { candidate_id: '11111111-0000-0000-0000-000000000014', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 4 },
      
      // Ryan Taylor - Senior Full Stack
      { candidate_id: '11111111-0000-0000-0000-000000000015', skill_id: s('React'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000015', skill_id: s('Node.js'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000015', skill_id: s('Python'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000015', skill_id: s('AWS'), proficiency_level: 5, years_experience: 7 },
      { candidate_id: '11111111-0000-0000-0000-000000000015', skill_id: s('Leadership'), proficiency_level: 5, years_experience: 5 },
      
      // Sofia Garcia - Illustrator
      { candidate_id: '11111111-0000-0000-0000-000000000016', skill_id: s('Adobe Photoshop'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000016', skill_id: s('Adobe Illustrator'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000016', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 5 },
      
      // Tom Anderson - WordPress Developer
      { candidate_id: '11111111-0000-0000-0000-000000000017', skill_id: s('PHP'), proficiency_level: 5, years_experience: 8 },
      { candidate_id: '11111111-0000-0000-0000-000000000017', skill_id: s('JavaScript'), proficiency_level: 4, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000017', skill_id: s('MySQL'), proficiency_level: 4, years_experience: 7 },
      
      // Julia Bennett - Data Analyst
      { candidate_id: '11111111-0000-0000-0000-000000000018', skill_id: s('Python'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000018', skill_id: s('PostgreSQL'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000018', skill_id: s('Excel'), proficiency_level: 5, years_experience: 6 },
      { candidate_id: '11111111-0000-0000-0000-000000000018', skill_id: s('Analiză financiară'), proficiency_level: 4, years_experience: 4 },
      
      // Marcus Brown - Audio Engineer
      { candidate_id: '11111111-0000-0000-0000-000000000019', skill_id: s('Creativitate'), proficiency_level: 5, years_experience: 9 },
      { candidate_id: '11111111-0000-0000-0000-000000000019', skill_id: s('Comunicare'), proficiency_level: 4, years_experience: 8 },
      
      // Olivia Davis - UX Researcher
      { candidate_id: '11111111-0000-0000-0000-000000000020', skill_id: s('Figma'), proficiency_level: 4, years_experience: 4 },
      { candidate_id: '11111111-0000-0000-0000-000000000020', skill_id: s('Comunicare'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000020', skill_id: s('Rezolvare probleme'), proficiency_level: 5, years_experience: 5 },
      { candidate_id: '11111111-0000-0000-0000-000000000020', skill_id: s('Gândire critică'), proficiency_level: 5, years_experience: 5 },
    ].filter(item => item.skill_id !== null);

    if (candidateSkills.length > 0) {
      await queryInterface.bulkInsert('candidate_skills', candidateSkills, { ignoreDuplicates: true });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('candidate_skills', null, {});
  }
};
