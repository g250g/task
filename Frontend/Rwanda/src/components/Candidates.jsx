import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    CandidateNationalId: '',
    FirstName: '',
    LastName: '',
    Gender: 'Male',
    DOB: '',
    ExamDate: '',
    PhoneNumber: ''
  });

  useEffect(() => {
    loadCandidates();
  }, []);

 const loadCandidates = async () => {
    try {
        const data = await api.getCandidates();
        setCandidates(data);
    } catch (err) {
        console.error('Full error:', err);
        alert(err.error || err.message || 'Failed to load candidates - check console');
    }
};

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api.updateCandidate(editing, formData);
      } else {
        await api.createCandidate(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({
        CandidateNationalId: '',
        FirstName: '',
        LastName: '',
        Gender: 'Male',
        DOB: '',
        ExamDate: '',
        PhoneNumber: ''
      });
      loadCandidates();
    } catch (err) {
      alert(err.error || 'Operation failed');
    }
  };

  const handleEdit = (candidate) => {
    setEditing(candidate.CandidateNationalId);
    setFormData({
      CandidateNationalId: candidate.CandidateNationalId,
      FirstName: candidate.FirstName,
      LastName: candidate.LastName,
      Gender: candidate.Gender,
      DOB: candidate.DOB?.split('T')[0] || '',
      ExamDate: candidate.ExamDate?.split('T')[0] || '',
      PhoneNumber: candidate.PhoneNumber
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this candidate?')) return;
    try {
      await api.deleteCandidate(id);
      loadCandidates();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
<div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 
      
      ">
        <h2 className="text-2xl font-bold text-white">Manage Candidates</h2>
        <button 
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Candidate
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 text-sm">National ID</th>
                <th className="text-left p-3 text-sm">Name</th>
                <th className="text-left p-3 text-sm">Gender</th>
                <th className="text-left p-3 text-sm">DOB</th>
                <th className="text-left p-3 text-sm">Exam Date</th>
                <th className="text-left p-3 text-sm">Phone</th>
                <th className="text-right p-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.CandidateNationalId} className="border-t">
                  <td className="p-3 text-sm">{c.CandidateNationalId}</td>
                  <td className="p-3 text-sm">{c.FirstName} {c.LastName}</td>
                  <td className="p-3 text-sm">{c.Gender}</td>
                  <td className="p-3 text-sm">{c.DOB?.split('T')[0]}</td>
                  <td className="p-3 text-sm">{c.ExamDate?.split('T')[0]}</td>
                  <td className="p-3 text-sm">{c.PhoneNumber}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(c.CandidateNationalId)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editing ? 'Edit Candidate' : 'Add Candidate'}
            </h3>
            <div className="space-y-3">
              <input
                placeholder="National ID"
                value={formData.CandidateNationalId}
                onChange={(e) => setFormData({...formData, CandidateNationalId: e.target.value})}
                disabled={editing}
                className="w-full border p-2 rounded"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="First Name"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                  className="w-full border p-2 rounded"
                />
                <input
                  placeholder="Last Name"
                  value={formData.LastName}
                  onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                  className="w-full border p-2 rounded"
                />
              </div>
              <select
                value={formData.Gender}
                onChange={(e) => setFormData({...formData, Gender: e.target.value})}
                className="w-full border p-2 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.DOB}
                    onChange={(e) => setFormData({...formData, DOB: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Exam Date</label>
                  <input
                    type="date"
                    value={formData.ExamDate}
                    onChange={(e) => setFormData({...formData, ExamDate: e.target.value})}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <input
                placeholder="Phone Number"
                value={formData.PhoneNumber}
                onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
                className="w-full border p-2 rounded"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 py-2 bg-blue-600 text-white rounded">
                  {editing ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   
  );
}

export default Candidates;