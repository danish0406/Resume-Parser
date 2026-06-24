import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const JobForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company || !description || !skillsInput) return;

    const formattedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .join(',');

    onSubmit({
      title,
      company,
      description,
      required_skills: formattedSkills
    });

    setTitle('');
    setCompany('');
    setDescription('');
    setSkillsInput('');
  };

  return (
    <Card className="border-[#253746] bg-[#172330]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white mb-2">Create Job Description</h3>
        
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Job Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior React Developer"
            className="w-full bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Company Name</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. SaaS Solutions Inc."
            className="w-full bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Required Skills (Comma separated)</label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. React, Node.js, TypeScript, SQL"
            className="w-full bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Job Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role requirements and context..."
            className="w-full h-32 bg-[#080C10] border border-[#253746] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#FF763D] transition-colors duration-200 resize-none"
            required
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading || !title || !company || !description || !skillsInput}
          className="mt-2"
        >
          {loading ? 'Creating Job...' : 'Create & Match Candidates'}
        </Button>
      </form>
    </Card>
  );
};
export default JobForm;
