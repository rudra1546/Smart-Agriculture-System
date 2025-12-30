import React, { useState, useRef } from 'react';
import './ContactUs.css';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
    const form = useRef();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "cropyield.system@gmail.com",
        to_name: "CropYield(Admin)",
    };

    const publicKey = "Mvg53gT1zEVt8lRnI";
    const serviceid = "service_1elymqu";
    const templateid = "template_1zemn53";
    const handleSubmit = (e) => {
        e.preventDefault();
        emailjs.send(
            serviceid,
            templateid,
            templateParams,
            publicKey
        )
            .then((response) => {
                console.log('Email sent successfully:', response);
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 5000);
                setFormData({ name: '', email: '', message: '' });
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    return (
        <div className="contact-container">
            <div className="contact-content">
                <header className="contact-header">
                    <h1 className="contact-title">Contact Us</h1>
                </header>

                <div className="contact-card">
                    <h2>Get in Touch</h2>
                    <p>
                        Have questions or feedback? We'd love to hear from you!
                        Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="contact-card">
                    {submitted && (
                        <div className="success-message">
                            ✅ Thank you for your message! We'll get back to you soon.
                        </div>
                    )}

                    <form ref={form} onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="from_name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="from_email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message here..."
                                rows="6"
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">
                            Send Message
                        </button>
                    </form>
                </div>

                <div className="contact-card">
                    <h2>Other Ways to Reach Us</h2>
                    <div className="contact-info">
                        <p>📧 Email: cropyield.system@gmail.com</p>
                        <p>📞 Phone: Available on request</p>
                        <p>📍 Location: Gandhinagar, Gujarat, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
