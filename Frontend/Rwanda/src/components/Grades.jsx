import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Grades() {
  const [candidates, setCandidates] = useState([]);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    CandidateNationalId: '',
    LicenseExamCategory: 'A',
    obtainedMarks_20: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [c, g] = await Promise.all([api.getCandidates(), api.getGrades()]);
      setCandidates(c);
      setGrades(g);
    } catch (err) {
      console.error('Failed to load data');
    }
  };

  const handleSubmit = async () => {
    try {
      await api.saveGrade({
        ...formData,
        obtainedMarks_20: parseInt(formData.obtainedMarks_20)
      });
      alert('Grade saved successfully!');
      setFormData({ CandidateNationalId: '', LicenseExamCategory: 'A', obtainedMarks_20: '' });
      loadData();
    } catch (err) {
      alert(err.error || 'Failed to save grade');
    }
  };

  const getDecision = (marks) => {
    if (!marks && marks !== 0) return '-';
    return marks >= 12 ? 'Pass' : 'Fail';
  };

  const getCandidateName = (id) => {
    const c = candidates.find(c => c.CandidateNationalId === id);
    return c ? `${c.FirstName} ${c.LastName}` : id;
  };

  return (
    <div className="space-y-6" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80')" }}>
      <h2 className="text-2xl font-bold text-white">Record Grades</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold mb-4">Enter Exam Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={formData.CandidateNationalId}
            onChange={(e) => setFormData({...formData, CandidateNationalId: e.target.value})}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Candidate</option>
            {candidates.map(c => (
              <option key={c.CandidateNationalId} value={c.CandidateNationalId}>
                {c.FirstName} {c.LastName} ({c.CandidateNationalId})
              </option>
            ))}
          </select>
          
          <select
            value={formData.LicenseExamCategory}
            onChange={(e) => setFormData({...formData, LicenseExamCategory: e.target.value})}
            className="border p-3 rounded-lg"
          >
            <option value="A">Category A (Motorcycle)</option>
            <option value="B">Category B (Car)</option>
            <option value="C">Category C (Truck)</option>
            <option value="D">Category D (Bus)</option>
            <option value="E">Category E (Heavy Truck)</option>
          </select>
          
          <input
            type="number"
            min="0"
            max="20"
            placeholder="Marks /20"
            value={formData.obtainedMarks_20}
            onChange={(e) => setFormData({...formData, obtainedMarks_20: e.target.value})}
            className="border p-3 rounded-lg"
          />
        </div>
        
        {formData.obtainedMarks_20 !== '' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Decision: </span>
            <span className={`font-bold text-lg ${
              parseInt(formData.obtainedMarks_20) >= 12 ? 'text-green-600' : 'text-red-600'
            }`}>
              {getDecision(parseInt(formData.obtainedMarks_20))}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              (Passing line: 12/20)
            </span>
          </div>
        )}
        
        <button 
          onClick={handleSubmit}
          disabled={!formData.CandidateNationalId || !formData.obtainedMarks_20}
          className="mt-4 w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          Save Grade
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h3 className="font-semibold p-4 border-b">All Grades</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-125">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm">Candidate</th>
                <th className="text-left p-3 text-sm">Category</th>
                <th className="text-center p-3 text-sm">Marks</th>
                <th className="text-center p-3 text-sm">Decision</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3 text-sm">{g.FirstName} {g.LastName}</td>
                  <td className="p-3 text-sm">Category {g.LicenseExamCategory}</td>
                  <td className="p-3 text-center font-bold">{g.obtainedMarks_20}/20</td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      g.Decision === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {g.Decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Grades;