import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-blue-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link  to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'  >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Q
              </span>
              A
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='About Us' className='font-bold'/>
              <div className='py-2'>Q A</div> 
              <div></div>
            </div>
            <div>
              <Footer.Title title='Follow us' className='font-bold'/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://github.com/Anushkabh'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  LinkedIn
                </Footer.Link>
                <Footer.Link
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Twitter/X
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' className='font-bold'/>
              <Footer.LinkGroup col>
                <Footer.Link href='#'>Privacy Policy</Footer.Link>
                <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='#'
            by="Anushka QA Application"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
        
            <Footer.Icon href='#' icon={BsTwitter}/>
            <Footer.Icon href='https://github.com/Anushkabh' icon={BsGithub}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}
