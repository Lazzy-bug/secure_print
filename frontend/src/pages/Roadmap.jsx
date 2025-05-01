import React, { useEffect, useState } from 'react';

const Roadmap = () => {
  const [currentPhase, setCurrentPhase] = useState(3); // Active phase, set to 3 (Testing Phase).

  useEffect(() => {
    const timeline = document.querySelector('.cd-container');
    const line = timeline.querySelector('.cd-line');

    if (line) {
      const phases = Array.from(document.querySelectorAll('.cd-timeline-block'));
      const activePhase = phases[currentPhase - 1];
      const phaseOffsetTop = activePhase.querySelector('.cd-timeline-img').offsetTop;

      line.style.height = `${phaseOffsetTop}px`;
    }
  }, [currentPhase]);

  return (
    <div className="roadmap-container">
      <h1 className="section-title">Roadmap</h1>
      <div id="cd-timeline" className="cd-container">
        {/* Software Section */}
        <div className="section-header">
          <h2>Software Development</h2>
        </div>
        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 1 ? 'active' : ''}`}>1</div>
          <div className="cd-timeline-content left">
            <h3>Prototype</h3>
            <p>Building the initial software prototype.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 2 ? 'active' : ''}`}>2</div>
          <div className="cd-timeline-content left">
            <h3>Development</h3>
            <p>Developing core software features and functionality.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div
            className={`cd-timeline-img ${currentPhase >= 3 ? 'active' : ''} ${currentPhase === 3 ? 'highlight' : ''}`}
          >
            3
          </div>
          <div className="cd-timeline-content left">
            <h3>Testing</h3>
            <p>Performing rigorous software testing to ensure quality.</p>
            {currentPhase === 3 && <div className="current-phase-badge">We are here now</div>}
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 4 ? 'active' : ''}`}>4</div>
          <div className="cd-timeline-content left">
            <h3>Deployment</h3>
            <p>Releasing the software for production use.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 5 ? 'active' : ''}`}>5</div>
          <div className="cd-timeline-content left">
            <h3>Maintenance</h3>
            <p>Ensuring the software remains functional and updated.</p>
          </div>
        </div>

        {/* Hardware Section */}
        <div className="section-header">
          <h2>Hardware Development</h2>
        </div>
        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 6 ? 'active' : ''}`}>6</div>
          <div className="cd-timeline-content left">
            <h3>Design</h3>
            <p>Designing the hardware components and layout.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 7 ? 'active' : ''}`}>7</div>
          <div className="cd-timeline-content left">
            <h3>Prototype</h3>
            <p>Building a functional prototype of the hardware.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 8 ? 'active' : ''}`}>8</div>
          <div className="cd-timeline-content left">
            <h3>Testing</h3>
            <p>Performing hardware stress tests and functionality checks.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 9 ? 'active' : ''}`}>9</div>
          <div className="cd-timeline-content left">
            <h3>Manufacturing</h3>
            <p>Mass producing hardware components.</p>
          </div>
        </div>

        <div className="cd-timeline-block">
          <div className={`cd-timeline-img ${currentPhase >= 10 ? 'active' : ''}`}>10</div>
          <div className="cd-timeline-content left">
            <h3>Integration</h3>
            <p>Integrating hardware with software for final deployment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap