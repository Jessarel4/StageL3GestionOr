import { Button } from 'antd'
import React from 'react'
import {HiOutlineSun, HiOutlineMoon} from 'react-icons/hi'

const ToggleThemeButton = ({darkTheme,toogleTheme}) => {
  return (
    <div className='toggle-theme-btn'>
      <Button onClick={toogleTheme}>
        {darkTheme ? <HiOutlineSun/>: <HiOutlineMoon/>}
      </Button>
    </div>
  )
}

export default ToggleThemeButton