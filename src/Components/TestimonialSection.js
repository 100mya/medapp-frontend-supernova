// src/components/TestimonialSection.js
import React from 'react';
import './TestimonialSection.css';
import avatar1 from './avatar1.png';
import avatar2 from './avatar2.png';
import avatar3 from './avatar3.png';

function TestimonialSection() {
  const testimonials = [
    {
      name: 'Alice Johnson',
      role: 'Research Scientist',
      feedback: 'This tool has revolutionized my research workflow. The AI summaries are incredibly accurate and save me so much time!',
      avatar: avatar1,
    },
    {
      name: 'Mark Smith',
      role: 'PhD Student',
      feedback: 'The comparison feature is a game-changer for my literature reviews. Highly recommend this to any researcher!',
      avatar: avatar2,
    },
    {
      name: 'Neil Martinez',
      role: 'Professor',
      feedback: 'The AI chat function is fantastic for clarifying complex concepts in papers. It feels like having a personal research assistant.',
      avatar: avatar3,
    },
  ];

  return (
    <div className="testimonial-section">
      <div className="testimonial-heading">
        <h2>What Our <span>Users</span> Are Saying</h2>
      </div>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-feedback">
              <p>"{testimonial.feedback}"</p>
            </div>
            <div className="testimonial-details">
              <img src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} className="testimonial-avatar" />
              <div>
                <p className="testimonial-name">{testimonial.name}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestimonialSection;
