import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
      const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/v1/user/logout', {
        method: 'GET',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
      <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=status'>
              <Sidebar.Item
                active={tab === 'status' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Status
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && !currentUser.isAdmin && (
            <Link to='/dashboard?tab=Edit'>
              <Sidebar.Item
                active={tab === 'Edit'}
                icon={HiDocumentText}
                as='div'
              >
                Edit/Delete Questions
              </Sidebar.Item>
            </Link>
          )}
          {currentUser &&  !currentUser.isAdmin &&(
            <>
              <Link to='/dashboard?tab=Pending'>
                <Sidebar.Item
                  active={tab === 'Pending'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Pending Questions
                </Sidebar.Item>
              </Link>
             
            </>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=AllQuestions'>
              <Sidebar.Item
                active={tab === 'AllQuestions'}
                icon={HiAnnotation}
                as='div'
              >
                Questions
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
