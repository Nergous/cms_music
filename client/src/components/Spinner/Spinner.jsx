import React from 'react'
import cl from './Spinner.module.css'

const Spinner = ({color}) => {
    return <div style={{backgroundColor: color}} className={cl.spinner}></div>
};

export default Spinner;