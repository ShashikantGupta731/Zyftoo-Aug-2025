'use client'
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import AuthContext from '@/components/context/AuthContext'
import authService from '@/util/authService'

export default function CorporateSignIn() {
    const router = useRouter()
    const { login, user } = useContext(AuthContext)
    
    // Redirect if already logged in as corporate user
    useEffect(() => {
        if (user && user.userType === 'Corporate') {
            router.push('/CorporateHome')
        }
    }, [user, router])

    const [isSignUp, setIsSignUp] = useState(false)
    const [step, setStep] = useState('login') // login, signup, otp, forgotPassword, resetPassword
    const [toast, setToast] = useState('')
    
    // Form fields
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [gstNumber, setGstNumber] = useState('')
    const [companyAddress, setCompanyAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [otp, setOtp] = useState(new Array(6).fill(''))
    const [newPassword, setNewPassword] = useState('')

    // Toast handler
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return
        const updatedOtp = [...otp]
        updatedOtp[index] = value
        setOtp(updatedOtp)
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        
        if (!email || !password) {
            setToast('Please fill all fields')
            return
        }

        try {
            console.log('🚀 [Frontend] Corporate login attempt for:', email)
            
            // Login data specifically for corporate users
            const loginData = { 
                email: email.toLowerCase().trim(),
                password,
                userType: 'Corporate'
            }
            
            console.log('📤 [Frontend] Sending login data:', { email: loginData.email, userType: loginData.userType })
            
            const response = await authService.login(loginData, true)
            
            console.log('📥 [Frontend] Login response:', response)

            if (!response.success) {
                console.error('❌ [Frontend] Login failed:', response.message)
                setToast(response.message || 'Login failed')
                return
            }

            // Extract user data and token from response
            const userData = response.data?.data?.user || response.data?.user || response.user
            const token = response.data?.data?.token || response.data?.token || response.token
            
            console.log('🔍 [Frontend] Extracted data:', {
                hasUserData: !!userData,
                hasToken: !!token,
                userType: userData?.userType,
                tokenLength: token?.length
            })
            
            if (!userData) {
                console.error('❌ [Frontend] No user data in response')
                setToast('Invalid response from server')
                return
            }
            
            if (!token) {
                console.error('❌ [Frontend] No token in response')
                setToast('Authentication token missing')
                return
            }
            
            console.log('👤 [Frontend] User data received:', { 
                name: userData.name, 
                email: userData.email, 
                userType: userData.userType 
            })
            
            // Verify this is a corporate user
            if (userData.userType !== 'Corporate') {
                console.error('❌ [Frontend] User is not corporate type:', userData.userType)
                setToast('This login is for corporate users only')
                return
            }

            // Update auth context with user data and token
            if (login && typeof login === 'function') {
                console.log('📝 [Frontend] Updating auth context...')
                const contextResult = await login(userData, token)
                
                if (!contextResult.success) {
                    console.error('❌ [Frontend] Failed to update auth context:', contextResult.message)
                    setToast('Authentication failed')
                    return
                }
                console.log('✅ [Frontend] Auth context updated successfully')
            }

            // Success message and form reset
            console.log('✅ [Frontend] Corporate login successful')
            setToast('Login successful! Redirecting...')
            
            // Clear form fields
            setEmail('')
            setPassword('')
            
            // Redirect after a short delay
            setTimeout(() => {
                console.log('🔄 [Frontend] Redirecting to CorporateHome...')
                router.push('/CorporateHome')
            }, 1500)
            
        } catch (error) {
            console.error('❌ [Frontend] Login error:', error)
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Login failed. Please try again.'
            setToast(errorMessage)
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        
        // Enhanced validation
        const errors = []
        
        if (!name || name.trim().length < 2) {
            errors.push('Please enter a valid name (at least 2 characters)')
        }
        
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address')
        }
        
        if (!phone || !/^[0-9]{10}$/.test(phone)) {
            errors.push('Please enter a valid 10-digit phone number')
        }
        
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters long')
        }
        
        if (password !== confirmPassword) {
            errors.push('Passwords do not match')
        }
        
        if (!companyName || companyName.trim().length < 2) {
            errors.push('Please enter a valid company name')
        }
        
        if (!gstNumber || gstNumber.trim().length < 5) {
            errors.push('Please enter a valid GST number')
        }
        
        if (!companyAddress || companyAddress.trim().length < 5) {
            errors.push('Please enter a valid company address')
        }
        
        if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
            errors.push('Please enter a valid 6-digit pincode')
        }
        
        if (errors.length > 0) {
            setToast(errors[0]) // Show first error
            return
        }

        try {
            // Check if user already exists before sending OTP
            const emailCheck = await authService.checkUserByEmail(email)
            if (emailCheck.data && emailCheck.data.exists) {
                setToast('An account already exists with this email')
                return
            }

            // Send OTP to email for corporate users
            const otpData = {
                email,
                phone, // Include phone for complete registration later
                purpose: 'signup',
                userType: 'Corporate'
            }
            
            const response = await authService.sendOTP(otpData)
            
            if (response.success) {
                setStep('otp')
                setToast('OTP sent to your email address')
            } else {
                setToast(response.message || 'Failed to send OTP')
            }
        } catch (error) {
            console.error('Send OTP error:', error)
            setToast(error.response?.data?.message || 'Failed to send OTP. Please try again.')
        }
    }

    const handleOtpVerification = async () => {
        if (otp.some(digit => !digit)) {
            setToast('Please enter complete OTP')
            return
        }

        const enteredOtp = otp.join('')

        try {
            // First verify OTP
            const otpData = {
                email,
                otp: enteredOtp,
                purpose: 'signup',
                userType: 'Corporate'
            }
            
            const otpResponse = await authService.verifyOTP(otpData)

            if (!otpResponse.success) {
                setToast(otpResponse.message || 'Invalid OTP')
                setOtp(new Array(6).fill('')) // Clear OTP fields
                return
            }

            // If OTP is valid, proceed with registration
            const registrationData = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                password,
                confirmPassword,
                otp: enteredOtp,
                userType: 'Corporate',
                companyDetails: {
                    companyName: companyName.trim(),
                    gstNumber: gstNumber.trim().toUpperCase(),
                    address: companyAddress.trim()
                },
                role: 'user',
                gender: 'others',
                dob: new Date().toISOString().split('T')[0],
                pincode: pincode.trim()
            }

            const signupResponse = await authService.signup(registrationData)

            if (!signupResponse.success) {
                setToast(signupResponse.message || 'Registration failed')
                return
            }

            setToast('Registration successful! Please check your email for verification.')
            
            // Clear all form fields and redirect to login after delay
            setTimeout(() => {
                setStep('login')
                setIsSignUp(false)
                // Clear all fields
                setName('')
                setEmail('')
                setPhone('')
                setPassword('')
                setConfirmPassword('')
                setCompanyName('')
                setGstNumber('')
                setCompanyAddress('')
                setPincode('')
                setOtp(new Array(6).fill(''))
            }, 3000)
            
        } catch (error) {
            console.error('Registration error:', error)
            setToast(error.response?.data?.message || 'Registration failed. Please try again.')
        }
    }

    const handleResendOTP = async (e) => {
        e.preventDefault()
        
        try {
            // Determine the purpose based on current step
            const purpose = step === 'resetOtp' ? 'reset' : 'signup'
            
            // Send OTP to email for corporate users
            const otpData = {
                email,
                purpose,
                userType: 'Corporate'
            }
            
            const response = await authService.sendOTP(otpData)
            
            if (response.success) {
                setToast('OTP resent to your email address')
                // Reset OTP input fields
                setOtp(new Array(6).fill(''))
            } else {
                setToast(response.message || 'Failed to resend OTP')
            }
        } catch (error) {
            console.error('Resend OTP error:', error)
            setToast('Failed to resend OTP. Please try again.')
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            setToast('Please enter your email address')
            return
        }

        try {
            // Check if user exists with this email
            const userCheckResponse = await authService.checkUserByEmail(email)
            
            if (!userCheckResponse.success || !userCheckResponse.data.exists) {
                setToast('No account found with this email')
                return
            }

            // Verify this is a corporate user
            if (userCheckResponse.data.userType !== 'Corporate') {
                setToast('This reset is for corporate users only')
                return
            }

            // Get phone from response
            const userPhone = userCheckResponse.data.phone
            if (!userPhone) {
                setToast('Unable to retrieve account information')
                return
            }
            
            // Send OTP to email for password reset
            const otpData = { 
                email,
                purpose: 'reset',
                userType: 'Corporate'
            }
            const otpResponse = await authService.sendOTP(otpData, true)

            if (!otpResponse.success) {
                setToast(otpResponse.message || 'Failed to send OTP')
                return
            }

            setStep('resetOtp')
            setPhone(userPhone)
            setToast('OTP sent to your email address')
        } catch (error) {
            console.error('Forgot password error:', error)
            setToast('Something went wrong. Please try again.')
        }
    }

    const handlePasswordReset = async () => {
        const enteredOtp = otp.join('')
        if (enteredOtp.length !== 6 || !newPassword || !confirmPassword) {
            setToast('Please fill all fields')
            return
        }

        if (newPassword !== confirmPassword) {
            setToast('Passwords do not match')
            return
        }

        try {
            // Verify OTP using email for corporate users
            const otpData = {
                email, // Use email for corporate password reset
                otp: enteredOtp,
                purpose: 'reset',
                userType: 'Corporate'
            }
            
            const otpResponse = await authService.verifyOTP(otpData, true)

            if (!otpResponse.success) {
                setToast('Invalid OTP')
                return
            }

            // Reset password
            const resetData = {
                email, // Use email for corporate users
                newPassword,
                userType: 'Corporate'
            }
            
            const resetResponse = await authService.resetPassword(resetData, true)

            if (!resetResponse.success) {
                setToast(resetResponse.message || 'Password reset failed')
                return
            }

            setToast('Password reset successful! Please login.')
            setStep('login')
            setOtp(new Array(6).fill(''))
            setNewPassword('')
            setConfirmPassword('')
            
        } catch (error) {
            console.error('Password reset error:', error)
            setToast(error.message || 'Reset failed. Please try again.')
        }
    }

    return (
        <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Corporate Portal">
            <section className="corporate-auth-area pt-80 pb-80">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="corporate-auth-wrapper">
                                <div className="corporate-auth-header text-center mb-40">
                                    <h2 className="corporate-title">Corporate Portal</h2>
                                    <p className="corporate-subtitle">Access exclusive benefits for business partners</p>
                                </div>

                                {step === 'login' && !isSignUp && (
                                    <div className="corporate-auth-box">
                                        <h3 className="auth-box-title">Corporate Sign In</h3>
                                        <form onSubmit={handleLogin}>
                                            <div className="corporate-form-group">
                                                <label>Corporate Email</label>
                                                <input
                                                    type="email"
                                                    className="corporate-input"
                                                    placeholder="your@company.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="corporate-form-group">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className="corporate-input"
                                                    placeholder="Enter your password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="corporate-form-actions">
                                                <button type="submit" className="corporate-btn-primary">
                                                    Sign In <i className="fal fa-long-arrow-right" />
                                                </button>
                                                <div className="corporate-links">
                                                    <a href="#" onClick={(e) => {
                                                        e.preventDefault()
                                                        setStep('forgotPassword')
                                                    }}>Forgot Password?</a>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="corporate-divider">
                                            <span>New to Corporate Portal?</span>
                                        </div>
                                        <button 
                                            className="corporate-btn-secondary"
                                            onClick={() => {
                                                setIsSignUp(true)
                                                // Clear all form fields when switching to signup
                                                setName('')
                                                setEmail('')
                                                setPhone('')
                                                setPassword('')
                                                setConfirmPassword('')
                                                setCompanyName('')
                                                setGstNumber('')
                                                setCompanyAddress('')
                                                setPincode('')
                                            }}
                                        >
                                            Create Corporate Account
                                        </button>
                                    </div>
                                )}

                                {isSignUp && step === 'login' && (
                                    <div className="corporate-auth-box">
                                        <h3 className="auth-box-title">Create Corporate Account</h3>
                                        <form onSubmit={handleSignUp}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Full Name *</label>
                                                        <input
                                                            type="text"
                                                            className="corporate-input"
                                                            placeholder=""
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Corporate Email *</label>
                                                        <input
                                                            type="email"
                                                            className="corporate-input"
                                                            placeholder=""
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Phone Number *</label>
                                                        <input
                                                            type="tel"
                                                            className="corporate-input"
                                                            placeholder=""
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            maxLength="10"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Company Name *</label>
                                                        <input
                                                            type="text"
                                                            className="corporate-input"
                                                            placeholder=""
                                                            value={companyName}
                                                            onChange={(e) => setCompanyName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>GST Number *</label>
                                                        <input
                                                            type="text"
                                                            className="corporate-input"
                                                            placeholder="GST123456789"
                                                            value={gstNumber}
                                                            onChange={(e) => setGstNumber(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Company Address *</label>
                                                        <input
                                                            type="text"
                                                            className="corporate-input"
                                                            placeholder="123 Business Park"
                                                            value={companyAddress}
                                                            onChange={(e) => setCompanyAddress(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Pincode *</label>
                                                        <input
                                                            type="text"
                                                            className="corporate-input"
                                                            placeholder="123456"
                                                            value={pincode}
                                                            onChange={(e) => setPincode(e.target.value)}
                                                            maxLength="6"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Password *</label>
                                                        <input
                                                            type="password"
                                                            className="corporate-input"
                                                            placeholder="Create password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="corporate-form-group">
                                                        <label>Confirm Password *</label>
                                                        <input
                                                            type="password"
                                                            className="corporate-input"
                                                            placeholder="Confirm password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="corporate-form-actions">
                                                <button type="submit" className="corporate-btn-primary">
                                                    Create Account <i className="fal fa-long-arrow-right" />
                                                </button>
                                            </div>
                                        </form>
                                        <div className="corporate-divider">
                                            <span>Already have an account?</span>
                                        </div>
                                        <button 
                                            className="corporate-btn-secondary"
                                            onClick={() => {
                                                setIsSignUp(false)
                                                // Clear all form fields when switching back to login
                                                setName('')
                                                setEmail('')
                                                setPhone('')
                                                setPassword('')
                                                setConfirmPassword('')
                                                setCompanyName('')
                                                setGstNumber('')
                                                setCompanyAddress('')
                                                setPincode('')
                                            }}
                                        >
                                            Back to Sign In
                                        </button>
                                    </div>
                                )}

                                {step === 'otp' && (
                                    <div className="corporate-auth-box">
                                        <h3 className="auth-box-title">Verify Your Email</h3>
                                        <p className="otp-info">We've sent a 6-digit OTP to {email}</p>
                                        <div className="otp-inputs">
                                            {otp.map((value, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    className="otp-input"
                                                    value={value}
                                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                                />
                                            ))}
                                        </div>
                                        <button 
                                            className="corporate-btn-primary mt-20"
                                            onClick={handleOtpVerification}
                                        >
                                            Verify OTP
                                        </button>
                                        <div className="otp-resend mt-20">
                                            <span>Didn't receive OTP? </span>
                                            <a href="#" onClick={handleResendOTP}>Resend</a>
                                        </div>
                                    </div>
                                )}

                                {step === 'forgotPassword' && (
                                    <div className="corporate-auth-box">
                                        <h3 className="auth-box-title">Reset Password</h3>
                                        <p className="reset-info">Enter your registered email to reset password</p>
                                        <div className="corporate-form-group">
                                            <label>Corporate Email</label>
                                            <input
                                                type="email"
                                                className="corporate-input"
                                                placeholder="your@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            className="corporate-btn-primary"
                                            onClick={handleForgotPassword}
                                        >
                                            Send OTP
                                        </button>
                                        <button 
                                            className="corporate-btn-secondary mt-10"
                                            onClick={() => setStep('login')}
                                        >
                                            Back to Sign In
                                        </button>
                                    </div>
                                )}

                                {step === 'resetOtp' && (
                                    <div className="corporate-auth-box">
                                        <h3 className="auth-box-title">Enter OTP & New Password</h3>
                                        <p className="otp-info">OTP sent to phone ending with {phone.slice(-4)}</p>
                                        <div className="otp-inputs">
                                            {otp.map((value, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength="1"
                                                    className="otp-input"
                                                    value={value}
                                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                                />
                                            ))}
                                        </div>
                                        <div className="corporate-form-group mt-20">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                className="corporate-input"
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="corporate-form-group">
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="corporate-input"
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            className="corporate-btn-primary"
                                            onClick={handlePasswordReset}
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toast Message */}
            {toast && (
                <div className="corporate-toast">
                    {toast}
                </div>
            )}

            <style jsx>{`
                .corporate-auth-area {
                    background: #f8f9fa;
                    min-height: 80vh;
                }

                .corporate-auth-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .corporate-title {
                    font-size: 36px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 10px;
                }

                .corporate-subtitle {
                    font-size: 18px;
                    color: #666;
                }

                .corporate-auth-box {
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e5e5e5;
                }

                .auth-box-title {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 30px;
                    color: #1a1a1a;
                }

                .corporate-form-group {
                    margin-bottom: 20px;
                }

                .corporate-form-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 8px;
                }

                .corporate-input {
                    width: 100%;
                    padding: 12px 16px;
                    font-size: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    background: #fafafa;
                }

                .corporate-input:focus {
                    outline: none;
                    border-color: #0989ff;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(9, 137, 255, 0.1);
                }

                .corporate-btn-primary {
                    width: 100%;
                    padding: 14px 24px;
                    background: #0989ff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .corporate-btn-primary:hover {
                    background: #0871d3;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(9, 137, 255, 0.3);
                }

                .corporate-btn-secondary {
                    width: 100%;
                    padding: 14px 24px;
                    background: white;
                    color: #0989ff;
                    border: 2px solid #0989ff;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .corporate-btn-secondary:hover {
                    background: #0989ff;
                    color: white;
                }

                .corporate-form-actions {
                    margin-top: 30px;
                }

                .corporate-links {
                    text-align: center;
                    margin-top: 15px;
                }

                .corporate-links a {
                    color: #0989ff;
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                }

                .corporate-links a:hover {
                    text-decoration: underline;
                }

                .corporate-divider {
                    text-align: center;
                    margin: 30px 0 20px;
                    position: relative;
                }

                .corporate-divider span {
                    background: white;
                    padding: 0 15px;
                    color: #999;
                    font-size: 14px;
                    position: relative;
                    z-index: 1;
                }

                .corporate-divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: #e5e5e5;
                }

                .otp-inputs {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin: 20px 0;
                }

                .otp-input {
                    width: 50px;
                    height: 50px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 600;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .otp-input:focus {
                    outline: none;
                    border-color: #0989ff;
                    box-shadow: 0 0 0 3px rgba(9, 137, 255, 0.1);
                }

                .otp-info {
                    text-align: center;
                    color: #666;
                    margin-bottom: 20px;
                }

                .otp-resend {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }

                .otp-resend a {
                    color: #0989ff;
                    text-decoration: none;
                    font-weight: 500;
                }

                .reset-info {
                    color: #666;
                    margin-bottom: 20px;
                    font-size: 15px;
                }

                .corporate-toast {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #333;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 768px) {
                    .corporate-auth-box {
                        padding: 30px 20px;
                    }

                    .corporate-title {
                        font-size: 28px;
                    }

                    .corporate-subtitle {
                        font-size: 16px;
                    }

                    .otp-input {
                        width: 45px;
                        height: 45px;
                        font-size: 18px;
                    }
                }
            `}</style>
        </Layout>
    )
}
