import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { HiHeart } from 'react-icons/hi'

const Footer = () => {
  return (
    <footer className="w-full ">
      {/* Container */}
      <div className="max-w-3xl mx-auto">
        {/* Content Wrapper */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base text-gray-400">
              Made with{' '}
              <HiHeart className="inline w-4 h-4 text-red-500 animate-pulse" />{' '}
              by{' '}
              <a
                href="https://github.com/salithbinanwar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
              >
                Salith Bin Anwar
              </a>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/salithbinanwar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/salith-anwar-372276208/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/salithAnwar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center md:text-right">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
