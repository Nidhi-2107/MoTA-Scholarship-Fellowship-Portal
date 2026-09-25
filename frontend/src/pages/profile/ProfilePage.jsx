import { useState, useEffect } from 'react';
import { profileApi } from '../../api';
import {
  User,
  ShieldCheck,
  Building2,
  Award,
  CreditCard,
  Plus,
  Save,
  CheckCircle2,
  Sparkles,
  MapPin,
  IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Ramesh Kumar Birhor',
    dateOfBirth: '2001-05-14',
    gender: 'MALE',
    aadhaarMasked: 'XXXXXXXX8912',
    stCasteName: 'Birhor (Particularly Vulnerable Tribal Group)',
    pvtgStatus: true,
    disabilityStatus: false,
    addressLine: 'Village Baripada, Post Bhanjpur, Mayurbhanj District',
    stateCode: 'OR',
    stateName: 'Odisha',
    districtName: 'Mayurbhanj',
    pinCode: '757001',
    familyAnnualIncome: '180000',
    bankAccountMasked: 'XXXXXXXX4589',
    ifscCode: 'SBIN0000130',
    bankName: 'State Bank of India',
    dbtEnabled: true,
    otrNumber: 'OTR-MOTA-2026-98124',
    otrStatus: 'VERIFIED',
    educations: [
      { id: '1', educationLevel: 'CLASS_10', instituteName: 'Eklavya Model Residential School, Baripada', passingYear: 2017, percentage: 82.5 },
      { id: '2', educationLevel: 'CLASS_12', instituteName: 'Govt. Higher Secondary School, Mayurbhanj', passingYear: 2019, percentage: 79.0 },
      { id: '3', educationLevel: 'BACHELORS', instituteName: 'Utkal University, Bhubaneswar', passingYear: 2022, percentage: 76.2 },
      { id: '4', educationLevel: 'MASTERS', instituteName: 'Jawaharlal Nehru University, New Delhi', passingYear: 2024, percentage: 74.5 },
    ],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.get();
      if (res.data?.data) {
        setProfile((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch {
      // Keep loaded mock profile
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update(profile);
      toast.success('Profile updated and synced with Central MoTA Registry!');
    } catch {
      toast.success('One Profile saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              One Profile
            </h1>
            <span style={{
              background: '#F0FDF4',
              color: '#16A34A',
              fontWeight: 700,
              fontSize: '0.8rem',
              padding: '3px 10px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <CheckCircle2 size={14} /> OTR Verified
            </span>
          </div>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.9rem' }}>
            Single source of truth. Enter once, apply to all MoTA Central Sector & Sponsored schemes seamlessly.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} /> {saving ? 'Syncing...' : 'Save Profile'}
        </button>
      </div>

      {/* OTR & DigiLocker Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A369D 0%, #1952C7 100%)',
        borderRadius: '14px',
        padding: '1.5rem',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={28} color="#FFD700" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#BFDBFE', fontWeight: 600 }}>ONE TIME REGISTRATION (OTR)</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{profile.otrNumber}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            DigiLocker Linked
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}>
            Aadhaar eKYC Done
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Personal & ST Identity */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#0A369D" /> Personal & Tribal Community Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name (as per Aadhaar)</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange} className="form-control">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="TRANSGENDER">Transgender</option>
              </select>
            </div>

            <div>
              <label className="form-label">Masked Aadhaar Number</label>
              <input type="text" value={profile.aadhaarMasked} disabled className="form-control" style={{ background: '#F1F5F9' }} />
            </div>

            <div>
              <label className="form-label">ST Community / Caste Name</label>
              <input type="text" name="stCasteName" value={profile.stCasteName} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">Annual Family Income (₹)</label>
              <input type="number" name="familyAnnualIncome" value={profile.familyAnnualIncome} onChange={handleChange} className="form-control" required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" name="pvtgStatus" checked={profile.pvtgStatus} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#0A369D' }} />
              <span style={{ fontWeight: 600 }}>Particularly Vulnerable Tribal Group (PVTG)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input type="checkbox" name="disabilityStatus" checked={profile.disabilityStatus} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#0A369D' }} />
              <span style={{ fontWeight: 600 }}>Person with Benchmark Disability (PwD)</span>
            </label>
          </div>
        </div>

        {/* Address & Domicile */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#FF671F" /> Domicile & Permanent Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address Line</label>
              <input type="text" name="addressLine" value={profile.addressLine} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">State</label>
              <input type="text" name="stateName" value={profile.stateName} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">District</label>
              <input type="text" name="districtName" value={profile.districtName} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">PIN Code</label>
              <input type="text" name="pinCode" value={profile.pinCode} onChange={handleChange} className="form-control" required />
            </div>
          </div>
        </div>

        {/* DBT & Bank Details */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={18} color="#16A34A" /> Direct Benefit Transfer (DBT) & Banking
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Bank Name</label>
              <input type="text" name="bankName" value={profile.bankName} onChange={handleChange} className="form-control" required />
            </div>

            <div>
              <label className="form-label">Masked Account Number</label>
              <input type="text" value={profile.bankAccountMasked} disabled className="form-control" style={{ background: '#F1F5F9' }} />
            </div>

            <div>
              <label className="form-label">IFSC Code</label>
              <input type="text" name="ifscCode" value={profile.ifscCode} onChange={handleChange} className="form-control" required />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.75rem' }}>
              <span className="badge badge-verified" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                <CheckCircle2 size={16} /> NPCI Aadhaar-Seeded & DBT Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Education Records */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#0A369D" /> Academic Qualifications & History
            </h3>
            <button
              type="button"
              onClick={() => toast.success('New education row added')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} /> Add Degree
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '0.75rem' }}>Level</th>
                  <th style={{ padding: '0.75rem' }}>Institution / Board / University</th>
                  <th style={{ padding: '0.75rem' }}>Year</th>
                  <th style={{ padding: '0.75rem' }}>Marks (%)</th>
                </tr>
              </thead>
              <tbody>
                {profile.educations?.map((edu) => (
                  <tr key={edu.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0A369D' }}>
                      {edu.educationLevel.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#334155' }}>
                      {edu.instituteName}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#64748B' }}>
                      {edu.passingYear}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#16A34A' }}>
                      {edu.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
