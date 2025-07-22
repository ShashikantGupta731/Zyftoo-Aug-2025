'use client';
import { post } from '@/util/apiService';
import { AUTH } from '@/util/apiEndpoints';
import { encryptData } from '@/util/cryptoHelper';

export default function RegisterStep({ 
  phone,
  name, 
  setName,
  email, 
  setEmail,
  regPassword, 
  setRegPassword,
  confirmPassword, 
  setConfirmPassword,
  gender, 
  setGender,
  dob, 
  setDob,
  pincode, 
  setPincode,
  isCorporate,
  setIsCorporate,
  userType,
  setUserType,
  companyName,
  setCompanyName,
  gstNumber,
  setGstNumber,
  companyAddress,
  setCompanyAddress,
  setStep, 
  setToast 
}) {

  const handleRegister = async () => {
    if (!name || !email || !regPassword || !confirmPassword || !gender || !dob || !pincode) {
      setToast('Please fill all required fields');
      return;
    }

    if (regPassword !== confirmPassword) {
      setToast('Passwords do not match');
      return;
    }

    try {
      // Prepare registration data
      const registrationData = {
        phone,
        name,
        email,
        password: regPassword,
        gender,
        dateOfBirth: dob,
        pincode,
        userType,
        role: 'user'
      };

      // Add corporate fields if user is corporate
      if (isCorporate) {
        registrationData.companyDetails = {
          companyName,
          gstNumber,
          companyAddress
        };
      }

      // Encrypt registration data
      const encryptedData = encryptData(registrationData);
      const response = await post(AUTH.REGISTER, { encryptedData }, false);

      if (!response.success) {
        setToast(response.message || 'Registration failed');
        return;
      }

      setStep('register-success');
    } catch (error) {
      setToast('Server error. Try again.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <h3 style={{ fontSize: '22px' }}>Create Your Account</h3>
      </div>
      <div className="form-vertical">
        <input 
          className="login-input" 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="login-input" 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="login-input" 
          type="password" 
          placeholder="Password" 
          value={regPassword} 
          onChange={(e) => setRegPassword(e.target.value)} 
        />
        <input 
          className="login-input" 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <select 
          className="login-input" 
          value={gender} 
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input 
          className="login-input" 
          type="date" 
          placeholder="Date of Birth" 
          value={dob} 
          onChange={(e) => setDob(e.target.value)} 
        />
        <input 
          className="login-input" 
          type="text" 
          placeholder="Pincode" 
          value={pincode} 
          onChange={(e) => setPincode(e.target.value)} 
        />
        
        {/* Corporate User Toggle */}
        <div className="corporate-toggle-wrapper">
          <label className="corporate-checkbox">
            <input
              type="checkbox"
              checked={isCorporate}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsCorporate(checked);
                setUserType(checked ? 'corporate' : 'individual');

                // Optional: Clear corporate fields when unchecked
                if (!checked) {
                  setCompanyName('');
                  setGstNumber('');
                  setCompanyAddress('');
                }
              }}
            />
            Are you a Corporate User?
          </label>
        </div>

        {/* Show corporate fields if selected */}
        {isCorporate && (
          <div className="corporate-fields">
            <input
              className="login-input"
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="login-input"
              type="text"
              placeholder="GST Number"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
            <input
              className="login-input"
              type="text"
              placeholder="Company Address"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </div>
        )}
        
        <button className="login-next" onClick={handleRegister}>
          REGISTER
        </button>
      </div>
    </>
  );
}
