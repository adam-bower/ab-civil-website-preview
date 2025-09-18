import React, { useEffect, useState } from 'react';
import './ProjectCounter.css';
import { supabase } from '../lib/supabase';

const ProjectCounter = ({ showExact = false }) => {
  const [projectCount, setProjectCount] = useState(null);
  const [clientCount, setClientCount] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get projects count - fetch IDs to count manually
        const { data: projects, error: projectError } = await supabase
          .from('projects')
          .select('id')
          .limit(10000);
        
        const projectTableCount = projects ? projects.length : 0;
        console.log('Projects table count:', projectTableCount);
        console.log('Projects data sample:', projects?.slice(0, 5));
        if (projectError) {
          console.error('Error counting projects:', projectError);
        }

        // Get takeoff_projects count
        const { data: takeoffs, error: takeoffError } = await supabase
          .from('takeoff_projects')
          .select('id')
          .limit(10000);
        
        const takeoffCount = takeoffs ? takeoffs.length : 0;
        console.log('Takeoff projects count:', takeoffCount);
        console.log('Takeoff data sample:', takeoffs?.slice(0, 5));
        if (takeoffError) {
          console.error('Error counting takeoff_projects:', takeoffError);
        }

        // Get clients count
        const { data: clientsData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .limit(10000);
        
        const clientCount = clientsData ? clientsData.length : 0;
        console.log('Clients count:', clientCount);
        if (clientError) {
          console.error('Error counting clients:', clientError);
        }

        // Total project count
        const totalProjects = projectTableCount + takeoffCount;
        console.log('Total projects:', totalProjects);
        
        // Use actual counts
        setProjectCount(totalProjects);
        setClientCount(clientCount);
      } catch (error) {
        console.error('Error fetching counts:', error);
        setProjectCount(1400); // Fallback numbers
        setClientCount(300);
      }
    };

    fetchCounts();
  }, []);

  if (projectCount === null || clientCount === null) return null;

  if (showExact) {
    return (
      <div className="project-count-wrapper">
        <span className="project-count">{projectCount.toLocaleString()}</span>
        <span className="project-subtitle">Projects Delivered</span>
        <span className="client-count">for {clientCount.toLocaleString()} Clients</span>
      </div>
    );
  }

  return (
    <div className="project-counter">
      <h2>Over {projectCount.toLocaleString()} Projects Completed for {clientCount.toLocaleString()} Clients</h2>
    </div>
  );
};

export default ProjectCounter;