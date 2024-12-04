import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashQuestions from '../components/UserQuestions';
import DashPendingQuestions from '../components/PendingQuestions';
import AdminallQuestions from '../components/AdminQuestions';
import Questionstatus from '../components/QuestionStatus';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts... */}
      {tab === 'Edit' && <DashQuestions />}
      {/* users */}
      {tab === 'Pending' && <DashPendingQuestions />}
      {/* comments  */}
      {tab === 'AllQuestions' && <AdminallQuestions />}
      {/* dashboard comp */}
      {tab === 'status' && <Questionstatus />}
    </div>
  );
}
