const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',  // ✅ Change from 5173 to 5174
    credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
    secret: 'rdl_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rdl'
});

db.connect((err) => {
    if (err) {
        console.log(' Database Error:', err);
        return;
    }
    console.log(' Connected to RDL Database');
});

// ==================== VALIDATION FUNCTIONS ====================

const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Need one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Need one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Need one number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Need one special character (!@#$%^&*)');
    return { isValid: errors.length === 0, errors };
};

// ==================== ADMIN ROUTES ====================

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
    const { AdminName, Password } = req.body;
    
    // Validate
    const pwdCheck = validatePassword(Password);
    if (!pwdCheck.isValid) {
        return res.status(400).json({ success: false, field: 'password', errors: pwdCheck.errors });
    }
    
    try {
        // Check if admin exists
        const [existing] = await db.promise().query('SELECT * FROM admin WHERE AdminName = ?', [AdminName]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, errors: ['admin name already exists'] });
        }
        
        // Hash password
        const hashed = await bcrypt.hash(Password, 10);
        
        // Insert
        const [result] = await db.promise().query(
            'INSERT INTO admin (AdminName, Password) VALUES (?, ?)',
            [AdminName, hashed]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'admin registered successfully',
            adminId: result.insertId 
        });
        
    } catch (err) {
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
});

// Admin Login (Session-based)
app.post('/api/admin/login', async (req, res) => {
    const { AdminName, Password } = req.body;
    
    if (!AdminName || !Password) {
        return res.status(400).json({ success: false, errors: ['Please enter all fields'] });
    }
    
    try {
        const [admins] = await db.promise().query('SELECT * FROM Admin WHERE AdminName = ?', [AdminName]);
        
        if (admins.length === 0) {
            return res.status(401).json({ success: false, errors: ['Invalid credentials'] });
        }
        
        const admin = admins[0];
        const isMatch = await bcrypt.compare(Password, admin.Password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, errors: ['Invalid credentials'] });
        }
        
        // Create session
        req.session.adminId = admin.AdminId;
        req.session.adminName = admin.AdminName;
        
        res.json({
            success: true,
            message: 'Login successful',
            admin: { id: admin.AdminId, name: admin.AdminName }
        });
        
    } catch (err) {
        res.status(500).json({ success: false, errors: ['Server error'] });
    }
});

