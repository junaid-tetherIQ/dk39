import React from 'react'
const page = () => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 `}>
      <div className='bg-white shadow-md rounded-lg p-8 max-w-md w-full'>
        <h1 className='text-3xl font-extrabold text-green-600 mb-4'>Félicitations !</h1>
        <p className='text-lg text-gray-700 mb-6'>
          Votre paiement a été traité avec succès. Merci pour votre achat !
        </p>
        <div className='flex items-center justify-center'>
          <svg className='w-16 h-16 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
      </div>
    </div>
  );
}



export default page