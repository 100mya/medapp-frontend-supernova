import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiList, FiMessageCircle, FiEdit, FiMap, FiClipboard, FiActivity } from 'react-icons/fi';
import './FeaturesSection1.css';

const features = [
  { id: '01', title: 'Summary Generation', description: 'Effortlessly generate summaries of research papers using AI algorithms. Save time by letting advanced algorithms condense complex papers into concise summaries, ready for quick review and understanding.' , icon: <FiFileText /> },
  { id: '02', title: 'Compare Summaries', description: 'Compare and analyze summaries to identify key findings. Pinpoint differences and similarities between multiple papers to enhance your research insights and decision-making process.', icon: <FiList /> },
  { id: '03', title: 'Chat with PDF', description: 'Engage in interactive conversations with an AI chatbot. Discuss content directly within PDF documents, ask questions, and receive answers in real-time to deepen your understanding.', icon: <FiMessageCircle /> },
  { id: '04', title: 'Take Notes', description: 'Create detailed and organized notes related to your research. Capture essential points, annotate findings, and store them securely for future reference and collaboration.', icon: <FiEdit /> },
  { id: '05', title: 'Compare And Chat', description: 'Chat and analyze across multiple papers with AI chatbot. Facilitate collaborative research discussions across various documents, leveraging AI insights for comprehensive analysis and dialogue.', icon: <FiMap /> },
  { id: '06', title: 'Questions Generator', description: 'Generate thought-provoking questions based on research content. Develop insightful inquiries from your findings, prompting deeper exploration and critical thinking in your research.', icon: <FiClipboard /> },
  { id: '07', title: 'AI-Generated Mind Maps', description: 'Visualize your research with automatically generated mind maps. Create dynamic representations of your data, exploring connections and relationships with AI-generated insights.', icon: <FiActivity /> },
];

const FeaturesSection = ({ onSectionEnd }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFixed, setIsFixed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionTop = sectionRef.current.offsetTop;
    const windowHeight = window.innerHeight;

    if (scrollY >= sectionTop - windowHeight / 2) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  }, [scrollY]);

  useEffect(() => {
    if (isFixed) {
      const sectionTop = sectionRef.current.offsetTop;
      const windowHeight = window.innerHeight;

      const handleAnimation = () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition >= sectionTop - windowHeight ) {
          const index = Math.floor((scrollPosition - sectionTop + windowHeight / 2) / (windowHeight / 2));
          setActiveIndex(index);
        }
      };

      window.addEventListener('scroll', handleAnimation);
      return () => window.removeEventListener('scroll', handleAnimation);
    }
  }, [isFixed]);

  useEffect(() => {
    if (activeIndex === features.length - 1) {
      setTimeout(() => {
        setIsFixed(false);
        //onSectionEnd();
      }, 1000); // Wait for the last animation to complete before unfixing the section
    }
  }, [activeIndex, onSectionEnd]);

  return (
    <div className={`features-section1 ${isFixed ? 'fixed' : ''}`} ref={sectionRef}>
      <div className="features-container1" ref={containerRef}>
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className="feature-card1"
            initial={{ width: '100px' }}
            animate={{ width: activeIndex === index ? '500px' : '100px' }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveIndex(index)}
          >
            <span className="feature-icon1">{feature.icon}</span>
            {activeIndex === index && (
              <div className="feature-content1">
                <h3 className='feature-title1'>{feature.title}</h3>
                <p className="feature-description1">{feature.description}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
