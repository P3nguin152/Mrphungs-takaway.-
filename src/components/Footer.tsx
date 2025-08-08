import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Mr. Phung's Takeaway</h3>
            <p className="mb-4">Authentic Chinese cuisine delivered to your door.</p>
            <p className="mb-2">4 Selby Avenue</p>
            <p className="mb-2">Leeds, LS9 0HL</p>
            <p className="mb-2">0113 248 3487</p>
            <div className="mt-4">
              <img 
                src="/hygein.png" 
                alt="Food Hygiene Rating" 
                className="h-32 w-auto"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
            <div className="space-y-1">
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 1 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 1 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Monday</span>
                <span className="text-sm text-gray-300">Closed</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 2 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 2 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Tuesday</span>
                <span className="text-sm text-gray-300">Closed</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 3 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 3 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Wednesday</span>
                <span className="text-sm text-gray-300">17:00 - 23:00</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 4 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 4 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Thursday</span>
                <span className="text-sm text-gray-300">17:00 - 23:00</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 5 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 5 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Friday</span>
                <span className="text-sm text-gray-300">17:00 - 23:00</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 6 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 6 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Saturday</span>
                <span className="text-sm text-gray-300">17:00 - 23:00</span>
              </div>
              <div className={`flex justify-between items-center p-1.5 rounded-md ${new Date().getDay() === 0 ? 'bg-gray-700' : ''}`}>
                <span className={`text-sm ${new Date().getDay() === 0 ? 'text-red-300 font-medium' : 'text-gray-300'}`}>Sunday</span>
                <span className="text-sm text-gray-300">17:00 - 23:00</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-red-400 transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-red-400 transition duration-300">
                  Order Online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Mr. Phung's Takeaway. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
         </div>
        </div>
      </div>
    </footer>
  );
}