// Check Session
app.get('/api/admin/session', (req, res) => {
    if (req.session.adminId) {
        res.json({ 
            loggedIn: true, 
            admin: { id: req.session.adminId, name: req.session.adminName } 
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out' });
});

// ==================== CANDIDATE ROUTES ====================

// Get all candidates
// Get all candidates
app.get('/api/candidates', async (req, res) => {
    try {
        const [candidates] = await db.promise().query('SELECT * FROM Candidate');
        res.json({ success: true, data: candidates }); // ✅ wrap it
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// Get single candidate
app.get('/api/candidates/:id', async (req, res) => {
    try {
        const [candidates] = await db.promise().query(
            'SELECT * FROM Candidate WHERE CandidateNationalId = ?',
            [req.params.id]
        );
        if (candidates.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidates[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add candidate
app.post('/api/candidates', async (req, res) => {
    const {
        CandidateNationalId,
        FirstName,
        LastName,
        Gender,
        DOB,
        ExamDate,
        PhoneNumber
    } = req.body;
    
    try {
        await db.promise().query(
            `INSERT INTO Candidate 
            (CandidateNationalId, FirstName, LastName, Gender, DOB, ExamDate, PhoneNumber) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [CandidateNationalId, FirstName, LastName, Gender, DOB, ExamDate, PhoneNumber]
        );
        res.status(201).json({ 
            success: true, 
            message: 'Candidate registered',
            id: CandidateNationalId 
        });
    } catch (err) {
        console.error('full error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                error: 'National ID or Phone Number already exists' 
            });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update candidate
app.put('/api/candidates/:id', async (req, res) => {
    const {
        FirstName,
        LastName,
        Gender,
        DOB,
        ExamDate,
        PhoneNumber
    } = req.body;
    
    try {
        await db.promise().query(
            `UPDATE Candidate SET 
                FirstName = ?, 
                LastName = ?, 
                Gender = ?, 
                DOB = ?, 
                ExamDate = ?, 
                PhoneNumber = ? 
            WHERE CandidateNationalId = ?`,
            [FirstName, LastName, Gender, DOB, ExamDate, PhoneNumber, req.params.id]
        );
        res.json({ success: true, message: 'Candidate updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete candidate
app.delete('/api/candidates/:id', async (req, res) => {
    try {
        // Delete grades first (foreign key constraint)
        await db.promise().query('DELETE FROM grade WHERE CandidateNationalId = ?', [req.params.id]);
        // Delete candidate
        await db.promise().query('DELETE FROM candidate WHERE CandidateNationalId = ?', [req.params.id]);
        res.json({ success: true, message: 'Candidate deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== GRADE ROUTES ====================

// Add/Update grade
// ==================== GRADE ROUTES ====================

// Add/Update grade
// ==================== GRADE ROUTES ====================

// Add/Update grade
app.post('/api/grades', async (req, res) => {
    console.log('DEBUG: Received request body:', req.body); // Add this line

    const { CandidateNationalId, LicenseExamCategory, obtainedMarks_20 } = req.body;

    if (obtainedMarks_20 < 0 || obtainedMarks_20 > 20) {
        return res.status(400).json({ 
            success: false, 
            error: 'Marks must be between 0 and 20' 
        });
    }
    
    // Calculate decision (Pass >= 12, Fail < 12)
    const Decision = obtainedMarks_20 >= 12 ? 'Pass' : 'Fail';
    
    try {
        // Check if grade exists
        const [existing] = await db.promise().query(
            'SELECT * FROM grade WHERE CandidateNationalId = ?',
            [CandidateNationalId]
        );
        
        if (existing.length > 0) {
            // Update - use backticks for exact column name matching
            await db.promise().query(
                `UPDATE grade SET 
                    LicenseExamCategory = ?, 
                    \`obtainedMarks_20\` = ?, 
                    Decision = ? 
                WHERE CandidateNationalId = ?`,
                [LicenseExamCategory, obtainedMarks_20, Decision, CandidateNationalId]
            );
            res.json({ success: true, message: 'grade updated', Decision });
        } else {
            // Insert - use backticks for exact column name matching
            await db.promise().query(
                `INSERT INTO grade 
                (CandidateNationalId, LicenseExamCategory, obtainedMarks_20 , Decision) 
                VALUES (?, ?, ?, ?)`,
                [CandidateNationalId, LicenseExamCategory, obtainedMarks_20, Decision]
            );
            res.status(201).json({ success: true, message: 'grade recorded', Decision });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all grades with candidate info
app.get('/api/grades', async (req, res) => {
    try {
        const [grades] = await db.promise().query(`
            SELECT g.*, c.FirstName, c.LastName, c.Gender, c.DOB, c.ExamDate, c.PhoneNumber
            FROM Grade g
            JOIN Candidate c ON g.CandidateNationalId = c.CandidateNationalId
        `);
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single grade
app.get('/api/grades/:candidateId', async (req, res) => {
    try {
        const [grades] = await db.promise().query(
            'SELECT * FROM grade WHERE CandidateNationalId = ?',
            [req.params.candidateId]
        );
        res.json(grades[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==================== REPORT ROUTES ====================

// Pass report (>= 12 marks)
// Pass report (>= 12 marks)
// Pass report (>= 12 marks)
// Pass report (>= 12 marks)
app.get('/api/reports/pass', async (req, res) => {
    try {
        const [results] = await db.promise().query(`
            SELECT g.*, c.FirstName, c.LastName, c.Gender, c.PhoneNumber
            FROM Grade g
            JOIN Candidate c ON g.CandidateNationalId = c.CandidateNationalId
            WHERE g.\`obtainedMarks_20\` >= 12
            ORDER BY g.\`obtainedMarks_20\` DESC
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fail report (< 12 marks)
app.get('/api/reports/fail', async (req, res) => {
    try {
        const [results] = await db.promise().query(`
            SELECT g.*, c.FirstName, c.LastName, c.Gender, c.PhoneNumber
            FROM Grade g
            JOIN Candidate c ON g.CandidateNationalId = c.CandidateNationalId
            WHERE g.\`obtainedMarks_20\` < 12
            ORDER BY g.\`obtainedMarks_20\` DESC
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// All results report
app.get('/api/reports/all', async (req, res) => {
    try {
        const [results] = await db.promise().query(`
            SELECT g.*, c.FirstName, c.LastName, c.Gender, c.DOB, c.ExamDate, c.PhoneNumber
            FROM Grade g
            JOIN Candidate c ON g.CandidateNationalId = c.CandidateNationalId
            ORDER BY g.\`obtainedMarks_20\` DESC
        `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Statistics
// Statistics
app.get('/api/reports/stats', async (req, res) => {
    try {
        const [total] = await db.promise().query('SELECT COUNT(*) as count FROM candidate');
        const [passed] = await db.promise().query('SELECT COUNT(*) as count FROM grade WHERE Decision = "Pass"');
        const [failed] = await db.promise().query('SELECT COUNT(*) as count FROM grade WHERE Decision = "Fail"');
        const [pending] = await db.promise().query(`
            SELECT COUNT(*) as count FROM candidate c
            LEFT JOIN grade g ON c.CandidateNationalId = g.CandidateNationalId
            WHERE g.CandidateNationalId IS NULL
        `);
        
        res.json({
            totalCandidates: total[0].count,
            passed: passed[0].count,
            failed: failed[0].count,
            pending: pending[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'rdl Server is working!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(` RDL Server running on http://localhost:${PORT}`);
    console.log(`Test: http://localhost:${PORT}/api/test`);
});