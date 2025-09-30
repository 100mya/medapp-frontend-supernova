import React from 'react';
import './About.css';
import Header from './Header';
import Footer from './Footer';
import sameerPhoto from './sameer.jpg';
import jakePhoto from './jake.jpg';
import soumyaPhoto from './soumya.jpg';
import priyanjaliPhoto from './priyanjali.jpg';

const About = () => {
  const teamMembers = [
    {
      name: 'Sameer Ranjan',
      designation: 'Founder',
      description: 'An innovative AI enthusiast and the visionary behind Cognitive Sprints. With a passion for transforming education and capitalism, he innovates cutting-edge AI technology.',
      photo: sameerPhoto,
    },
    {
      name: 'Jake Chacko',
      designation: 'Head of Technology and Co-Founder',
      description: 'A visionary technologist passionate about innovation, excelling in AI and software development. His creative problem-solving and technical expertise drive groundbreaking advancements in our projects.',
      photo: jakePhoto,
    },
    {
      name: 'Soumya Pandey',
      designation: 'Senior Software Developer',
      description: 'A brilliant engineer passionate about experimenting with modern and deep tech, creating the most innovative products. Her expertise and creativity drive groundbreaking advancements in our projects.',
      photo: soumyaPhoto,
    },
    {
      name: 'Priyanjali Sharma',
      designation: 'Strategic Advisor',
      description: 'A dedicated 5th-year medical student and co-founder of PRASHA, passionate about healthcare innovation. Her leadership in global medical networks drives advancements in medical education and practice.',
      photo: priyanjaliPhoto,
    },
  ];

  return (
    <div className="about-container">
      <Header />

      <section className="about-section2">
        <h2>About <span>Us</span></h2>
        <p>
          Welcome to MedicoEd, where innovation meets medical education. Our mission is to empower medical students by providing cutting-edge learning tools powered by generative AI. At MedicoEd, we believe in transforming the way medical education is delivered, making it more interactive, personalized, and effective.
        </p>
      </section>

      <section className="about-section1">
        <h2>Our <span>Vision</span></h2>
        <p>
          We envision a world where medical education is revolutionized by technology. Our goal is to make learning more accessible and engaging for students everywhere, helping them achieve their full potential. We are committed to creating a platform that not only enhances learning but also fosters a global community of medical professionals who can connect, share knowledge, and collaborate.
        </p>
      </section>

      <section className="about-section2">
        <h2>Meet the <span>Team</span></h2>
        <p>
          Our team is a diverse group of professionals passionate about both medical education and technology. We bring together expertise from various fields to create a product that truly meets the needs of modern medical students. Our team members include experienced educators, skilled software developers, and innovative designers, all working together to bring you the best possible learning experience.
        </p>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <img src={member.photo} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <h4>{member.designation}</h4>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section1">
        <h2>Our <span>Roadmap</span></h2>
        <p>
          Looking ahead, our next big step is to build a common platform where medical professionals from around the world can connect and talk to each other. We aim to create a vibrant community where knowledge and experience can be shared, fostering collaboration and innovation in the medical field.
        </p>
      </section>

      <footer className="about-footer">
        <p>
          Join us on this exciting journey as we transform medical education for the better. Welcome to <span>MedicoED</span>, where your learning journey begins.
        </p>
      </footer>

      <Footer />
    </div>
  );
};

export default About;
