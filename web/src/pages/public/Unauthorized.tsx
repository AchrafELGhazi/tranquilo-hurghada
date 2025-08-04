import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
      const navigate = useNavigate();

      const handleGoBack = () => {
            navigate(-1);
      };

      return (
            <div className='flex flex-col items-center justify-center min-h-screen p-6 text-center'>
                  <div className='max-w-md w-full space-y-4'>
                        <h1 className='text-3xl font-bold text-red-600'>Access Denied</h1>
                        <p className='text-lg text-gray-600'>You don't have permission to access this page.</p>
                        <button
                              onClick={handleGoBack}
                              className='px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                              Go Back
                        </button>
                  </div>
            </div>
      );
};
