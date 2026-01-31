import React from 'react'

const ActionPopup = ({ text, setModal, onConfirm }) => {

  return (
    <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/50'>
        <div className='h-full max-h-64 px-12 md:px-20 rounded-[20px] bg-white shadow shadow-black-10 flex justify-center items-center flex-col gap-12'>
            <p className='text-xl md:text-2xl text-center font-semibold'>{text}</p>
            <div className='w-full flex justify-center items-center gap-10 text-white'>
                <button 
                  className='py-2 px-12 bg-[#EF3826] hover:bg-[#EF3826]/90 rounded-sm'
                  onClick={onConfirm}
                >
                  Yes
                </button>
                <button 
                  className='py-2 px-12 bg-[#4880FF] hover:bg-[#4880FF]/90 rounded-sm' 
                  onClick={() => setModal(false)}
                >
                  No
                </button>
            </div>
        </div>
    </div>
  )
}

export default ActionPopup