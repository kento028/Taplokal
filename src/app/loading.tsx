import React from 'react'

const loading = () => {
    return (
        <div className='flex h-screen justify-center items-center'>
            <div className="container">
                <div className="cube"><div className="cube__inner"></div></div>
                <div className="cube"><div className="cube__inner"></div></div>
                <div className="cube"><div className="cube__inner"></div></div>
            </div>
        </div>
    )
}

export default loading